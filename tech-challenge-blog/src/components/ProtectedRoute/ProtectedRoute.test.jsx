import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import ProtectedRoute from './index'
import { AuthContext } from '../../contexts/AuthContext'
import theme from '../../styles/theme'

const renderWithProviders = (authValue) =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authValue}>
          <Routes>
            <Route path="/login" element={<div>Página de Login</div>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <div>Painel Admin</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  )

describe('ProtectedRoute', () => {
  it('should render children when user is authenticated', () => {
    renderWithProviders({
      isAuthenticated: true,
      loading: false,
      user: { name: 'Prof. Ana' },
    })
    expect(screen.getByText('Painel Admin')).toBeInTheDocument()
  })

  it('should redirect to /login when user is not authenticated', () => {
    renderWithProviders({
      isAuthenticated: false,
      loading: false,
      user: null,
    })
    expect(screen.getByText('Página de Login')).toBeInTheDocument()
    expect(screen.queryByText('Painel Admin')).not.toBeInTheDocument()
  })

  it('should show loading state while authentication is being verified', () => {
    renderWithProviders({
      isAuthenticated: false,
      loading: true,
      user: null,
    })
    expect(screen.getByText(/Verificando autenticação/i)).toBeInTheDocument()
    expect(screen.queryByText('Painel Admin')).not.toBeInTheDocument()
  })
})
