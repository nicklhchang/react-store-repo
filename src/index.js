import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { AlertProvider } from './app-context/alertContext.tsx';
import { DashboardProvider } from './app-context/dashboardContext';
import ComposeProviders from './app-context/context.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* right most in array below is most nested; need alerts for dashboardContext */}
    <ComposeProviders providers={[AlertProvider, DashboardProvider]}>
      <App />
    </ComposeProviders>
  </React.StrictMode>
);

// can change default port 3000 in node_modules/react-scripts/scripts/start.js

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
