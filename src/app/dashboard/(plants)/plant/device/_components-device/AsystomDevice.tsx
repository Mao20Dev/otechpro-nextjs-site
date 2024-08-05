"use client"

import React, { useState } from 'react'

import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

import {  useSearchParams } from 'next/navigation';
import Specs from './_components-asystom-device/Specs';
import VarChartAsystom from './_components-asystom-device/VarChartAsystom';

import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon } from "@radix-ui/react-icons"


import { addDays, format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { set } from 'lodash';

const BarGraph = dynamic(() => import('./BarChart'), { ssr: false });

const RadarChart = dynamic(() => import('./_components-asystom-device/RadarChart'), { ssr: false });


function convertirFormatoFecha(fechaOriginal: any) {
    const fecha = new Date(fechaOriginal);
    fecha.setHours(fecha.getHours() + 5); // Adjust for time zone if needed

    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    const hours = fecha.getHours().toString().padStart(2, '0');
    const minutes = fecha.getMinutes().toString().padStart(2, '0');
    const seconds = fecha.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}


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


function calculateCumulativeAverage(dataArray: number[]) {
    let cumulativeSum = 0;
    return dataArray.map((value, index) => {
        cumulativeSum += value;
        return cumulativeSum / (index + 1);
    });
}



function AsystomDevice() {
    const [imageUrl, setImageUrl] = useState('');
    const param = useSearchParams();

    const [Temperature, setTemperature] = useState<any>('');
    const [Battery, setBattery] = useState<any>('');

    const [anomalyData, setAnomalyData] = useState<any>('');
    const [actualValueAnomaly, setActualValueAnomaly] = useState<any>('');
    const [anomalyTrendData, setAnomalyTrendData] = useState<any>('');
    const [trendActualValue, setTrendActualValue] = useState<any>('');

    const [anomalyDataArray, setAnomalyDataArray] = useState<any>([]);

    const [vibrationData, setVibrationData] = useState<any>('');
    const [actualValueVibration, setActualValueVibration] = useState<any>('');

    const [rpmData, setRpmData] = useState<any>('');
    const [actualValueRpm, setActualValueRpm] = useState<any>('');

    const [temperatureSensor, setTemperatureSensor] = useState<any>('');
    const [actualValueTemperatureSensor, setActualValueTemperatureSensor] = useState<any>('');

    const [ultrasonicData, setUltrasonicData] = useState<any>('');
    const [actualValueUltrasonic, setActualValueUltrasonic] = useState<any>('');

    const [machineId, setMachineId] = useState<any>({});

    const [date, setDate] = React.useState<DateRange | undefined>(undefined);
    const [prevDate, setPrevDate] = React.useState<DateRange | undefined>(undefined);

    const [specsDataFlag, setSpecsDataFlag] = useState<boolean>(true);

    const [dataFlag, setDataFlag] = useState<boolean>(true);


    const notify = () => toast.error("No se encontraron datos para el rango seleccionado");

    const id = param.get('id');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');

    const colorClass = clsx({
        'text-green-700': actualValueAnomaly >= 0 && actualValueAnomaly <= 60,
        'text-yellow-500': actualValueAnomaly > 60 && actualValueAnomaly <= 80,
        'text-red-700': actualValueAnomaly > 80 && actualValueAnomaly <= 100,
    });

    const colorClassTrend = clsx({
        'text-green-700': trendActualValue >= 0 && trendActualValue <= 60,
        'text-yellow-500': trendActualValue > 60 && trendActualValue <= 80,
        'text-red-700': trendActualValue > 80 && trendActualValue <= 100,
    });

    const bgClass = clsx({
        'bg-button-green-gradient': trendActualValue >= 0 && trendActualValue <= 60,
        'bg-button-yellow-gradient': trendActualValue > 60 && trendActualValue <= 80,
        'bg-button-red-gradient': trendActualValue > 80 && trendActualValue <= 100,
    });


    console.log(id);

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

    const fetchMachineId = async () => {
        const machineIdFetch = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=IdCard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const machineId = await machineIdFetch.json();
        console.log(machineId);
        setMachineId(machineId[0]);
        // setMachineId(machineId[0].value);

    }


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

        setAnomalyDataArray(scores);

         // Calcular el promedio acumulativo
        const cumulativeAverages = calculateCumulativeAverage(scores);

        const trendActualValue = cumulativeAverages[cumulativeAverages.length - 1].toFixed(0);

        const formattedTrendData = formatData(times, cumulativeAverages);
    
        console.log('Fechas: ', times);
        console.log('Scores en anomaly: ', scores);

        const mostRecentValue = scores[scores.length - 1].toFixed(0);

        console.log('Data formateada para dygraph: ', formatData(times, scores));
        setTrendActualValue(trendActualValue);
        setAnomalyTrendData(formattedTrendData);
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


    const fetchAnomalyWithDateRange = async (startDate: string, endDate: string) => {
        const formattedStartDate = convertirFormatoFecha(startDate);
        const formattedEndDate = convertirFormatoFecha(endDate);
        const response = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature_Anomaly&from=${formattedStartDate}&to=${formattedEndDate}`, {  
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

        setAnomalyDataArray(scores);

         // Calcular el promedio acumulativo
        const cumulativeAverages = calculateCumulativeAverage(scores);

        const trendActualValue = cumulativeAverages[cumulativeAverages.length - 1].toFixed(0);

        const formattedTrendData = formatData(times, cumulativeAverages);
    
        console.log('Fechas: ', times);
        console.log('Scores en anomaly: ', scores);

        const mostRecentValue = scores[scores.length - 1].toFixed(0);

        console.log('Data formateada para dygraph: ', formatData(times, scores));
        setTrendActualValue(trendActualValue);
        setAnomalyTrendData(formattedTrendData);
        setAnomalyData(formatData(times, scores));
        setActualValueAnomaly(mostRecentValue);
    };
    
    const fetchVibrationWithDateRange = async (startDate: string, endDate: string) => {
        const formattedStartDate = convertirFormatoFecha(startDate);
        const formattedEndDate = convertirFormatoFecha(endDate);
        const response = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature&from=${formattedStartDate}&to=${formattedEndDate}`, {  
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
    
    const fetchRpmWithDateRange = async (startDate: string, endDate: string) => {
        const formattedStartDate = convertirFormatoFecha(startDate);
        const formattedEndDate = convertirFormatoFecha(endDate);
        const response = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature_Anomaly&from=${formattedStartDate}&to=${formattedEndDate}`, {  
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


    
    const handlePopoverClose = async () => {
        setDataFlag(true);
        if (date?.from && date?.to && (date.from !== prevDate?.from || date.to !== prevDate?.to)) {
            // Ajusta la fecha de inicio al comienzo del día (00:00:00)
            const startDate = format(date.from, "yyyy-MM-dd") + " 00:00:00";
            // Ajusta la fecha de fin al final del día (23:59:59)
            const endDate = format(date.to, "yyyy-MM-dd") + " 23:59:59";
    
            console.log(startDate);
            console.log(endDate);
    
            // Realiza las peticiones con el rango de fechas ajustado
            try {
                // Fetch anomaly data with date range
                const responseAnomaly = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature_Anomaly&from=${convertirFormatoFecha(startDate)}&to=${convertirFormatoFecha(endDate)}`, {  
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
                    },
                });
                const dataAnomaly = await responseAnomaly.json();
    
                // Check if dataAnomaly is empty
                if (dataAnomaly.length === 0) {
                    // No data found for the date range, fetch static data
                    fetchSpecData();
                    fetchAnomaly();
                    fetchVibration();
                    fetchRpm();
                    notify();
                } else {
                    // Data found, process it
                    fetchAnomalyWithDateRange(startDate, endDate);
                    fetchVibrationWithDateRange(startDate, endDate);
                    fetchRpmWithDateRange(startDate, endDate);
                }
            } catch {
                // Handle fetch error
                fetchSpecData();
                fetchAnomaly();
                fetchVibration();
                fetchRpm();
            }
        } else {
            // No date range selected, fetch static data
            fetchSpecData();
            fetchAnomaly();
            fetchVibration();
            fetchRpm();
        }
        setDataFlag(false);
    };
    
    

    React.useEffect(() => {
        // Static data
        fetchMachineId();
        fetchImage();
        
        

        // Dynamic data
        fetchSpecData();
        // skeleton for specs
        setTimeout(() => {
            setSpecsDataFlag(false);
        }, 1000);
        


        fetchAnomaly();
        fetchVibration();
        fetchRpm();

        setTimeout(() => {
            setDataFlag(false);
        }, 1000);
        
    }, []);


    React.useEffect(() => {
       console.log(date);
    }, [date]);
    
    console.log(anomalyData);

    return (
    <>
        <Toaster 
        toastOptions={{
            className: 'text-md p-2 rounded-2xl width-[500px]',
            style: {
            background: '#713200',
            border: '1px solid #713200',
            padding: '16px',
            color: '#e4e4e7',
            },
          }}

        />
        {specsDataFlag ?
        <>
            <div className='flex flex-row flex-wrap'>
                <Skeleton className=" w-full sm:w-full md:w-full lg:w-2/3  xl:w-3/5 big-xl:w-1/3 h-[150px] rounded-2xl" />

                <div className=' w-full  xl:w-full big-xl:w-3/7 grid grid-cols-1 lg:grid-cols-2 gap-2 mt-5 px-0 xl:px-0 big-xl:px-4 justify-center items-end'>
                    <Skeleton className=" w-full xl:w-full big-xl:w-[100%] h-[60px] rounded-2xl" />
                    <Skeleton className=" w-full xl:w-full big-xl:w-[100%] h-[60px] rounded-2xl mt-1" />
                </div>
            </div>
        </> :
        <>
            <Specs imageUrl={imageUrl} temperature={Temperature} battery={Battery} functionM={machineId.process_function} piece={machineId.type} model={machineId.model} manufacturer={machineId.manufacturer} serial={mac} />
        </>
        
    }
        
        



        <div className='w-full flex justify-center '>
            
            <div className={cn("grid gap-2")}>
                <Popover onOpenChange={(open) => !open && handlePopoverClose()}>
                <PopoverTrigger asChild>
                    <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                        <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                        </>
                        ) : (
                        format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Selecciona una fecha</span>
                    )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    />
                </PopoverContent>
                </Popover>
            </div>
        </div>
        
        {dataFlag ?
        <>
            <Skeleton className=" w-full  h-[550px] rounded-2xl" />
            <Skeleton className=" w-full  h-[420px] rounded-2xl mt-3" />
            <Skeleton className=" w-full  h-[420px] rounded-2xl mt-3" />
            <Skeleton className=" w-full  h-[420px] rounded-2xl mt-3" />
            <Skeleton className=" w-full  h-[420px] rounded-2xl mt-3" />
            <Skeleton className=" w-full  h-[420px] rounded-2xl mt-3" />
        </> :
        <>
            <div className='w-full grid grid-cols-8 h-auto bg-gray-800 rounded-2xl gap-1 mt-6'>
                <div className='col-span-8 xl:col-span-6 p-2  rounded-2xl grid grid-cols-8 gap-1'>
                    <div className='col-span-8 xl:col-span-2 p-2 grid grid-cols-2 '>
                        <div className='col-span-2 w-full flex justify-center text-zinc-200 text-md pb-1 pt-4'> Puntuación de anomalía</div>
                        <div className='col-span-1 w-full flex flex-col justify-start items-center'>
                            <div className='text-zinc-200 text-md'>
                                Tendencia
                            </div>
                            <div className={clsx(colorClassTrend, 'text-xl', 'font-bold')}>
                                {trendActualValue} %
                            </div> 
                        </div>
                        <div className='col-span-1 w-full flex flex-col justify-start items-center'>
                            <div  className='text-zinc-200 text-md'>
                                Actual
                            </div>
                            <div className={clsx(colorClass, 'text-xl', 'font-bold')}>
                                {actualValueAnomaly} %
                            </div> 
                        </div>
                    </div>
                    <div className={clsx(bgClass,'col-span-8 xl:col-span-6 pt-6 pr-6 rounded-2xl w-full h-full')}>
                        {anomalyData &&<BarGraph data={anomalyData}  title='' graphStyle={{ height: '180px' }} />}
                    </div>
                    <div className='col-span-8 p-2 flex flex-col '>
                        <div className='text-green-700 text-lg font-bold'>
                            El Asesor de Incidencias no ha detectado ninguna anomalía significativa.
                        </div>
                        <div className='text-zinc-200 text-md'>
                            El Asesor de Incidencias le ayuda a detectar comportamientos anómalos de la máquina y le orienta sobre la naturaleza de las anomalías detectadas. Basándose en una zona de entrenamiento que refleja el estado normal de la máquina, el Asesor de incidencias realiza un seguimiento de las desviaciones con respecto a este estado nominal.
                        </div>
                    </div>
                </div>
                <div className={clsx(bgClass,'col-span-8 xl:col-span-2 p-2 rounded-2xl m-2 ')}>
                    <div className='w-full h-[300px] rounded-2xl m-2'>
                        <RadarChart barData={anomalyDataArray} />
                    </div>
                </div>
            </div>

            <VarChartAsystom data={anomalyData} actualValue={actualValueAnomaly} unit={'%'} nameVariable={'Puntaje de anomalia'} iconType={'vibration'} />

            <VarChartAsystom data={vibrationData} actualValue={actualValueVibration} unit={'mm/s'} nameVariable={'Severidad de la vibración'} iconType={'speed'} />

            <VarChartAsystom data={rpmData} actualValue={actualValueRpm} unit={'rpm'} nameVariable={'Revoluciones por minuto'} iconType={'speed'} />

            <VarChartAsystom data={temperatureSensor} actualValue={actualValueTemperatureSensor} unit={'°C'} nameVariable={'Temperatura sensor'} iconType={'temperature'} />

            <VarChartAsystom data={ultrasonicData} actualValue={actualValueUltrasonic} unit={'dB'} nameVariable={'Nivel de ultrasonido'} iconType={'frequency'} />
            
        </>}
        

        


        

    </>
)
}

export default AsystomDevice