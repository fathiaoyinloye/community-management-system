export type LevyFrequency = 'monthly' | 'yearly' | 'one_time'
export type LevyStatus = 'active' | 'inactive'

export interface LevyType {
  id: string
  name: string
  description: string
  icon: string
  amount: number
  frequency: LevyFrequency
  status: LevyStatus
}

export interface LevySummary {
  totalActiveLevies: number
  totalLevyTypes: number
  monthlyRevenueEstimate: number
  monthlyRevenueChangePct: number
  pendingUpdates: number
  lastProcessedLabel: string
}

export interface ScheduledAdjustment {
  id: string
  label: string
  effectiveLabel: string
}

export interface CreateLevyTypePayload {
  name: string
  description: string
  icon: string
  amount: number
  frequency: LevyFrequency
}

