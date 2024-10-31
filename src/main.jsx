// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CacheProvider } from './contexts/CacheContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './index.css'; // Global styles
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <CacheProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </CacheProvider>
  </React.StrictMode>
);
