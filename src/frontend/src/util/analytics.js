// ./util/analytics.js
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-VMT5FFE0N6'); // Replace with your Measurement ID
};

export const logPageView = () => {
  ReactGA.send('pageview');
};

export const logEvent = (category, action, label) => {
  console.log("logeventCalled:" + label);
  ReactGA.event({
    category,
    action,
    label
  });
};
