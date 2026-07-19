import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthUser, LoginPayload } from '../types/auth'
import { login as loginRequest, logout as logoutRequest } from '../api/auth'

// Auth is cookie-based (HttpOnly jwt cookie set by backend).
// We only persist the user profile in localStorage for page-refresh UX.
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
      const { user: loggedInUser } = await loginRequest(payload)
      // Cookie is set by the browser automatically from the response.
      // We only store the user profile for display purposes.
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser))
      setUser(loggedInUser)
      return loggedInUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = () => {
    logoutRequest().catch(() => {})
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
