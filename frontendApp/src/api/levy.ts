import type {
  CreateLevyTypePayload,
  HouseLevy,
  LevySummary,
  LevyType,
  ScheduledAdjustment,
} from '../types/levy'
import {
  mockCreateLevyType,
  mockGetHouseLevies,
  mockGetLevySummary,
  mockGetLevyTypes,
  mockGetScheduledAdjustments,
  mockUpdateLevyStatus,
} from '../mocks/levy.mock'
import { apiUrl, GLOBAL_USE_MOCK } from './config'

// POST /levies — implemented
const USE_MOCK_WRITE = GLOBAL_USE_MOCK
// GET /levies/my-balance — implemented
const USE_MOCK_BALANCE = GLOBAL_USE_MOCK

/** Community staff: create a new levy type — POST /api/v1/levies */
export async function createLevyType(payload: CreateLevyTypePayload): Promise<LevyType> {
  if (USE_MOCK_WRITE) return mockCreateLevyType(payload)

  // Backend expects uppercase frequency
  const body = {
    name: payload.name,
    amount: payload.amount,
    frequency: payload.frequency.toUpperCase(),
    description: payload.description,
    icon: payload.icon,
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
  if (USE_MOCK_BALANCE) return mockGetHouseLevies()

  const response = await fetch(apiUrl('/levies/my-balance'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load levy balances.')
  return response.json() as Promise<HouseLevy[]>
}

// ── UI-only helpers (mocked — no backend endpoint yet) ────────────────────────

export async function getLevyTypes(): Promise<LevyType[]> {
  return mockGetLevyTypes()
}

export async function getLevySummary(): Promise<LevySummary> {
  return mockGetLevySummary()
}

export async function getScheduledAdjustments(): Promise<ScheduledAdjustment[]> {
  return mockGetScheduledAdjustments()
}

export async function updateLevyStatus(id: string, status: LevyType['status']): Promise<LevyType> {
  return mockUpdateLevyStatus(id, status)
}
