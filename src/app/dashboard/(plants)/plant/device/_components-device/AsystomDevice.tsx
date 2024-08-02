import React, { useState } from 'react'

import { CldImage } from 'next-cloudinary';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {  useSearchParams } from 'next/navigation';
import { BatteryCharging, BatteryMediumIcon, ThermometerIcon } from 'lucide-react';



function AsystomDevice() {
    const [imageUrl, setImageUrl] = useState('');
    const param = useSearchParams();

    const id = param.get('id');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');

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
        console.log('data traida con exito: ', data.ImageURL);
        console.log('data traida con exito: ', data);
        setImageUrl(data.ImageURL);
    }
    
    React.useEffect(() => {
        fetchImage();
    }, []);
    
    



    return (<>

    <div className='flex flex-row flex-wrap'>
        <div className=' w-full mb-4 sm:w-full md:w-full lg:w-full xl:w-1/2 h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 bg-gray-800 rounded-2xl '>
            <div className='w-full h-full flex justify-center lg:justify-start items-center'>

                <CldImage
                    alt='Uploaded Image'
                    src={imageUrl}
                    width="650"
                    height="280"
                    crop={{
                        type: 'auto',
                        source: true
                    }}
                    className='rounded-t-2xl rounded-tl-2xl rounded-l-none sm:rounded-l-2xl sm:rounded-tr-none  xl:rounded-tr-none'
                />
            </div>
            <div className='flex flex-col pt-2 pb-4 xl:pb-0 pl-4 lg:pl-4 lg:pt-2 justify-start items-start w-full h-full'>
                <div className='flex flex-row text-sm xl:text-base'>
                    <p className='text-zinc-200 font-bold leading-6'>Funcion:</p>
                    <div className='text-muted ml-2 leading-6'>Other</div>
                </div>
                <div className='flex flex-row text-sm xl:text-base '>
                    <p className='text-zinc-200 font-bold leading-6'>Pieza:</p>
                    <div className='text-muted ml-2 leading-6'>Compresor</div>
                </div>
                <div className='flex flex-row text-sm xl:text-base'>
                    <p className='text-zinc-200 font-bold leading-6'>Modelo:</p>
                    <div className='text-muted ml-2 leading-6'>Modelo 2</div>
                </div>
                <div className='flex flex-row text-sm xl:text-base'>
                    <p className='text-zinc-200 font-bold leading-6'>Fabricante:</p>
                    <div className='text-muted ml-2 leading-6'>cummis</div>
                </div>
                <div className='flex flex-row text-sm xl:text-base'>
                    <p className='text-zinc-200 font-bold leading-6'>Serial:</p>
                    <div className='text-muted ml-2 leading-6'>1234567890</div>
                </div>
            </div>
        </div>


        <div className='w-full   xl:w-3/4 h-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3 justify-start items-end'>
            <div className='w-full h-[65px] flex flex-row justify-between items-center bg-gray-800 rounded-2xl p-2'>
                <div className='w-[70px] h-[70px] xl:w-[80px] xl:h-[80px] relative top-[-20px] ml-2  rounded-2xl bg-button-green-gradient flex flex-row justify-center items-center '>
                    <BatteryMediumIcon className='text-zinc-200 text-2xl' size={40} />
                </div>
                <div className='mr-6'>
                    <Label className=' text-muted-foreground font-bold leading-6 text-sm xl:text-base '>Bateria</Label>
                    <div className='flex flex-row items-end '>
                        <div className='w-auto h-full text-zinc-200 rounded-2xl text-2xl'>2.93</div>
                        <div className='ml-2 text-muted-foreground font-bold leading-6'>V</div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[65px] flex flex-row justify-between items-center bg-gray-800 rounded-2xl mt-3 p-2'>
                <div className='w-[70px] h-[70px] xl:w-[80px] relative top-[-20px] ml-2  rounded-2xl bg-button-green-gradient flex flex-row justify-center items-center '>
                    <ThermometerIcon className='text-zinc-200 text-2xl' size={40} />
                </div>
                <div className='mr-6'>
                    <Label className='text-muted-foreground font-bold leading-6 text-sm xl:text-base '>Temperatura</Label>
                    <div className='flex flex-row items-end '>
                        <div className='w-auto h-full text-zinc-200 rounded-2xl text-2xl'>30.84</div>
                        <div className='ml-2 text-muted-foreground font-bold leading-6'>°C</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    
    


        
    </>
)
}

export default AsystomDevice