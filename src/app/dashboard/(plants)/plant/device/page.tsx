'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react'

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



const Graph = dynamic(() => import('./_components-device/Chart'), { ssr: false });


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
    const company = param.get('company');
    const idCompany = param.get('idCompany');
    const plantName = param.get('plantName');

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 14),
        to: addDays(new Date(), 0),
    });
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

    const handleFilterClick = () => {
        if (date?.from && date?.to) {
            const startDate = format(date.from, "yyyy-MM-dd") + " 00:00:00";
            const endDate = format(date.to, "yyyy-MM-dd") + " 23:59:59";
            setLoadingFilter(true);
            fetchData(startDate, endDate);
        }
    }


    console.log('chartData', chartData);

    const chartsComponent = Object.keys(filteredData.variables).map((key, index) => {
        return (
            <div className='flex flex-col py-5 px-1 bg-button-green-gradient rounded-2xl' key={index}>
                <div className='w-[100%] flex justify-center pb-4 text-md font-semibold text-slate-200'>
                    {key}
                </div>
                <div className='w-[100%] '>
                    <Graph data={formatData(filteredData.time, filteredData.variables[key])} id={key} />
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
                        <Popover>
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
                                <span>Pick a date</span>
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
                    <Button variant="custom"  className='mt-2' onClick={handleFilterClick}>Filtrar</Button></>}
                    

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
    );
}

export default Device;
