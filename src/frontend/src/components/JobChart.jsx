import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';
import AnnotationGenerator from './AnnotationGenerator';
import AnnotationToggleButton from './AnnotationToggleButton';
import captureAndUpload from '../util/captureAndUpload';
import AIPane from './AIPane';

Chart.register(...registerables, zoomPlugin);

const JobsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeAnnotations, setActiveAnnotations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [paneOpen, setPaneOpen] = useState(false);
  const [showShadedAreas, setShowShadedAreas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs_data`);
        const data = response.data;

        const labels = data.map(item => item.date);
        const laborForceParticipationRate = data.map(item => item.labor_force_participation_rate);
        const discouragedWorkers = data.map(item => item.discouraged_workers);
        const marginallyAttachedWorkers = data.map(item => item.marginally_attached_workers);
        const underemploymentRate = data.map(item => item.underemployment_rate);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Labor Force Participation Rate',
              data: laborForceParticipationRate,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
              yAxisID: 'y-labor'
            },
            {
              label: 'Discouraged Workers',
              data: discouragedWorkers,
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              fill: false,
              yAxisID: 'y-discouraged'
            },
            {
              label: 'Marginally Attached Workers',
              data: marginallyAttachedWorkers,
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
              fill: false,
              yAxisID: 'y-marginal'
            },
            {
              label: 'Underemployment Rate',
              data: underemploymentRate,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              fill: false,
              yAxisID: 'y-underemployment'
            }
          ]
        });

      } catch (error) {
        console.error('Error fetching the data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePane = () => {
    setPaneOpen(!paneOpen);
  };

  const toggleAnnotationType = (type) => {
    setActiveAnnotations(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const annotations = chartData ? AnnotationGenerator({ data: chartData, showAnnotations, type: activeAnnotations, showShadedAreas }) : [];

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month'
        }
      },
      'y-labor': {
        type: 'linear',
        position: 'left',
        ticks: {
          color: 'rgba(75, 192, 192, 1)'
        }
      },
      'y-discouraged': {
        type: 'linear',
        position: 'right',
        ticks: {
          color: 'rgba(153, 102, 255, 1)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      'y-marginal': {
        type: 'linear',
        position: 'right',
        ticks: {
          color: 'rgba(255, 159, 64, 1)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      'y-underemployment': {
        type: 'linear',
        position: 'right',
        ticks: {
          color: 'rgba(255, 99, 132, 1)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      title: {
        display:true,
        text: "Trends in Labor Market Participation and Underemployment",
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: false,
          },
          drag: {
            enabled: false,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        }
      },
      annotation: {
        annotations: annotations
      }
    }
  };

  const buttons = [
    { label: 'Conflict', key: 'war' },
    { label: 'Finance', key: 'financial' },
    { label: 'Policy', key: 'policy' },
    { label: 'Pandemic', key: 'pandemic' },
  ];

  return (
    <div className="chart-and-annotations">
      <div className="chart-container">
        <div className="button-container">
          {buttons.map((button) => (
            <AnnotationToggleButton
              key={button.key}
              label={button.label}
              isActive={activeAnnotations.includes(button.key)}
              onClick={() => toggleAnnotationType(button.key)}
            />
          ))}
          <AnnotationToggleButton
            label="Key Moments"
            isActive={showShadedAreas}
            onClick={() => setShowShadedAreas(prevState => !prevState)}
          />
          <button onClick={paneOpen ? togglePane : () => captureAndUpload('jobsChart', 'chart.png', 'Review this image. Identify correlations in job data.', `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen)} className="feedback-button">
            {isLoading ? 'Loading...' : (paneOpen ? 'Close' : 'Insights')}
          </button>
        </div>
        <div className="main-chart" id="jobsChart" style={{ position: 'relative' }}>
          {chartData ? (
            <Line data={chartData} options={options} style={{ maxHeight: '60vh' }} />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
      <AIPane
        isOpen={paneOpen}
        isLoading={isLoading}
        feedback={feedback}
        onClose={togglePane}
        onRefresh={() => captureAndUpload('jobsChart', 'chart.png', 'Review this image. Identify correlations in job data.', `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen)}
      />
    </div>
  );
};

export default JobsChart;
