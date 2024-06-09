import React from 'react';
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const governmentStimulusBailoutData = {
    "Stimulus": {
        "years": [2001, 2008, 2009, 2020, 2021],
        "amounts": [120, 152, 831, 2200, 1900],  // in billion $
        "labels": [
            "Economic Growth and Tax Relief Reconciliation Act",
            "Economic Stimulus Act",
            "American Recovery and Reinvestment Act",
            "CARES Act",
            "American Rescue Plan"
        ],
        "color": "blue"
    },
    "Bailouts": {
        "years": [2008, 2008, 2008, 2008, 2008, 2009, 2020],
        "amounts": [30, 200, 180, 25, 700, 45, 669],  // in billion $
        "labels": [
            "Bear Stearns",
            "Fannie Mae/Freddie Mac",
            "AIG",
            "Auto Industry",
            "TARP",
            "Citigroup",
            "Paycheck Protection Program"
        ],
        "color": "green"
    }
};

const BailoutStimulusChart = () => {
    const stimulusData = governmentStimulusBailoutData.Stimulus.years.map((year, index) => ({
        x: year.toString(),
        y: governmentStimulusBailoutData.Stimulus.amounts[index],
        label: governmentStimulusBailoutData.Stimulus.labels[index]
    }));

    const bailoutsData = governmentStimulusBailoutData.Bailouts.years.map((year, index) => ({
        x: year.toString(),
        y: governmentStimulusBailoutData.Bailouts.amounts[index],
        label: governmentStimulusBailoutData.Bailouts.labels[index]
    }));

    const data = {
        labels: Array.from(new Set([...governmentStimulusBailoutData.Stimulus.years, ...governmentStimulusBailoutData.Bailouts.years])).sort((a, b) => a - b).map(String),
        datasets: [
            {
                type: 'line',
                label: 'Stimulus',
                data: stimulusData,
                backgroundColor: governmentStimulusBailoutData.Stimulus.color,
                borderColor: governmentStimulusBailoutData.Stimulus.color,
                borderWidth: 1,
                fill: false,
                tension: 0.1
            },
            {
                type: 'bar',
                label: 'Bailouts',
                data: bailoutsData,
                backgroundColor: governmentStimulusBailoutData.Bailouts.color,
                borderColor: governmentStimulusBailoutData.Bailouts.color,
                borderWidth: 1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount in Billion $'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year'
                },
                type: 'category',
                position: 'bottom'
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.raw.label;
                        const amount = context.raw.y;
                        const datasetLabel = context.dataset.label || '';
                        return `${datasetLabel}: ${label} - $${amount} billion`;
                    }
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        hover: {
            animationDuration: 0 // Remove the hover animation delay
        }
    };

    return <Bar data={data} options={options} />;
};

export default BailoutStimulusChart;