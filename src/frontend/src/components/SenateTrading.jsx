// src/components/SenateTrading.js
import React from 'react';

const SenateTrading = ({ data }) => {
  return (
    <div className="senate-trading">
      <h3>Senate Trading</h3>
      <ul>
        {data.map((trade, index) => (
          <li key={index}>
            <span>{trade.date}</span>
            <span>{trade.senator}</span>
            <span>{trade.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SenateTrading;