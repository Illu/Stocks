import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

var COMPANIES = [
  {
    name: "AAPL",
    selected: false
  },
  {
    name: "TSLA",
    selected: false
  },
  {
    name: "GOOGL",
    selected: false
  }
];

ReactDOM.render(
  <App companies={COMPANIES}/>,
  document.getElementById('root')
);
