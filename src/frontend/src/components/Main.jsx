// src/components/Main.jsx
import React from 'react';
import BailoutStimulusChart from './BailoutStimulusChart.jsx';
import EconomicIndicatorsChart from './EconomicIndicators.jsx';
import UnemploymentChart from './UnemploymentChart.jsx';
import CPIChart from './CPIChart.jsx';
import OverlayChart from './OverlayChart.jsx';
import FinancialDashboard from './FinancialDashboard.jsx';
import GdpStockCorrelationChart from './GdpStockCorrelationChart';

const Main = () => (
  <div className="min-h-screen flex flex-col min-w-screen " style={{ marginTop: '110px', marginLeft: '0px', marginRight: '0px'}}>
    {/*<div className="py-4">*/}
    {/*  <h1 className="text-3xl text-center">DataExpert.IO - Rosy Economix Capstone</h1>*/}
    {/*  <p className="text-center mt-2"></p>*/}
    {/*</div>*/}
    <div id="default-carousel" className="relative w-full bg-gray-600 h-[85vh]" data-carousel="static" style={{ paddingLeft: '65px', paddingRight: '65px', minHeight: '710px', paddingTop: '10px' }}>
      <div className="relative h-96 overflow-hidden md:h-96 bg-green-50 pb-0 mb-0" >
                <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <OverlayChart />
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          {/*<OverlayChart />*/}

          <GdpStockCorrelationChart />
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <BailoutStimulusChart />
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <EconomicIndicatorsChart />
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <UnemploymentChart />
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <CPIChart />
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <FinancialDashboard />
        </div>
      </div>
      <div className="second-carousel-item absolute z-30 flex -translate-x-1/2 bottom mt-4 left-1/2 space-x-3 rtl:space-x-reverse max-h-[48px]">
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 6" data-carousel-slide-to="5"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 7" data-carousel-slide-to="6"></button>

      </div>
      <button type="button" className="border-2 absolute top-0 start-0 z-50 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none bg-gray-500" data-carousel-prev>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-3 h-3 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button type="button" className="border-2 absolute top-0 end-0 z-50 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none bg-gray-500" data-carousel-next>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-3 h-3 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>

  </div>
);

export default Main;