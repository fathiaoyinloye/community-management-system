import type { CreateLevyTypePayload, HouseLevy, LevySummary, LevyType, ScheduledAdjustment } from '../types/levy'

let levyTypes: LevyType[] = [
  {
    id: 'lv1',
    name: 'Security & Patrols',
    amount: 150,
    frequency: 'monthly',
    housesBilled: 48,
    description: 'Residential security guard services',
    icon: 'security',
    status: 'active',
  },
  {
    id: 'lv2',
    name: 'Waste Management',
    amount: 45,
    frequency: 'monthly',
    housesBilled: 48,
    description: 'Weekly collection and recycling',
    icon: 'delete_sweep',
    status: 'active',
  },
]

const houseLevies: HouseLevy[] = [
  {
    id: 'hl1',
    levyName: 'Security & Patrols',
    amount: 150,
    balance: 150,
    dueDate: '2026-08-01',
    status: 'unpaid',
  },
  {
    id: 'hl2',
    levyName: 'Waste Management',
    amount: 45,
    balance: 45,
    dueDate: '2026-08-01',
    status: 'unpaid',
  },
]

const summary: LevySummary = {
  totalActiveLevies: 2,
  totalLevyTypes: 2,
  monthlyRevenueEstimate: 42500,
  monthlyRevenueChangePct: 4.2,
  pendingUpdates: 3,
  lastProcessedLabel: '24 Oct',
}

const scheduledAdjustments: ScheduledAdjustment[] = [
  { id: 'sa1', label: 'Waste Management Increase (5%)', effectiveLabel: 'Starts Jan 1, 2027' },
  { id: 'sa2', label: 'Security Surcharge Expiry', effectiveLabel: 'Dec 31, 2026' },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockGetLevyTypes(): Promise<LevyType[]> {
  await delay(600)
  return levyTypes
}

export async function mockGetHouseLevies(): Promise<HouseLevy[]> {
  await delay(400)
  return houseLevies
}

export async function mockGetLevySummary(): Promise<LevySummary> {
  await delay(400)
  const activeCount = levyTypes.filter((l) => l.status === 'active').length
  return { ...summary, totalLevyTypes: levyTypes.length, totalActiveLevies: activeCount }
}

export async function mockGetScheduledAdjustments(): Promise<ScheduledAdjustment[]> {
  await delay(400)
  return scheduledAdjustments
}

export async function mockUpdateLevyStatus(id: string, status: LevyType['status']): Promise<LevyType> {
  await delay(500)
  const levy = levyTypes.find((l) => l.id === id)
  if (!levy) throw new Error('Levy type not found.')
  levy.status = status
  return levy
}

export async function mockCreateLevyType(payload: CreateLevyTypePayload): Promise<LevyType> {
  await delay(600)
  const newLevy: LevyType = {
    id: `lv${levyTypes.length + 1}`,
    name: payload.name,
    amount: payload.amount,
    frequency: payload.frequency,
    housesBilled: 0,
    icon: 'receipt_long',
    status: 'active',
  }
  levyTypes.push(newLevy)
  return newLevy
}
