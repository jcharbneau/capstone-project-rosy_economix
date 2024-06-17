import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const BailoutStimulusChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('/api/bailout-stimulus')
            .then(response => response.json())
            .then(data => {
                setChartData(data);
                initializeChart(data);
            })
            .catch(error => console.error('Error fetching the bailout and stimulus data:', error));
    }, []);

    const initializeChart = (data) => {
        const ctx = document.getElementById('bailoutStimulusChart').getContext('2d');
        new Chart(ctx, {
            type: 'line', // or any other type of chart you want
            data: {
                labels: data.map(item => item.date),
                datasets: [
                    {
                        label: 'Bailout Amount',
                        data: data.map(item => item.bailout_amount),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Stimulus Amount',
                        data: data.map(item => item.stimulus_amount),
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <div>
            <canvas id="bailoutStimulusChart"></canvas>
        </div>
    );
};

export default BailoutStimulusChart;