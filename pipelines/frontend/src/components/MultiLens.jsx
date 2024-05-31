import React, { useState } from 'react';
import './MultiLens.css';

const lenses = [
  { id: 1, color: 'red', opacity: 'bg-red-500/50', bgColor: 'bg-red-500' },
  { id: 2, color: 'blue', opacity: 'bg-blue-500/50', bgColor: 'bg-blue-500' },
  { id: 3, color: 'green', opacity: 'bg-green-500/50', bgColor: 'bg-green-500' },
];

const MultiLens = () => {
  const [activeLenses, setActiveLenses] = useState([]);

  const toggleLens = (lens) => {
    setActiveLenses((prev) =>
      prev.includes(lens)
        ? prev.filter((l) => l !== lens)
        : [...prev, lens]
    );
  };

  return (
    <div className="relative w-full h-full bg-gray-100 border border-gray-300 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {activeLenses.map((lens, index) => (
          <div
            key={index}
            className={`absolute inset-0 ${lenses.find(
              (l) => l.color === lens.color
            ).opacity}`}
          ></div>
        ))}
      </div>
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center space-y-2 p-2">
        {lenses.map((lens) => (
          <button
            key={lens.id}
            className={`tab ${activeLenses.includes(lens) ? 'to-right' : ''} ${lens.bgColor} px-4 py-2 text-white font-bold`}
            onClick={() => toggleLens(lens)}
          >
            {lens.color}
          </button>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center space-y-2 p-2">
        {lenses.map((lens) => (
          <button
            key={lens.id}
            className={`tab ${activeLenses.includes(lens) ? '' : 'to-left'} ${lens.bgColor} px-4 py-2 text-white font-bold`}
            onClick={() => toggleLens(lens)}
          >
            {lens.color}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiLens;