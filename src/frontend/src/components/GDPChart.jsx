import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const GDPChart = () => {
  const [data, setData] = useState({ labels: [], values: [] });

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

        const response = await fetch(`http://localhost:8500/api/gdp?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
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
      label: 'GDP Growth',
      data: data.values,
      borderColor: 'rgba(75, 192, 192, 1)',
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
        text: 'GDP Growth Over Time',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default GDPChart;