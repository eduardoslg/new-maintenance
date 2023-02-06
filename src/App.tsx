import { Provider } from '@siakit/core'
import { DialogProvider } from '@siakit/dialog'
import { LoadingProvider } from '@siakit/loading'
import { ToastProvider } from '@siakit/toast'

import AuthProvider from './contexts/authContext'
import { Routes } from './routes'

export function App() {
  return (
    <AuthProvider>
      <Provider>
        <DialogProvider>
          <ToastProvider>
            <LoadingProvider>
              <Routes />
            </LoadingProvider>
          </ToastProvider>
        </DialogProvider>
      </Provider>
    </AuthProvider>
  )
}
