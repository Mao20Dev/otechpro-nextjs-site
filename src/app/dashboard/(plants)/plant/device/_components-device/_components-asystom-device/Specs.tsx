import React from 'react'
import { BatteryCharging, BatteryMediumIcon, ThermometerIcon } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Specs({imageUrl, temperature, battery, functionM, piece,model,manufacturer,serial}: any) {
    return (
        <div className='flex flex-row flex-wrap'>
            <div className=' w-full sm:w-full md:w-full lg:w-2/3  xl:w-3/5 big-xl:w-1/3 h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 bg-gray-800 rounded-2xl justify-start items-end'>
                <div className='w-full h-full flex justify-center lg:justify-start items-center'>

                    <CldImage
                        alt='Uploaded Image'
                        src={imageUrl}
                        width="550"
                        height="240"
                        crop={{
                            type: 'auto',
                            source: true
                        }}
                        className='rounded-t-2xl rounded-tl-2xl rounded-l-none sm:rounded-l-2xl sm:rounded-tr-none  xl:rounded-tr-none'
                    />
                </div>
                <div className='flex flex-col pt-2 pb-4 xl:pb-2 pl-4 lg:pl-4 lg:pt-3 justify-start items-start w-full h-full'>
                    <div className='flex flex-row text-sm '>
                        <p className='text-zinc-200 font-bold leading-5'>Funcion:</p>
                        <div className='text-muted text-xs ml-2 leading-5'>{functionM}</div>
                    </div>
                    <div className='flex flex-row text-sm  '>
                        <p className='text-zinc-200 font-bold leading-5'>Pieza:</p>
                        <div className='text-muted text-xs ml-2 leading-5'>{piece}</div>
                    </div>
                    <div className='flex flex-row text-sm '>
                        <p className='text-zinc-200 font-bold leading-5'>Modelo:</p>
                        <div className='text-muted text-xs ml-2 leading-5'>{model}</div>
                    </div>
                    <div className='flex flex-row text-sm '>
                        <p className='text-zinc-200 font-bold leading-5'>Fabricante:</p>
                        <div className='text-muted text-xs ml-2 leading-5'>{manufacturer}</div>
                    </div>
                    <div className='flex flex-row text-sm '>
                        <p className='text-zinc-200 font-bold leading-5'>Serial:</p>
                        <div className='text-muted text-xs ml-2 leading-5'>{serial}</div>
                    </div>
                </div>
            </div>

            <div className='w-full  xl:w-full big-xl:w-3/7 h-auto grid grid-cols-1 lg:grid-cols-2 gap-2 mt-5 px-0 xl:px-0 big-xl:px-4 justify-center items-end '>
                <div className='w-full xl:w-full big-xl:w-[100%] h-[65px] flex flex-row justify-between items-center bg-gray-800 rounded-xl p-2'>
                    <div className='w-[60px] h-[60px] xl:w-[70px] xl:h-[70px] relative top-[-20px] ml-2  rounded-2xl bg-button-green-gradient flex flex-row justify-center items-center '>
                        <BatteryMediumIcon className='text-zinc-200 text-2xl' size={30} />
                    </div>
                    <div className='mr-1'>
                        <Label className=' text-muted-foreground font-bold 3 text-sm xl:text-sm '>Bateria</Label>
                        <div className='flex flex-row items-end '>
                            <div className='w-auto h-full text-zinc-200 rounded-2xl text-xl'>{battery}</div>
                            <div className='ml-2 text-muted-foreground font-bold leading-6'>V</div>
                        </div>
                    </div>
                </div>
                <div className='w-full xl:w-full big-xl:w-[100%] h-[65px] flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-3 p-2'>
                    <div className='w-[60px] h-[60px] xl:w-[70px] xl:h-[70px] relative top-[-20px] ml-2  rounded-2xl bg-button-green-gradient flex flex-row justify-center items-center '>
                        <ThermometerIcon className='text-zinc-200 text-2xl' size={30} />
                    </div>
                    <div className='mr-1'>
                        <Label className='text-muted-foreground font-bold leading-6 text-sm xl:text-sm '>Temperatura</Label>
                        <div className='flex flex-row items-end '>
                            <div className='w-auto h-full text-zinc-200 rounded-2xl text-xl'>{temperature}</div>
                            <div className='ml-2 text-muted-foreground font-bold leading-6'>°C</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Specs