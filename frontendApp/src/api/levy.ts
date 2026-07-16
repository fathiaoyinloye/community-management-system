import type { CreateLevyTypePayload, LevySummary, LevyType, ScheduledAdjustment } from '../types/levy'
import {
  mockCreateLevyType,
  mockGetLevySummary,
  mockGetLevyTypes,
  mockGetScheduledAdjustments,
  mockUpdateLevyStatus,
} from '../mocks/levy.mock'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://community-management-system-41c7.onrender.com'
const USE_MOCK = false

export async function getLevyTypes(): Promise<LevyType[]> {
  if (USE_MOCK) {
    return mockGetLevyTypes()
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/levy-types`)

  if (!response.ok) {
    throw new Error('Unable to load levy types.')
  }

  return response.json() as Promise<LevyType[]>
}

export async function getLevySummary(): Promise<LevySummary> {
  if (USE_MOCK) {
    return mockGetLevySummary()
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/levy-types/summary`)

  if (!response.ok) {
    throw new Error('Unable to load levy summary.')
  }

  return response.json() as Promise<LevySummary>
}

export async function getScheduledAdjustments(): Promise<ScheduledAdjustment[]> {
  if (USE_MOCK) {
    return mockGetScheduledAdjustments()
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/levy-types/scheduled-adjustments`)

  if (!response.ok) {
    throw new Error('Unable to load scheduled adjustments.')
  }

  return response.json() as Promise<ScheduledAdjustment[]>
}

export async function updateLevyStatus(id: string, status: LevyType['status']): Promise<LevyType> {
  if (USE_MOCK) {
    return mockUpdateLevyStatus(id, status)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/levy-types/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Unable to update levy status.')
  }

  return response.json() as Promise<LevyType>
}

export async function createLevyType(payload: CreateLevyTypePayload): Promise<LevyType> {
  if (USE_MOCK) {
    return mockCreateLevyType(payload)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/levy-types`, {
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

