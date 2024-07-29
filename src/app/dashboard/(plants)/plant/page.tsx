'use client'

import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"


import Link from 'next/link'
import {  useSearchParams } from 'next/navigation'
import React, { use, useState } from 'react'
import { useUser } from "@clerk/nextjs"
import Device from "./_components-plant/DeviceButton"



function Plant({}) {
    const [userData, setUserData] = useState<any>(null);
    const [filteredDevices, setFilteredDevices] = useState<any[]>([]);
    const param = useSearchParams();
    const id = param.get('id');  
    const name = param.get('name');
    const plantName = param.get('plantName');

    const user = useUser();

    

    React.useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.user?.id,
                }),
            });
            if (!response.ok) {
                console.error('Error al enviar la información del usuario a la API de Lambda');
            } else {
                const responseData = await response.json();
                console.log(responseData);
                setUserData(responseData);
                // Filtrar dispositivos de la planta correspondiente
                const devices: any = [];
                responseData.Companies.forEach((company: any) => {
                    company.Plants.forEach((plant: any) => {
                        if (plant.PlantID === id) {
                            devices.push(...plant.Devices);
                        }
                    });
                });
                setFilteredDevices(devices);
            }
        };
        fetchUser();
    }, [user.user?.id])

    console.log(filteredDevices);

    const devices = filteredDevices?.map((device: any) => {
        return (
            <Device device={device} company={name} idCompany={id} plantName={plantName} />
        )
    });

    return (
    <>
        <div className=" font-bold text-xl text-gray-800 pt-4 md:pt-0 mb-8">
            <Link href='/dashboard' className=' text-muted-foreground relative border-b-0 hover:border-b-2 hover:border-zinc-400'>Principal</Link> 
            <span className='text-sm text-muted-foreground '>{'  ->  '}</span>
            {name}
        </div>

        <div className="bg-gray-800 w-full lg:w-1/2 h-auto rounded-2xl px-6 py-8 ">
            <div className="w-full flex flex-row justify-between items-center mb-6">
                <div className="text-md text-zinc-200 pt-4 md:pt-0 ">{plantName}</div>
                <Input  placeholder="Buscar dispositivo" type="search" className="w-1/4 text-sm" />
            </div>
            
            <Separator classname='text-zinc-200 bg-zinc-200'  />

            <div className="bg-gray-800 w-full  h-auto rounded-2xl px-6 py-8 grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2  ">
                {devices}
            </div>
            
        </div>
        
        
        
    </>
    )
}

export default Plant