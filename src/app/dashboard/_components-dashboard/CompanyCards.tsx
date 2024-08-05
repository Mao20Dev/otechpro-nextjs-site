import React from 'react'
import PlantButton from './PlantButton'



function CompanyCards({company}: any) {
    console.log("company in companyCards",company);
    const companies = company?.map((company: any) => {
        return (
            <div className="bg-gray-800 w-full  h-auto rounded-t-2xl rounded-b-xl px-0 py-0" key={company.CompanyName}>
                <div className="flex flex-col items-start justify-between px-0 py-0">
                    <img src={company.image} className="w-full h-[200px] rounded-t-xl" alt="logo" />
                    <div className="text-zinc-200 text-md ml-4 mt-2 font-bold mb-3">{company.CompanyName}</div> 

                    <div className='w-full px-4 mb-4 flex flex-col justify-center items-center'>
                        <PlantButton plants={company.Plants} company={company.CompanyName} />
                    </div>
                    
                    
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