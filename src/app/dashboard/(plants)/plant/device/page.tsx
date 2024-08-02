'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import IntegrationDevice from './_components-device/IntegrationDevice';
import AsystomDevice from './_components-device/AsystomDevice';




function Device({}) {
    const [deviceType, setDeviceType] = React.useState('');
    

    React.useEffect(() => { 
        if (meterSN && table) {
            setDeviceType('integrationDevice');
        } else if (mac) {
            setDeviceType('standardDevice');
        }
    }, []);

    const param = useSearchParams();
    const id = param.get('id');
    const meterSN = param.get('meterSN');
    const table = param.get('table');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');
    const company = param.get('company');
    const idCompany = param.get('idCompany');
    const plantName = param.get('plantName');

    

    return (
        <>
            <div className="font-bold text-xl text-gray-800 pt-4 md:pt-0 mb-8">
                <Link href='/dashboard' className='text-muted-foreground relative border-b-0 hover:border-b-2 hover:border-zinc-400'>Principal</Link> 
                <span className='text-sm text-muted-foreground '>{'  ->  '}</span>
                <Link href={{pathname:'/dashboard/plant', query: { id: idCompany, name: company, plantName: plantName }}} className='text-muted-foreground relative border-b-0 hover:border-b-2 hover:border-zinc-400'>{company}</Link> 
                <span className='text-sm text-muted-foreground '>{'  ->  '}</span>
                {deviceName}
            </div>
            

            {deviceType === 'integrationDevice' && (
                <>
                <IntegrationDevice />
                </>
            )}

            {deviceType === 'standardDevice' && (
                <AsystomDevice />
            )}

            

            
            
            
        </>
    );
}

export default Device;
