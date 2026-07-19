export type UserRole = 'platform_admin' | 'community_admin' | 'community_staff' | 'resident'

// ── Swagger: LoginRequest ─────────────────────────────────────────────────────
export interface LoginPayload {
  username: string
  password: string
}

// ── Swagger: LoginResponse ────────────────────────────────────────────────────
export interface LoginResponse {
  id: string
  username: string
  firstName: string
  lastName: string
  role: UserRole
}

// ── Local convenience: full user stored in context ───────────────────────────
export interface AuthUser {
  id: string
  username: string
  firstName: string
  lastName: string
  /** Derived display name: firstName + lastName */
  name: string
  role: UserRole
}

// ── Swagger: CompleteAccountSetupRequest ──────────────────────────────────────
export interface CompleteAccountSetupPayload {
  token: string
  password: string
  confirmPassword: string
}

// ── Swagger: AccountActivatedResponse ────────────────────────────────────────
export interface AccountActivatedResponse {
  username: string
  message: string
}

// ── Swagger: UserActivationResponse (returned when assigning resident/admin) ──
export interface UserActivationResponse {
  userId: string
  email: string
  username: string
  role: string
  activationLink: string
  expiresAt: string
}
