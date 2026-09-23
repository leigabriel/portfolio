import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from './registerSW.js'
import './assets/index.css'
import App from './App.jsx'

registerSW()

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
