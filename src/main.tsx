// Imports
// ========================================================
import React from 'react';
import ReactDOM from 'react-dom';
import RootRoutes from './routes';
import RootProvider from './providers';
import './index.css';

// Main Render
// ========================================================
ReactDOM.render(
  <React.StrictMode>
    <RootProvider>
      <RootRoutes />
    </RootProvider>
  </React.StrictMode>,
  document.getElementById('root')
);