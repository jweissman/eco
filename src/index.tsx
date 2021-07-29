import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import arena from './examples/Arena';

ReactDOM.render(
  <React.StrictMode>
    <App model={arena} />
  </React.StrictMode>,
  document.getElementById('root')
);
