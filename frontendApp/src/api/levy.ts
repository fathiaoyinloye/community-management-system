import type { CreateLevyTypePayload, HouseLevy, LevySummary, LevyType, ScheduledAdjustment } from '../types/levy'
import {
  mockCreateLevyType,
  mockGetHouseLevies,
  mockGetLevySummary,
  mockGetLevyTypes,
  mockGetScheduledAdjustments,
  mockUpdateLevyStatus,
} from '../mocks/levy.mock'
import { apiUrl } from './config'

const USE_MOCK = false

/** Community admin: get all levy types (POST /api/v1/levies creates one) */
export async function getLevyTypes(): Promise<LevyType[]> {
  if (USE_MOCK) return mockGetLevyTypes()

  const response = await fetch(apiUrl('/api/v1/levies'))
  if (!response.ok) throw new Error('Unable to load levy types.')
  return response.json() as Promise<LevyType[]>
}

/** Community admin: create a new levy type */
export async function createLevyType(payload: CreateLevyTypePayload): Promise<LevyType> {
  if (USE_MOCK) return mockCreateLevyType(payload)

  const response = await fetch(apiUrl('/api/v1/levies'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to create levy type.')
  }

  return response.json() as Promise<LevyType>
}

/** Resident: get my outstanding house levy balances */
export async function getMyBalance(): Promise<HouseLevy[]> {
  if (USE_MOCK) return mockGetHouseLevies()

  const response = await fetch(apiUrl('/api/v1/levies/my-balance'))
  if (!response.ok) throw new Error('Unable to load levy balances.')
  return response.json() as Promise<HouseLevy[]>
}

// ── UI-only helpers (mock-only, no swagger equivalent) ───────────────────────

export async function getLevySummary(): Promise<LevySummary> {
  if (USE_MOCK) return mockGetLevySummary()
  throw new Error('getLevySummary: no backend endpoint available.')
}

export async function getScheduledAdjustments(): Promise<ScheduledAdjustment[]> {
  if (USE_MOCK) return mockGetScheduledAdjustments()
  throw new Error('getScheduledAdjustments: no backend endpoint available.')
}

export async function updateLevyStatus(id: string, status: LevyType['status']): Promise<LevyType> {
  if (USE_MOCK) return mockUpdateLevyStatus(id, status)
  throw new Error('updateLevyStatus: no backend endpoint available.')
}
