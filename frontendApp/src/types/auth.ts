export type UserRole = 'platform_admin' | 'community_admin' | 'community_staff' | 'resident'

export interface AuthUser {
  id: string
  name: string
  email: string
  username?: string
  role: UserRole
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RegisterResidentPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  houseId: string
  password: string
}

