import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
// Page-scoped design system, carried over verbatim from the approved HTML build.
// Editorial rules live under .editorial-root, brand pages under .bs-root, so the
// newspaper pastiche and the BuilderSite brand never bleed into each other.
import './styles/pages.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
