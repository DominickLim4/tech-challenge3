/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { login as loginService } from '../services/api'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

function readStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || null
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // Lazy initialisation — reads localStorage once at mount, no useEffect needed
  const [token, setToken] = useState(readStoredToken)
  const [user, setUser] = useState(readStoredUser)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    window.addEventListener('auth:logout', logout)
    return () => window.removeEventListener('auth:logout', logout)
  }, [logout])

  const handleLogin = useCallback(async (credentials) => {
    const response = await loginService(credentials)
    const { token: newToken, user: newUser } = response.data

    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))

    setToken(newToken)
    setUser(newUser)

    return response.data
  }, [])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: false,
        isAuthenticated,
        login: handleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
