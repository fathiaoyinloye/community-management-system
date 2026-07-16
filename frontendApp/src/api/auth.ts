import type { AuthUser, LoginPayload, LoginResponse, RegisterResidentPayload } from '../types/auth'
import { mockLogin, mockRegisterResident } from '../mocks/auth.mock'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://community-management-system-41c7.onrender.com'
const USE_MOCK = false

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (USE_MOCK) {
    return mockLogin(payload)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
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

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register-resident`, {
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

