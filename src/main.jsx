import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// POLYFILL PENTRU SOCKJS / STOMPJS
if (typeof window !== 'undefined') {
  window.global = window;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)