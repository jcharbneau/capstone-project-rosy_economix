import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import axios from 'axios';
import AnnotationGenerator from './AnnotationGenerator';
import AIPane from './AIPane';
import AnnotationToggleButton from './AnnotationToggleButton';
import captureAndUpload from '../util/captureAndUpload';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const sectorColors = {
    "Communication Services": 'rgba(255, 99, 132, 0.6)',
    "Consumer Cyclical": 'rgba(54, 162, 235, 0.6)',
    "Consumer Defensive": 'rgba(255, 206, 86, 0.6)',
    "Energy": 'rgba(75, 192, 192, 0.6)',
    "Financial Services": 'rgba(153, 102, 255, 0.6)',
    "Healthcare": 'rgba(255, 159, 64, 0.6)',
    "Industrials": 'rgba(99, 255, 132, 0.6)',
    "Real Estate": 'rgba(235, 54, 162, 0.6)',
    "Technology": 'rgba(132, 99, 255, 0.6)',
    "Utilities": 'rgba(192, 75, 192, 0.6)'
};

const SectorGrowthChart = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: [],
    });

    const [showAnnotations, setShowAnnotations] = useState(false);
    const [activeAnnotations, setActiveAnnotations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [paneOpen, setPaneOpen] = useState(false);
    const [showShadedAreas, setShowShadedAreas] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sector-growth-last-decade`);
            const result = await response.json();
            console.log("API Response:", result); // Log the API response to verify the data

            if (result && result.length > 0) {
                const groupedData = result.reduce((acc, curr) => {
                    const { date, sector, growth_percentage } = curr;
                    if (!acc[sector]) acc[sector] = { label: sector, data: [] };
                    acc[sector].data.push({ x: new Date(date), y: growth_percentage });
                    return acc;
                }, {});

                const datasets = Object.keys(groupedData).map(sector => {
                    const sectorColor = sectorColors[sector] || 'rgba(0, 0, 0, 0.6)'; // Default color if not found
                    return {
                        ...groupedData[sector],
                        data: groupedData[sector].data.sort((a, b) => a.x - b.x), // Ensure data is sorted by date
                        borderColor: sectorColor,
                        backgroundColor: sectorColor.replace('1)', '0.4)'),
                        borderWidth: 1,
                        pointRadius: 1,
                        pointHitRadius: 1,
                        fill: true,
                    };
                });

                const labels = [...new Set(result.map(entry => entry.date))].map(date => new Date(date)); // Ensure unique dates and parse them

                console.log("Labels:", labels); // Log labels
                console.log("Datasets:", datasets); // Log datasets

                // Ensure datasets are not empty and contain valid data points
                datasets.forEach(dataset => {
                    console.log(`Dataset for ${dataset.label}:`, dataset.data);
                    dataset.data.forEach(point => {
                        if (point.x == null || point.y == null) {
                            console.error(`Invalid data point in dataset for ${dataset.label}:`, point);
                        }
                    });
                });

                setData({
                    labels: labels,
                    datasets: datasets,
                });
            } else {
                console.error("No data returned from API");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
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

    const annotations = data.labels.length > 0 ? AnnotationGenerator({ data, showAnnotations: true, type: activeAnnotations, showShadedAreas }) : [];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sector Growth Over the Past Decade',
            },
            annotation: {
                annotations: annotations,
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    tooltipFormat: 'll',
                    displayFormats: {
                        month: 'MMM YYYY'
                    }
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Growth Percentage'
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
                        disabled={true}
                    />
                    <button onClick={paneOpen ? togglePane : () => captureAndUpload('sectorGrowthChart', 'chart.png', 'Analyze the growth percentages of different sectors over the past decade.', `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen)} className="feedback-button">
                        {isLoading ? 'Loading...' : (paneOpen ? 'Close' : 'Insights')}
                    </button>
                </div>
                <div className="main-chart" id="sectorGrowthChart" style={{ position: 'relative' }}>
                    {data.labels.length > 0 ? (
                        <Line data={data} options={options} style={{ maxHeight: '60vh' }} />
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
                onRefresh={() => captureAndUpload('sectorGrowthChart', 'chart.png', 'Analyze the growth percentages of different sectors over the past decade.', `${import.meta.env.VITE_API_BASE_URL}/api/upload-chart/`, setIsLoading, setFeedback, setPaneOpen)}
            />
        </div>
    );
};

export default SectorGrowthChart;
