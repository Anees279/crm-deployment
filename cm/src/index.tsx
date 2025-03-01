
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use react-dom/client for React 18
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import App from './App';

// Create root using ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

