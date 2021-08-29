import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import models from './examples';

ReactDOM.render(
  <React.StrictMode>
    <App model={models[0]} />
  </React.StrictMode>,
  document.getElementById('root')
);
