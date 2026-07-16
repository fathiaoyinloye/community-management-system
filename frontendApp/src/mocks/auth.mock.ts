import type { AuthUser, LoginPayload, LoginResponse, RegisterResidentPayload } from '../types/auth'
import { mockUpdateHouse } from './house.mock'


interface StoredAccount {
  user: AuthUser
  password: string
}

export const accounts: StoredAccount[] = [
  {
    user: {
      id: 'platform-admin-1',
      name: 'Ada Obi',
      email: 'admin@gmail.com',
      role: 'platform_admin',
    },
    password: 'Admin@123',
  },
  {
    user: {
      id: 'community-admin-1',
      name: 'Nelson Adams',
      email: 'nelly@gmail.com',
      role: 'community_admin',
    },
    password: 'nelly@123',
  },
  {
    user: {
      id: 'resident-1',
      name: 'ekwe emma',
      email: 'emma@gmail.com',
      role: 'resident',
    },
    password: 'ekwe@123',
  },
]

export function addMockResidentAccount(resident: { firstName: string; lastName: string; email: string }, password?: string) {
  const email = resident.email.trim().toLowerCase()
  if (accounts.some((entry) => entry.user.email === email)) {
    return
  }
  const user: AuthUser = {
    id: `resident-${accounts.length + 1}`,
    name: `${resident.firstName.trim()} ${resident.lastName.trim()}`,
    email,
    role: 'resident',
  }
  accounts.push({ user, password: password || 'password123' })
}

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

export async function mockRegisterResident(payload: RegisterResidentPayload): Promise<AuthUser> {
  await delay(800)

  const email = payload.email.trim().toLowerCase()
  if (accounts.some((entry) => entry.user.email === email)) {
    throw new Error('An account with this email already exists.')
  }

  const resident = {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email,
    phone: payload.phone.trim(),
  }

  // Update the corresponding house in the mock database
  await mockUpdateHouse(payload.houseId, {
    status: 'occupied',
    resident,
  })

  const user: AuthUser = {
    id: `resident-${accounts.length + 1}`,
    name: `${payload.firstName.trim()} ${payload.lastName.trim()}`,
    email,
    role: 'resident',
  }

  accounts.push({ user, password: payload.password })

  return user
}

