import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EconomicIndicatorsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
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
          },
          {
            label: 'CPI',
            data: cpiData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
          {
            label: 'Unemployment Rate',
            data: unemploymentRateData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
          },
          {
            label: 'Average Hourly Earnings',
            data: avgHourlyEarningsData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
          },
          {
            label: 'Average Weekly Earnings',
            data: avgWeeklyEarningsData,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
          },
          {
            label: 'Employment Cost Index',
            data: employmentCostIndexData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Job Openings',
            data: jobOpeningsData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
          {
            label: 'Nonfarm Payrolls',
            data: nonfarmPayrollsData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
          },
          {
            label: 'Total Wages and Salaries',
            data: totalWagesAndSalariesData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full h-full max-w-4xl max-h-[28px] center transparent-canvas absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <h2>Economic Indicators Chart</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>Start Date: </label>
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        <label style={{ marginLeft: '20px' }}>End Date: </label>
        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
      </div>
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default EconomicIndicatorsChart;