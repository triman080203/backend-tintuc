import { BrowserRouter } from 'react-router-dom'
import { QueryClientProviderWrapper } from './app/providers/QueryClientProviderWrapper'
import { AuthProvider } from './app/providers/AuthProvider'
import { LayoutWrapper } from './app/layout/LayoutWrapper'
import { AppRoutes } from './app/router/AppRoutes'
import { Toaster } from 'sonner'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <QueryClientProviderWrapper>
        <AuthProvider>
          <LayoutWrapper>
            <AppRoutes />
          </LayoutWrapper>
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProviderWrapper>
    </BrowserRouter>
  )
}

export default App
