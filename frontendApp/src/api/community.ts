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
import { apiUrl, GLOBAL_USE_MOCK } from './config'

// GET /communities — not yet implemented on backend, keep mocked
const USE_MOCK_LIST = true
// POST /communities and /assign-admin — implemented
const USE_MOCK_WRITE = GLOBAL_USE_MOCK
// GET/PUT community profile — not yet implemented on backend, keep mocked
const USE_MOCK_PROFILE = true

export async function getCommunities(): Promise<Community[]> {
  if (USE_MOCK_LIST) return mockGetCommunities()

  const response = await fetch(apiUrl('/communities'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load communities.')
  return response.json() as Promise<Community[]>
}

export async function createCommunity(payload: CreateCommunityPayload): Promise<Community> {
  if (USE_MOCK_WRITE) return mockCreateCommunity(payload)

  const response = await fetch(apiUrl('/communities'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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
  if (USE_MOCK_WRITE) {
    return {
      userId: `admin-${Date.now()}`,
      email: payload.email ?? '',
      username: `${payload.firstName.toLowerCase()}.${payload.lastName.toLowerCase()}`,
      role: 'community_admin',
      activationLink: `https://communaltrust.app/activate-account?token=mock`,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    }
  }

  const response = await fetch(apiUrl(`/communities/${communityId}/assign-admin`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to assign community admin.')
  }

  return response.json() as Promise<UserActivationResponse>
}

export async function inviteStaff(payload: InviteStaffPayload): Promise<UserActivationResponse> {
  const response = await fetch(apiUrl('/communities/staff/invite'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to invite staff.')
  }

  return response.json() as Promise<UserActivationResponse>
}

export async function getCommunityProfile(id?: string): Promise<CommunityProfile> {
  if (USE_MOCK_PROFILE) return mockGetCommunityProfile()

  const response = await fetch(apiUrl(`/communities/${id ?? 'me'}`), {
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Unable to load community profile.')
  return response.json() as Promise<CommunityProfile>
}

export async function updateCommunityProfile(profile: CommunityProfile): Promise<CommunityProfile> {
  if (USE_MOCK_PROFILE) return mockUpdateCommunityProfile(profile)

  const response = await fetch(apiUrl(`/communities/${profile.id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(profile),
  })

  if (!response.ok) throw new Error('Unable to update community profile.')
  return response.json() as Promise<CommunityProfile>
}
