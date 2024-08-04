"use client"

import React, { useState } from 'react'



import {  useSearchParams } from 'next/navigation';
import Specs from './_components-asystom-device/Specs';
import VarChartAsystom from './_components-asystom-device/VarChartAsystom';


import dynamic from 'next/dynamic';

const BarGraph = dynamic(() => import('./BarChart'), { ssr: false });


function formatData(timeArray: any, dataArray: any) {
    if (timeArray.length !== dataArray.length) {
        throw new Error("Both arrays must have the same length");
    }

    let formattedData = "";
    for (let i = 0; i < timeArray.length; i++) {
        const date = new Date(timeArray[i]);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date: ${timeArray[i]}`);
        }
        const isoDate = date.toISOString();
        formattedData += `${isoDate},${dataArray[i]}\n`;
    }

    return formattedData;
}



function AsystomDevice() {
    const [imageUrl, setImageUrl] = useState('');
    const param = useSearchParams();

    const [Temperature, setTemperature] = useState<any>('');
    const [Battery, setBattery] = useState<any>('');

    const [anomalyData, setAnomalyData] = useState<any>('');
    const [actualValueAnomaly, setActualValueAnomaly] = useState<any>('');

    const [vibrationData, setVibrationData] = useState<any>('');
    const [actualValueVibration, setActualValueVibration] = useState<any>('');

    const [rpmData, setRpmData] = useState<any>('');
    const [actualValueRpm, setActualValueRpm] = useState<any>('');

    const [temperatureSensor, setTemperatureSensor] = useState<any>('');
    const [actualValueTemperatureSensor, setActualValueTemperatureSensor] = useState<any>('');

    const [ultrasonicData, setUltrasonicData] = useState<any>('');
    const [actualValueUltrasonic, setActualValueUltrasonic] = useState<any>('');

    const id = param.get('id');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');


    console.log(id);

    const fetchSpecData = async () => {

        const responseTemperature = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Temperature&last=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const data = await responseTemperature.json();
        setTemperature(data[0].value.toFixed(2));

        const responseBattery = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Batt_Lvl&last=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const dataBattery = await responseBattery.json();
        setBattery(dataBattery[0].value.toFixed(2));

    }

    const fetchAnomaly = async () => {
        const response = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature_Anomaly&last=60`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const data = await response.json();
        console.log("anomaly normal",data);
        
        // Extraer los datos y transformarlos
        const transformedData = data.map((item: any) => {
            const date = new Date(item.time);
            const formattedTime = date.toISOString();
            
            return {
                time: formattedTime,
                score_anomaly: item.score_anomaly*100
            };
        });
    
        // Ordenar los datos por tiempo en orden ascendente (antiguo a reciente)
        transformedData.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
        // Crear los arrays separados e invertidos
        const times = transformedData.map((item: any) => item.time);
        const scores = transformedData.map((item: any) => item.score_anomaly);
    
        console.log('Fechas: ', times);
        console.log('Scores en anomaly: ', scores);

        const mostRecentValue = scores[scores.length - 1].toFixed(0);

        console.log('Data formateada para dygraph: ', formatData(times, scores));
        setAnomalyData(formatData(times, scores));
        setActualValueAnomaly(mostRecentValue);
    };

    const fetchVibration = async () => {
        const response = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature&last=60`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const data = await response.json();

        console.log(data);
        
        // Extraer los datos y transformarlos
        const transformedData = data.map((item: any) => {
            const date = new Date(item.time);
    const formattedTime = date.toISOString();
            
            return {
                time: formattedTime,
                score_anomaly: item.sonic_rmslog
            };
        });
    
        // Ordenar los datos por tiempo en orden ascendente (antiguo a reciente)
        transformedData.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
        // Crear los arrays separados e invertidos
        const times = transformedData.map((item: any) => item.time);
        const scores = transformedData.map((item: any) => item.score_anomaly);
    
        console.log('Fechas: ', times);
        console.log('Scores: ', scores);

        const mostRecentValue = scores[scores.length - 1].toFixed(2);

        const transformedTemperatureData = data.map((item: any) => {
            const date = new Date(item.time);
    const formattedTime = date.toISOString();
            
            return {
                time: formattedTime,
                score_anomaly: item.temp
            };
        });

        transformedTemperatureData.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());

        const temperatureSensor = transformedTemperatureData.map((item: any) => item.score_anomaly);

        setTemperatureSensor(formatData(times, temperatureSensor));
        setActualValueTemperatureSensor((temperatureSensor[temperatureSensor.length - 1]).toFixed(2));

        console.log('Data formateada para dygraph: ', formatData(times, scores));
        setUltrasonicData(formatData(times, scores));
        setActualValueUltrasonic(mostRecentValue );
    };

    const fetchRpm = async () => {
        const response = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature_Anomaly&last=60`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const data = await response.json();

        console.log(data);
        
        // Extraer los datos y transformarlos
        const transformedData = data.map((item: any) => {
            const date = new Date(item.time);
    const formattedTime = date.toISOString();
            
            return {
                time: formattedTime,
                score_anomaly: item.aux_f2
            };
        }); 

        const transformedVibrationData = data.map((item: any) => {
            const date = new Date(item.time);
            const formattedTime = date.toISOString();
            
            return {
                time: formattedTime,
                score_anomaly: item.aux_f1
            };
        }); 


        transformedVibrationData.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
        const vibrationData = transformedVibrationData.map((item: any) => item.score_anomaly);
    
        
    

        // Ordenar los datos por tiempo en orden ascendente (antiguo a reciente)
        transformedData.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());
        console.log(transformedData);


       
    
        
        const times = transformedData.map((item: any) => item.time);
        const scores = transformedData.map((item: any) => item.score_anomaly);

        setVibrationData(formatData(times, vibrationData));
        setActualValueVibration((vibrationData[vibrationData.length - 1]).toFixed(2));

        
        console.log('Fechas: ', times);
        console.log('Scores rpm: ', scores);

        const mostRecentValue = scores[scores.length - 1].toFixed(2);

        console.log('Data formateada para dygraph: ', formatData(times, scores));
        setRpmData(formatData(times, scores));
        setActualValueRpm(mostRecentValue);

        
    };

    
    
    const fetchImage = async () => {
        const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": id,
                "type": 'device'
            })
        });
        const data = await response.json();
        
        setImageUrl(data.ImageURL);
    }
    
    React.useEffect(() => {
        // Static data
        fetchSpecData();
        fetchImage();

        // Dynamic data
        fetchAnomaly();
        fetchVibration();
        fetchRpm();
        
    }, []);
    


    return (
    <>
        <Specs imageUrl={imageUrl} temperature={Temperature} battery={Battery} />


        <div className='w-full grid grid-cols-8 h-auto bg-gray-800 rounded-2xl gap-1 mt-6'>
            <div className='col-span-8 xl:col-span-6 p-2  rounded-2xl grid grid-cols-6 gap-1'>
                <div className='col-span-6 xl:col-span-2 p-2 grid grid-cols-2 '>
                    <div className='col-span-2 w-full flex justify-center text-zinc-200 text-md pb-1 pt-4'> Puntuación de anomalía</div>
                    <div className='col-span-1 w-full flex flex-col justify-start items-center'>
                        <div className='text-zinc-200 text-md'>
                            Tendencia
                        </div>
                        <div  className='text-green-700 text-xl font-bold'>
                            18%
                        </div> 
                    </div>
                    <div className='col-span-1 w-full flex flex-col justify-start items-center'>
                        <div  className='text-zinc-200 text-md'>
                            Actual
                        </div>
                        <div className='text-green-700 text-xl font-bold'>
                            {actualValueAnomaly} %
                        </div> 
                    </div>
                </div>
                <div className='col-span-6 xl:col-span-4 pt-4 pr-6 bg-button-green-gradient rounded-2xl w-full h-full'>
                    <BarGraph data={anomalyData} title=''  graphStyle={{ height: '150px' }} />
                </div>
                <div className='col-span-6 p-2 flex flex-col '>
                    <div className='text-green-700 text-lg font-bold'>
                        El Asesor de Incidencias no ha detectado ninguna anomalía significativa.
                    </div>
                    <div className='text-zinc-200 text-md'>
                        El Asesor de Incidencias le ayuda a detectar comportamientos anómalos de la máquina y le orienta sobre la naturaleza de las anomalías detectadas. Basándose en una zona de entrenamiento que refleja el estado normal de la máquina, el Asesor de incidencias realiza un seguimiento de las desviaciones con respecto a este estado nominal.
                    </div>
                </div>
            </div>
            <div className='col-span-8 xl:col-span-2 p-2 '>
                perro
            </div>
        </div>

        <VarChartAsystom data={anomalyData} actualValue={actualValueAnomaly} unit={'%'} nameVariable={'Puntaje de anomalia'} iconType={'vibration'} />

        <VarChartAsystom data={vibrationData} actualValue={actualValueVibration} unit={'mm/s'} nameVariable={'Severidad de la vibración'} iconType={'speed'} />

        <VarChartAsystom data={rpmData} actualValue={actualValueRpm} unit={'rpm'} nameVariable={'Revoluciones por minuto'} iconType={'speed'} />

        <VarChartAsystom data={temperatureSensor} actualValue={actualValueTemperatureSensor} unit={'°C'} nameVariable={'Temperatura sensor'} iconType={'temperature'} />

        <VarChartAsystom data={ultrasonicData} actualValue={actualValueUltrasonic} unit={'dB'} nameVariable={'Nivel de ultrasonido'} iconType={'frequency'} />
        


        

    </>
)
}

export default AsystomDevice