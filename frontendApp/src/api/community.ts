import type {
  Community,
  CommunityProfile,
  CreateCommunityPayload,
  AssignCommunityAdminPayload,
  InviteStaffPayload,
} from '../types/community'
import type { UserActivationResponse } from '../types/auth'
import {
  mockCreateCommunity,
  mockGetCommunities,
  mockGetCommunityProfile,
  mockUpdateCommunityProfile,
} from '../mocks/community.mock'
import { apiUrl } from './config'

const USE_MOCK = true

export async function getCommunities(): Promise<Community[]> {
  if (USE_MOCK) return mockGetCommunities()

  const response = await fetch(apiUrl('/api/v1/communities'))
  if (!response.ok) throw new Error('Unable to load communities.')
  return response.json() as Promise<Community[]>
}

export async function createCommunity(payload: CreateCommunityPayload): Promise<Community> {
  if (USE_MOCK) return mockCreateCommunity(payload)

  const response = await fetch(apiUrl('/api/v1/communities'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to create community.')
  }

  return response.json() as Promise<Community>
}

export async function assignCommunityAdmin(
  communityId: string,
  payload: AssignCommunityAdminPayload,
): Promise<UserActivationResponse> {
  if (USE_MOCK) {
    // Return a stub activation response
    return {
      userId: `admin-${Date.now()}`,
      email: payload.email,
      username: payload.email.split('@')[0],
      role: 'community_admin',
      activationLink: `https://communaltrust.app/activate?token=mock`,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    }
  }

  const response = await fetch(apiUrl(`/api/v1/communities/${communityId}/assign-admin`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to assign community admin.')
  }

  return response.json() as Promise<UserActivationResponse>
}

export async function inviteStaff(payload: InviteStaffPayload): Promise<UserActivationResponse> {
  if (USE_MOCK) {
    return {
      userId: `staff-${Date.now()}`,
      email: payload.email,
      username: payload.email.split('@')[0],
      role: 'community_staff',
      activationLink: `https://communaltrust.app/activate?token=mock`,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    }
  }

  const response = await fetch(apiUrl('/api/v1/communities/staff/invite'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to invite staff.')
  }

  return response.json() as Promise<UserActivationResponse>
}

export async function getCommunityProfile(id?: string): Promise<CommunityProfile> {
  if (USE_MOCK) return mockGetCommunityProfile()

  const response = await fetch(apiUrl(`/api/v1/communities/${id ?? 'me'}`))
  if (!response.ok) throw new Error('Unable to load community profile.')
  return response.json() as Promise<CommunityProfile>
}

export async function updateCommunityProfile(profile: CommunityProfile): Promise<CommunityProfile> {
  if (USE_MOCK) return mockUpdateCommunityProfile(profile)

  const response = await fetch(apiUrl(`/api/v1/communities/${profile.id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  if (!response.ok) throw new Error('Unable to update community profile.')
  return response.json() as Promise<CommunityProfile>
}
