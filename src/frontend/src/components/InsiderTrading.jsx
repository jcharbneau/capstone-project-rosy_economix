// src/components/InsiderTrading.js
import React from 'react';

const InsiderTrading = ({ data }) => {
  return (
    <div className="insider-trading">
      <h3>Insider Trading</h3>
      <p>Insider Confidence Index: {data.insiderConfidenceIndex}</p>
      <p>Shares Bought: {data.sharesBought}</p>
      <p>Shares Sold: {data.sharesSold}</p>
    </div>
  );
};

export default InsiderTrading;