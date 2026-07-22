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
  email?: string
}

// ── Swagger: InviteStaffRequest ───────────────────────────────────────────────
export interface InviteStaffPayload {
  firstName: string
  lastName: string
  phone: string
  email: string
}


