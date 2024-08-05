
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Radar } from 'react-chartjs-2'; 
  import React from 'react';
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );
  
  
  
  const options= {
    locale: 'en-US',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: { // https://www.chartjs.org/docs/latest/axes/radial/
        angleLines: {
          color: 'rgba(255,255,255,0.2)'
        },
        grid: {
          color: 'rgba(255,255,255,0.2)'
        },
        pointLabels: { // https://www.chartjs.org/docs/latest/axes/radial/#point-labels
          color: 'rgba(255,255,255,1)',
          
        },
        ticks: { // https://www.chartjs.org/docs/latest/axes/radial/#ticks
          color: 'rgba(255,255,255,1)',
          backdropColor: 'rgb(224, 244, 255,0)' // https://www.chartjs.org/docs/latest/axes/_common_ticks.html
        }
      }
      
    }
  }
  
  export default function RadarChart({ barData }: any) {
    const [datasetted, setDataSetted] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [labels, setLabels] = React.useState([]);
    const [ranges, setRanges] = React.useState([]);
  
    React.useEffect(() => {
      if (barData) {
        // Calcular los rangos y las etiquetas dinámicamente
        const min = Math.min(...barData);
        const max = Math.max(...barData);
        const step = (max - min) / 10; // Divide en 10 intervalos
  
        const newRanges: any = Array.from({ length: 11 }, (_: any, i: any) => min + step * i);
        const newLabels = newRanges.map((range: any) => `${(range ).toFixed(2)}%`);
  
        const conteoRangos = new Array(newLabels.length).fill(0);
  
        barData.forEach((valor: any) => {
          for (let i = 1; i < newRanges.length; i++) {
            if (valor <= newRanges[i]) {
              conteoRangos[i]++;
              break;
            }
          }
        });
  
        setRanges(newRanges);
        setLabels(newLabels);
        setDataSetted(conteoRangos);
      }
    }, [barData]);
  
    const data = {
      labels,
      datasets: [
        {
          label: 'Puntaje de Anomalia',
          data: datasetted,
          backgroundColor: 'rgba(255,255,255,0.4)',
          borderColor: 'rgba(255,255,255,1)',
          borderWidth: 1,
          options:{
            scales:{
              backdropColor:'rgba(255,255,255,1)'
            },
            color:'rgba(255,255,255,1)'
          }
        },
      ],
    };
  
    return <Radar data={data} options={options} style={{ color: 'rgba(255,255,255,1)' }} />;
  }
  
  
  