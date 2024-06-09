import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const UnemploymentChart = () => {
  const [data, setData] = useState({ labels: [], values: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate the start date (5 years ago)
        const currentDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(currentDate.getFullYear() - 25);

        // Format dates to YYYY-MM-DD
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = currentDate.toISOString().split('T')[0];

        const response = await fetch(`http://localhost:8500/api/unemployment_rate?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
        const result = await response.json();

        // Log the API response
        console.log("API Response:", result);

        const labels = result.map(entry => entry.date);
        const values = result.map(entry => entry.value);

        // Log the processed data
        console.log("Labels:", labels);
        console.log("Values:", values);

        setData({ labels, values });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.labels,
    datasets: [{
      label: 'Unemployment Rate',
      data: data.values,
      borderColor: 'rgba(54, 162, 235, 1)',
      fill: false,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Unemployment Rate Over Time',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default UnemploymentChart;