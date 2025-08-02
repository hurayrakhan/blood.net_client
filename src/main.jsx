import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import AuthProvider from './Providers/AuthProvider.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router/Router.jsx'
import ThemeContextProvider from './Providers/ThemeContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <AuthProvider>
            <RouterProvider router={router}>

            </RouterProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
