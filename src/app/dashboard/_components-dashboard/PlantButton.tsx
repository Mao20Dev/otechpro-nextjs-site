import React from 'react'



function PlantButton({}) {
  return (
    <div className="flex w-full flex-col bg-button-green-gradient items-start justify-between px-4 py-2 mt-3 rounded-lg cursor-pointer hover:bg-button-blue-gradient ">
        <div className="text-zinc-200 text-sm ml-2 ">Planta generacion portable</div>
        {/* <div className=" text-[10px] text-muted ml-2 ">Dispostivos: 2</div>  */}
    </div>
  )
}

export default PlantButton