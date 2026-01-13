import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import React from 'react'
import TeamManager from './pages/TeamManager'

createRoot(document.getElementById('root')! as HTMLElement).render(
    <React.StrictMode>
        <TeamManager />
    </React.StrictMode>
)