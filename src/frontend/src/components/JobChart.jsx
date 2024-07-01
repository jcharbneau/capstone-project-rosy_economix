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

  const aiprompt = "Review this image of a chart.  Please analyze the chart titled 'Trends in Labor Market Participation and Underemployment.' Only refer to the following metrics with their associated colors: Labor Force Participation Rate (green line), Unemployment Rate (orange line), Federal Funds Effective Rate (blue line), Job Openings (purple line). Only refer to metrics that are enabled.  Do not mention any other metrics or colors.  Identify key trends, correlations, and insights related to the job data presented. Focus on lines such as the Labor Force Participation Rate (blue), Unemployment Rate (orange), and any other visible metrics. Highlight significant events marked on the timeline and their impacts on the data trends.";

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
        const federalFundsRate = data.map(item => item.federal_funds_rate);
        const yearTreasuryRate = data.map(item => item.year_treasury_rate);
        const jobOpenings = data.map(item => item.job_openings);
        const unemploymentRate = data.map(item => item.unemployment_rate);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Labor Force Participation Rate',
              data: laborForceParticipationRate,
              borderColor: 'rgba(0, 128, 0, 1)',
              backgroundColor: 'rgba(0, 128, 0, 0.1)',
              borderWidth: 2,
              pointRadius: 0.5,
              pointHitRadius: 4,
              fill: false,
              yAxisID: 'y-labor'
            },
            // {
            //   label: 'Discouraged Workers',
            //   data: discouragedWorkers,
            //   borderColor: 'rgba(73, 192, 55, 1)',
            //   borderWidth: 2,
            //   pointRadius: 0.5,
            //   pointHitRadius: 4,
            //   fill: false,
            //   yAxisID: 'y-discouraged'
            // },
            // {
            //   label: 'Marginally Attached Workers',
            //   data: marginallyAttachedWorkers,
            //   borderColor: 'rgba(255, 159, 64, 1)',
            //   borderWidth: 2,
            //   pointRadius: 0.5,
            //   pointHitRadius: 4,
            //   fill: false,
            //   yAxisID: 'y-marginal'
            // },
            // {
            //   label: 'Underemployment Rate',
            //   data: underemploymentRate,
            //   borderColor: 'rgba(255, 99, 132, 1)',
            //   borderWidth: 2,
            //   pointRadius: 0.5,
            //   pointHitRadius: 4,
            //   fill: false,
            //   yAxisID: 'y-underemployment'
            // },
            {
              label: 'Unemployment Rate',
              data: unemploymentRate,
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.1)',
              borderWidth: 2,
              pointRadius: 0.5,
              pointHitRadius: 4,
              fill: false,
              yAxisID: 'y-unemployment',
              hidden: false
            },
            {
              label: 'Federal Funds Effective Rate',
              data: federalFundsRate,
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              pointRadius: 0.5,
              pointHitRadius: 4,
              fill: true,
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              yAxisID: 'y-federal-funds',
              hidden: false,
            },
            // {
            //   label: '10-Year Treasury Constant Maturity Rate',
            //   data: yearTreasuryRate,
            //   borderColor: 'rgba(255, 206, 86, 1)',
            //   borderWidth: 2,
            //   pointRadius: 0.5,
            //   pointHitRadius: 4,
            //   fill: true,
            //   backgroundColor: 'rgba(255, 206, 86, 0.1)',
            //   yAxisID: 'y-treasury',
            //   hidden: true
            // },
            {
              label: 'Job Openings',
              data: jobOpenings,
              borderColor: 'rgba(44, 22, 235, 1)', // updated to a more blue color
              backgroundColor: 'rgba(44, 22, 235, 0.1)', // added a background color for fill
              borderWidth: 2,
              pointRadius: 0.5,
              pointHitRadius: 4,
              fill: true,
              yAxisID: 'y-job-openings',
              hidden: false
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
      // 'y-discouraged': {
      //   type: 'linear',
      //   position: 'right',
      //   ticks: {
      //     color: 'rgba(153, 102, 255, 1)'
      //   },
      //   grid: {
      //     drawOnChartArea: false
      //   }
      // },
      // 'y-marginal': {
      //   type: 'linear',
      //   position: 'right',
      //   ticks: {
      //     color: 'rgba(255, 159, 64, 1)'
      //   },
      //   grid: {
      //     drawOnChartArea: false
      //   }
      // },
      // 'y-underemployment': {
      //   type: 'linear',
      //   position: 'right',
      //   ticks: {
      //     color: 'rgba(255, 99, 132, 1)'
      //   },
      //   grid: {
      //     drawOnChartArea: false
      //   }
      // },
      'y-federal-funds': {
        type: 'linear',
        position: 'right',
        display: chartData?.datasets.find(ds => ds.label === 'Federal Funds Effective Rate')?.hidden === false,
        ticks: {
          color: 'rgba(54, 162, 235, 1)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      // 'y-treasury': {
      //   type: 'linear',
      //   position: 'right',
      //   display: chartData?.datasets.find(ds => ds.label === '10-Year Treasury Constant Maturity Rate')?.hidden === false,
      //   ticks: {
      //     color: 'rgba(255, 206, 86, 1)'
      //   },
      //   grid: {
      //     drawOnChartArea: false
      //   }
      // },
      'y-job-openings': {
        type: 'linear',
        position: 'right',
        display: chartData?.datasets.find(ds => ds.label === 'Job Openings')?.hidden === false,
        ticks: {
          color: 'rgba(75, 192, 192, 1)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      'y-unemployment': {
        type: 'linear',
        position: 'right',
        ticks: {
          color: 'rgba(255, 159, 64, 1)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      title: {
        display: true,
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
      },
      legend: {
        onClick: (e, legendItem, legend) => {
          const ci = legend.chart;
          const datasetIndex = legendItem.datasetIndex;
          const dataset = ci.getDatasetMeta(datasetIndex);
          const hidden = !dataset.hidden;

          dataset.hidden = hidden;

          // Update the display property for corresponding y-axes
          if (dataset.yAxisID === 'y-federal-funds' || dataset.yAxisID === 'y-treasury' || dataset.yAxisID === 'y-job-openings') {
            ci.options.scales[dataset.yAxisID].display = !hidden;
          }

          ci.update();
        }
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
          <button onClick={paneOpen ? togglePane : () => captureAndUpload('jobsChart', 'chart.png', `${aiprompt}`, `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen)} className="feedback-button">
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
        onRefresh={() => {
          const uniqueId = `${Date.now()}`;
          captureAndUpload('jobsChart', `JobsChart-${uniqueId}.png`,`${aiprompt}`, `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen);
        }}
      />

    </div>
  );
};

export default JobsChart;
