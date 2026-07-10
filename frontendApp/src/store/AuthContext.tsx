import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthUser, LoginPayload } from '../types/auth'
import { login as loginRequest } from '../api/auth'

const TOKEN_KEY = 'ct_auth_token'
const USER_KEY = 'ct_auth_user'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticating: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  const stored = localStorage.getItem(USER_KEY)
  return stored ? (JSON.parse(stored) as AuthUser) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (payload: LoginPayload) => {
    setIsAuthenticating(true)
    setError(null)
    try {
      const response = await loginRequest(payload)
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      setUser(response.user)
      return response.user
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticating, error, login, logout }),
    [user, isAuthenticating, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
