import type { LevySummary, LevyType, ScheduledAdjustment } from '../types/levy'

let levyTypes: LevyType[] = [
  {
    id: 'lv1',
    name: 'Security & Patrols',
    description: 'Residential security guard services',
    icon: 'security',
    amount: 150,
    frequency: 'monthly',
    status: 'active',
  },
  {
    id: 'lv2',
    name: 'Waste Management',
    description: 'Weekly collection and recycling',
    icon: 'delete_sweep',
    amount: 45,
    frequency: 'monthly',
    status: 'active',
  },
  {
    id: 'lv3',
    name: 'Road Maintenance',
    description: 'Annual resurfacing and repairs',
    icon: 'construction',
    amount: 1200,
    frequency: 'yearly',
    status: 'active',
  },
  {
    id: 'lv4',
    name: 'Clubhouse Renovation',
    description: 'Special project completion',
    icon: 'forest',
    amount: 300,
    frequency: 'one_time',
    status: 'inactive',
  },
]

const summary: LevySummary = {
  totalActiveLevies: 12,
  totalLevyTypes: 12,
  monthlyRevenueEstimate: 42500,
  monthlyRevenueChangePct: 4.2,
  pendingUpdates: 3,
  lastProcessedLabel: '24 Oct',
}

const scheduledAdjustments: ScheduledAdjustment[] = [
  {
    id: 'sa1',
    label: 'Waste Management Increase (5%)',
    effectiveLabel: 'Starts Jan 1, 2027',
  },
  {
    id: 'sa2',
    label: 'Security Surcharge Expiry',
    effectiveLabel: 'Dec 31, 2026',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockGetLevyTypes(): Promise<LevyType[]> {
  await delay(600)
  return levyTypes
}

export async function mockGetLevySummary(): Promise<LevySummary> {
  await delay(400)
  return summary
}

export async function mockGetScheduledAdjustments(): Promise<ScheduledAdjustment[]> {
  await delay(400)
  return scheduledAdjustments
}

export async function mockUpdateLevyStatus(id: string, status: LevyType['status']): Promise<LevyType> {
  await delay(500)
  const levy = levyTypes.find((entry) => entry.id === id)
  if (!levy) {
    throw new Error('Levy type not found.')
  }
  levy.status = status
  levyTypes = levyTypes.map((entry) => (entry.id === id ? levy : entry))
  return levy
}
