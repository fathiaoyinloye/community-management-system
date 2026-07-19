import type { AuthUser, LoginPayload, LoginResponse, CompleteAccountSetupPayload, AccountActivatedResponse } from '../types/auth'
import { mockLogin } from '../mocks/auth.mock'
import { apiUrl } from './config'

const USE_MOCK = false

export async function login(payload: LoginPayload): Promise<{ token: string; user: AuthUser }> {
  if (USE_MOCK) {
    return mockLogin(payload)
  }

  const response = await fetch(apiUrl('/api/v1/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Invalid username or password.')
  }

  const data: LoginResponse = await response.json()

  // Normalize role — backend may return uppercase e.g. "PLATFORM_ADMIN"
  const normalizeRole = (raw: string): AuthUser['role'] => {
    return raw.toLowerCase().replace(/^role_/, '') as AuthUser['role']
  }

  const user: AuthUser = {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    name: `${data.firstName} ${data.lastName}`,
    role: normalizeRole(data.role),
  }

  // Backend doesn't return a token in LoginResponse — use a placeholder until
  // the backend adds token-based auth. For now store the user id as the token.
  return { token: data.id, user }
}

export async function logout(): Promise<void> {
  if (USE_MOCK) return

  await fetch(apiUrl('/api/v1/auth/logout'), { method: 'POST' })
}

export async function activateAccount(payload: CompleteAccountSetupPayload): Promise<AccountActivatedResponse> {
  if (USE_MOCK) {
    return { username: 'mock_user', message: 'Account activated successfully.' }
  }

  const response = await fetch(apiUrl('/api/v1/auth/activate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to activate account.')
  }

  return response.json() as Promise<AccountActivatedResponse>
}
