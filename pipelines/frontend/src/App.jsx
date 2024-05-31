import React, { useState } from 'react';
import DynamicChart from './components/DynamicChart';
import { leftRowsConfig, rightRowsConfig } from './constants/index';
import './index.css'; // Ensure the CSS is imported

const App = () => {
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [overlayClass, setOverlayClass] = useState('');
const [selectedTab, setSelectedTab] = useState('combined');

const getChartSrc = () => {
  switch (selectedTab) {
    case 'bailouts':
      return 'http://localhost:8500/bailouts-chart';
    case 'stimulus':
      return 'http://localhost:8500/stimulus-chart';
    case 'combined':
    default:
      return 'http://localhost:8500/combined-chart';
  }
};
  const handleRowClick = (overlayClass) => {
    setActiveOverlay(activeOverlay === overlayClass ? null : overlayClass);
    setOverlayClass(overlayClass);
  };

  const renderChart = (overlayClass) => {
    const row = [...leftRowsConfig, ...rightRowsConfig].find(row => row.overlayClass === overlayClass);
    if (row) {
      return (
        <div className="chart-container">
          <DynamicChart
            type={row.chartType}
            data={row.data}
            options={{ responsive: true, maintainAspectRatio: false }}
            key={`dynamic-${overlayClass}`}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-rosy h-screen flex flex-col items-center">
      <div className=""><header className="header text-white text-3xl py-4">Rosy Economix</header></div>
      <div className="container flex">
        <div className="left flex flex-col space-y-2 p-2">
          {leftRowsConfig.map((row) => (
            <div
              key={row.overlayClass}
              className={`row ${!row.visible ? 'hidden' : ''} ${activeOverlay === row.overlayClass ? 'active' : ''}`}
              onClick={() => handleRowClick(row.overlayClass)}
            >
              {row.displayText}
            </div>
          ))}
        </div>
<div className="center flex-1 flex flex-col items-center">
  <div className="w-full flex justify-center border-b-2 border-gray-300">



    <button
      className={`mx-2 py-2 px-4 -mb-0.5 ${selectedTab === 'combined' ? 'border-l border-t border-r rounded-t bg-blue-500 text-white' : 'bg-gray-300 border-b-2'}`}
      onClick={() => setSelectedTab('combined')}
    >
      Combined
    </button>
    <button
      className={`mx-2 py-2 px-4 -mb-0.5 ${selectedTab === 'bailouts' ? 'border-l border-t border-r rounded-t bg-green-500 text-white' : 'bg-gray-300 border-b-2'}`}
      onClick={() => setSelectedTab('bailouts')}
    >
      Bailouts
    </button>
    <button
      className={`mx-2 py-2 px-4 -mb-0.5 ${selectedTab === 'stimulus' ? 'border-l border-t border-r rounded-t bg-blue-500 text-white' : 'bg-gray-300 border-b-2'}`}
      onClick={() => setSelectedTab('stimulus')}
    >
      Stimulus
    </button>
  </div>
  <div className="center-content p-4">
    <img src={getChartSrc()} alt={`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Chart`} className="max-w-full h-auto" />
  </div>
  {leftRowsConfig.concat(rightRowsConfig).map((row) => (
    <div
      key={row.overlayClass}
      className={`overlay ${overlayClass} ${activeOverlay === row.overlayClass ? 'show' : ''}`}
    >
      {renderChart(row.overlayClass)}
    </div>
  ))}
</div>


        <div className="right flex flex-col space-y-2 p-2">
          {rightRowsConfig.map((row) => (
            <div
              key={row.overlayClass}
              className={`row ${!row.visible ? 'hidden' : ''} ${activeOverlay === row.overlayClass ? 'active' : ''}`}
              onClick={() => handleRowClick(row.overlayClass)}
            >
              {row.displayText}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
