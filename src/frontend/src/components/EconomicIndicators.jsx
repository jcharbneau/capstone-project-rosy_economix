import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EconomicIndicatorsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 25)));
  const [endDate, setEndDate] = useState(new Date());

  const fetchData = async (start, end) => {
    try {
      const response = await fetch(
        `http://localhost:8500/economic-indicators?start_date=${start.toISOString().split('T')[0]}&end_date=${end.toISOString().split('T')[0]}`
      );
      const data = await response.json();

      // Check if the response data is in expected format
      if (!data.gdp || !data.gdp.length) {
        throw new Error('Invalid data format');
      }

      // Process data for Chart.js
      const dates = data.gdp.map(item => item.date);

      const gdpData = data.gdp.map(item => item.value);
      const cpiData = data.cpi.map(item => item.value);
      const unemploymentRateData = data.unemployment_rate.map(item => item.value);
      const avgHourlyEarningsData = data.avg_hourly_earnings.map(item => item.value);
      const avgWeeklyEarningsData = data.avg_weekly_earnings.map(item => item.value);
      const employmentCostIndexData = data.employment_cost_index.map(item => item.value);
      const jobOpeningsData = data.job_openings.map(item => item.value);
      const nonfarmPayrollsData = data.nonfarm_payrolls.map(item => item.value);
      const totalWagesAndSalariesData = data.total_wages_and_salaries.map(item => item.value);


      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'GDP',
            data: gdpData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'CPI',
            data: cpiData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'Unemployment Rate',
            data: unemploymentRateData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'Avg Hourly Earnings',
            data: avgHourlyEarningsData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'Avg Weekly Earnings',
            data: avgWeeklyEarningsData,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'Employment Cost Index',
            data: employmentCostIndexData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'Job Openings',
            data: jobOpeningsData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'Nonfarm Payrolls',
            data: nonfarmPayrollsData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
          {
            label: 'Total Wages and Salaries',
            data: totalWagesAndSalariesData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 1, // Make lines thinner
            pointRadius: 1, // Make plot points smaller
            pointHitRadius: 1, // Adjust the hit radius for smaller points
            fill: true,
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
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
              text: 'Unemployment Rate (%)',
            },
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
          y3: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'CPI (Index)',
            },
            grid: {
              drawOnChartArea: false,
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
  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart-container">
      <div className="main-chart">
        <Line data={chartData} options={options}  style={{maxHeight:'70vh'}}  />
      </div>
    </div>
  );
};

export default EconomicIndicatorsChart;