import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import SearchBar from './index'
import theme from '../../styles/theme'

const renderWithTheme = (ui) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

describe('SearchBar', () => {
  let onSearch

  beforeEach(() => {
    onSearch = vi.fn()
    vi.useFakeTimers()
  })

  it('should render the search input', () => {
    renderWithTheme(<SearchBar onSearch={onSearch} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('should render with the correct placeholder', () => {
    renderWithTheme(
      <SearchBar onSearch={onSearch} placeholder="Buscar por título..." />
    )
    expect(
      screen.getByPlaceholderText('Buscar por título...')
    ).toBeInTheDocument()
  })

  it('should debounce the onSearch call by 300ms', () => {
    renderWithTheme(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('searchbox')

    fireEvent.change(input, { target: { value: 'React' } })
    expect(onSearch).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(onSearch).toHaveBeenCalledWith('React')
  })

  it('should call onSearch once when typing quickly', () => {
    renderWithTheme(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('searchbox')

    fireEvent.change(input, { target: { value: 'R' } })
    fireEvent.change(input, { target: { value: 'Re' } })
    fireEvent.change(input, { target: { value: 'React' } })

    vi.advanceTimersByTime(300)
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('React')
  })

  it('should show clear button when input has text', () => {
    renderWithTheme(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('searchbox')

    expect(screen.queryByLabelText('Limpar busca')).not.toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'React' } })
    expect(screen.getByLabelText('Limpar busca')).toBeInTheDocument()
  })

  it('should clear input and call onSearch with empty string when clear button is clicked', () => {
    renderWithTheme(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('searchbox')

    fireEvent.change(input, { target: { value: 'React' } })
    vi.advanceTimersByTime(300)

    const clearBtn = screen.getByLabelText('Limpar busca')
    fireEvent.click(clearBtn)

    expect(input.value).toBe('')
    expect(onSearch).toHaveBeenLastCalledWith('')
  })

  it('should have accessible search landmark', () => {
    renderWithTheme(<SearchBar onSearch={onSearch} />)
    expect(screen.getByRole('search')).toBeInTheDocument()
  })
})
