import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OverlayChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'GDP',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        yAxisID: 'y1',
        fill: false,
      },
      {
        label: 'CPI',
        data: [],
        borderColor: 'rgba(255,99,132,1)',
        yAxisID: 'y2',
        fill: false,
      },
      {
        label: 'Unemployment Rate',
        data: [],
        borderColor: 'rgba(54,162,235,1)',
        yAxisID: 'y2',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate the start date (5 years ago)
        const currentDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(currentDate.getFullYear() - 5);

        // Format dates to YYYY-MM-DD
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = currentDate.toISOString().split('T')[0];

        const response = await fetch(`http://localhost:8500/get_gdp_cpi_ur?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
        const result = await response.json();

        // Log the API response
        console.log("API Response:", result);

        const labels = result.gdp.map(entry => entry.date);
        const gdpValues = result.gdp.map(entry => entry.value / 1000); // Convert to billions
        const cpiValues = result.cpi.map(entry => entry.value);
        const unemploymentValues = result.unemployment_rate.map(entry => entry.value);

        // Log the processed data
        console.log("Labels:", labels);
        console.log("GDP Values:", gdpValues);
        console.log("CPI Values:", cpiValues);
        console.log("Unemployment Values:", unemploymentValues);
        // Verify the values are within expected range (e.g., typically between 0 and 10%)
        if (cpiValues.some(value => value < 0 || value > 10)) {
          console.warn("CPI values seem unusually high or low. Please verify the data source.");
        }
        setData({
          labels: labels,
          datasets: [
            {
              label: 'GDP',
              data: gdpValues,
              borderColor: 'rgba(75,192,192,1)',
              yAxisID: 'y1',
              fill: false,
            },
            {
              label: 'CPI',
              data: cpiValues,
              borderColor: 'rgba(255,99,132,1)',
              yAxisID: 'y2',
              fill: false,
            },
            {
              label: 'Unemployment Rate',
              data: unemploymentValues,
              borderColor: 'rgba(54,162,235,1)',
              yAxisID: 'y2',
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    scales: {
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'GDP (in billions)',
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Percentage (%)',
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Economic Indicators Over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default OverlayChart;