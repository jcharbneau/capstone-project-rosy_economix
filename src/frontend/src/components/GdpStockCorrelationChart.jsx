import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

import AnnotationGenerator from './AnnotationGenerator';
Chart.register(...registerables);

const GdpStockCorrelationChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [showAnnotations, setShowAnnotations] = useState(false);
    const [annotationType, setAnnotationType] = useState('all');

    useEffect(() => {
         fetch('http://localhost:8500/api/gdp-stock-correlation')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const labels = data.map(d => d.quarter);
                    const gdpData = data.map(d => d.gdp_growth_rate);
                    const stockData = data.map(d => d.avg_stock_return);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'GDP Growth Rate',
                                data: gdpData,
                                borderColor: 'blue',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderWidth: 1, // Make lines thinner
                                pointRadius: 1, // Make plot points smaller
                                pointHitRadius: 1, // Adjust the hit radius for smaller points
                                fill: true,
                                yAxisID: 'y-axis-1',
                            },
                            {
                                label: 'Stock Market Return',
                                data: stockData,
                                borderColor: 'red',
                                backgroundColor: 'rgba(255,99,132,0.2)',
                                borderWidth: 1, // Make lines thinner
                                pointRadius: 1, // Make plot points smaller
                                pointHitRadius: 1, // Adjust the hit radius for smaller points
                                fill: true,
                                yAxisID: 'y-axis-2',
                            }
                        ]
                    });
                } else {
                    console.error('No data found or data is not an array');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    console.log("GDO Stock correlation: chartData");
    console.log(chartData);

    const annotations = showAnnotations ? AnnotationGenerator({ data:chartData, type: annotationType }) : [];

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'quarter',
                    tooltipFormat: 'Q YYYY'
                }
            },
            'y-axis-1': {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'GDP Growth Rate'
                }
            },
            'y-axis-2': {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Stock Market Return'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'GDP Growth Rate vs Stock Market Return',
          },
          annotation: {
            annotations: annotations,
          },
        },
    };

    return (
           <div className="chart-container m-2" >

<div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', backgroundColor: '#f5f5f5', fontSize: '14px' }}>


      <button onClick={() => setAnnotationType('all')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>All</button>
      <button onClick={() => setAnnotationType('war')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Conflict</button>
      <button onClick={() => setAnnotationType('financial')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Finance</button>
      <button onClick={() => setAnnotationType('policy')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Policy</button>
      <button onClick={() => setAnnotationType('pandemic')} style={{ flex: 1, margin: '0 5px', padding: '5px', fontSize: '14px', backgroundColor: showAnnotations ? '' : '#ccc', cursor: showAnnotations ? 'pointer' : 'not-allowed' }} disabled={!showAnnotations}>Pandemic</button>
      <label style={{ display: 'flex', alignItems: 'center', margin: '0 5px', paddingRight: '10px' }}>
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
        {/*<Line data={data} options={options} style={{maxHeight:'60vh'}} />*/}

            {chartData.labels.length > 0 ? (
                <Line data={chartData} options={options}  style={{maxHeight:'60vh'}} />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
               </div>
    );
};

export default GdpStockCorrelationChart;