// src/components/Main.jsx
import React, { useState, useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';

register();

import GdpCpiUnemploymentChart from './GdpCpiUnemploymentChart.jsx';
import FinancialDashboard from './FinancialDashboard.jsx';
import GdpStockCorrelationChart from './GdpStockCorrelationChart';
import UnemploymentConsumerSpendingChart from "./UnemploymentConsumerSpending.jsx";
import JobChart from "./JobChart.jsx";
import MainContent from "./MainContent.jsx";
import { logEvent } from "../util/analytics.js";


const Main = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperElRef = useRef(null);

    useEffect(() => {
        // Control Swiper with custom buttons
        const prevButton = document.querySelector('.custom-prev-button');
        const nextButton = document.querySelector('.custom-next-button');

        prevButton.addEventListener('click', () => {
            swiperElRef.current.swiper.slidePrev();
            logEvent('Navigation', 'Previous Slide', 'User clicked previous slide button');

        });

        nextButton.addEventListener('click', () => {
            swiperElRef.current.swiper.slideNext();
            logEvent('Navigation', 'Next Slide', 'User clicked next slide button');

        });

        const swiperInstance = swiperElRef.current.swiper;
        const updateActiveIndex = () => setActiveIndex(swiperInstance.realIndex);

        swiperInstance.on('slideChange', updateActiveIndex);
        return () => {
            swiperInstance.off('slideChange', updateActiveIndex);
        };
    }, []);

    return (
        <div className="flex flex-col h-screen" style={{ backgroundColor: '#000000', marginTop: '120px', marginLeft: '0px', marginRight: '0px' }}>
            { /* left navigation button, aka left */ }
            <div style={{ minWidth: '10vw', maxHeight:'90vh'}}>
                <button type="button" className="custom-prev-button border-2 absolute top-0 start-0 z-50 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none bg-gray-500" style={{paddingBottom: '150px'}}>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-3 h-3 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
            </div>

            { /* main content area to display text and charts, aka center */ }

            <div className="relative w-full z-20" style={{  paddingLeft: '65px', paddingRight: '65px', minHeight: '758px', maxHeight:'100vh', paddingTop: '10px', marginBottom: '0px', paddingBottom: '150px' }}>
                <swiper-container
                    ref={swiperElRef}
                    slides-per-view="1"
                    navigation="false"
                    pagination="false"
                    scrollbar="false"
                    mousewheel="false"
                    loop="true"
                    inject-styles="scrollable-content"
                >
                    <swiper-slide className="bg-white" style={{ minHeight: '80vh', backgroundColor: '#ffffff' }}>
                        <MainContent/>
                    </swiper-slide>
                    <swiper-slide className="bg-white" style={{ minHeight: '80vh', backgroundColor: '#ffffff' }}>
                        <JobChart currentSlideIndex={activeIndex} />
                    </swiper-slide>
                    <swiper-slide className="bg-white" style={{ minHeight: '80vh', backgroundColor: '#ffffff' }}>
                        <GdpStockCorrelationChart currentSlideIndex={activeIndex} />
                    </swiper-slide>
                    <swiper-slide className="bg-white" style={{ minHeight: '80vh', backgroundColor: '#ffffff' }}>
                        <UnemploymentConsumerSpendingChart  currentSlideIndex={activeIndex} />
                    </swiper-slide>
                    <swiper-slide className="bg-white" style={{ minHeight: '80vh', backgroundColor: '#ffffff' }}>
                        <GdpCpiUnemploymentChart currentSlideIndex={activeIndex} />
                    </swiper-slide>
                    <swiper-slide className="bg-white" style={{ minHeight: '80vh', backgroundColor: '#ffffff' }} >
                        <FinancialDashboard />
                    </swiper-slide>
                </swiper-container>
            </div>

            { /* right navigation button, aka right */ }
            <div style={{ minWidth: '10vw'}}>
                <button type="button" className="custom-next-button border-2 absolute top-0 end-0 z-50 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none bg-gray-500" style={{paddingBottom: '150px'}}>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-3 h-3 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>

            { /* bottom indicator bar, aka bottom */ }
            <div className="fixed bottom-0 max-w-full" style={{height: '60px', minHeight: '60px', maxHeight:'60px', backgroundColor: '#000000', zIndex: 100, width: '100%'}}>
            <div className="fixed bottom-0 pb-8 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3 rtl:space-x-reverse max-h-[64px] mt-4">
                {[...Array(6).keys()].map(index => (
                    <button
                        key={index}
                        type="button"
                        className="w-12 rounded-full cursor-pointer"
                        style={{
                            border: 0,
                            backgroundColor: activeIndex === index ? '#ff69b4' : '#6b7280', // Example color
                        }}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => {
                            swiperElRef.current.swiper.slideToLoop(index);
                            logEvent('Navigation', 'Slide Indicator', `User clicked slide indicator ${index + 1}`);
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    ></button>
                ))}
            </div></div>

        </div>
    );
}

export default Main;
