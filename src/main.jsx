// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import AppProvider from './context/index'
import App from './App'

createRoot(document.getElementById('root')).render(
    <AppProvider>
      <App />
    </AppProvider>
)
