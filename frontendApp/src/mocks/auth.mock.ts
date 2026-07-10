import type { AuthUser, LoginPayload, LoginResponse } from '../types/auth'

interface StoredAccount {
  user: AuthUser
  password: string
}

const accounts: StoredAccount[] = [
  {
    user: {
      id: 'platform-admin-1',
      name: 'Ada Obi',
      email: 'admin@communaltrust.com',
      role: 'platform_admin',
    },
    password: 'Admin@123',
  },
  {
    user: {
      id: 'community-admin-1',
      name: 'Alex Jordan',
      email: 'admin@journalist.com',
      role: 'community_admin',
    },
    password: 'Admin@123',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function issueToken(email: string) {
  return `mock-jwt.${btoa(email)}.${Date.now()}`
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
  await delay(800)

  const email = payload.email.trim().toLowerCase()
  const account = accounts.find((entry) => entry.user.email === email)

  if (!account || account.password !== payload.password) {
    throw new Error('Invalid email or password.')
  }

  return { token: issueToken(account.user.email), user: account.user }
}

interface CreateCommunityAdminPayload {
  name: string
  email: string
  temporaryPassword: string
}

export async function mockCreateCommunityAdmin(payload: CreateCommunityAdminPayload): Promise<AuthUser> {
  await delay(500)

  const email = payload.email.trim().toLowerCase()
  if (accounts.some((entry) => entry.user.email === email)) {
    throw new Error('An account with this email already exists.')
  }

  const user: AuthUser = {
    id: `community-admin-${accounts.length + 1}`,
    name: payload.name.trim(),
    email,
    role: 'community_admin',
  }

  accounts.push({ user, password: payload.temporaryPassword })

  return user
}
