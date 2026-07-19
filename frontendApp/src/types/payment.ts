// ── Swagger: UploadPaymentRequest (POST /api/v1/payments) ────────────────────
export interface UploadPaymentPayload {
  houseLevyId: string
  amount: number
  paymentReference: string
  proofOfPaymentUrl: string
}

// ── Swagger: PaymentResponse ──────────────────────────────────────────────────
export interface PaymentResponse {
  id: string
  houseLevyId: string
  amount: number
  paymentReference: string
  status: PaymentStatus
  remarks: string | null
  paymentDate: string
  verifiedDate: string | null
}

// ── Swagger: ReceiptResponse ──────────────────────────────────────────────────
export interface ReceiptResponse {
  id: string
  receiptNumber: string
  communityName: string
  houseNumber: string
  residentName: string
  levyName: string
  amount: number
  datePaid: string
}

// ── Swagger: RejectPaymentRequest ────────────────────────────────────────────
export interface RejectPaymentPayload {
  remarks: string
}

export type PaymentStatus = 'pending' | 'verified' | 'rejected'

// ── UI-only type: enriched payment row for community admin table ──────────────
export interface Payment {
  id: string
  residentName: string
  residentEmail: string
  houseNumber: string
  street: string
  reference: string
  proofUrl: string
  amount: number
  levyType: string
  submittedAtLabel: string
  status: PaymentStatus
  remarks?: string | null
}

// ── UI-only summary ───────────────────────────────────────────────────────────
export interface PaymentSummary {
  totalPending: number
  pendingValue: number
  verificationRate: number
  autoMatchedCount: number
  disputedCount: number
}
