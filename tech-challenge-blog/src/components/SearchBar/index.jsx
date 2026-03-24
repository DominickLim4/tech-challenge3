import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
`

const SearchLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[5]} ${theme.spacing[3]} ${theme.spacing[10]}`};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  aria-hidden: true;
`

const ClearButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.gray600};
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: 14px;
  line-height: 1;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

function SearchBar({ onSearch, placeholder = 'Buscar posts por título ou conteúdo...', initialValue = '' }) {
  const [inputValue, setInputValue] = useState(initialValue)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      onSearch(inputValue.trim())
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [inputValue, onSearch])

  const handleClear = () => {
    setInputValue('')
    onSearch('')
  }

  return (
    <SearchWrapper role="search">
      <SearchLabel htmlFor="search-input">Buscar posts</SearchLabel>

      <SearchIcon aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </SearchIcon>

      <SearchInput
        id="search-input"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar posts"
        autoComplete="off"
      />

      {inputValue && (
        <ClearButton
          type="button"
          onClick={handleClear}
          aria-label="Limpar busca"
          title="Limpar busca"
        >
          ×
        </ClearButton>
      )}
    </SearchWrapper>
  )
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
}

export default SearchBar
