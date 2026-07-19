import type { Payment, PaymentSummary, UploadPaymentPayload, RejectPaymentPayload } from '../types/payment'
import {
  mockGetPayments,
  mockGetPaymentSummary,
  mockVerifyPayment,
  mockRejectPayment,
  mockUploadPayment,
} from '../mocks/payment.mock'
import { apiUrl } from './config'

const USE_MOCK = true

/** Resident: upload proof of payment — POST /api/v1/payments */
export async function uploadPayment(payload: UploadPaymentPayload): Promise<{ message: string }> {
  if (USE_MOCK) return mockUploadPayment(payload)

  const response = await fetch(apiUrl('/api/v1/payments'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to upload payment proof.')
  }

  return response.json() as Promise<{ message: string }>
}

/** Community admin: reject a payment — includes remarks */
export async function rejectPaymentWithRemarks(
  id: string,
  payload: RejectPaymentPayload,
): Promise<Payment> {
  if (USE_MOCK) return mockRejectPayment(id)

  const response = await fetch(apiUrl(`/api/v1/payments/${id}/reject`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Unable to reject payment.')
  return response.json() as Promise<Payment>
}

// ── UI-only helpers (no direct swagger endpoint, but needed by admin UI) ──────

export async function getPayments(
  page: number,
  filter: 'all' | 'pending' | 'verified' | 'rejected',
  keyword: string,
): Promise<{ payments: Payment[]; total: number }> {
  if (USE_MOCK) return mockGetPayments(page, filter, keyword)
  throw new Error('getPayments: use uploadPayment and direct PaymentResponse queries instead.')
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
  if (USE_MOCK) return mockGetPaymentSummary()
  throw new Error('getPaymentSummary: no backend endpoint available.')
}

export async function verifyPayment(id: string): Promise<Payment> {
  if (USE_MOCK) return mockVerifyPayment(id)
  throw new Error('verifyPayment: no backend endpoint available — check swagger for verify endpoint.')
}

export async function rejectPayment(id: string): Promise<Payment> {
  if (USE_MOCK) return mockRejectPayment(id)
  return rejectPaymentWithRemarks(id, { remarks: '' })
}
