// src/components/Chart.js
import React from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for tree shaking

const RosyBaseChart = () => {
 const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sample Data',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
    aspectRatio: 16 / 9,
  };

  return (
    <div className="w-[1024px] h-[576px] bg-gray-300 flex items-center justify-center">
      <Chart type="line" data={data} options={options} />
    </div>
  );
};

export default RosyBaseChart;