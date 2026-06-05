import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n/config';
import reportWebVitals from './reportWebVitals';

// CRA’s error overlay hook — kill it 💀
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-undef
  window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = {
    showCompileError: () => { },
    showRuntimeError: () => { },
    dismissRuntimeErrors: () => { },
  };
}
/* --- Suppress ResizeObserver warnings globally --- */

// Hide them from the console
// const origError = console.error;
// debugger
// console.error = (...args) => {
//   if (
//     typeof args[0] === 'string' &&
//     (args[0].includes('ResizeObserver loop') || args[0].includes('ResizeObserver loop limit exceeded'))
//   ) {
//     return;
//   }
//   origError(...args);
// };

// Stop CRA's runtime overlay from showing them
window.addEventListener('error', (e) => {
  if (
    e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    e.message === 'ResizeObserver loop limit exceeded'
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Disable CRA error overlay completely in dev mode
if (process.env.NODE_ENV === 'development') {
  // This prevents the red overlay from rendering
  // eslint-disable-next-line no-undef
  window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = {};
}

/* --- End suppression --- */

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
