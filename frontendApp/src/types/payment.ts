export type PaymentStatus = 'pending' | 'verified' | 'rejected'

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
}

export interface PaymentSummary {
  totalPending: number
  pendingValue: number
  verificationRate: number
  autoMatchedCount: number
  disputedCount: number
}
