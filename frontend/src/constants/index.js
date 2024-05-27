export const leftRowsConfig = [
  {
    "className": "pastel-red",
    "visible": true,
    "displayText": "Gross Domestic Product",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "GDP",
          "fill": true,
          "data": [7.64, 8.08, 8.54, 9.09, 9.66, 10.28, 10.62, 10.93, 11.55, 12.27, 13.04, 13.85, 14.45, 14.71, 14.45, 15.21, 15.81, 16.34, 17.01, 17.55, 18.22, 18.71, 19.49, 20.53, 21.43, 20.89, 22.76, 24.19, 25.46],
          "backgroundColor": "rgba(255, 182, 193, 0.2)",
          "borderColor": "rgba(255, 182, 193, 1)",
          "borderWidth": 2
        }
      ]
    }
  },
  {
    "className": "pastel-orange",
    "visible": true,
    "displayText": "Wilshire 5k Price Index",
    "chartType": "bar",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "W5k",
          "fill": true,
          "data": [4584.24, 5324.74, 6284.61, 7602.98, 8605.65, 8446.92, 7042.32, 7131.57, 8818.19, 9900.39, 11185.34, 12808.57, 14646.54, 12154.59, 15307.65, 17376.64, 18980.43, 20716.58, 24470.58, 26438.17, 27131.12, 27914.72, 30688.69, 29110.36, 33258.54, 30308.89, 37980.57, 39758.79, 41304.57],
          "backgroundColor": "rgba(255, 218, 185, 0.6)",
          "borderColor": "rgba(255, 182, 193, 1)",
          "borderWidth": 2
        }
      ]
    }
  },

  {
    "className": "pastel-blue",
    "visible": true,
    "displayText": "Home Prices (Median Sales Price in USD)",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Home Prices (in USD)",
          "fill": true,
          "data": [133900, 140000, 146000, 152000, 159000, 169000, 175000, 180000, 187000, 197000, 219000, 239000, 257000, 238000, 216000, 221000, 227000, 235000, 245000, 254000, 265000, 275000, 285000, 297000, 309000, 324000, 347000, 371000, 390000],
          "backgroundColor": "rgba(135, 206, 250, 0.8)"
        }
      ]
    }
  }
  ,
  {
    "className": "pastel-salmon",
    "visible": true,
    "displayText": "Home Sales (Number of Units Sold)",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Home Sales (in millions)",
          "fill": true,
          "data": [3.54, 3.69, 3.83, 4.10, 4.28, 4.60, 4.75, 5.53, 6.18, 6.78, 7.08, 6.48, 5.65, 4.12, 4.34, 4.57, 4.26, 4.66, 5.09, 5.34, 5.64, 5.45, 5.51, 5.34, 5.64, 6.49, 6.76, 5.64, 4.14],
          "backgroundColor": "rgba(255, 165, 0, 0.8)"
        }
      ]
    }
  },
  {
    "className": "pastel-pink",
    "visible": true,
    "displayText": "Mortgage Rates (%)",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "30-Year Fixed Mortgage Rates (%)",
          "fill": true,
          "data": [7.93, 7.81, 7.60, 6.94, 7.44, 8.05, 6.97, 6.54, 5.83, 5.84, 5.87, 6.41, 6.34, 6.03, 5.04, 4.69, 4.45, 3.66, 3.98, 4.17, 3.85, 3.65, 3.99, 4.54, 3.94, 3.11, 2.96, 5.11, 6.94],
          "backgroundColor": "rgba(255, 182, 193, 0.8)",
          "borderColor": "rgba(255, 105, 180, 1)",
          "borderWidth": 2
        },
        {
          "label": "15-Year Fixed Mortgage Rates (%)",
          "fill": true,
          "data": [7.43, 7.30, 7.10, 6.49, 6.97, 7.76, 6.50, 6.10, 5.21, 5.21, 5.23, 5.79, 5.70, 5.39, 4.68, 4.23, 3.97, 3.19, 3.37, 3.56, 3.18, 2.96, 3.27, 3.95, 3.39, 2.61, 2.26, 4.12, 5.44],
          "backgroundColor": "rgba(173, 216, 230, 0.8)",
          "borderColor": "rgba(0, 0, 255, 1)",
          "borderWidth": 2
        }
      ]
    }
  },{
  className: "pastel-violet",
  visible: true,
  displayText: "Mortgage Delinquency Rate",
  chartType: "line",
  data: {
    labels: [
      "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004",
      "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014",
      "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"
    ],
    datasets: [
      {
        label: "Delinquency Rate (%)",
        fill: true,
        data: [
          2.20, 2.08, 2.13, 2.13, 2.25, 2.34, 2.75, 2.89, 2.97, 2.89,
          2.67, 2.41, 2.40, 2.96, 5.05, 4.39, 3.74, 3.35, 3.14, 2.85,
          2.45, 2.16, 2.05, 1.88, 1.79, 2.31, 1.93, 2.01, 1.71
        ],
        backgroundColor: "rgba(238, 130, 238, 0.8)",
        borderColor: "rgba(238, 130, 238, 1)",
        borderWidth: 2
      }
    ]
  }
},
    {
  className: "pastel-aqua",
  visible: true,
  displayText: "New Mortgages and Refi's",
  chartType: "line",
  data: {
    labels: [
      "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004",
      "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014",
      "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"
    ],
    datasets: [
      {
        label: "New Mortgages (in millions)",
        fill: true,
        data: [
          3.6, 3.8, 4.0, 4.1, 4.3, 4.5, 5.0, 5.5, 5.3, 5.1,
          5.4, 5.2, 4.9, 3.9, 3.6, 4.0, 4.2, 4.3, 4.5, 4.6,
          4.7, 4.8, 4.9, 5.0, 5.1, 5.5, 6.2, 5.8, 5.3
        ],
        backgroundColor: "rgba(0, 255, 255, 0.4)",
        borderColor: "rgba(0, 255, 255, 1)",
        borderWidth: 2
      },
      {
        label: "Refinance Mortgages (in millions)",
        fill: true,
        data: [
          1.5, 1.7, 1.8, 2.0, 2.2, 2.4, 3.0, 3.2, 3.5, 3.3,
          3.1, 2.8, 2.6, 3.0, 4.5, 4.8, 4.2, 3.8, 3.6, 3.4,
          3.2, 3.1, 3.0, 2.9, 3.0, 3.8, 4.1, 3.7, 3.2
        ],
        backgroundColor: "rgba(255, 182, 193, 0.4)",
        borderColor: "rgba(255, 182, 193, 1)",
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);

          // See controller.isDatasetVisible comment
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          // We hid a dataset ... rerender the chart
          ci.update();
        }
      }
    },
    scales: {
      y: {
        position: 'right',
        ticks: {
          beginAtZero: true
        }
      },
      x: {
        beginAtZero: true
      }
    }
  }
}
];

