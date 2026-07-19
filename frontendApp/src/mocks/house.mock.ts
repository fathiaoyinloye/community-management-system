import type { House, HouseSummary, RegisterHousePayload, AssignResidentPayload } from '../types/house'
import type { UserActivationResponse } from '../types/auth'
import { addMockAccount } from './auth.mock'

let mockHouses: House[] = [
  {
    id: 'h3',
    communityId: 'c1',
    residentId: null,
    houseNumber: 'H-1102',
    street: '566 West Pine Blvd',
    createdAt: '2026-03-20',
    propertyType: 'apartment',
    status: 'vacant',
    hasMaintenanceAlert: false,
  },
  {
    id: 'h6',
    communityId: 'c1',
    residentId: 'resident-1',
    houseNumber: 'H-1042',
    street: '15 Jasmine Boulevard',
    createdAt: '2026-05-20',
    propertyType: 'single_family',
    status: 'occupied',
    hasMaintenanceAlert: false,
    resident: {
      firstName: 'Femi',
      lastName: 'Olayemi',
      email: 'femi.olayemi@gmail.com',
      phone: '08123344556',
    },
  },
  {
    id: 'h7',
    communityId: 'c1',
    residentId: null,
    houseNumber: 'H-0309',
    street: '72 Sunset Avenue',
    createdAt: '2026-06-01',
    propertyType: 'commercial',
    status: 'vacant',
    hasMaintenanceAlert: false,
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockGetHouses(
  keyword?: string,
  tab?: 'all' | 'residential' | 'commercial' | 'vacant',
): Promise<{ houses: House[]; summary: HouseSummary }> {
  await delay(400)

  let filtered = [...mockHouses]

  if (tab === 'residential') {
    filtered = filtered.filter((h) => h.propertyType !== 'commercial')
  } else if (tab === 'commercial') {
    filtered = filtered.filter((h) => h.propertyType === 'commercial')
  } else if (tab === 'vacant') {
    filtered = filtered.filter((h) => h.status === 'vacant')
  }

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      (h) =>
        h.houseNumber.toLowerCase().includes(kw) ||
        h.street.toLowerCase().includes(kw) ||
        (h.resident &&
          `${h.resident.firstName} ${h.resident.lastName}`.toLowerCase().includes(kw)),
    )
  }

  const occupied = mockHouses.filter((h) => h.status === 'occupied').length
  const vacant = mockHouses.filter((h) => h.status === 'vacant').length
  const alerts = mockHouses.filter((h) => h.hasMaintenanceAlert).length

  const summary: HouseSummary = {
    totalInventory: mockHouses.length,
    occupiedCount: occupied,
    vacantCount: vacant,
    maintenanceAlertCount: alerts,
    occupancyRate: mockHouses.length > 0 ? Math.round((occupied / mockHouses.length) * 1000) / 10 : 0,
  }

  return { houses: filtered, summary }
}

export async function mockRegisterHouse(payload: RegisterHousePayload): Promise<House> {
  await delay(600)

  const newHouse: House = {
    id: `h${mockHouses.length + 1}`,
    communityId: 'c1',
    residentId: null,
    houseNumber: payload.houseNumber,
    street: payload.street,
    createdAt: new Date().toISOString().slice(0, 10),
    status: 'vacant',
    hasMaintenanceAlert: false,
  }

  mockHouses.unshift(newHouse)
  return newHouse
}

export async function mockAssignResident(
  houseId: string,
  payload: AssignResidentPayload,
): Promise<UserActivationResponse> {
  await delay(600)

  const idx = mockHouses.findIndex((h) => h.id === houseId)
  if (idx === -1) throw new Error('House not found.')

  const username = payload.email.split('@')[0]
  const userId = `resident-${Date.now()}`

  mockHouses[idx] = {
    ...mockHouses[idx],
    residentId: userId,
    status: 'occupied',
    resident: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
    },
  }

  // Register them as a mock account with a temporary password
  addMockAccount(
    {
      id: userId,
      username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      name: `${payload.firstName} ${payload.lastName}`,
      role: 'resident',
    },
    'Temp@1234',
  )

  return {
    userId,
    email: payload.email,
    username,
    role: 'resident',
    activationLink: `https://communaltrust.app/activate?token=mock-${userId}`,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  }
}

/** UI-only helper: update arbitrary house fields (used by Houses page for alerts/occupancy) */
export async function mockUpdateHouse(id: string, updates: Partial<House>): Promise<House> {
  await delay(500)
  const idx = mockHouses.findIndex((h) => h.id === id)
  if (idx === -1) throw new Error('House not found.')
  mockHouses[idx] = { ...mockHouses[idx], ...updates }
  return mockHouses[idx]
}
