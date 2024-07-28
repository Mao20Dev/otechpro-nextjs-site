import React from 'react'



function CompanyCards({}) {
    
    return (
        <div className="bg-gray-800 w-full  h-auto rounded-2xl px-2 py-4">
            <div className="flex flex-col items-start justify-between px-4 py-3">
                <div className="text-white text-2xl ml-2 font-bold mb-3">Bavaria -  Bogota</div> 
                
                <div className="flex w-full flex-col bg-button-green-gradient items-start justify-between px-4 py-2 mt-3 rounded-lg cursor-pointer hover:bg-button-blue-gradient ">
                <div className="text-zinc-200 text-sm ml-2 ">Planta generacion portable</div>
                <div className=" text-[10px] text-muted ml-2 ">Dispostivos: 2</div> 
                </div>
                <div className="flex w-full flex-col bg-button-green-gradient items-start justify-between px-4 py-2 mt-3 rounded-lg cursor-pointer hover:bg-button-blue-gradient ">
                <div className="text-zinc-200 text-sm ml-2 ">Planta generacion portable</div>
                <div className=" text-[10px] text-muted ml-2 ">Dispostivos: 2</div> 
                </div>
                
            </div>
        </div>
    )
}

export default CompanyCards