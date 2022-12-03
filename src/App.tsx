import { BrowserRouter } from 'react-router-dom'

import { Provider } from '@siakit/core'
import { DialogProvider } from '@siakit/dialog'
import { LoadingProvider } from '@siakit/loading'
import { ToastProvider } from '@siakit/toast'

import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <Provider>
        <DialogProvider>
          <ToastProvider>
            <LoadingProvider>
              <AppRoutes />
            </LoadingProvider>
          </ToastProvider>
        </DialogProvider>
      </Provider>
    </BrowserRouter>
  )
}
