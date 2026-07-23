import type {
  Community,
  CreateCommunityPayload,
  AssignCommunityAdminPayload,
  InviteStaffPayload,
} from '../types/community'
import type { UserActivationResponse } from '../types/auth'
import { apiUrl } from './config'

export async function getCommunities(): Promise<Community[]> {
  const response = await fetch(apiUrl('/communities'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load communities.')
  return response.json() as Promise<Community[]>
}

export async function createCommunity(payload: CreateCommunityPayload): Promise<Community> {
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

export async function inviteStaff(
  communityId: string,
  payload: InviteStaffPayload,
): Promise<UserActivationResponse> {
  const response = await fetch(apiUrl(`/communities/${communityId}/staff`), {
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

export async function getStaff(communityId: string): Promise<any[]> {
  const response = await fetch(apiUrl(`/communities/${communityId}/staff`), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load staff.')
  return response.json() as Promise<any[]>
}
