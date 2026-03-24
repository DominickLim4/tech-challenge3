import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import LoginPage from './index'
import { AuthContext } from '../../contexts/AuthContext'
import theme from '../../styles/theme'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLoginPage = (authValue) =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authValue}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Painel Admin</div>} />
          </Routes>
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  )

describe('LoginPage', () => {
  let mockLogin

  beforeEach(() => {
    mockLogin = vi.fn()
    mockNavigate.mockClear()
  })

  it('should render the login form', () => {
    renderLoginPage({ isAuthenticated: false, loading: false, login: mockLogin })
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument()
  })

  it('should show validation error for empty email', async () => {
    renderLoginPage({ isAuthenticated: false, loading: false, login: mockLogin })
    fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }))

    await waitFor(() => {
      expect(screen.getByText(/E-mail é obrigatório/i)).toBeInTheDocument()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should show validation error for invalid email', async () => {
    renderLoginPage({ isAuthenticated: false, loading: false, login: mockLogin })
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'invalid-email' } })
    fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }))

    await waitFor(() => {
      expect(screen.getByText(/e-mail válido/i)).toBeInTheDocument()
    })
  })

  it('should call login with email and password on submit', async () => {
    mockLogin.mockResolvedValueOnce({ token: 'abc123', user: { name: 'Prof.' } })
    renderLoginPage({ isAuthenticated: false, loading: false, login: mockLogin })

    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: 'prof@escola.edu' },
    })
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'prof@escola.edu',
        password: 'senha123',
      })
    })
  })

  it('should show error message on failed login', async () => {
    const error = { response: { status: 401 } }
    mockLogin.mockRejectedValueOnce(error)
    renderLoginPage({ isAuthenticated: false, loading: false, login: mockLogin })

    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: 'prof@escola.edu' },
    })
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: 'senhaerrada' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }))

    await waitFor(() => {
      expect(screen.getByText(/E-mail ou senha incorretos/i)).toBeInTheDocument()
    })
  })

  it('should redirect authenticated users away from login page', () => {
    renderLoginPage({
      isAuthenticated: true,
      loading: false,
      login: mockLogin,
      user: { name: 'Prof.' },
    })
    expect(screen.getByText('Painel Admin')).toBeInTheDocument()
    expect(screen.queryByLabelText(/E-mail/i)).not.toBeInTheDocument()
  })
})
