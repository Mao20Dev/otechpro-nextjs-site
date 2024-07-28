import React from 'react'
import PlantButton from './PlantButton'



function CompanyCards({}) {
    
    return (
        <div className="bg-gray-800 w-full  h-auto rounded-2xl px-2 py-4">
            <div className="flex flex-col items-start justify-between px-4 py-3">
                <div className="text-white text-md ml-2 font-bold mb-3">Bavaria -  Bogota</div> 
                
                <PlantButton />
                
            </div>
        </div>
    )
}

export default CompanyCards