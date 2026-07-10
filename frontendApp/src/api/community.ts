import type { Community, CommunityProfile, CreateCommunityPayload } from '../types/community'
import {
  mockCreateCommunity,
  mockGetCommunities,
  mockGetCommunityProfile,
  mockUpdateCommunityProfile,
} from '../mocks/community.mock'

// Flip to false once GET /api/v1/communities is available on the backend.
const USE_MOCK = true

export async function getCommunities(): Promise<Community[]> {
  if (USE_MOCK) {
    return mockGetCommunities()
  }

  const response = await fetch('/api/v1/communities')

  if (!response.ok) {
    throw new Error('Unable to load communities.')
  }

  return response.json() as Promise<Community[]>
}

export async function createCommunity(payload: CreateCommunityPayload): Promise<Community> {
  if (USE_MOCK) {
    return mockCreateCommunity(payload)
  }

  const response = await fetch('/api/v1/communities', {
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

export async function getCommunityProfile(): Promise<CommunityProfile> {
  if (USE_MOCK) {
    return mockGetCommunityProfile()
  }

  const response = await fetch('/api/v1/community/profile')

  if (!response.ok) {
    throw new Error('Unable to load community profile.')
  }

  return response.json() as Promise<CommunityProfile>
}

export async function updateCommunityProfile(profile: CommunityProfile): Promise<CommunityProfile> {
  if (USE_MOCK) {
    return mockUpdateCommunityProfile(profile)
  }

  const response = await fetch('/api/v1/community/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    throw new Error('Unable to update community profile.')
  }

  return response.json() as Promise<CommunityProfile>
}
