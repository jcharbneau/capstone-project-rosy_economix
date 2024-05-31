import React from 'react';
import { Chart as ChartJS, LineElement, BarElement, PointElement, LineController, BarController, CategoryScale, LinearScale, Legend, Tooltip, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register necessary components
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
    Filler
);

const DynamicChart = ({ type, data, options }) => {
  const ChartComponent = type === 'bar' ? Bar : Line;

  const chartOptions = {
    fill: false,
    ...options,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
      },
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      point: {
        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background for points
      },
      line: {
        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background for line charts
      },
    },
    scales: {
      x: {
        ticks: { beginAtZero: true },
        grid: {
          color: 'rgba(0, 0, 0, 0)', // Transparent grid lines for x-axis
        },
      },
      y: {
        ticks: { beginAtZero: true },
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0)', // Transparent grid lines for y-axis
        },
      },
    },
  };

  return <ChartComponent data={data} options={chartOptions} />;
};

export default DynamicChart;
