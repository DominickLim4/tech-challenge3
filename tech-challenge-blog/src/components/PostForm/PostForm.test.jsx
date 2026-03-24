import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import PostForm from './index'
import theme from '../../styles/theme'
import { AuthContext } from '../../contexts/AuthContext'

const mockUser = { name: 'Prof. Ana Costa', email: 'ana@escola.edu' }

const renderWithProviders = (ui, authValue = { user: mockUser, isAuthenticated: true }) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authValue}>
          {ui}
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  )

describe('PostForm', () => {
  let onSubmit

  beforeEach(() => {
    onSubmit = vi.fn()
  })

  it('should render all form fields', () => {
    renderWithProviders(<PostForm onSubmit={onSubmit} />)
    expect(screen.getByLabelText(/Título/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Autor/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Conteúdo/)).toBeInTheDocument()
  })

  it('should pre-fill author from logged-in user', () => {
    renderWithProviders(<PostForm onSubmit={onSubmit} />)
    expect(screen.getByLabelText(/Autor/)).toHaveValue('Prof. Ana Costa')
  })

  it('should pre-fill fields from initialData', () => {
    const initialData = {
      title: 'Introdução ao JavaScript',
      content: 'Conteúdo extenso sobre JavaScript aqui...',
      author: 'Prof. Carlos',
    }
    renderWithProviders(<PostForm onSubmit={onSubmit} initialData={initialData} />)

    expect(screen.getByLabelText(/Título/)).toHaveValue('Introdução ao JavaScript')
    expect(screen.getByLabelText(/Autor/)).toHaveValue('Prof. Carlos')
    expect(screen.getByLabelText(/Conteúdo/)).toHaveValue('Conteúdo extenso sobre JavaScript aqui...')
  })

  it('should show validation errors when submitting empty form', async () => {
    renderWithProviders(<PostForm onSubmit={onSubmit} />)

    // Clear the author field first
    fireEvent.change(screen.getByLabelText(/Autor/), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /publicar post/i }))

    await waitFor(() => {
      expect(screen.getByText(/Título é obrigatório/)).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should show error when title is too short', async () => {
    renderWithProviders(<PostForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Título/), { target: { value: 'Hi' } })
    fireEvent.blur(screen.getByLabelText(/Título/))

    await waitFor(() => {
      expect(screen.getByText(/mínimo 5 caracteres/i)).toBeInTheDocument()
    })
  })

  it('should call onSubmit with correct data when valid', async () => {
    renderWithProviders(<PostForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Título/), {
      target: { value: 'Fundamentos de TypeScript' },
    })
    fireEvent.change(screen.getByLabelText(/Conteúdo/), {
      target: { value: 'TypeScript é um superset do JavaScript que adiciona tipagem estática ao código.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /publicar post/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Fundamentos de TypeScript',
        content: 'TypeScript é um superset do JavaScript que adiciona tipagem estática ao código.',
        author: 'Prof. Ana Costa',
      })
    })
  })

  it('should show "Salvar alterações" button when editing', () => {
    renderWithProviders(
      <PostForm onSubmit={onSubmit} initialData={{ title: 'Título existente', content: '', author: '' }} />
    )
    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument()
  })

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    renderWithProviders(<PostForm onSubmit={onSubmit} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('should disable all inputs and submit button when isLoading is true', () => {
    renderWithProviders(<PostForm onSubmit={onSubmit} isLoading={true} />)
    expect(screen.getByLabelText(/Título/)).toBeDisabled()
    expect(screen.getByLabelText(/Conteúdo/)).toBeDisabled()
  })
})
