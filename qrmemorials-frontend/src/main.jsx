import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/style.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

