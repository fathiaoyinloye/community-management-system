import type {
  CreateLevyTypePayload,
  HouseLevy,
  LevySummary,
  LevyType,
  ScheduledAdjustment,
} from '../types/levy'
import { apiUrl } from './config'

/** Community staff: create a new levy type — POST /api/v1/levies */
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

  const created = await response.json() as LevyType

  // Enforce UI extras and save in localStorage
  created.description = payload.description || ''
  created.icon = payload.icon || 'receipt_long'
  created.status = 'active'

  const stored = localStorage.getItem('ct_levies')
  const levies = stored ? JSON.parse(stored) : []
  levies.push(created)
  localStorage.setItem('ct_levies', JSON.stringify(levies))

  return created
}

/** Resident: get outstanding house levy balances — GET /api/v1/levies/my-balance */
export async function getMyBalance(): Promise<HouseLevy[]> {
  const response = await fetch(apiUrl('/levies/my-balance'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load levy balances.')
  return response.json() as Promise<HouseLevy[]>
}

export async function getLevyTypes(): Promise<LevyType[]> {
  const stored = localStorage.getItem('ct_levies')
  return stored ? JSON.parse(stored) : []
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
  const stored = localStorage.getItem('ct_levies')
  const levies = stored ? JSON.parse(stored) : []
  const idx = levies.findIndex((l: any) => l.id === id)
  if (idx === -1) throw new Error('Levy not found.')
  levies[idx].status = status
  localStorage.setItem('ct_levies', JSON.stringify(levies))
  return levies[idx]
}
