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
import annotationPlugin from 'chartjs-plugin-annotation';

import AnnotationGenerator from './AnnotationGenerator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

// Function to calculate the Simple Moving Average (SMA)
const calculateSMA = (data, windowSize) => {
  let sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      sma.push(null); // Not enough data points to calculate SMA
    } else {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += data[i - j];
      }
      sma.push(sum / windowSize);
    }
  }
  return sma;
};

const OverlayChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  const [overviewData, setOverviewData] = useState({
    labels: [],
    datasets: [],
  });

  const [showAnnotations, setShowAnnotations] = useState(false);
  const [annotationType, setAnnotationType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate the start date (35 years ago)
        const currentDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(currentDate.getFullYear() - 35);

        // Format dates to YYYY-MM-DD
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = currentDate.toISOString().split('T')[0];

        const response = await fetch(`http://localhost:8500/get_gdp_cpi_ur?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
        const result = await response.json();

        const labels = result.gdp.map(entry => entry.date);
        console.log("Labels: ", labels); // Log the labels to verify the format

        const gdpValues = result.gdp.map(entry => entry.value / 1000); // Convert to billions
        const cpiValues = result.cpi.map(entry => entry.value);
        const unemploymentValues = result.unemployment_rate.map(entry => entry.value);

        // Calculate SMAs
        const windowSize = 12; // For example, a 12-month moving average
        const gdpSMA = calculateSMA(gdpValues, windowSize);
        const cpiSMA = calculateSMA(cpiValues, windowSize);
        const unemploymentSMA = calculateSMA(unemploymentValues, windowSize);

        setData({
          labels: labels,
          datasets: [
            {
              label: 'Gross Domestic Product (GDP)',
              data: gdpValues,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.4)',
              yAxisID: 'y1',
              borderWidth: 3,
              pointRadius: 1,
              pointHitRadius: 1,
              fill: false,
              hidden: true,
            },
            {
              label: 'GDP - 12 Month Moving Average',
              data: gdpSMA,
              borderColor: 'rgba(180, 63, 63, 1)',
              backgroundColor: 'rgba(180,63,63,0.1)',
              yAxisID: 'y1',
              borderWidth: 1,
              pointRadius: 1,
              pointHitRadius: 1,
              fill: true,
            },
            {
              label: 'Consumer Price Index (CPI)',
              data: cpiValues,
              borderColor: 'rgba(34, 102, 185, 1)',
              backgroundColor: 'rgba(100, 181, 246, 0.1)',
              yAxisID: 'y3',
              borderWidth: 3,
              pointRadius: 1,
              pointHitRadius: 1,
              fill: false,
              hidden: true,
            },
            {
              label: 'CPI - 12 Month Moving Average',
              data: cpiSMA,
              borderColor: 'rgba(255,99,132,1)',
              backgroundColor: 'rgba(255, 69, 58, 0.1)',
              yAxisID: 'y3',
              borderWidth: 1,
              pointRadius: 1,
              pointHitRadius: 1,
              fill: true,
            },
            {
              label: 'Unemployment Rate',
              data: unemploymentValues,
              borderColor: 'rgba(54,162,235,1)',
              backgroundColor: 'rgba(54,162,235,0.2)',
              yAxisID: 'y2',
              borderWidth: 3,
              pointRadius: 1,
              pointHitRadius: 1,
              fill: false,
              hidden: true,
            },
            {
              label: 'Unemployment Rate - 12 Month Moving Average',
              data: unemploymentSMA,
              borderColor: 'rgba(54,162,235,0.5)',
              backgroundColor: 'rgba(54,162,235,0.2)',
              yAxisID: 'y2',
              borderWidth: 1,
              pointRadius: 1,
              pointHitRadius: 1,
              fill: true,
            }
          ],
        });

        // Fetch data for all time
        const atStartDate = new Date();
        atStartDate.setFullYear(1900, 0, 1);
        const formattedAtStartDate = atStartDate.toISOString().split('T')[0];

        const allTimeResponse = await fetch(`http://localhost:8500/get_gdp_cpi_ur?start_date=${formattedAtStartDate}&end_date=${formattedEndDate}`);
        const allTimeResult = await allTimeResponse.json();

        const allTimeLabels = allTimeResult.gdp.map(entry => entry.date);
        const allTimeGdpValues = allTimeResult.gdp.map(entry => entry.value / 1000);
        const allTimeCpiValues = allTimeResult.cpi.map(entry => entry.value);
        const allTimeUnemploymentValues = allTimeResult.unemployment_rate.map(entry => entry.value);

        setOverviewData({
          labels: allTimeLabels,
          datasets: [
            {
              label: 'GDP',
              data: allTimeGdpValues,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              yAxisID: 'y1',
              borderWidth: .5,
              pointRadius: .5,
              pointHitRadius: .5,
              fill: true,
            },
            {
              label: 'CPI',
              data: allTimeCpiValues,
              borderColor: 'rgba(255,99,132,1)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              yAxisID: 'y3',
              borderWidth: .5,
              pointRadius: .5,
              pointHitRadius: .5,
              fill: true,
            },
            {
              label: 'Unemployment Rate',
              data: allTimeUnemploymentValues,
              borderColor: 'rgba(54,162,235,1)',
              backgroundColor: 'rgba(54,162,235,0.2)',
              yAxisID: 'y2',
              borderWidth: .5,
              pointRadius: .5,
              pointHitRadius: .5,
              fill: true,
            },
          ],
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const annotations = showAnnotations ? AnnotationGenerator({ data, type: annotationType }) : [];
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
      annotation: {
        annotations: annotations,
      },
    },
  };

  const overviewOptions = {
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y1: {
        display: false,
      },
      y2: {
        display: false,
      },
      y3: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  return (
<div className="chart-container inline-block">
      <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', backgroundColor: '#f5f5f5', fontSize: '14px' }}>


      <button onClick={() => setAnnotationType('all')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>All</button>
      <button onClick={() => setAnnotationType('war')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Conflict</button>
      <button onClick={() => setAnnotationType('financial')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Finance</button>
      <button onClick={() => setAnnotationType('policy')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Policy</button>
      <button onClick={() => setAnnotationType('pandemic')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Pandemic</button>
      <label style={{ display: 'flex', alignItems: 'center', margin: '0 5px' }}>
        <input
          type="checkbox"
          checked={showAnnotations}
          onChange={() => setShowAnnotations(!showAnnotations)}
          style={{ marginRight: '5px' }}
        />
        Enable Annotations
      </label>

      </div>
      <div className="main-chart">
        <Line data={data} options={options} style={{ maxHeight: '56vh' }} />
      </div>
      <div className="overview-chart">
        <Line data={overviewData} options={overviewOptions} style={{ maxHeight: '80px', top: 0, marginBottom: '60px' }} />
      </div>
    </div>
  );
};

export default OverlayChart;
