import type { House, HouseSummary, RegisterHousePayload, AssignResidentPayload } from '../types/house'
import type { UserActivationResponse } from '../types/auth'
import { mockGetHouses, mockRegisterHouse, mockAssignResident } from '../mocks/house.mock'
import { apiUrl } from './config'

const USE_MOCK = true

export async function getHouses(
  keyword?: string,
  tab?: 'all' | 'residential' | 'commercial' | 'vacant',
): Promise<{ houses: House[]; summary: HouseSummary }> {
  if (USE_MOCK) return mockGetHouses(keyword, tab)

  const params = new URLSearchParams()
  if (keyword) params.append('keyword', keyword)
  if (tab) params.append('tab', tab)

  const response = await fetch(apiUrl(`/api/v1/houses?${params}`))
  if (!response.ok) throw new Error('Unable to load houses.')
  return response.json() as Promise<{ houses: House[]; summary: HouseSummary }>
}

export async function registerHouse(payload: RegisterHousePayload): Promise<House> {
  if (USE_MOCK) return mockRegisterHouse(payload)

  const response = await fetch(apiUrl('/api/v1/houses'), {
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

export async function assignResident(
  houseId: string,
  payload: AssignResidentPayload,
): Promise<UserActivationResponse> {
  if (USE_MOCK) return mockAssignResident(houseId, payload)

  const response = await fetch(apiUrl(`/api/v1/houses/${houseId}/assign-resident`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to assign resident.')
  }

  return response.json() as Promise<UserActivationResponse>
}
