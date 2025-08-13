import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Since we are using Tailwind CSS from a CDN, we don't need a separate CSS file.
// If you were using Tailwind CLI, you would import a stylesheet here.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
