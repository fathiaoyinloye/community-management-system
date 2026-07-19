// ── Swagger: RegisterHouseRequest ────────────────────────────────────────────
export interface RegisterHousePayload {
  houseNumber: string
  street: string
}

// ── Swagger: HouseResponse ────────────────────────────────────────────────────
export interface House {
  id: string
  communityId: string
  residentId: string | null
  houseNumber: string
  street: string
  createdAt: string
  // UI-only extras (not from backend, kept for display purposes)
  propertyType?: PropertyType
  status?: OccupancyStatus
  hasMaintenanceAlert?: boolean
  resident?: Resident
}

// ── Swagger: AssignResidentRequest ────────────────────────────────────────────
export interface AssignResidentPayload {
  firstName: string
  lastName: string
  phone: string
  email: string
}

// ── UI-only types ─────────────────────────────────────────────────────────────
export interface Resident {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatarUrl?: string
}

export type OccupancyStatus = 'occupied' | 'vacant'

export type PropertyType =
  | 'single_family'
  | 'townhouse'
  | 'apartment'
  | 'duplex'
  | 'condominium'
  | 'commercial'

export interface HouseSummary {
  totalInventory: number
  occupiedCount: number
  vacantCount: number
  maintenanceAlertCount: number
  occupancyRate: number
}
