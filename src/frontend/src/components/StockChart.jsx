import React, { useRef, useEffect } from 'react';
import 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ data, ticker, companyName }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (data && data.datasets) {
      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new ChartJS(ctx, {
        type: 'line',
        data: {
          ...data,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            borderWidth: 0.5, // Thinner line
          })),
        },
        options: options,
      });
    }
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          enabled: true,
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 1, // Smaller plot points
        hitRadius: 1, // Adjust the hit radius for smaller points
      },
    },
  };

  return (
    <div className="stock-chart-container p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{ticker} - {companyName} - Stock Performance</h2>
      <canvas ref={chartRef} style={{ maxHeight: '400px' }} />
    </div>
  );
};

export default StockChart;
