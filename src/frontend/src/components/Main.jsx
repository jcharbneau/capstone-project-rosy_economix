import React from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
// import { Carousel} from "flowbite";
import BailoutStimulusChart from "./BailoutStimulusChart.jsx";
import EconomicIndicatorsChart from "./EconomicIndicators.jsx";
import UnemploymentChart from "./UnemploymentChart.jsx";
import GDPChart from "./GDPChart.jsx";
import CPIChart from "./CPIChart.jsx";
import OverlayChart from "./OverlayChart.jsx";

import carousel1 from '../assets/carousel-1.svg';
import carousel2 from '../assets/carousel-2.svg';
import carousel3 from '../assets/carousel-3.svg';
import carousel4 from '../assets/carousel-4.svg';
import carousel5 from '../assets/carousel-5.svg';



const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Slight transparency for the dataset fill
      borderColor: 'rgba(75, 192, 192, 1)',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: 'rgba(0,0,0,1)',
      },
    },
  },
  elements: {
    line: {
      tension: 0.4, // Curved lines
    },
    point: {
      radius: 5,
    },
  },
};


const Main = () => (
  <div className="min-h-screen flex flex-col min-w-screen" style={{ "marginTop":"140px", "marginLeft":"30px", "marginRight":"30px", "minHeight":"800px"}}>
    <div className="py-4">
      <h1 className="text-3xl text-center">DataExpert.IO - Rosy Economix Capstone</h1>
      <p className="text-center mt-2"></p>
    </div>

    {/*<div className="h-56 sm:h-64 xl:h-80 2xl:h-96">*/}
    {/*  <Carousel>*/}
    {/*    <img src={carousel1} alt="1" />*/}
    {/*    <img src={carousel2} alt="2" />*/}
    {/*    <img src={carousel3} alt="3" />*/}
    {/*    <img src={carousel4} alt="4" />*/}
    {/*    <img src={carousel5} alt="5" />*/}
    {/*  </Carousel>*/}
    {/*</div>*/}
    <div id="default-carousel" className="border-2 relative w-full min-h-[800px] bg-gray-600 " data-carousel="static" style={{ "padding-left": "85px", "padding-right":"85px", "min-height":"700px", "padding-top":"30px"}}>

      <div className="relative h-96 overflow-hidden rounded-lg md:h-96 bg-green-50">

        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          {/*<img src={carousel1}*/}
          {/*     className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />*/}
          {/*<Line data={data} options={options} className="max-w-5xl max-h-full center transparent-canvas" />;*/}
          <OverlayChart  className="" />
        </div>

        <div className="hidden duration-700 ease-in-out"  data-carousel-item>
          {/*<img src={carousel2}*/}
          {/*     className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />*/}
          <BailoutStimulusChart className=" " />
        </div>

        <div className="hidden duration-700 ease-in-out " data-carousel-item>
          {/*<img src={carousel3}*/}
          {/*     className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />*/}
          <EconomicIndicatorsChart className=" " />
        </div>

        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          {/*<img src={carousel4}*/}
          {/*     className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />*/}
          <UnemploymentChart/>
        </div>

        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          {/*<img src={carousel5}*/}
          {/*     className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>*/}
          <CPIChart className=" "  />
        </div>
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom mt-4 left-1/2 space-x-3 rtl:space-x-reverse">
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="true" aria-label="Slide 1"
                data-carousel-slide-to="0"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 2"
                data-carousel-slide-to="1"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 3"
                data-carousel-slide-to="2"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 4"
                data-carousel-slide-to="3"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 5"
                data-carousel-slide-to="4"></button>
      </div>
      <button type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none bg-gray-500"
              data-carousel-prev>
        <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-8 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M5 1 1 5l4 4"/>
            </svg>
            <span className="sr-only">Previous</span>
        </span>
      </button>
      <button type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none bg-gray-500"
              data-carousel-next>
        <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="m1 9 4-4-4-4"/>
            </svg>
            <span className="sr-only">Next</span>
        </span>
      </button>
      {/*<div className="w-full h-full overflow-hidden z-50 bg-red-300 opacity-20">*/}



      {/*</div>*/}


    </div>
        <div className="flex justify-center items-center w-full space-x-1.5 mt-0 border-2" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
      {Array.from({ length: 10 }).map((_, index) => (
        <button
          key={index}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600"
          style={{ margin: '2px' }}
        />
      ))}
    </div>
  </div>
);

export default Main;