import type { House, HouseSummary, RegisterHousePayload } from '../types/house'
import { mockGetHouses, mockRegisterHouse, mockUpdateHouse } from '../mocks/house.mock'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://community-management-system-41c7.onrender.com'
const USE_MOCK = false

export async function getHouses(
  keyword?: string,
  tab?: 'all' | 'residential' | 'commercial' | 'vacant',
): Promise<{ houses: House[]; summary: HouseSummary }> {
  if (USE_MOCK) {
    return mockGetHouses(keyword, tab)
  }

  const queryParams = new URLSearchParams()
  if (keyword) queryParams.append('keyword', keyword)
  if (tab) queryParams.append('tab', tab)

  const response = await fetch(`${API_BASE_URL}/api/v1/houses?${queryParams.toString()}`)
  if (!response.ok) {
    throw new Error('Unable to load houses.')
  }

  return response.json() as Promise<{ houses: House[]; summary: HouseSummary }>
}

export async function registerHouse(payload: RegisterHousePayload): Promise<House> {
  if (USE_MOCK) {
    return mockRegisterHouse(payload)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/houses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to register house.')
  }

  return response.json() as Promise<House>
}

export async function updateHouse(id: string, updates: Partial<House>): Promise<House> {
  if (USE_MOCK) {
    return mockUpdateHouse(id, updates)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/houses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error('Unable to update house.')
  }

  return response.json() as Promise<House>
}
