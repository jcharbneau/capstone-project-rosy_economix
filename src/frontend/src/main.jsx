import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';


import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components and adapters globally
Chart.register(...registerables);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);