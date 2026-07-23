import type {
  CreateLevyTypePayload,
  HouseLevy,
  LevySummary,
  LevyType,
  ScheduledAdjustment,
} from '../types/levy'
import { apiUrl } from './config'

/** Community staff: create a new levy type — POST /api/v1/levy-types */
export async function createLevyType(payload: CreateLevyTypePayload): Promise<LevyType> {
  const body = {
    name: payload.name,
    amount: payload.amount,
    frequency: payload.frequency.toUpperCase(),
  }

  const response = await fetch(apiUrl('/levies'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message ?? 'Unable to create levy type.')
  }

  return response.json() as Promise<LevyType>
}

/** Resident: get outstanding house levy balances — GET /api/v1/levies/my-balance */
export async function getMyBalance(): Promise<HouseLevy[]> {
  const response = await fetch(apiUrl('/levies/my-balance'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load levy balances.')
  return response.json() as Promise<HouseLevy[]>
}

/** Get all levy types from backend — GET /api/v1/levy-types */
export async function getLevyTypes(): Promise<LevyType[]> {
  const response = await fetch(apiUrl('/levy-types'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load levy types.')
  return response.json() as Promise<LevyType[]>
}

/** Generate levies for all active houses — POST /api/v1/levies/generate */
export async function generateHouseLevies(communityId: string): Promise<void> {
  const response = await fetch(apiUrl('/levies/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ communityId }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message ?? 'Unable to generate house levies.')
  }
}

export async function getLevySummary(): Promise<LevySummary> {
  const levies = await getLevyTypes()
  const active = levies.filter(l => l.status !== 'inactive')
  const monthlyRev = active.reduce((acc, l) => {
    const freq = (l.frequency || '').toUpperCase()
    if (freq === 'MONTHLY') return acc + l.amount
    if (freq === 'YEARLY' || freq === 'ANNUALLY') return acc + (l.amount / 12)
    if (freq === 'QUARTERLY') return acc + (l.amount / 3)
    return acc
  }, 0)

  return {
    totalActiveLevies: active.length,
    totalLevyTypes: levies.length,
    monthlyRevenueEstimate: monthlyRev,
    monthlyRevenueChangePct: 0,
    pendingUpdates: 0,
    lastProcessedLabel: 'Just now',
  }
}

export async function getScheduledAdjustments(): Promise<ScheduledAdjustment[]> {
  return []
}

export async function updateLevyStatus(id: string, status: LevyType['status']): Promise<LevyType> {
  // Fetch existing details first to maintain them
  const response = await fetch(apiUrl('/levy-types'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load levy types.')
  const list = await response.json() as LevyType[]
  const existing = list.find(l => l.id === id)
  if (!existing) throw new Error('Levy type not found.')

  const updatedBody = {
    name: existing.name,
    amount: existing.amount,
    frequency: (existing.frequency || 'MONTHLY').toUpperCase(),
    status: status?.toUpperCase() || 'ACTIVE',
  }

  const putResponse = await fetch(apiUrl(`/levy-types/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updatedBody),
  })

  if (!putResponse.ok) {
    const err = await putResponse.json().catch(() => null)
    throw new Error(err?.message ?? 'Unable to update levy status.')
  }

  return putResponse.json() as Promise<LevyType>
}
