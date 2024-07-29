import React from 'react'
import PlantButton from './PlantButton'



function CompanyCards({company}: any) {
    const companies = company?.map((company: any) => {
        return (
            <div className="bg-gray-800 w-full  h-auto rounded-2xl px-2 py-4">
                <div className="flex flex-col items-start justify-between px-4 py-3">
                    <div className="text-zinc-200 text-md ml-2 font-bold mb-3">{company.CompanyName}</div> 
                    
                    <PlantButton plants={company.Plants} company={company.CompanyName} />
                    
                </div>
            </div>
            );
        });
    
        return (
            <>
                {companies}
            </>
            
        )
    }

export default CompanyCards