import React from 'react';

// Utility function to find the closest date in the dataset
const findClosestDate = (labels, targetDate) => {
  const targetTime = new Date(targetDate).getTime();
  let closestDate = labels[0];
  let closestDiff = Math.abs(new Date(labels[0]).getTime() - targetTime);

  for (let i = 1; i < labels.length; i++) {
    const currentDiff = Math.abs(new Date(labels[i]).getTime() - targetTime);
    if (currentDiff < closestDiff) {
      closestDiff = currentDiff;
      closestDate = labels[i];
    }
  }
  return closestDate;
};

const AnnotationGenerator = ({ data, showAnnotations = true, type = [], showShadedAreas = false }) => {
  if (!data || !data.labels) {
    console.error("No data or labels provided to AnnotationGenerator.");
    return [];
  }

  if (!showAnnotations && !showShadedAreas) return [];

  if (type.length === 0 && !showShadedAreas) return [];

  console.log("Annotation Generator");
  console.log(data);

  const significantEvents = [
    { date: '2001-09-11', label: '9/11 Attack', color: 'red', type: 'attack' },
    { date: '2008-03-16', label: 'Bear Stearns Bailout', color: 'green', yAdjust: 120, type: 'financial' },
    { date: '2008-09-15', label: 'Lehman Brothers Bankruptcy', color: 'red', yAdjust: -60, xAdjust: -80, type: 'financial' },
    { date: '2008-10-03', label: 'TARP Bailout', color: 'green', yAdjust: -20, type: 'financial' },
    { date: '2009-03-30', label: 'Auto Bailout', color: 'green', yAdjust: 30, xAdjust: 20, type: 'financial' },
    { date: '2011-08-05', label: 'US Credit Rating Downgrade', color: 'red', yAdjust: 80, type: 'financial' },
    { date: '2015-12-16', label: 'Fed Rate Hike', color: 'blue', type: 'policy' },
    { date: '2020-01-01', label: 'COVID-19 Pandemic', color: 'red', type: 'pandemic' },
    { date: '2020-03-09', label: 'Stock Market Drop', color: 'red', yAdjust: 80, type: 'financial' },
    { date: '2020-03-27', label: 'CARES Act Stimulus', color: 'blue', yAdjust: -40, type: 'policy' },
    { date: '2021-03-11', label: 'American Rescue Plan', color: 'blue', yAdjust: 120, xAdjust: -60, type: 'policy' },
    { date: '2023-05-03', label: 'First Republic Bank Failure', color: 'red', yAdjust: -140, type: 'financial' },
    { date: '1991-01-17', label: 'Gulf War Begins', color: 'red', type: 'war' },
    { date: '2001-10-07', label: 'War in Afghanistan Begins', color: 'red', type: 'war' },
    { date: '2003-03-20', label: 'Iraq War Begins', color: 'red', type: 'war', yAdjust: -40 },
    { date: '2014-02-20', label: 'Annexation of Crimea by Russia', color: 'red', type: 'war' },
    { date: '2022-02-24', label: 'Russian Invasion of Ukraine', color: 'red', type: 'war' },
  ];

  const filteredEvents = type.length === 0 ? [] : significantEvents.filter(event => type.includes(event.type));

  const annotations = filteredEvents.map(event => {
    const closestDate = findClosestDate(data.labels, event.date);
    return {
      type: 'line',
      mode: 'vertical',
      scaleID: 'x',
      value: closestDate,
      borderColor: event.color,
      borderWidth: 1.3,
      label: {
        content: event.label,
        enabled: showAnnotations,
        position: 'top',
        yAdjust: event.yAdjust || 0,
        xAdjust: event.xAdjust || 0,
      }
    };
  });

  if (showShadedAreas) {
    const shadedAreas = [
      {
        id: 'housing-crisis',
        type: 'box',
        xScaleID: 'x',
        yScaleID: 'y-labor',
        xMin: '2007-01-01',
        xMax: '2010-01-01',
        backgroundColor: 'rgba(173, 216, 230, 0.5)',  // Light blue
        borderColor: 'rgba(173, 216, 230, 0.5)',
        borderWidth: 1,
        label: {
          content: '2008 Housing Crisis',
          enabled: true,
          position: 'start', // Position the label at the start of the box
          xAdjust: 0,
          yAdjust: 0, // Initial yAdjust
          textAlign: 'start'
        },
        beforeDraw(chart, args, options) {
          const chartHeight = chart.scales['y-labor'].height;
          const yMin = chart.scales['y-labor'].getPixelForValue(chart.scales['y-labor'].min);
          options.label.yAdjust = yMin - chartHeight;
        }
      },
      {
        id: 'covid-period',
        type: 'box',
        xScaleID: 'x',
        yScaleID: 'y-labor',
        xMin: '2019-12-01',
        xMax: '2021-06-01',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Light red
        borderColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        label: {
          content: 'COVID-19 Period',
          enabled: true,
          position: 'start', // Position the label at the start of the box
          xAdjust: 0,
          yAdjust: 0, // Initial yAdjust
          textAlign: 'start'
        },
        beforeDraw(chart, args, options) {
          const chartHeight = chart.scales['y-labor'].height;
          const yMin = chart.scales['y-labor'].getPixelForValue(chart.scales['y-labor'].min);
          options.label.yAdjust = yMin - chartHeight;
        }
      },
      {
        id: 'covid-shutdown',
        type: 'box',
        xScaleID: 'x',
        yScaleID: 'y-labor',
        xMin: '2020-03-01',
        xMax: '2020-06-01',
        backgroundColor: 'rgba(255, 0, 0, 0.4)',  // Darker red
        borderColor: 'rgba(255, 0, 0, 0.4)',
        borderWidth: 1,
        label: {
          content: 'COVID-19 Shutdown',
          enabled: true,
          position: 'start', // Position the label at the start of the box
          xAdjust: 0,
          yAdjust: 0, // Initial yAdjust
          textAlign: 'start'
        },
        beforeDraw(chart, args, options) {
          const chartHeight = chart.scales['y-labor'].height;
          const yMin = chart.scales['y-labor'].getPixelForValue(chart.scales['y-labor'].min);
          options.label.yAdjust = yMin - chartHeight;
        }
      }
    ];

    shadedAreas.forEach(area => annotations.push(area));
  }

  return annotations;
};

export default AnnotationGenerator;
