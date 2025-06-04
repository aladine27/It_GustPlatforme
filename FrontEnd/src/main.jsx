import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import'./i18n.js'
import {theme} from './Theme.js'
import { ThemeProvider } from '@emotion/react'
import {PersistGate} from 'redux-persist/integration/react'
import {persistor} from './redux/store.js'
import {Provider} from 'react-redux'
import {store} from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/* <PersistGate loading={null} persistor={persistor}>  
  <Provider store={store}> */}
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>
 {/*  </Provider>
  </PersistGate> */}
  </StrictMode>,
)
