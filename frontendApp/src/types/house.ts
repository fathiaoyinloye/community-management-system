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

export interface House {
  id: string
  houseNumber: string
  street: string
  propertyType: PropertyType
  status: OccupancyStatus
  hasMaintenanceAlert: boolean
  resident?: Resident
  createdAt: string
}

export interface RegisterHousePayload {
  houseNumber: string
  street: string
  propertyType: PropertyType
  resident?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export interface HouseSummary {
  totalInventory: number
  occupiedCount: number
  vacantCount: number
  maintenanceAlertCount: number
  occupancyRate: number
}
