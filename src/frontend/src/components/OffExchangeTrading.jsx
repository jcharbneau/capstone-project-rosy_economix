// src/components/OffExchangeTrading.js
import React from 'react';

const OffExchangeTrading = ({ data }) => {
  return (
    <div className="off-exchange-trading">
      <h3>Off-Exchange Trading</h3>
      <p>Short Sales: {data.shortSales}</p>
      <p>Off-Exchange Volume: {data.offExchangeVolume}</p>
      <p>DPI: {data.dpi}</p>
    </div>
  );
};

export default OffExchangeTrading;