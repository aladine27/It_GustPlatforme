import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import'./i18n.js'
import {theme} from './Theme.js'
import { ThemeProvider } from '@emotion/react'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
  </StrictMode>,
)
