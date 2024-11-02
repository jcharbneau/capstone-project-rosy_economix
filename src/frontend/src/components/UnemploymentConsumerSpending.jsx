import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import html2canvas from 'html2canvas';
import axios from 'axios';
import AnnotationGenerator from './AnnotationGenerator';
import AIPane from './AIPane';
import AnnotationToggleButton from "./AnnotationToggleButton.jsx";
import { logEvent } from '../util/analytics';
import captureAndUpload from "../util/captureAndUpload.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const UnemploymentConsumerSpendingChart = ({currentSlideIndex}) => {
    const [data, setData] = useState({
        labels: [],
        datasets: [],
    });

    const [showAnnotations, setShowAnnotations] = useState(false);
    const [annotationType, setAnnotationType] = useState('all');
    const [activeAnnotations, setActiveAnnotations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [paneOpen, setPaneOpen] = useState(false);
    const [showShadedAreas, setShowShadedAreas] = useState(false);
    const aiprompt = 'Review this image. Identify any relationships between unemployment rates and consumer spending.';

    const fetchData = async () => {
        try {
            const currentDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(currentDate.getFullYear() - 35);

            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = currentDate.toISOString().split('T')[0];

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/unemployment-consumer-spending?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
            const result = await response.json();

            console.log("Fetched data:", result);

            const labels = result.map(entry => entry.date);
            const unemploymentValues = result.map(entry => entry.unemployment_rate);
            const consumerSpendingValues = result.map(entry => entry.consumer_spending);

            setData({
                labels: labels,
                datasets: [
                    {
                        label: 'Unemployment Rate',
                        data: unemploymentValues,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        yAxisID: 'y1',
                        borderWidth: 3,
                        pointRadius: 1,
                        pointHitRadius: 1,
                        fill: false,
                    },
                    {
                        label: 'Consumer Spending',
                        data: consumerSpendingValues,
                        borderColor: 'rgba(255,99,132,1)',
                        backgroundColor: 'rgba(255,99,132,0.4)',
                        yAxisID: 'y2',
                        borderWidth: 3,
                        pointRadius: 1,
                        pointHitRadius: 1,
                        fill: false,
                    }
                ],
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const annotations = showAnnotations ? AnnotationGenerator({ data, type: activeAnnotations, showShadedAreas }) : [];
        setOptions(prevOptions => ({
            ...prevOptions,
            plugins: {
                ...prevOptions.plugins,
                annotation: {
                    annotations: annotations,
                },
            },
        }));
    }, [showAnnotations, activeAnnotations, showShadedAreas, data]);

    // const captureAndUpload = async () => {
    //     const chartElement = document.getElementById('unemploymentConsumerSpendingChart');
    //     setIsLoading(true);
    //     setPaneOpen(true);
    //
    //     html2canvas(chartElement, {
    //         useCORS: true,
    //         scale: 2
    //     }).then(canvas => {
    //         canvas.toBlob(async (blob) => {
    //             const formData = new FormData();
    //             formData.append('file', blob, 'chart.png');
    //             formData.append('aiprompt', 'Review this image. Identify any relationships between unemployment rates and consumer spending.');
    //             try {
    //                 const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, formData);
    //                 const feedbackData = response.data.feedback;
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

    const togglePane = () => {
        setPaneOpen(!paneOpen);
    };
    const handleRefresh = async () => {
     const uniqueId = `${Date.now()}`;
     logEvent('Button', 'AIPane', `Refresh button clicked on slide ${currentSlideIndex} (unemploymentConsumerSpendingChart)`);
     await captureAndUpload('unemploymentConsumerSpendingChart', `unemploymentConsumerSpendingChart-${uniqueId}.png`,`${aiprompt}`, `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen);
    };
    const toggleAnnotationType = (type) => {
        setActiveAnnotations(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
        setShowAnnotations(true);
    };

    const [options, setOptions] = useState({
        responsive: true,
        scales: {
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Unemployment Rate (%)',
                },
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Consumer Spending (in billion $)',
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
                text: 'Unemployment Rate vs Consumer Spending',
            },
            annotation: {
                annotations: [],
            },
        },
    });

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
                        disabled={true}
                    />
                    <button
                      onClick={() => {
                        const label = isLoading ? 'Loading' : (paneOpen ? 'Close' : 'Insights');
                        logEvent('Button', 'Click', `${label} button clicked on slide ${currentSlideIndex} (unemploymentConsumerSpendingChart)`);
                        paneOpen ? togglePane() : captureAndUpload('unemploymentConsumerSpendingChart', 'chart.png', `${aiprompt}`, `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen);
                      }}
                      className="feedback-button"
                    >
                      {isLoading ? 'Loading...' : (paneOpen ? 'Close' : 'Insights')}
                    </button>


                    {/*<button onClick={paneOpen ? togglePane : captureAndUpload} className="feedback-button">*/}
                    {/*    {isLoading ? 'Loading...' : (paneOpen ? 'Close' : 'Insights')}*/}
                    {/*</button>*/}
                </div>
                <div className="main-chart" id="unemploymentConsumerSpendingChart">
                    <Line data={data} options={options} style={{ maxHeight: '60vh' }} />
                </div>
            </div>
            <AIPane
                isOpen={paneOpen}
                isLoading={isLoading}
                feedback={feedback}
                onClose={togglePane}
                onRefresh={handleRefresh}
            />
        </div>
    );
};

export default UnemploymentConsumerSpendingChart;
