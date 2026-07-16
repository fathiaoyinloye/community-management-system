import type { AuthUser, LoginPayload, LoginResponse, RegisterResidentPayload } from '../types/auth'
import { mockLogin, mockRegisterResident } from '../mocks/auth.mock'

const USE_MOCK = true

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (USE_MOCK) {
    return mockLogin(payload)
  }

  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Invalid email or password.')
  }

  return response.json() as Promise<LoginResponse>
}

export async function registerResident(payload: RegisterResidentPayload): Promise<AuthUser> {
  if (USE_MOCK) {
    return mockRegisterResident(payload)
  }

  const response = await fetch('/api/v1/auth/register-resident', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to register resident.')
  }

  return response.json() as Promise<AuthUser>
}

