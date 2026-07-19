import type { AuthUser, LoginPayload } from '../types/auth'

interface StoredAccount {
  user: AuthUser
  password: string
}

export const accounts: StoredAccount[] = [
  {
    user: {
      id: 'platform-admin-1',
      username: 'admin',
      firstName: 'Ada',
      lastName: 'Obi',
      name: 'Ada Obi',
      role: 'platform_admin',
    },
    password: 'Admin@123',
  },
  {
    user: {
      id: 'community-admin-1',
      username: 'nelson',
      firstName: 'Nelson',
      lastName: 'Adams',
      name: 'Nelson Adams',
      role: 'community_admin',
    },
    password: 'nelly@123',
  },
  {
    user: {
      id: 'resident-1',
      username: 'emma',
      firstName: 'Ekwe',
      lastName: 'Emma',
      name: 'Ekwe Emma',
      role: 'resident',
    },
    password: 'ekwe@123',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function issueToken(id: string) {
  return `mock-jwt.${btoa(id)}.${Date.now()}`
}

export async function mockLogin(
  payload: LoginPayload,
): Promise<{ token: string; user: AuthUser }> {
  await delay(800)

  const identifier = payload.username.trim().toLowerCase()
  const account = accounts.find((a) => a.user.username.toLowerCase() === identifier)

  if (!account || account.password !== payload.password) {
    throw new Error('Invalid username or password.')
  }

  return { token: issueToken(account.user.id), user: account.user }
}

export function addMockAccount(user: AuthUser, password: string) {
  if (accounts.some((a) => a.user.username === user.username)) return
  accounts.push({ user, password })
}
