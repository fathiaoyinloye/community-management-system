export type CommunityStatus = 'active' | 'pending_setup'

export interface Community {
  id: string
  name: string
  state: string
  lga: string
  adminName: string
  status: CommunityStatus
  housesCount: number
  createdAt: string
}

export interface CreateCommunityPayload {
  name: string
  state: string
  lga: string
  adminName: string
  adminEmail: string
  temporaryPassword: string
}

export type CommunityType =
  | 'gated_estate'
  | 'apartment_complex'
  | 'residential_association'
  | 'commercial_plaza'

export interface CommunityProfile {
  id: string
  name: string
  type: CommunityType
  address: string
  state: string
  lga: string
  phone: string
  email: string
  description: string
  logoUrl: string | null
  profileCompleteness: number
  isPublic: boolean
}
