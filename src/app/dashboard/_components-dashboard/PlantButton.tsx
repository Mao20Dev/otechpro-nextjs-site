import Link from 'next/link';
import React from 'react'



function PlantButton({plants, company}: any) {
    const plantComponent = plants?.map((plant: any) => {
        console.log(plant);
    return (
        <Link href={{ pathname: "/dashboard/plant", query: { id: plant.PlantID, name:company, plantName:plant.PlantName } }} className="flex w-full flex-col bg-button-green-gradient items-start justify-between px-4 py-2 mt-3 rounded-lg cursor-pointer hover:bg-button-blue-gradient ">
            <div className="text-zinc-200 text-sm ml-2 ">{plant.PlantName}</div>
            {/* <div className=" text-[10px] text-muted ml-2 ">Dispostivos: 2</div>  */}
        </Link>
    );
  });
    return (
        <>
            {plantComponent}
        </>
    )
    }

    export default PlantButton