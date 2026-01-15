import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import React from 'react'
import FullDashboard from './pages/FullDashboard'

createRoot(document.getElementById('root')! as HTMLElement).render(
    <React.StrictMode>
        <FullDashboard />
    </React.StrictMode>
)