// ── Swagger: CreateCommunityRequest ──────────────────────────────────────────
export interface CreateCommunityPayload {
  name: string
  type: string
  address: string
  lga: string
  state: string
  phone: string
  email: string
  description: string
}

// ── Swagger: CommunityResponse ────────────────────────────────────────────────
export interface Community {
  id: string
  name: string
  type: string
  address: string
  lga: string
  state: string
  phone: string
  email: string
  description: string
  createdAt: string
  // UI-only extras (populated from local context or separate calls)
  adminName?: string
  housesCount?: number
  status?: 'active' | 'pending_setup'
}

// ── Swagger: AssignCommunityAdminRequest ──────────────────────────────────────
export interface AssignCommunityAdminPayload {
  firstName: string
  lastName: string
  phone: string
  email: string
}

// ── Swagger: InviteStaffRequest ───────────────────────────────────────────────
export interface InviteStaffPayload {
  firstName: string
  lastName: string
  phone: string
  email: string
}

// ── CommunityProfile: used by CommunityInfo page ─────────────────────────────
// Maps to CommunityResponse fields + local UI state
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
