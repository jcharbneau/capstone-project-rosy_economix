import 'regenerator-runtime/runtime';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { initGA, logPageView } from "./util/analytics.js";
import Main from "./components/Main.jsx";
import DesignDataModel from "./components/DesignDataModel.jsx";
import About from "./components/About.jsx";
import NavBar from "./components/NavBar.jsx";
import './App.css';
import './index.css';
import rosyheaderimage from './assets/rosy_header_logo.png';

const questions = {
    economic_indicators: [
        "How do GDP growth rates correlate with stock market performance?",
        "What is the relationship between unemployment rates and consumer spending?",
        "How do inflation rates impact the stock prices of different sectors?"
    ],
    stock_market_analysis: [
        "Which sectors have shown the highest growth over the past decade?",
        "How do dividend yields compare across different industries?",
        "What are the top-performing stocks in terms of ROI (Return on Investment) over the past year?"
    ],
    credit_and_debt_metrics: [
        "How has consumer credit delinquency evolved over time, and what are the implications for financial stability?",
        "What are the trends in corporate debt issuance and repayment?"
    ],
    government_fiscal_policy: [
        "How do changes in federal interest rates affect the stock market?",
        "What is the impact of government spending on economic growth?"
    ],
    business_and_stock: [
        "How does stock volatility differ between large-cap and small-cap companies?",
        "What are the most common characteristics of companies that have consistently outperformed the market?"
    ],
    user_engagement_metrics: [
        "Which stocks have the most favorable P/E (Price-to-Earnings) ratios?",
        "What are the historical trends in stock splits and their impact on stock prices?"
    ]
};

const buttonLabels = {
    economic_indicators: 'Economic Indicators',
    stock_market_analysis: 'Stock Market Analysis',
    credit_and_debt_metrics: 'Credit & Market Analysis',
    government_fiscal_policy: 'Government & Fiscal Policy',
    business_and_stock: 'Business & Stock Data',
    user_engagement_metrics: 'User-Engaging Metrics'
};

function App() {
    const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
    const [activePanel, setActivePanel] = useState(null);

    const handleMouseEnter = (text, event) => {
        const { clientX: x, clientY: y } = event;
        // setTooltip({ show: true, text, x, y });
    };

    const handleMouseLeave = () => {
        setTooltip({ show: false, text: '', x: 0, y: 0 });
    };

    const handleClick = (key) => {
        setActivePanel(prevKey => prevKey === key ? null : key);
    };

    return (
        <BrowserRouter>
            <div>
                {/* Top banner */}
                <div className="flex justify-start" style={{zIndex:100}}>
                    <div className="svg-container">
                        <img src={rosyheaderimage} alt="Rosy Economix" />
                    </div>
                    <header className="top-0">
                        <NavBar />
                    </header>
                </div>
                <div className="text-black mt-56 pl-4 bg-white min-h-screen w-full justify-between relative">
                    <Routes>
                        <Route path="/" element={<Main />} />
                        {/*<Route path="/charts" element={<Charts />} />*/}
                        <Route path="/design" element={<DesignDataModel />} />
                        {/*<Route path="/about" element={<About />} />*/}
                    </Routes>
                    <div className={`sliding-panel ${activePanel ? 'active' : ''}`} style={{ zIndex: 40 }}>
                        {activePanel && (
                            <div className="panel-content">
                                <h2>{buttonLabels[activePanel]}</h2>
                                <ul>
                                    {questions[activePanel].map((question, index) => (
                                        <li key={index}>{question}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="footer flex justify-end fixed absolute z-40" style={{"width":"100%", backgroundColor: "rgb(40, 44, 52)" }}>
                    {/*<div className="flex justify-center items-center w-full space-x-1.5 mt-1" style={{ paddingLeft: '5px', paddingRight: '5px' }}>*/}
                    {/*    {[*/}
                    {/*        { key: 'economic_indicators', text: 'Economic Indicators' },*/}
                    {/*        { key: 'stock_market_analysis', text: 'Stock Market Analysis' },*/}
                    {/*        { key: 'credit_and_debt_metrics', text: 'Credit & Market Analysis' },*/}
                    {/*        { key: 'government_fiscal_policy', text: 'Government & Fiscal Policy' },*/}
                    {/*        { key: 'business_and_stock', text: 'Business & Stock Data' },*/}
                    {/*        { key: 'user_engagement_metrics', text: 'User-Engaging Metrics' }*/}
                    {/*    ].map(({ key, text }) => (*/}
                    {/*        <button*/}
                    {/*            key={key}*/}
                    {/*            className={`overlay-button w-full h-10 center ${activePanel === key ? 'active-button' : ''}`}*/}
                    {/*            style={{ margin: '2px' }}*/}
                    {/*            onClick={() => handleClick(key)}*/}
                    {/*            onMouseEnter={(e) => handleMouseEnter(text, e)}*/}
                    {/*            onMouseLeave={handleMouseLeave}*/}
                    {/*        >*/}
                    {/*            {text}*/}
                    {/*        </button>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
                {/*{tooltip.show && (*/}
                {/*    <div className="tooltip" style={{ top: tooltip.y - 40, left: tooltip.x }}>*/}
                {/*        {tooltip.text}*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </BrowserRouter>
    );
}

export default App;
