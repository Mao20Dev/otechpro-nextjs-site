import React, { useState } from 'react'

import { CldImage } from 'next-cloudinary';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {  useSearchParams } from 'next/navigation';

function AsystomDevice() {
    const [imageUrl, setImageUrl] = useState('');
    const param = useSearchParams();

    const id = param.get('id');
    console.log(id);
    

    const uploadImage = async (file: any) => {
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''); // Configura tu preset de subida en Cloudinary
    
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
    
        const data = await response.json();
        return data.secure_url; // URL segura de la imagen subida
    };
    

    const handleImageUpload = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const url = await uploadImage(file);
            console.log(url);
            setImageUrl(url);
        }
    };



    return (<>
        <div>AsystomDevice</div>

        <Label htmlFor="picture">Picture</Label>
        <Input className='w-1/3' id="picture" type="file" onChange={handleImageUpload} />
        
        {imageUrl && (
            <CldImage
                alt='Uploaded Image'
                src={imageUrl}
                width="500"
                height="500"
                crop={{
                    type: 'auto',
                    source: true
                }}
            />
        )}
    </>
)
}

export default AsystomDevice