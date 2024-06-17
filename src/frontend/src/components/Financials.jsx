import React from 'react';
import './Financials.css';

const formatNumber = (num) => {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)} Trillion`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)} Billion`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)} Million`;
  }
  return num.toString();
};

const Financials = ({ data }) => {
  if (!data) {
    return <div>Loading financial data...</div>;
  }

  return (
    <div className="financials-data p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="font-bold underline">Financials</h3>
      <p>Market Cap: {formatNumber(data.marketCap)}</p>
      <p>Total Revenue: {formatNumber(data.totalRevenue)}</p>
      <p>Last Close Price: {data.lastClosePrice}</p>
      <p>Sector: {data.sector}</p>
      <p>Industry: {data.industry}</p>
    </div>
  );
};

export default Financials;
