import type { LevySummary, LevyType, ScheduledAdjustment } from '../types/levy'
import {
  mockGetLevySummary,
  mockGetLevyTypes,
  mockGetScheduledAdjustments,
  mockUpdateLevyStatus,
} from '../mocks/levy.mock'

// Flip to false once the levy endpoints are available on the backend.
const USE_MOCK = true

export async function getLevyTypes(): Promise<LevyType[]> {
  if (USE_MOCK) {
    return mockGetLevyTypes()
  }

  const response = await fetch('/api/v1/levy-types')

  if (!response.ok) {
    throw new Error('Unable to load levy types.')
  }

  return response.json() as Promise<LevyType[]>
}

export async function getLevySummary(): Promise<LevySummary> {
  if (USE_MOCK) {
    return mockGetLevySummary()
  }

  const response = await fetch('/api/v1/levy-types/summary')

  if (!response.ok) {
    throw new Error('Unable to load levy summary.')
  }

  return response.json() as Promise<LevySummary>
}

export async function getScheduledAdjustments(): Promise<ScheduledAdjustment[]> {
  if (USE_MOCK) {
    return mockGetScheduledAdjustments()
  }

  const response = await fetch('/api/v1/levy-types/scheduled-adjustments')

  if (!response.ok) {
    throw new Error('Unable to load scheduled adjustments.')
  }

  return response.json() as Promise<ScheduledAdjustment[]>
}

export async function updateLevyStatus(id: string, status: LevyType['status']): Promise<LevyType> {
  if (USE_MOCK) {
    return mockUpdateLevyStatus(id, status)
  }

  const response = await fetch(`/api/v1/levy-types/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Unable to update levy status.')
  }

  return response.json() as Promise<LevyType>
}
