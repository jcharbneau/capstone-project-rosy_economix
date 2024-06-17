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

const AnnotationGenerator = ({ data, showAnnotations = true, type = 'all' }) => {
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
  { date: '2020-03-09', label: 'Stock Market Drop', color: 'red', yAdjust: 80, type: 'financial' },  // Black Monday 2020
  { date: '2020-03-27', label: 'CARES Act Stimulus', color: 'blue', yAdjust: -40, type: 'policy' },
  { date: '2021-03-11', label: 'American Rescue Plan', color: 'blue', yAdjust: 120, xAdjust: -60, type: 'policy' },
  { date: '2023-05-03', label: 'First Republic Bank Failure', color: 'red', yAdjust: 160, type: 'financial' },
  // US Wars
  // { date: '1917-04-06', label: 'US Enters WWI', color: 'black', type: 'war' },
  // { date: '1941-12-07', label: 'Pearl Harbor Attack', color: 'black', type: 'war' },
  // { date: '1941-12-08', label: 'US Enters WWII', color: 'black', type: 'war' },
  // { date: '1950-06-25', label: 'Korean War Begins', color: 'black', type: 'war' },
  // { date: '1965-03-08', label: 'US Enters Vietnam War', color: 'black', type: 'war' },
  { date: '1991-01-17', label: 'Gulf War Begins', color: 'red', type: 'war' },
  { date: '2001-10-07', label: 'War in Afghanistan Begins', color: 'red', type: 'war' },
  { date: '2003-03-20', label: 'Iraq War Begins', color: 'red', type: 'war', yAdjust: -40 }
];


  const filteredEvents = type === 'all' ? significantEvents : significantEvents.filter(event => event.type === type);

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

  return annotations;
};

export default AnnotationGenerator;
