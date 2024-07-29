'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react'



function Device({}) {
    const param = useSearchParams();
    const id = param.get('id');
    const meterSN = param.get('meterSN');
    const table = param.get('table');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');
    const company = param.get('company');
    const idCompany = param.get('idCompany');
    const plantName = param.get('plantName');

    let deviceType = '';

    if (meterSN && table) {
        deviceType = 'integrationDevice';
    } else if (mac) {
        deviceType = 'standardDevice';
    }

    
    
    return (
        <>
            <div className=" font-bold text-xl text-gray-800 pt-4 md:pt-0 mb-8">
                <Link href='/dashboard' className=' text-muted-foreground relative border-b-0 hover:border-b-2 hover:border-zinc-400'>Principal</Link> 
                <span className='text-sm text-muted-foreground '>{'  ->  '}</span>
                <Link href={{pathname:'/dashboard/plant',query: { id: idCompany, name:company, plantName:plantName }}}  className=' text-muted-foreground relative border-b-0 hover:border-b-2 hover:border-zinc-400'>{company}</Link> 
                <span className='text-sm text-muted-foreground '>{'  ->  '}</span>
                {deviceName}
            </div>
                <h1>Device Information</h1>
                <p>Device ID: {id}</p>
                <p>Device Name: {deviceName}</p>

                {deviceType === 'integrationDevice' && (
                    <>
                        <p>Meter SN: {meterSN}</p>
                        <p>Data Table: {table}</p>
                    </>
                )}

                {deviceType === 'standardDevice' && (
                    <p>MAC: {mac}</p>
                )}

            <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div>
        </>
    );
}

export default Device