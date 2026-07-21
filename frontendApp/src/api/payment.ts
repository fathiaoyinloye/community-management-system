import type {
  Payment,
  PaymentSummary,
  UploadPaymentPayload,
  RejectPaymentPayload,
  ReceiptResponse,
} from '../types/payment'
import {
  mockGetPayments,
  mockGetPaymentSummary,
  mockVerifyPayment,
  mockRejectPayment,
  mockUploadPayment,
} from '../mocks/payment.mock'
import { apiUrl, GLOBAL_USE_MOCK } from './config'

// POST /payments — implemented
const USE_MOCK_UPLOAD = GLOBAL_USE_MOCK
// POST /payments/{id}/verify and /reject — implemented
const USE_MOCK_ACTIONS = GLOBAL_USE_MOCK

/** Resident: upload proof of payment — POST /api/v1/payments */
export async function uploadPayment(payload: UploadPaymentPayload): Promise<{ message: string }> {
  if (USE_MOCK_UPLOAD) return mockUploadPayment(payload)

  const response = await fetch(apiUrl('/payments'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to upload payment proof.')
  }

  return { message: 'Proof of payment uploaded successfully.' }
}

/** Community staff: verify a payment — POST /api/v1/payments/{id}/verify */
export async function verifyPayment(id: string): Promise<ReceiptResponse> {
  if (USE_MOCK_ACTIONS) {
    await mockVerifyPayment(id)
    return {} as ReceiptResponse
  }

  const response = await fetch(apiUrl(`/payments/${id}/verify`), {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to verify payment.')
  }

  return response.json() as Promise<ReceiptResponse>
}

/** Community staff: reject a payment — POST /api/v1/payments/{id}/reject */
export async function rejectPayment(id: string, remarks = ''): Promise<Payment> {
  if (USE_MOCK_ACTIONS) return mockRejectPayment(id)

  const payload: RejectPaymentPayload = { remarks }

  const response = await fetch(apiUrl(`/payments/${id}/reject`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to reject payment.')
  }

  return response.json() as Promise<Payment>
}

/** Resident or staff: download receipt — GET /api/v1/payments/{id}/receipt */
export async function getReceipt(paymentId: string): Promise<ReceiptResponse> {
  const response = await fetch(apiUrl(`/payments/${paymentId}/receipt`), {
    credentials: 'include',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to fetch receipt.')
  }

  return response.json() as Promise<ReceiptResponse>
}

// ── UI-only helpers (mocked — no backend list endpoint yet) ───────────────────

export async function getPayments(
  page: number,
  filter: 'all' | 'pending' | 'verified' | 'rejected',
  keyword: string,
): Promise<{ payments: Payment[]; total: number }> {
  return mockGetPayments(page, filter, keyword)
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
  return mockGetPaymentSummary()
}
