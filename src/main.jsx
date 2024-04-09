import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
  navigator.serviceWorker
  .register("./service-worker.js")
  .then((registration) => {
  console.log("Service Worker registered! Scope: ", registration.scope);
  })
  .catch((err) => {
  console.log("Service Worker registration failed: ", err);
  });
  });
 }

const DATA = JSON.parse(localStorage.getItem('tasks')) || [] ;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App tasks={DATA} />
  </React.StrictMode>,
)