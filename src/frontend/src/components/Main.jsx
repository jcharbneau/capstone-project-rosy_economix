// src/components/Main.jsx
import React, { useState } from 'react';
import GdpCpiUnemploymentChart from './GdpCpiUnemploymentChart.jsx';
import FinancialDashboard from './FinancialDashboard.jsx';
import GdpStockCorrelationChart from './GdpStockCorrelationChart';
import UnemploymentConsumerSpendingChart from "./UnemploymentConsumerSpending.jsx";
import SectorGrowthChart from "./SectorGrowthChart.jsx";
import JobChart from "./JobChart.jsx";
import astronomer_logo from '../assets/astro.svg';
import daily_stock_data_update from '../assets/daily_stock_data_update.dag.png';
import fred_data_pipeline from '../assets/fred_data_pipeline.dag.png';
const rawData = [
  { "desc":"Stock data for 481 Tickers", "state":"in use", "type":"raw", "freq":"daily", "source": "Yahoo Finance", "records": "4,553,117", "units": "USD", "url":"https://pypi.org/project/yfinance/", "seasonal": "Not Seasonally Adjusted" },
  { "desc":"Consumer Price Index (CPI)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "929", "units": "Index", "url": "https://fred.stlouisfed.org/series/CPIAUCSL", "seasonal": "Seasonally Adjusted" },
  { "desc":"Gross Domestic Product (GDP)", "state":"in use", "type":"aggregated", "freq":"quarterly", "source": "Federal Reserve", "records": "313", "units": "Billions of Dollars", "url": "https://fred.stlouisfed.org/series/GDP", "seasonal": "Seasonally Adjusted" },
  { "desc":"Unemployment (UNRATE)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "917", "units": "Percent", "url": "https://fred.stlouisfed.org/series/UNRATE", "seasonal": "Seasonally Adjusted" },
  { "desc":"Nonfarm Payrolls (PAYEMS)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "1025", "units": "Thousands of Persons", "url": "https://fred.stlouisfed.org/series/PAYEMS", "seasonal": "Seasonally Adjusted" },
  { "desc":"Job Openings (JTSJOL)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "281", "units": "Thousands", "url": "https://fred.stlouisfed.org/series/JTSJOL", "seasonal": "Not Seasonally Adjusted" },
  { "desc":"Average Hourly Earnings (AHETPI)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "725", "units": "Dollars per Hour", "url": "https://fred.stlouisfed.org/series/AHETPI", "seasonal": "Seasonally Adjusted" },
  { "desc":"Total Wages and Salaries (BA06RC1A027NBEA)", "state":"in use", "type":"aggregated", "freq":"annually", "source": "Federal Reserve", "records": "41", "units": "Billions of Dollars", "url": "https://fred.stlouisfed.org/series/BA06RC1A027NBEA", "seasonal": "Seasonally Adjusted" },
  { "desc":"Employment Cost Index (ECIWAG)", "state":"in use", "type":"aggregated", "freq":"quarterly", "source": "Federal Reserve", "records": "177", "units": "Index", "url": "https://fred.stlouisfed.org/series/ECIWAG", "seasonal": "Seasonally Adjusted" },
  { "desc":"Average Weekly Earnings (CES0500000011)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "219", "units": "Dollars per Week", "url": "https://fred.stlouisfed.org/series/CES0500000011", "seasonal": "Seasonally Adjusted" },
  {"desc":"Consumer Spending (PCEC)", "freq":"quarterly", "state":"in use", "type":"aggregated", "source": "Federal Reserve", "records": "341", "units": "Billions of Dollars", "url": "https://fred.stlouisfed.org/series/PCEC", "seasonal": "Seasonally Adjusted" },
  {"desc":"Labor Force Participation Rate (CIVPART)","state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "917", "units": "Percent", "url": "https://fred.stlouisfed.org/series/CIVPART", "seasonal": "Seasonally Adjusted" },
  {"desc":"Discouraged Workers (LNU05026645)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "365", "units": "Thousands", "url": "https://fred.stlouisfed.org/series/LNU05026645", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"Marginally Attached Workers (LNU05026645)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "365", "units": "Thousands", "url": "https://fred.stlouisfed.org/series/LNU05026645", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"Underemployment Rate (U6RATE)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "365", "units": "Percent", "url": "https://fred.stlouisfed.org/series/U6RATE", "seasonal": "Seasonally Adjusted" },
  {"desc":"Consumer Sentiment Index (UMCSENT)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "858", "units": "Index", "url": "https://fred.stlouisfed.org/series/UMCSENT", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"Daily Treasury Yield Curve Rates (DGS1)", "state":"in use", "type":"raw", "freq":"daily", "source": "Federal Reserve", "records": "16303", "units": "Percent", "url": "https://fred.stlouisfed.org/series/DGS1", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"30-Year Fixed-Rate Mortgage Average (MORTGAGE30US)", "state":"in use", "type":"raw", "freq":"weekly", "source": "Federal Reserve", "records": "2779", "units": "Percent", "url": "https://fred.stlouisfed.org/series/MORTGAGE30US", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"S&P 500 Index (SP500)", "state":"in use", "type":"raw", "freq":"daily", "source": "Yahoo Finance", "records": "2610", "units": "Index", "url": "https://fred.stlouisfed.org/series/SP500", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"New Private Housing Units Authorized by Building Permits (PERMIT)", "state":"in use", "type":"aggregated", "freq":"monthly", "source": "Federal Reserve", "records": "773", "units": "Thousands of Units", "url": "https://fred.stlouisfed.org/series/PERMIT", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"10-Year Treasury Constant Maturity Rate (DGS10)", "state":"in use", "type":"raw", "freq":"daily", "source": "Federal Reserve", "records": "16303", "units": "Percent", "url": "https://fred.stlouisfed.org/series/DGS10", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"Exchange Rate USD to EUR (DEXUSEU)", "state":"in use", "type":"raw", "freq":"daily", "source": "Federal Reserve", "records": "6645", "units": "USD per EUR", "url": "https://fred.stlouisfed.org/series/DEXUSEU", "seasonal": "Not Seasonally Adjusted" },
  {"desc":"Federal Funds Effective Rate (FEDFUNDS)", "state":"in use", "type":"raw", "freq":"daily", "source": "Federal Reserve", "records": "839", "units": "Percent", "url": "https://fred.stlouisfed.org/series/FEDFUNDS", "seasonal": "Not Seasonally Adjusted" }
];





/*

'GDP': 'GDP',
    'Unemployment Rate': 'UNRATE',
    'CPI': 'CPIAUCSL',
    'Nonfarm Payrolls': 'PAYEMS',
    'Job Openings': 'JTSJOL',
    'Average Hourly Earnings': 'AHETPI',
    'Total Wages and Salaries': 'BA06RC1A027NBEA',
    'Employment Cost Index': 'ECIWAG',
    'Average Weekly Earnings': 'CES0500000011',
    'Consumer Spending': 'PCEC',
    'Labor Force Participation Rate': 'CIVPART',
    'Discouraged Workers': 'LNU05026645',
    'Marginally Attached Workers': 'LNU05026645',  # Same as Discouraged Workers
    'Underemployment Rate': 'U6RATE',
    'Consumer Sentiment Index':'UMCSENT'
 */
const Main = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    let windowReference = null;

    const handleRowClick = (item) => {
        setSelectedRow(item);
        if (windowReference == null || windowReference.closed) {
            windowReference = window.open(item.url, "_blank");
        } else {
            windowReference.location.href = item.url;
            windowReference.focus();
        }
    };

    return (
        <div className="min-h-screen flex flex-col min-w-screen " style={{ marginTop: '110px', marginLeft: '0px', marginRight: '0px'}}>
            <div id="default-carousel" className="relative w-full bg-gray-600 h-[85vh]" data-carousel="static" style={{ paddingLeft: '65px', paddingRight: '65px', minHeight: '758px', paddingTop: '10px' }}>
                <div className="relative h-96 overflow-hidden md:h-96 bg-green-50 pb-0 mb-0" >
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        { /* Project description / notes */ }
                        <div className="main-content-c1-flex main-content-c1-flex-col main-content-c1-p-6 main-content-c1-m-4 main-content-c1-overflow-y-scroll main-content-c1-max-h-full main-content-c1-bg-white main-content-c1-rounded-lg main-content-c1-shadow-md">
                            <h1 className="main-content-c1-text-3xl main-content-c1-font-bold main-content-c1-mb-4 main-content-c1-text-gray-800">Welcome to Rosy Economix</h1>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">Welcome to my project, the "Rosy Economix" tool. This tool started as an idea about how an average person interested in economics, stocks, or other measurable metrics we encounter daily could assess whether the picture is "Rosy" or not.  While this was a useful exercise, I believe the goal will be harder to achieve without including sentiment analysis, and incorporating other factors including the interest rates, housing costs and other economic influences into the overall view of the economy and markets.  Many of these data sets are only available to "members", and so would take some research and/or funding to acquire.</p>

                            <h2 className="main-content-c1-text-2xl main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">A quick walk thru</h2>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                On each panel that you navigate to using the arrows on either side of the application, you will find various charts attempting to answer questions I developed as part of this exercise.
                                In some cases, I selected data sets that do not historically align with a typical comparison.  The idea being to see what interesting insights could be gleaned for data sets not generally found useful,
                                by augmenting and overlaying them with various events.  To that end, each of the charts you encounter will have a series of Selectors at the top of the chart named "Conflict", "Finance", "Policy", "Pandemic" and "Key Moments".  While these are currently hard coded, a longer term idea was to have these as user configurable.  That way the user could define (or select pre-existing definitions) the events that they want to analyze or overlay for impact observability.
                            </p><p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                            One example of this is the "GDP Growth Rate vs Stock Market Return".  From some perspectives, this sort of comparison would not be considered ideal.
                            However, if we layer in Finance related annotations, we can start to see occurrences where both move in similar ways, tho stocks tend to be more extreme and/or volatile and recover more quickly.
                            These are observations that I would likely miss, not being trained in these disciplines.  Having a way to highlight and/or inject these annotations dynamically is a useful way to customize these charts for the users needs.
                        </p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                At the urging of friends/colleagues, and a little smitten with the auto-grading functionality developed for DataExpert.io, I decided to test the idea of incorporating an AI engine to provide feedback on the data.
                                By selecting the "Insights" button on any of the charts, you will receive feedback from OpenAI on the chart presented.  If you layer in annotations, and select the refresh icon, the chart will be reassessed and an updated analysis provided.
                            </p>

                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                One final exploration taken as part of this study, was to dig into the functionality afforded by the Data Build Tool (dbt from the folks at dbtlabs).  This tool has been very eye opening for me, and I wish I would have explored its capabilities sooner.  If you select DbtFlow from the navigation menu above, you will be taken to a representation of the source data and the flow of the data and modeling from dbt.

                            </p>
                             <h2 className="main-content-c1-text-2xl main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">Technology Preview</h2>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">While this project has come a long way in six weeks, it has a long way to go. In many ways, it is a presentation of what is possible; and in no way should be considered "production worthy". You will see bugs, you will likely encounter data that is inaccurate, you will encounter broken functionality and potential layout issues. While I have longer term ideas, this is a project for a class; and so certain ideas had to be left for later.  I also believe determining the "Rosiness" of various readings of economics is a goal that is nebulous, and so may take a few extra minutes ;-).  Note also that the data is US focused only, and does not include economic data from any other country.  Also note that in this early proof-of-concept, I am only targeting Google Chrome so please test using that browser.</p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">Please keep these thoughts in mind as you navigate this demonstration. </p>
                           <h2 className="text-2xl font-semibold mb-2 text-gray-800">Technology Stack</h2>
<ul className="mb-4 text-gray-700 flex flex-wrap">
    <li className="mb-2 flex items-center mr-8"><i className="fab fa-react mr-2 text-blue-600"></i>ReactJS</li>
    <li className="mb-2 flex items-center mr-8"><i className="fas fa-rocket mr-2 text-green-600"></i>FastAPI</li>
    <li className="mb-2 flex items-center mr-8"><i className="fas fa-database mr-2 text-indigo-600"></i>PostgreSQL</li>
    <li className="mb-2 flex items-center mr-8"><i className="fas fa-tools mr-2 text-red-600"></i>Data Build Tool (dbt-core)</li>
    <li className="mb-2 flex items-center mr-8"><img src={astronomer_logo} alt="Astronomer.io" className="mr-2" style={{ width: '1em', height: '1em' }} />Astronomer.io</li>
    <li className="mb-2 flex items-center mr-8"><i className="fab fa-python mr-2 text-blue-600"></i>Python 3</li>
    <li className="mb-2 flex items-center mr-8">
        <svg style={{ width: '1em', height: '1em' }} width="1em" height="1em" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" role="img">
            <text x="-9999" y="-9999">OpenAI</text>
            <path
                d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                fill="currentColor"
            ></path>
        </svg>
        <span className="ml-1.5">OpenAI</span>
    </li>
</ul>



                            <h2 className="main-content-c1-text-2xl main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">Observations / Challenges</h2>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                This project is very exploratory in nature, and is as much a opportunity for me to enhance my skills as explore upcoming technologies.  AI has been everywhere recently, and so leveraging those capabilities in this application / data flow became a very interesting way to explore some of these concepts.
                                I've encountered a number of successes, but critical review has shown that AI, while a profound enhancement to capabilities, is still very much a maturing technology.  In some instances, so called "hallucinations" can be seen, particularly when using multimodal capabilities (the ability to "view" a image).   I have found in many cases that colors are not always accurately identified, and so analysis can become confusing as the feedback will reference chart components incorrectly.  The AI responses have at times even provided analysis for datasets that are not included in the charts, and so some questions are raised regarding the responses and whether hallucinations have played a role in the inaccuracies.  More investigation and testing would be necessary to "tune" these issues out.
                            </p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                That being said, through much testing of the OpenAI API; I can honestly understand the excitement around this technology.   In many cases, the AI was able to identify correlations that as a lay person, I may not have spotted.  It provided highly conversational responses, and analyzed data much more rapidly than a human would be able to.
                                As this technology matures, I am sure it will play an outsized role in enhancing human understanding and capability.  The voluminous amount of data found in many companies has already become unmanageable.  AI technology will allow much more analysis at a much higher rate than ever before.  Will it replace engineers?  No, I don't believe it will.  It will augment our abilities.  It will replace some of our responsibilties and workloads through assisted automation.  It will allow much higher volumes of analysis with a much higher rate of quality.   It will change the game.  But I don't think it can work with out humans.  I don't believe it can "think" on its own.  And without us guiding the helm, I don't believe it can do much at all; but as a tool for us to further increase our output and understanding?  Absolutely!


                            </p>
                            <h2 className="main-content-c1-text-2xl main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">The DAGs</h2>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                I created two Directed Acyclic Graphs (DAGs) as part of this exercise. The first is a mockup of a DAG to collect data from the Yahoo Finance API, named <code>daily_stock_data_update.py</code>. This DAG demonstrates a process that could be used to facilitate a looped process to download stock data. I did not perform a full implementation as I have doubts about this approach to collecting the data due to the large number of stocks that may be needed to accurately assess the economic conditions, and while I am certain this could work; it would also take much too long and be too costly to just run API calls continuously.  I believe other, more appropriate options exist in the way of tools such as Polygon.io that would allow S3 based flat file access using Spark  (or Glue) and so would pursue those options for any production oriented effort.
                            </p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                The second DAG is named <code>fred_data_pipeline.py</code>, and is a closer approximation than I believe the first DAG is. It will loop through the defined datasets, dynamically define the task's, and download the corresponding data from FRED. It would normally filter and insert this data, but I have left that step unhooked for purposes of demonstration. As a follow on, the DAG would execute <code>dbt run</code> with appropriate arguments to model the raw data through to the production application tables.  There are outstanding questions with this dag, mainly regarding the accounting of different timeframes for the various data sets (daily vs weekly vs monthly, etc).  This approach too would encounter errors, as there is a rate limit implemented by FRED.   To that end, any time numerous calls would be made, a certain amount of care will be needed to adhere to the terms of service.
                            </p>
                            <div className="main-content-c1-flex main-content-c1-justify-between main-content-c1-mb-4">
                                <div className="main-content-c1-w-1/2 main-content-c1-p-2 main-content-c1-border main-content-c1-border-gray-300 main-content-c1-rounded">
                                    <h3 className="main-content-c1-text-lg main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">daily_stock_data_update.py</h3>
                                    <img src={daily_stock_data_update} className="main-content-c1-w-full main-content-c1-h-auto" alt="Daily Stock Data Update DAG"/>
                                </div>
                                <div className="main-content-c1-w-1/2 main-content-c1-p-2 main-content-c1-border main-content-c1-border-gray-300 main-content-c1-rounded">
                                    <h3 className="main-content-c1-text-lg main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">fred_data_pipeline</h3>
                                    <img src={fred_data_pipeline} className="main-content-c1-w-full main-content-c1-h-auto" alt="FRED Data Pipeline DAG"/>
                                </div>
                            </div>



                            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Notes on the data</h2>
                            <p className="pb-4"> In the table below, I have documented the datasets I have been working with.  If you select a dataset, it will open a window/tab to the FRED page for that dataset.</p>
                            <div className="text-base leading-relaxed mb-4 text-gray-700">
                                <table className="min-w-full bg-white">
                                    {/*<caption className="text-lg font-semibold text-gray-700 mb-4">Data sources</caption>*/}
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>

                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Source</th>

                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">State</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Records</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Unit of Measurement</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Adjustments</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {rawData.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleRowClick(item)}
                                            >
                                                <td className="py-2 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.desc}</td>
                                                <td className="py-2 px-4 whitespace-nowrap text-sm  text-gray-500">{item.type}</td>
                                                <td className="py-2 px-4 whitespace-nowrap text-sm  text-gray-500">{item.source}</td>
                                                <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{item.state}</td>
                                                <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{item.records} records</td>
                                                <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{item.freq}</td>
                                                <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
                                                <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{item.seasonal}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <h2 className="main-content-c1-text-2xl main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">A brief history</h2>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">I have long held an interest in stocks, economics and other measurements, and have been particularly impressed with public figures such as Warren Buffet and their ability to see around the corner.  But I have often wondered if they know something the rest of us do not.  Do they have some magic ability to tell when the credit agencies are making a mistake or not telling "the whole story"?  Do they have insights into economics the rest of us do not?  Or do they just have better data, better insight and better intuition? How can we, the average person know "the whole story" about our economy, our stocks and our credit systems?  </p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                As an example, around the time this project started to become more solidified in my mind,
                                I watched a <a href="https://www.youtube.com/watch?v=pff7TCbu9ps&t=305s" target="_blank" className="main-content-c1-text-blue-600 main-content-c1-underline">YouTube video</a> from <a href="https://www.youtube.com/@MichaelBordenaro" target="_blank" className="main-content-c1-text-blue-600 main-content-c1-underline">Michael Bordenaro</a> regarding a report from the Chicago Federal Reserve. In short, the Fed was not worried about the 1.2 Trillion in consumer credit debt; but they were concerned about
                                the rising delinquency rate. This puzzled me a bit, as I see them as intertwined. If consumers cannot afford to pay their debt, then that debt will increase until
                                consumers default.  So in that case, both parties will be negatively affected.  The creditor will lose the repayment, and the consumer will lose the ability to further
                                finance items or needs, ultimately impacting the economy.  Neither outcome could be good, yet it was presented as tho "not a big deal".  This got me thinking about my
                                earlier query of "How can we know the whole story?".</p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                As I thought more about this, I also considered that in more recent times, almost everything you hear, from our governing bodies, credit bureaus, companies, and other sources would have us believe things are just great. Then you read the news, and it's all doom and gloom depending on the narrative that's currently selling. How can the average person find their own answers? What would I like to use in order help provide more value to the charts I look at when reading articles?  </p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">
                                These are the thoughts of a wandering mind I suppose, but I found the concepts interesting enough to continue entertaining these ideas.  So much so that I had developed another project titled "The Buffet Indicator", in which I built a demo project where I calculated and presented data related to the Warren Buffet principle of deducing a good time to invest using the GDP and the Wilshire 5000 Price Index. </p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">Then came the <a href="https://www.dataexpert.io" target="_blank">DataExpert.io</a> Boot camp. For the capstone project, <a href="https://www.linkedin.com/in/eczachly/" target="_blank">Zach</a> made several suggestions; one of which was to pick an idea or topic that you would want to work on after the project and bootcamp are complete. Something that would drive your passion, make use of the skills you learned in class, and bootstrap your ideas on what the project could become.</p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">Challenge extended! Challenge accepted! Let all know that the gauntlet has been thrown down!  I will answer, and I will answer with vigor! </p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">All jokes aside, This is my attempt to "find my passion". I'm not a financial analyst, an economist, or a wealth manager; but I love working with data, love coding, I like money (who doesn't right?), and I have an interest in impact analysis. That was the beginning of the end in terms of my ability to resist pursuing this with reckless abandon.  As a result of these efforts, I have a final project that I am excited about, have passion to see where I can take it, and genuinely find to be a interesting concept.</p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700"></p>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">I hope you find this project insightful and that it will inspire others to think about how they could create products and tools that utilize modern techniques to simplify our understanding of the universe of data we're creating.</p>


                            <h2 className="main-content-c1-text-2xl main-content-c1-font-semibold main-content-c1-mb-2 main-content-c1-text-gray-800">Credits</h2>

                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">While I did much of the wiring and working things out, coding, data work and whatnot; I am a firm believer that nothing happens in a vacuum!  There are several people that gave feedback, provided insight, provided ideas or otherwise acted as a sounding board to get my thoughts to the right place!.  A heartfelt thank you!</p>
                            <ul className="main-content-c1-list main-content-c1-mb-4 main-content-c1-text-gray-700">
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Ronnie Hash is always there to lend a hand and provide thoughtful objective critique, ideas and direction!</li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Jake Adkins provided a lot of feedback on the concepts and ideas, and things he would find useful in this scope.</li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Nick Boeka provided tons of insight on the use of AI and ML concepts that piqued my curiosity and gave me more ideas than I can count!</li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Daniel Zhao provided feedback and ideas on pursuing consumer &amp; market sentiment and including those insights as data sets</li>
                            </ul>

                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">Several folks from the V4 Cohort also provided feedback, ideas and motivation to keep going.  Thanks team!!</p>
                            <ul className="main-content-c1-list main-content-c1-mb-4 main-content-c1-text-gray-700">
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Billy Switzer</li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Aleem Rahil</li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Anjana Shivangi</li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Donny Williams</li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Chris Taulbee </li>
                                <li className="main-content-c1-mb-2 main-content-c1-flex main-content-c1-items-center">Ovo Ojameruaye</li>
                            </ul>
                            <p className="main-content-c1-text-base main-content-c1-leading-relaxed main-content-c1-mb-4 main-content-c1-text-gray-700">And of course one final round of thanks to Zach, Julie, Mitali, Samuel, Jo and the rest of the DataExpert team!</p>

                        </div>
                    </div>
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        <JobChart />
                    </div>
                    {/*<div className="hidden duration-700 ease-in-out" data-carousel-item>*/}
                    {/*  <SectorGrowthChart />*/}
                    {/*</div>*/}
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        {/* GDP Growth Rate vs Stock Market Performance */}
                        <GdpStockCorrelationChart />
                    </div>
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        {/* Unemployment Rate vs Consumer Spending  */}
                        <UnemploymentConsumerSpendingChart />
                    </div>
                    {/*<div className="hidden duration-700 ease-in-out" data-carousel-item>*/}
                    {/*  /!* Inflation Rate vs Stock Prices by Sector *!/*/}
                    {/*   <InflationStockImpactChart />*/}
                    {/*</div>*/}
                    <div className="hidden duration-700 ease-in-out" data-carousel-item>
                        {/*<OverlayChart />*/}
                        <GdpCpiUnemploymentChart />
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
                    {/*<button type="button" className="w-3 h-3 rounded-full bg-blue-400" aria-current="false" aria-label="Slide 7" data-carousel-slide-to="6"></button>*/}

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
}

export default Main;