import React, { useState, useEffect } from 'react';
import StockChart from './StockChart';
import Financials from './Financials';
import './FinancialDashboard.css';
import StockTickerScroller from "./StockTickerScroller";

function FinancialDashboard() {
  const [chartData, setChartData] = useState(null);
  const [financialsData, setFinancialsData] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [companyName, setCompanyName] = useState('');

  const fetchData = async (ticker) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock-data?ticker=${ticker}`);
      const data = await response.json();
      if (data && data.chartData && data.financials) {
        setChartData(data.chartData);
        setFinancialsData(data.financials);
        setCompanyName(data.financials.companyName);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchData(selectedTicker);
  }, [selectedTicker]);

  const handleTickerClick = (ticker) => {
    setSelectedTicker(ticker);
  };

  return (
    <div className="dashboard overflow-hidden" style={{ maxHeight: "640px" }}>
      <StockTickerScroller
        className="overflow-hidden"
        backgroundColor="#282c34"
        color="#61dafb"
        scrollSpeed={40}
        onTickerClick={handleTickerClick}
      />
      <div className="charts border-2" style={{ maxHeight: "550px" }}>
        <div className="stock-chart">
          <StockChart
            data={chartData || { labels: [], datasets: [] }}
            ticker={selectedTicker}
            companyName={companyName}
            className="border-2"
            style={{ maxHeight: "500px" }}
          />
        </div>
        <div className="financials">
          <Financials data={financialsData} />
        </div>
      </div>
    </div>
  );
}

export default FinancialDashboard;
