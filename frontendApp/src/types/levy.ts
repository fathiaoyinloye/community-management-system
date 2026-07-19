// ── Swagger: CreateLevyRequest ────────────────────────────────────────────────
export interface CreateLevyTypePayload {
  name: string
  amount: number
  frequency: LevyFrequency
}

// ── Swagger: LevyTypeResponse ─────────────────────────────────────────────────
export interface LevyType {
  id: string
  name: string
  amount: number
  frequency: LevyFrequency
  housesBilled: number
  // UI-only extras
  description?: string
  icon?: string
  status?: LevyStatus
}

// ── Swagger: HouseLevyResponse (GET /api/v1/levies/my-balance) ────────────────
export interface HouseLevy {
  id: string
  levyName: string
  amount: number
  balance: number
  dueDate: string
  status: HouseLevyStatus
}

export type LevyFrequency = 'monthly' | 'yearly' | 'one_time'
export type LevyStatus = 'active' | 'inactive'
export type HouseLevyStatus = 'paid' | 'unpaid' | 'overdue' | 'partial'

// ── UI-only summary types ─────────────────────────────────────────────────────
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