export const rightRowsConfig = [
  {
    "className": "pastel-turquoise",
    "visible": true,
    "displayText": "Federal Budget (in billions)",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Federal Budget (in billions)",
          "fill": true,
          "data": [1460, 1560, 1650, 1720, 1810, 1940, 2010, 2130, 2200, 2300, 2400, 2550, 2680, 2850, 3200, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4350, 4500, 4700, 5000, 5300, 5600],
          "backgroundColor": "rgba(175, 238, 238, 0.8)"
        }
      ]
    }
  },
  {
    "className": "pastel-purple",
    "visible": true,
    "displayText": "Federal Deficit (in billions)",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Federal Deficit (in billions)",
          "fill": true,
          "data": [-164.0, -107.4, -21.9, 69.2, 125.6, 236.2, -157.8, -421.0, -553.0, -412.7, -318.3, -248.2, -160.7, -458.6, -1412.7, -1294.3, -1089.1, -1087.0, -680.8, -484.6, -439.0, -587.0, -665.4, -779.1, -984.4, -3191.0, -2217.0, -1300.0, -1400.0],
          "backgroundColor": "rgba(221, 160, 221, 0.8)"
        }
      ]
    }
  },
  {
    "className": "pastel-amber",
    "visible": true,
    "displayText": "Consumer Price Index (CPI)",
    "chartType": "bar",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "CPI",
          "fill": true,
          "data": [152.4, 156.9, 160.5, 163.0, 166.6, 172.2, 177.1, 179.9, 184.0, 188.9, 195.3, 201.6, 207.3, 215.3, 214.5, 218.1, 224.9, 229.6, 233.0, 236.7, 237.0, 240.0, 245.1, 251.1, 255.7, 258.8, 271.0, 284.6, 296.3],
          "backgroundColor": "rgba(255, 191, 0, 0.2)"
        }
      ]
    }
  },
  {
    "className": "pastel-chartreuse",
    "visible": true,
    "displayText": "Interest Rates",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Interest Rates",
          "fill": true,
          "data": [6.0, 5.5, 5.25, 4.75, 5.0, 6.5, 3.75, 1.75, 1.0, 1.25, 3.5, 5.25, 4.75, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 1.25, 2.5, 1.75, 0.25, 0.25, 1.0, 3.0],
          "backgroundColor": "rgba(127, 255, 0, 0.2)"
        }
      ]
    }
  },
  {
    "className": "pastel-coral",
    "visible": true,
    "displayText": "Retail Sales",
    "chartType": "bar",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Retail Sales",
          "fill": true,
          "data": [2195.8, 2301.6, 2411.5, 2553.7, 2721.8, 2911.5, 3050.2, 3184.1, 3398.8, 3626.3, 3825.5, 4048.9, 4232.5, 4101.1, 3733.5, 3984.5, 4139.1, 4327.8, 4528.7, 4705.2, 4861.7, 5000.5, 5216.9, 5446.1, 5595.2, 5347.4, 5804.2, 6120.5, 6331.8],
          "backgroundColor": "rgba(255, 127, 80, 0.8)"
        }
      ]
    }
  },{
    "className": "pastel-yellow",
    "visible": true,
    "displayText": "Credit Volumes",
    "chartType": "line",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Credit Volumes",
          "fill": true,
          "data": [120, 125, 130, 135, 150, 160, 140, 130, 120, 150, 160, 170, 180, 160, 150, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 240, 250, 260, 270],
          "backgroundColor": "rgba(255, 255, 204, 0.8)"
        }
      ]
    }
  },
  {
    "className": "pastel-green",
    "visible": true,
    "displayText": "Credit Delinquencies",
    "chartType": "bar",
    "data": {
      "labels": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      "datasets": [
        {
          "label": "Credit Delinquencies",
          "fill": true,
          "data": [3.1, 3.2, 3.4, 3.5, 3.5, 3.6, 3.8, 3.9, 4.0, 3.9, 3.8, 3.7, 3.6, 4.5, 5.0, 4.8, 4.6, 4.4, 4.2, 4.0, 3.8, 3.7, 3.6, 3.5, 3.4, 4.2, 4.0, 3.8, 3.7],
          "backgroundColor": "rgba(204, 255, 204, 0.8)",
          "borderColor": "rgba(102, 204, 102, 1)",
          "borderWidth": 2
        }
      ]
    }
  },
    {
  className: "pastel-olive",
  visible: true,
  displayText: "Jobs Data",
  chartType: "line",
  data: {
    labels: [
      "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004",
      "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014",
      "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"
    ],
    datasets: [
      {
        label: "Number of Jobs Added (in thousands)",
        fill: true,
        data: [
          117000, 203000, 240000, 288000, 292000, 242000, -142000, -158000, -100000, 157000,
          213000, 197000, 194000, -353000, -510000, 117000, 174000, 227000, 182000, 250000,
          232000, 211000, 209000, 222000, 212000, -940000, 220000, 611000, 537000
        ],
        backgroundColor: "rgba(144, 238, 144, 0.5)",
        borderColor: "rgba(144, 238, 144, 1)",
        borderWidth: 2
      },
      {
        label: "Unemployment Rate (%)",
        fill: true,
        data: [
          5.6, 5.4, 5.3, 4.5, 4.2, 4.0, 4.7, 5.8, 6.0, 5.5,
          5.1, 4.6, 4.6, 5.8, 9.3, 9.6, 8.9, 8.1, 7.4, 6.2,
          5.3, 4.9, 4.4, 4.0, 3.7, 8.1, 5.9, 5.3, 3.9
        ],
        backgroundColor: "rgba(255, 182, 193, 0.5)",
        borderColor: "rgba(255, 182, 193, 1)",
        borderWidth: 2,
        yAxisID: 'y2'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);

          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          ci.update();
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Jobs Added (in thousands)'
        }
      },
      y2: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Unemployment Rate (%)'
        }
      },
      x: {
        beginAtZero: true
      }
    }
  }
}
];