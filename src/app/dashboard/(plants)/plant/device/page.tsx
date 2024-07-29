'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import Graph from './_components-device/Chart';


function formatData(timeArray: any, dataArray: any) {
    // Check if both arrays have the same length
    if (timeArray.length !== dataArray.length) {
      throw new Error("Both arrays must have the same length");
    }
  
    // Create a formatted string
    let formattedData = "";
    for (let i = 0; i < timeArray.length; i++) {
      formattedData += `${timeArray[i]},${dataArray[i]}\n`;
    }
  
    return formattedData;
  }



function Device({}) {
    const [deviceType, setDeviceType] = React.useState('');
    const [chartData, setChartData] = React.useState<any>({ time: [], variables: {} });

    const param = useSearchParams();
    const id = param.get('id');
    const meterSN = param.get('meterSN');
    const table = param.get('table');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');
    const company = param.get('company');
    const idCompany = param.get('idCompany');
    const plantName = param.get('plantName');

    React.useEffect(() => { 
        if (meterSN && table) {
            setDeviceType('integrationDevice');
        } else if (mac) {
            setDeviceType('standardDevice');
        }
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/devices/meterSN', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meterSN: meterSN,
                    dataTable: table,
                    // "startDate":"2024-07-10 00:00:00",
                    // "endDate":"2024-07-28 23:50:00"
                })
            });
            const data = await response.json();
            console.log('data traida con exito: ', data);

            // Procesar los datos traídos
            const timeArray: any = [];
            const variables: any = {};

            data?.forEach((item: any) => {
                // Agregar el tiempo al array de tiempos
                timeArray.push(item.time);

                // Iterar sobre las claves del objeto
                Object.keys(item).forEach(key => {
                    // Saltar meterSN y ID
                    if (key === 'meterSN' || key === 'ID' || key === 'time') return;

                    // Si la clave no está en variables, inicializarla como un array vacío
                    if (!variables[key]) {
                        variables[key] = [];
                    }

                    // Agregar el valor al array correspondiente
                    variables[key].push(item[key]);
                });
            });

            setChartData({ time: timeArray, variables: variables });
        }
        fetchData();
        console.log('deviceType', deviceType);
    }, []);


    console.log('chartData', chartData);

    const chartsComponent = Object.keys(chartData.variables).map((key, index) => {
        console.log("Data:",chartData.variables[key]);
        console.log("Time:",chartData.time);

        return (
            <div className='flex flex-col  p-5 bg-button-green-gradient rounded-2xl'>
                <div className='w-[100%] flex justify-center pb-4 text-md font-semibold text-slate-200'>
                    {key}
                </div>
                <div className='w-[100%] '>
                    <Graph data={formatData(chartData.time, chartData.variables[key])} id={key} />
                </div>
            </div>
        );
    });

    return (
        <>
            <div className="font-bold text-xl text-gray-800 pt-4 md:pt-0 mb-8">
                <Link href='/dashboard' className='text-muted-foreground relative border-b-0 hover:border-b-2 hover:border-zinc-400'>Principal</Link> 
                <span className='text-sm text-muted-foreground '>{'  ->  '}</span>
                <Link href={{pathname:'/dashboard/plant', query: { id: idCompany, name: company, plantName: plantName }}} className='text-muted-foreground relative border-b-0 hover:border-b-2 hover:border-zinc-400'>{company}</Link> 
                <span className='text-sm text-muted-foreground '>{'  ->  '}</span>
                {deviceName}
            </div>
            {/* <h1>Device Information</h1>
            <p>Device ID: {id}</p>
            <p>Device Name: {deviceName}</p> */}

            {deviceType === 'integrationDevice' && (
                <>
                    {/* <p>Meter SN: {meterSN}</p>
                    <p>Data Table: {table}</p> */}
                </>
            )}

            {deviceType === 'standardDevice' && (
                <p>MAC: {mac}</p>
            )}
             
            <div className='w-full mt-[50px]  grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-7 p-4'>
                {chartsComponent}
            </div>

            
            
            
        </>
    );
}

export default Device;
