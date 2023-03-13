import { createRoot } from "react-dom/client"
import { StrictMode } from "react"
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import App from './App'

const persistor = persistStore(store)
const rootElement = document.getElementById("root")
const root = createRoot(rootElement!)

root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)
