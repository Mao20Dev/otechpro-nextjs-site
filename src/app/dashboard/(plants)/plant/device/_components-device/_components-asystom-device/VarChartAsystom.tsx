"use client"

import React, { useState } from 'react'



import {  useSearchParams } from 'next/navigation';

import { AudioLines, Gauge, Thermometer, Radio, Waves } from 'lucide-react'; // Asegúrate de importar todos los íconos necesarios


import dynamic from 'next/dynamic';
const Graph = dynamic(() => import('../Chart'), { ssr: false });


const getIcon = (iconType: any) => {
    switch (iconType) {
        case 'vibration':
            return <Radio className='text-zinc-200' size={30} />;
        case 'speed':
            return <Gauge className='text-zinc-200' size={30} />;
        case 'temperature':
            return <Thermometer className='text-zinc-200' size={30} />;
        case 'frequency':
            return <Waves className='text-zinc-200' size={30} />;
        default:
            return <AudioLines className='text-zinc-200' size={30} />; // Ícono por defecto
    }
};




function AsystomDevice({data, actualValue, unit, nameVariable, iconType}: any) {
    const [imageUrl, setImageUrl] = useState('');
    const param = useSearchParams();

    const [anomalyData, setAnomalyData] = useState<any>('');

    const id = param.get('id');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');


    console.log(id);


    return (
    <>

        <div className='w-full h-auto my-12 bg-slate-800 rounded-2xl grid grid-cols-8 gap-1 xl:gap-4 p-2 chartAsystomElement '>
            <div className='w-full h-full grid grid-cols-4 pb-0 xl:pb-12 xl:grid-cols-1 gap-4 rounded-2xl col-span-8 xl:col-span-1 justify-center items-center py-0 xl:py-2'>
                <div className='w-full h-full flex items-center justify-start xl:justify-center xl:items-end col-span-1 xl:col-span-1'>
                    <div className='w-[60px] h-[60px] xl:w-[70px] xl:h-[70px] relative top-[-32px] ml-2  rounded-2xl bg-button-green-gradient flex flex-row justify-center items-center xl:static'> 
                        {getIcon(iconType)}  
                    </div>
                </div>
                <div className='col-span-3 h-full xl:col-span-1 flex flex-col justify-center items-end xl:justify-start xl:items-center pb-2'>
                    <div className='text-center text-lg xl:text-xl font-bold text-muted-foreground '>{actualValue} {unit}</div>
                    <div className='text-center text-sm xl:text-md font-normal text-zinc-200'>{nameVariable}</div>
                </div>
                
            </div>
            <div className='w-full h-full bg-button-green-gradient rounded-2xl col-span-8 xl:col-span-7 pb-6 pr-6'>
                {data && <Graph data={data}  graphStyle={{ height: '330px' }} />}
            </div>
        </div>

        

    </>
)
}

export default AsystomDevice