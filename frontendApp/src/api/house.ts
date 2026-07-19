import type { House, HouseSummary, RegisterHousePayload, AssignResidentPayload } from '../types/house'
import type { UserActivationResponse } from '../types/auth'
import { mockGetHouses, mockRegisterHouse, mockAssignResident } from '../mocks/house.mock'
import { apiUrl } from './config'

// GET /houses — not yet implemented on backend, keep mocked
const USE_MOCK_LIST = true
// POST /houses and /assign-resident — implemented
const USE_MOCK_WRITE = false

export async function getHouses(
  keyword?: string,
  tab?: 'all' | 'residential' | 'commercial' | 'vacant',
): Promise<{ houses: House[]; summary: HouseSummary }> {
  if (USE_MOCK_LIST) return mockGetHouses(keyword, tab)

  const params = new URLSearchParams()
  if (keyword) params.append('keyword', keyword)
  if (tab) params.append('tab', tab)

  const response = await fetch(apiUrl(`/houses?${params}`), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load houses.')
  return response.json() as Promise<{ houses: House[]; summary: HouseSummary }>
}

export async function registerHouse(payload: RegisterHousePayload): Promise<House> {
  if (USE_MOCK_WRITE) return mockRegisterHouse(payload)

  const response = await fetch(apiUrl('/houses'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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
  if (USE_MOCK_WRITE) return mockAssignResident(houseId, payload)

  const response = await fetch(apiUrl(`/houses/${houseId}/assign-resident`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to assign resident.')
  }

  return response.json() as Promise<UserActivationResponse>
}
