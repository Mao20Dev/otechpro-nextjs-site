import Link from 'next/link';
import React from 'react'



function DeviceButton({device, company, idCompany, plantName}: any) {
    console.log(device);

    return (
    <Link href={{ pathname: "/dashboard/plant/device", 
        query: device.meterSN && device.dataTable ? { 
            id: device.DeviceID, 
            meterSN: device.meterSN, 
            table: device.dataTable, 
            deviceName: device.DeviceName,
            company: company,
            idCompany: idCompany,
            plantName: plantName
        } : { 
            id: device.DeviceID, 
            deviceName: device.DeviceName, 
            mac: device.MAC,
            company: company,
            idCompany: idCompany,
            plantName: plantName
        } }} 
    className="flex w-full flex-col bg-button-green-gradient items-center justify-center px-4 py-2  rounded-lg cursor-pointer hover:bg-button-blue-gradient ">
            <div className="text-zinc-200 text-sm ">{device.DeviceName}</div> 
    </Link>
            
    )
}

export default DeviceButton