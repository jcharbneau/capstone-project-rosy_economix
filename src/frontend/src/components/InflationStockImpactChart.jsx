import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import html2canvas from 'html2canvas';
import axios from 'axios';
import AnnotationGenerator from './AnnotationGenerator';
import AIPane from './AIPane.jsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const InflationStockImpactChart = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: [],
    });

    const [showAnnotations, setShowAnnotations] = useState(false);
    const [annotationType, setAnnotationType] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [paneOpen, setPaneOpen] = useState(false);

    const fetchData = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inflation-stock-impact`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log("API Response:", result);

        // Check if the result is in the expected format
        if (!Array.isArray(result) || !result.length || !result[0].stock_data) {
            throw new Error("Unexpected API response format");
        }

        const labels = result.map(entry => entry.date);
        const inflationValues = result.map(entry => entry.inflation_rate);
        const stockValuesBySector = {};

        result.forEach(entry => {
            entry.stock_data.forEach(stockEntry => {
                if (!stockValuesBySector[stockEntry.sector]) {
                    stockValuesBySector[stockEntry.sector] = [];
                }
                stockValuesBySector[stockEntry.sector].push(stockEntry.stock_price);
            });
        });

        console.log("Labels:", labels);
        console.log("Inflation Values:", inflationValues);
        console.log("Stock Values By Sector:", stockValuesBySector);

        // Normalize stock prices and apply moving average
        const normalizedStockValuesBySector = {};
        Object.keys(stockValuesBySector).forEach(sector => {
            const values = stockValuesBySector[sector];
            const max = Math.max(...values);
            const min = Math.min(...values);
            normalizedStockValuesBySector[sector] = calculateMovingAverage(values.map(value => (value - min) / (max - min) * 100), 12);
        });

        console.log("Normalized Stock Values By Sector:", normalizedStockValuesBySector);

        // Filter out sectors with insufficient data and limit the number of sectors displayed
        const filteredSectors = Object.keys(normalizedStockValuesBySector)
            .filter(sector => normalizedStockValuesBySector[sector].length > 10)
            .slice(0, 5); // Display top 5 sectors

        const datasets = [
            {
                label: 'Inflation Rate',
                data: calculateMovingAverage(inflationValues, 12),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.4)',
                yAxisID: 'y1',
                borderWidth: 3,
                pointRadius: 1,
                pointHitRadius: 1,
                fill: false,
            },
            ...filteredSectors.map(sector => ({
                label: `${sector} Stock Price (normalized)`,
                data: normalizedStockValuesBySector[sector],
                borderColor: getRandomColor(),
                backgroundColor: getRandomColor(0.4),
                yAxisID: 'y2',
                borderWidth: 3,
                pointRadius: 1,
                pointHitRadius: 1,
                fill: false,
            }))
        ];

        console.log("Datasets:", datasets);

        setData({
            labels: labels,
            datasets: datasets,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};



    useEffect(() => {
        fetchData();
    }, []);

    const captureAndUpload = async () => {
        const chartElement = document.getElementById('inflationStockImpactChart');
        setIsLoading(true);
        setPaneOpen(true);  // Open the pane first

        html2canvas(chartElement, {
            useCORS: true,
            scale: 2
        }).then(canvas => {
            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('file', blob, 'chart.png');
                formData.append('aiprompt', 'Review this image. Analyze the impact of inflation rates on stock prices across different sectors.');
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, formData);
                    const feedbackData = response.data.feedback;
                    const cleanedFeedback = feedbackData.replace(/<pre[^>]*>/g, '').replace(/<\/pre>/g, '').trim();

                    setFeedback(cleanedFeedback);
                } catch (error) {
                    console.error('Error uploading chart:', error);
                } finally {
                    setIsLoading(false);
                }
            });
        });
    };

    const togglePane = () => {
        setPaneOpen(!paneOpen);
    };

    const calculateMovingAverage = (data, windowSize) => {
        let averages = [];
        for (let i = 0; i < data.length; i++) {
            if (i < windowSize - 1) {
                averages.push(null); // Not enough data points to calculate the moving average
            } else {
                let sum = 0;
                for (let j = 0; j < windowSize; j++) {
                    sum += data[i - j];
                }
                averages.push(sum / windowSize);
            }
        }
        return averages;
    };

    const getRandomColor = (alpha = 1) => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r},${g},${b},${alpha})`;
    };

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
                text: 'Inflation Rate (%)',
            },
            beginAtZero: true,
        },
        y2: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: 'Stock Price (Normalized)',
            },
            grid: {
                drawOnChartArea: false,
            },
            beginAtZero: true,
        },
        x: {
            type: 'time',
            time: {
                unit: 'month'
            },
            title: {
                display: true,
                text: 'Date',
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
            text: 'Inflation Rate vs Stock Prices by Sector',
        },
        annotation: {
            annotations: annotations,
        },
    },
};



    return (
        <div className="chart-and-annotations">
            <div className="chart-container">
                <div className="button-container">
                    <button onClick={() => setAnnotationType('all')} className={`annotation-button ${showAnnotations ? '' : 'disabled'}`} disabled={!showAnnotations}>All</button>
                    <button onClick={() => setAnnotationType('war')} className={`annotation-button ${showAnnotations ? '' : 'disabled'}`} disabled={!showAnnotations}>Conflict</button>
                    <button onClick={() => setAnnotationType('financial')} className={`annotation-button ${showAnnotations ? '' : 'disabled'}`} disabled={!showAnnotations}>Finance</button>
                    <button onClick={() => setAnnotationType('policy')} className={`annotation-button ${showAnnotations ? '' : 'disabled'}`} disabled={!showAnnotations}>Policy</button>
                    <button onClick={() => setAnnotationType('pandemic')} className={`annotation-button ${showAnnotations ? '' : 'disabled'}`} disabled={!showAnnotations}>Pandemic</button>
                    <label className="annotation-checkbox">
                        <input
                            type="checkbox"
                            checked={showAnnotations}
                            onChange={() => setShowAnnotations(!showAnnotations)}
                        />
                        Enable Annotations
                    </label>
                    <button onClick={paneOpen ? togglePane : captureAndUpload} className="feedback-button">
                        {isLoading ? 'Loading...' : (paneOpen ? 'Close' : 'Insights')}
                    </button>
                </div>
                <div className="main-chart" id="inflationStockImpactChart">
                    <Line data={data} options={options} style={{ maxHeight: '60vh' }} />
                </div>
            </div>
            <AIPane
                isOpen={paneOpen}
                isLoading={isLoading}
                feedback={feedback}
                onClose={togglePane}
                onRefresh={captureAndUpload}
            />
        </div>
    );
};

export default InflationStockImpactChart;
