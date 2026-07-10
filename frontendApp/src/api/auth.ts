import type { LoginPayload, LoginResponse } from '../types/auth'
import { mockLogin } from '../mocks/auth.mock'

// Flip to false once POST /api/v1/auth/login is available on the backend.
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
