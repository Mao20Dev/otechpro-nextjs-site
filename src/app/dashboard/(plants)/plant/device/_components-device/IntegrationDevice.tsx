'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react'

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
import { Input } from '@/components/ui/input';



const Graph = dynamic(() => import('./Chart'), { ssr: false });


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




function IntegrationDevice({}) {
    const [deviceType, setDeviceType] = React.useState('');
    const [chartData, setChartData] = React.useState<any>({ time: [], variables: {} });
    const [loading, setLoading] = React.useState(true);
    const [loadingFilter, setLoadingFilter] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState<any>({ time: [], variables: {} });

    const param = useSearchParams();
    const id = param.get('id');
    const meterSN = param.get('meterSN');
    const table = param.get('table');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');
    

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 14),
        to: addDays(new Date(), 0),
    });
    
    const [prevDate, setPrevDate] = React.useState<DateRange | undefined>(date);

    console.log(date);
    
    React.useEffect(() => { 
        if (meterSN && table) {
            setDeviceType('integrationDevice');
        } else if (mac) {
            setDeviceType('standardDevice');
        }
    }, []);

    

// aca hay que hacer un fetch para meterSN y table y luego pasarlo a fetchData
const fetchData = async (startDate: string, endDate: string) => {
    const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/devices/meterSN', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            meterSN: meterSN,
            dataTable: table,
            startDate: startDate,
            endDate: endDate
        })
    });
    const data = await response.json();
    console.log('data traida con exito: ', data);

    const timeArray: any = [];
    const variables: any = {};

    data.forEach((item: any) => {
        timeArray.push(item.time);
        Object.keys(item).forEach(key => {
            if (key === 'meterSN' || key === 'ID' || key === 'time') return;
            if (!variables[key]) {
                variables[key] = [];
            }
            variables[key].push(item[key]);
        });
    });

    setChartData({ time: timeArray, variables: variables });
    setFilteredData({ time: timeArray, variables: variables });
    setLoading(false);
    setLoadingFilter(false);
}

    // aca hago el primer fetch para meterSN y table y luego pasarlo a fetchData
    React.useEffect(() => {
        const initialFetchData = async () => {
            const startDate = format(subDays(new Date(), 14), "yyyy-MM-dd 00:00:00");
            const endDate = format(new Date(), "yyyy-MM-dd 23:59:59");
            await fetchData(startDate, endDate);
        }
        initialFetchData();
        console.log('deviceType', deviceType);
    }, []);

    const handleSearchChange = (event: any) => {
        const term = event.target.value;
        setSearchTerm(term);
        
        const newFilteredData = {
            time: chartData.time,
            variables: Object.keys(chartData.variables).reduce((result: any, key: any) => {
                if (key.toLowerCase().includes(term.toLowerCase())) {
                    result[key] = chartData.variables[key];
                }
                return result;
            }, {})
        };
        setFilteredData(newFilteredData);
    }
    

    
    // aca hago el segundo fetch para meterSN y table y luego pasarlo a fetchData con la fecha filtrada

    const handlePopoverClose = () => {
        if (date?.from && date?.to && (date.from !== prevDate?.from || date.to !== prevDate?.to)) {
            const startDate = format(date.from, "yyyy-MM-dd") + " 00:00:00";
            const endDate = format(date.to, "yyyy-MM-dd") + " 23:59:59";
            setLoadingFilter(true);
            fetchData(startDate, endDate);
            setPrevDate(date);
        }
    }


    const handleDownloadClick = () => {
        if (filteredData.time.length === 0) {
            alert("No data available to download.");
            return;
        }
    
        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = ["time", ...Object.keys(filteredData.variables)];
        csvContent += headers.join(",") + "\n";
    
        for (let i = 0; i < filteredData.time.length; i++) {
            const row = [filteredData.time[i]];
            headers.slice(1).forEach(header => {
                row.push(filteredData.variables[header][i]);
            });
            csvContent += row.join(",") + "\n";
        }
    
        // Calcular Potencia activa total consumida y Potencia reactiva total consumida
        let potenciaActivaTotal = 0;
        let potenciaReactivaTotal = 0;
        let hasPotenciaActiva = false;
        let hasPotenciaReactiva = false;
    
        if (filteredData.variables["Potencia activa total"]) {
            const values = filteredData.variables["Potencia activa total"].map(Number);
            if (values.length > 1) {
                potenciaActivaTotal = values[values.length - 1] - values[0];
            }
            hasPotenciaActiva = true;
        }
    
        if (filteredData.variables["Potencia reactiva total"]) {
            const values = filteredData.variables["Potencia reactiva total"].map(Number);
            if (values.length > 1) {
                potenciaReactivaTotal = values[values.length - 1] - values[0];
            }
            hasPotenciaReactiva = true;
        }
    
        // Agregar los valores totales al contenido del CSV si existen
        csvContent += "\n";
        if (hasPotenciaActiva) {
            csvContent += `Potencia activa total consumida:,${potenciaActivaTotal}\n`;
        }
        if (hasPotenciaReactiva) {
            csvContent += `Potencia reactiva total consumida:,${potenciaReactivaTotal}\n`;
        }
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Datos_${deviceName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    


    

    const chartsComponent = Object.keys(filteredData.variables).map((key, index) => {
        console.log('key', key);
        console.log('filteredData.variables[key]', filteredData.variables[key]);
    
        // Convertir los valores a números y calcular la diferencia si la clave es 'Potencia activa total'
        let totalDifference = 0;
        if (key === 'Potencia activa total') {
            const values = filteredData.variables[key].map(Number); // Convertir todos los valores a números
            if (values.length > 1) {
                totalDifference = values[values.length - 1] - values[0]; // Calcular la diferencia
            }
        }else if(key === 'Potencia reactiva total'){
            const values = filteredData.variables[key].map(Number);
            if (values.length > 1) {
                totalDifference = values[values.length - 1] - values[0];
            }
        }
    
        return (
            <div className='flex flex-col py-5 px-1 bg-button-green-gradient rounded-2xl' key={index}>
                <div className='w-[100%] flex justify-center pb-4 text-md font-semibold text-slate-200'>
                    {key}
                </div>
                {key === 'Potencia activa total'&& (
                    <div className='w-[100%] flex justify-center pb-4 text-md font-semibold text-slate-200'>Total consumido: {totalDifference.toFixed(2)}</div> // Mostrar la diferencia calculada
                )}
                {key === 'Potencia reactiva total'&& (
                    <div className='w-[100%] flex justify-center pb-4 text-md font-semibold text-slate-200'>Total consumido: {totalDifference.toFixed(2)}</div> // Mostrar la diferencia calculada
                )}
                <div className='w-[100%] pr-6 '>
                    <Graph data={formatData(filteredData.time, filteredData.variables[key])} id={key} graphStyle={{ height: '350px' }} />
                </div>
            </div>
        );
    });
    

    return (
        <>
                <>
                    <div className='w-full mt-[50px]  grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-7 p-4'>
                <div className='w-full h-auto flex justify-center items-end'>
                    {loading?
                    <Skeleton className="h-[35px] w-full rounded-xl" /> : 
                    <Input placeholder='Buscar por nombre de variable' className='w-full' value={searchTerm} onChange={handleSearchChange} />}
                
                </div>
                
                <div className='w-full h-auto flex flex-col justify-start items-start lg:justify-end lg:items-end'>

                {loading?<>
                    <Skeleton className="h-[35px] w-1/5 rounded-xl" />
                    <Skeleton className="h-[35px] w-1/3 rounded-xl mt-1" />
                    <Skeleton className="h-[35px] w-1/5 rounded-xl mt-1" />
                </> :
                
                <>
                <div className='text-md text-gray-800 flex justify-start items-end'>Filtrar por fecha: </div>
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
                    <div className='w-full flex justify-start lg:justify-end'>
                        <Button variant="custom"  className='mt-2' onClick={handleDownloadClick}>Descargar datos</Button>  
                    </div>
                    </>}
                    

                </div>
                
            </div>

            <div className='w-full mt-[50px]  grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-7 p-4'>
                    {loading || loadingFilter ? (
                        <>
                            <Skeleton className="h-[325px] w-full rounded-xl" />
                            <Skeleton className="h-[325px] w-full rounded-xl" />
                            <Skeleton className="h-[325px] w-full rounded-xl" />
                            
                        </>
                    ) : (
                        <>

                            


                            {chartsComponent}
                        </>
                        
                    )}
                
            </div>
                </>

            
        </>
    );
}

export default IntegrationDevice;
