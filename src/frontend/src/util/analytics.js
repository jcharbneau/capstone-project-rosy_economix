import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-VMT5FFE0N6'); // Replace with your Measurement ID
};

export const logPageView = () => {
  ReactGA.send('pageview');
};
