import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import type { UserRole } from '../types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: UserRole[]
  redirectTo: string
}

export function ProtectedRoute({ children, allowedRoles, redirectTo }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
