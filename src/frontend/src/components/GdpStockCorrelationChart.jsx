import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';
import AnnotationGenerator from './AnnotationGenerator';
import AIPane from './AIPane';
import AnnotationToggleButton from "./AnnotationToggleButton.jsx";
import { logEvent } from '../util/analytics';
import captureAndUpload from "../util/captureAndUpload.js";


Chart.register(...registerables, zoomPlugin);

const GdpStockCorrelationChart = ({currentSlideIndex}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [showAnnotations, setShowAnnotations] = useState(false);
    const [annotationType, setAnnotationType] = useState('all');
    const [activeAnnotations, setActiveAnnotations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [paneOpen, setPaneOpen] = useState(false);
    const [showShadedAreas, setShowShadedAreas] = useState(false);
    const aiprompt = 'Review this image. Identify correlations between GDP growth rate and stock market return.';

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gdp-stock-correlation`)
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
                                borderWidth: 1,
                                pointRadius: 1,
                                pointHitRadius: 1,
                                fill: true,
                                yAxisID: 'y-axis-1',
                            },
                            {
                                label: 'Stock Market Return',
                                data: stockData,
                                borderColor: 'red',
                                backgroundColor: 'rgba(255,99,132,0.2)',
                                borderWidth: 1,
                                pointRadius: 1,
                                pointHitRadius: 1,
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

    const togglePane = () => {
        setPaneOpen(!paneOpen);
    };
    const handleRefresh = async () => {
     const uniqueId = `${Date.now()}`;
     logEvent('Button', 'AIPane', `Refresh button clicked on slide ${currentSlideIndex} (gdpStockCorrelationChart)`);
     await captureAndUpload('gdpStockCorrelationChart', `gdpStockCorrelationChart-${uniqueId}.png`,`${aiprompt}`, `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen);
    };
    // const captureAndUpload = async () => {
    //     const chartElement = document.getElementById('gdpStockCorrelationChart');
    //     setIsLoading(true);
    //     setPaneOpen(true);  // Open the pane first
    //
    //     // Capture the chart
    //     html2canvas(chartElement, {
    //         useCORS: true, // Ensure CORS is enabled
    //         scale: 2 // Increase resolution for better quality
    //     }).then(canvas => {
    //         canvas.toBlob(async (blob) => {
    //             const formData = new FormData();
    //             formData.append('file', blob, 'chart.png');
    //             formData.append('aiprompt', 'Review this image. Identify correlations between GDP growth rate and stock market return.');
    //             try {
    //                 // Upload to FastAPI
    //                 const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, formData);
    //                 const feedbackData = response.data.feedback;
    //
    //                 // Clean up the feedback data
    //                 const cleanedFeedback = feedbackData.replace(/<pre[^>]*>/g, '').replace(/<\/pre>/g, '').trim();
    //
    //                 setFeedback(cleanedFeedback);
    //             } catch (error) {
    //                 console.error('Error uploading chart:', error);
    //             } finally {
    //                 setIsLoading(false);
    //             }
    //         });
    //     });
    // };
    const toggleAnnotationType = (type) => {
        setActiveAnnotations(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
        setShowAnnotations(true); // Ensure annotations are shown
    };

    const annotations = chartData ? AnnotationGenerator({ data: chartData, showAnnotations, type: activeAnnotations, showShadedAreas }) : [];

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
            zoom: {
                pan: {
                    enabled: false,
                    mode: 'x',
                    speed: 0.03,
                    threshold: 10,
                },
                zoom: {
                    wheel: {
                        speed: 0.03,
                        enabled: false
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'xy',
                },
            },
        },
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
                            slideIndex={currentSlideIndex}
                        />
                    ))}
                    <AnnotationToggleButton
                        label="Key Moments"
                        isActive={showShadedAreas}
                        onClick={() => setShowShadedAreas(prevState => !prevState)}
                        disabled={false}
                        slideIndex={currentSlideIndex}
                    />
                    <button
                      onClick={() => {
                        const label = isLoading ? 'Loading' : (paneOpen ? 'Close' : 'Insights');
                        logEvent('Button', 'Click', `${label} button clicked on slide ${currentSlideIndex} (gdpStockCorrelationChart)`);
                        paneOpen ? togglePane() : captureAndUpload('gdpStockCorrelationChart', 'chart.png', `${aiprompt}`, `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen);
                      }}
                      className="feedback-button"
                    >
                      {isLoading ? 'Loading...' : (paneOpen ? 'Close' : 'Insights')}
                    </button>
                    {/*<button onClick={paneOpen ? togglePane : captureAndUpload} className="feedback-button">*/}
                    {/*    {isLoading ? 'Loading...' : (paneOpen ? 'Close' : 'Insights')}*/}
                    {/*</button>*/}
                </div>
                <div className="main-chart" id="gdpStockCorrelationChart" style={{ position: 'relative' }}>
                    {chartData.labels.length > 0 ? (
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
                onRefresh={handleRefresh}  // Add the refresh hook here
            />
        </div>
    );
};

export default GdpStockCorrelationChart;
