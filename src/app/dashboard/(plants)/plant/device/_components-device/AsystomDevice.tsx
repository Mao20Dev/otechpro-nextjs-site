"use client"

import React, { useState } from 'react'



import {  useSearchParams } from 'next/navigation';
import Specs from './_components-asystom-device/Specs';
import { AudioLines } from 'lucide-react';
import Graph from './Chart';
import VarChartAsystom from './_components-asystom-device/VarChartAsystom';
import { set } from 'lodash';

function formatData(timeArray: any, dataArray: any) {
    // Check if both arrays have the same length
    if (timeArray.length !== dataArray.length) {
        throw new Error("Both arrays must have the same length");
    }
    
    // Create a formatted string
    let formattedData = "";
    for (let i = 0; i < timeArray.length; i++) {
        formattedData += `${timeArray[i]},${dataArray[i]}\n`;
    }
    
    return formattedData;
    }



function AsystomDevice() {
    const [imageUrl, setImageUrl] = useState('');
    const param = useSearchParams();

    const [Temperature, setTemperature] = useState<any>('');
    const [Battery, setBattery] = useState<any>('');

    const [anomalyData, setAnomalyData] = useState<any>('');
    const [actualValueAnomaly, setActualValueAnomaly] = useState<any>('');

    const id = param.get('id');
    const deviceName = param.get('deviceName');
    const mac = param.get('mac');


    console.log(id);

    const fetchSpecData = async () => {

        const responseTemperature = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Temperature&last=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const data = await responseTemperature.json();
        setTemperature(data[0].value.toFixed(2));

        const responseBattery = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Batt_Lvl&last=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const dataBattery = await responseBattery.json();
        setBattery(dataBattery[0].value.toFixed(2));

    }

    const fetchAnomaly = async () => {
        const response = await fetch(`https://otechpro.asystom.com/dev/api/?device_mac=${mac}&datatype=Signature_Anomaly&last=60`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('asysbotoo:SRjHhpkXaDx2DdmMq353')
            },
        });
        const data = await response.json();
        
        // Extraer los datos y transformarlos
        const transformedData = data.map((item: any) => {
            const date = new Date(item.time);
            const formattedTime = date.toLocaleString('es-CO', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            }).replace(',', '');
            
            return {
                time: formattedTime,
                score_anomaly: item.score_anomaly
            };
        });
    
        // Ordenar los datos por tiempo en orden ascendente (antiguo a reciente)
        transformedData.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
        // Crear los arrays separados e invertidos
        const times = transformedData.map((item: any) => item.time).reverse();
        const scores = transformedData.map((item: any) => item.score_anomaly).reverse();
    
        console.log('Fechas: ', times);
        console.log('Scores: ', scores);

        const mostRecentValue = scores[scores.length - 1].toFixed(2);

        console.log('Data formateada para dygraph: ', formatData(times, scores));
        setAnomalyData(formatData(times, scores));
        setActualValueAnomaly(mostRecentValue *100);
    };
    
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
        
        setImageUrl(data.ImageURL);
    }
    
    React.useEffect(() => {
        fetchSpecData();
        fetchImage();
        fetchAnomaly();
        
    }, []);
    
    



    return (
    <>
        <Specs imageUrl={imageUrl} temperature={Temperature} battery={Battery} />

        <VarChartAsystom data={anomalyData} actualValue={actualValueAnomaly} unit={'%'} nameVariable={'Puntaje de anomalia'} iconType={'vibration'} />

        

    </>
)
}

export default AsystomDevice