import { Provider } from '@siakit/core'
import { DialogProvider } from '@siakit/dialog'
import { LoadingProvider } from '@siakit/loading'
import { ToastProvider } from '@siakit/toast'

import AuthProvider from './contexts/authContext'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <LoadingProvider>
      <ToastProvider>
        <AuthProvider>
          <Provider>
            <DialogProvider>
              <AppRoutes />
            </DialogProvider>
          </Provider>
        </AuthProvider>
      </ToastProvider>
    </LoadingProvider>
  )
}
