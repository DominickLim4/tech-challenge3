import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import PostCard from './index'
import theme from '../../styles/theme'

const renderWithProviders = (ui) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  )

const defaultProps = {
  id: '1',
  title: 'Introdução ao React',
  author: 'Prof. Maria Silva',
  description: 'Um guia completo sobre os fundamentos do React para iniciantes.',
  createdAt: '2024-01-15T10:00:00.000Z',
}

describe('PostCard', () => {
  it('should render the post title', () => {
    renderWithProviders(<PostCard {...defaultProps} />)
    expect(screen.getByText('Introdução ao React')).toBeInTheDocument()
  })

  it('should render the author name', () => {
    renderWithProviders(<PostCard {...defaultProps} />)
    expect(screen.getByText('Prof. Maria Silva')).toBeInTheDocument()
  })

  it('should render the description', () => {
    renderWithProviders(<PostCard {...defaultProps} />)
    expect(screen.getByText(/Um guia completo sobre/)).toBeInTheDocument()
  })

  it('should render a link pointing to the correct post URL', () => {
    renderWithProviders(<PostCard {...defaultProps} />)
    const link = screen.getByRole('link', { name: /Ler post: Introdução ao React/i })
    expect(link).toHaveAttribute('href', '/posts/1')
  })

  it('should truncate long descriptions to 150 chars', () => {
    const longDescription = 'a'.repeat(200)
    renderWithProviders(<PostCard {...defaultProps} description={longDescription} />)
    const text = screen.getByText(/a+\.\.\./)
    expect(text.textContent.length).toBeLessThanOrEqual(153)
  })

  it('should handle author as an object with name property', () => {
    renderWithProviders(
      <PostCard {...defaultProps} author={{ name: 'Prof. João Souza' }} />
    )
    expect(screen.getByText('Prof. João Souza')).toBeInTheDocument()
  })

  it('should render without author gracefully', () => {
    renderWithProviders(<PostCard {...defaultProps} author={null} />)
    expect(screen.getByText('Introdução ao React')).toBeInTheDocument()
  })

  it('should render without description gracefully', () => {
    renderWithProviders(<PostCard {...defaultProps} description={null} />)
    expect(screen.getByText('Introdução ao React')).toBeInTheDocument()
  })
})
