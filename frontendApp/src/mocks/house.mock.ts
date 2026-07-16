import type { House, HouseSummary, RegisterHousePayload } from '../types/house'

let mockHouses: House[] = [
  {
    id: 'h1',
    houseNumber: 'H-0248',
    street: '1422 Oakwood Avenue',
    propertyType: 'single_family',
    status: 'occupied',
    hasMaintenanceAlert: false,
    createdAt: '2026-01-10',
    resident: {
      firstName: 'Julian',
      lastName: 'Vance',
      email: 'julian.vance@example.com',
      phone: '08012345678',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZeIOKw38JceWP60Ve5STbMoW_k1m3GoqjoDWYuUSzBf9wQ7qxWa9XpRSu5Nkiqm2_zFSDb_8BOBzu_iLe25_mieSQ9NPOfkP4KMGOHJ_tnsNkGCEOuTCbXprgJhB7j47KaMYjWQcmn7RQTr85gvKu6Uo9Zvu6qjUFri4lCzOzi-7IraipkiiaUVJKT8V_Sg_u1ZiwP77SzLmlLllDQNzdIxsgmWxu5ClhQQZX4j0vlcE3-lZDwN4Yj3Uxgx45bfAPQdRpzRewx7s',
    },
  },
  {
    id: 'h2',
    houseNumber: 'H-0812',
    street: '89 Brookside Court',
    propertyType: 'townhouse',
    status: 'occupied',
    hasMaintenanceAlert: false,
    createdAt: '2026-02-15',
    resident: {
      firstName: 'Elena',
      lastName: 'Rodriguez',
      email: 'elena.rod@example.com',
      phone: '08087654321',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgrRrkTAXnP4B5Ye7EZcoFvlDS7RtrVZf6dubyG-EyaZFxeSfgvjJUN4e36cV0t0qndrpsc2LJaJNAYIam2asYjcNIAB8vMEOTD5SbF_px_vsevDb3qNOy0yuPa4vwMzK26xkDPvmAaFFNRYfSTf99Vh_rXnDVFS1db8gsxhnCVbMoBZAxET2bSy8hth_T4g5MbQhGsibefMqMyuzfOEykrqm_nyX8xSbOsfvHuUqs5EWPxZIYlbWRprWu0Knkcx_JEVxMqtyuEfM',
    },
  },
  {
    id: 'h3',
    houseNumber: 'H-1102',
    street: '566 West Pine Blvd',
    propertyType: 'apartment',
    status: 'vacant',
    hasMaintenanceAlert: false,
    createdAt: '2026-03-20',
  },
  {
    id: 'h4',
    houseNumber: 'H-0455',
    street: '201 North High Street',
    propertyType: 'duplex',
    status: 'occupied',
    hasMaintenanceAlert: true,
    createdAt: '2026-04-05',
    resident: {
      firstName: 'Marcus',
      lastName: 'Chen',
      email: 'marcus.chen@example.com',
      phone: '08123456789',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQuizN9CXuKF8rR5Pd1o34BzMNy_H6iRM3KKggbTN5iHcLJ1XThEcSTg_Ed3zWHXK99IupbefUnpMZd1NXAAWv0LIQdwrTbsAHh7ZG8DXh2AC7uGie86CY8UOoshAkKNrj5s5Moaha3DyJMgX2FZm-mdzdROKseynoo-g8OnoB8DfL571zXnRQ-W1zjR1HGitpVZhU4BW8V-CnNMsLBHmctQce6KxAmiLIvOFJ3IFmMdh29gH0m2t5AYnNyLN572bDs12fNlDMKtU',
    },
  },
  {
    id: 'h5',
    houseNumber: 'H-0931',
    street: '11 Maple Drive',
    propertyType: 'condominium',
    status: 'occupied',
    hasMaintenanceAlert: false,
    createdAt: '2026-05-18',
    resident: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.j@example.com',
      phone: '08098765432',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo0ffSRQykhBflWda68mNfrzXwwokpKkEFQJCdG3KtzQjrtNZxJpfTqbqs5GOlzw8C8RC4inrs29ogvFBOIyiYNT7TII9hJB75pPxlCVEmKOuQin7n30_QpItBGHT2BXUwed0J_oAQ5WaOrAWc12C4ya6loHTkCQEydWLRBBG2Fa_SYtsPfQBnCpniHSLXeY4XTM49B8dRW6eSSvK3sxYTKOWbXRWJDgwuaaIbo8kldR1VeLAL1qjBnxebP-ix1wuuFakAeUhlycE',
    },
  },
  {
    id: 'h6',
    houseNumber: 'H-1042',
    street: '15 Jasmine Boulevard',
    propertyType: 'single_family',
    status: 'occupied',
    hasMaintenanceAlert: false,
    createdAt: '2026-05-20',
    resident: {
      firstName: 'Femi',
      lastName: 'Olayemi',
      email: 'femi.olayemi@example.com',
      phone: '08123344556',
    },
  },
  {
    id: 'h7',
    houseNumber: 'H-0309',
    street: '72 Sunset Avenue',
    propertyType: 'commercial',
    status: 'vacant',
    hasMaintenanceAlert: false,
    createdAt: '2026-06-01',
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

  if (tab) {
    if (tab === 'residential') {
      filtered = filtered.filter((h) => h.propertyType !== 'commercial')
    } else if (tab === 'commercial') {
      filtered = filtered.filter((h) => h.propertyType === 'commercial')
    } else if (tab === 'vacant') {
      filtered = filtered.filter((h) => h.status === 'vacant')
    }
  }

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      (h) =>
        h.houseNumber.toLowerCase().includes(kw) ||
        h.street.toLowerCase().includes(kw) ||
        (h.resident &&
          (`${h.resident.firstName} ${h.resident.lastName}`.toLowerCase().includes(kw) ||
            h.resident.email.toLowerCase().includes(kw) ||
            h.resident.phone.includes(kw))),
    )
  }

  const occupied = mockHouses.filter((h) => h.status === 'occupied').length
  const vacant = mockHouses.filter((h) => h.status === 'vacant').length
  const alerts = mockHouses.filter((h) => h.hasMaintenanceAlert).length

  // Match the HTML specifications:
  // Total inventory: 1248 (can be mocked for display/counting, but we scale with mockHouses count dynamically or keep static as requested)
  // Let's use the static metrics from the template but adjusted dynamically or hardcoded to make it match exactly!
  const summary: HouseSummary = {
    totalInventory: 1248 + (mockHouses.length - 7),
    occupiedCount: 1176 + (occupied - 5),
    vacantCount: 72 + (vacant - 2),
    maintenanceAlertCount: 14 + (alerts - 1),
    occupancyRate: 94.2,
  }

  return {
    houses: filtered,
    summary,
  }
}

export async function mockRegisterHouse(payload: RegisterHousePayload): Promise<House> {
  await delay(600)

  const newHouse: House = {
    id: `h${mockHouses.length + 1}`,
    houseNumber: payload.houseNumber,
    street: payload.street,
    propertyType: payload.propertyType,
    status: payload.resident ? 'occupied' : 'vacant',
    hasMaintenanceAlert: false,
    createdAt: new Date().toISOString().slice(0, 10),
    resident: payload.resident
      ? {
          firstName: payload.resident.firstName,
          lastName: payload.resident.lastName,
          email: payload.resident.email,
          phone: payload.resident.phone,
        }
      : undefined,
  }

  mockHouses.unshift(newHouse)
  return newHouse
}

export async function mockUpdateHouse(id: string, updates: Partial<House>): Promise<House> {
  await delay(500)
  const idx = mockHouses.findIndex((h) => h.id === id)
  if (idx === -1) {
    throw new Error('House not found')
  }

  mockHouses[idx] = {
    ...mockHouses[idx],
    ...updates,
  }
  return mockHouses[idx]
}
