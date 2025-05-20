/**
 * ENTRY POINT OF THE REACT APPLICATION
 * This file mounts the root React component to the DOM
 */

// ===== CORE REACT IMPORTS =====
import React from 'react';
import ReactDOM from 'react-dom/client';

// ===== MAIN APP COMPONENT =====
import App from './App.jsx'; // Main application component (must be default export)

// ===== GLOBAL STYLES =====
import './App.css'; // Global styles that apply to the entire application

/**
 * MOUNT REACT APPLICATION TO DOM
 * - Finds the 'root' div in public/index.html
 * - Renders the App component inside React's StrictMode
 * - StrictMode helps identify potential problems during development
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);