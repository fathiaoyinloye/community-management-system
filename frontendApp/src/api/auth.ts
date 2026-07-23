import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  CompleteAccountSetupPayload,
  AccountActivatedResponse,
} from '../types/auth'
import { apiUrl } from './config'

// Normalize role — backend returns uppercase e.g. "PLATFORM_ADMIN"
function normalizeRole(raw: string): AuthUser['role'] {
  return raw.toLowerCase().replace(/^role_/, '') as AuthUser['role']
}

export async function login(payload: LoginPayload): Promise<{ token: string; user: AuthUser }> {
  const response = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Invalid username or password.')
  }

  const data: LoginResponse = await response.json()
  const user: AuthUser = {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    name: `${data.firstName} ${data.lastName}`,
    role: normalizeRole(data.role),
  }

  // Auth is cookie-based — no token to store. Return user id as a placeholder
  // so AuthContext shape stays stable.
  return { token: data.id, user }
}

export async function logout(): Promise<void> {
  await fetch(apiUrl('/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  })
}

export async function activateAccount(
  payload: CompleteAccountSetupPayload,
): Promise<AccountActivatedResponse> {
  const response = await fetch(apiUrl('/auth/complete-account-setup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to activate account.')
  }

  return response.json() as Promise<AccountActivatedResponse>
}
