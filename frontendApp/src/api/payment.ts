import type { Payment, PaymentSummary } from '../types/payment'
import {
  mockGetPayments,
  mockGetPaymentSummary,
  mockVerifyPayment,
  mockRejectPayment,
} from '../mocks/payment.mock'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://community-management-system-41c7.onrender.com'
const USE_MOCK = false

export async function getPayments(
  page: number,
  filter: 'all' | 'pending' | 'verified' | 'rejected',
  keyword: string,
): Promise<{ payments: Payment[]; total: number }> {
  if (USE_MOCK) {
    return mockGetPayments(page, filter, keyword)
  }

  const params = new URLSearchParams({
    page: String(page),
    status: filter,
    keyword,
  })
  const response = await fetch(`${API_BASE_URL}/api/v1/payments?${params}`)

  if (!response.ok) {
    throw new Error('Unable to load payments.')
  }

  return response.json() as Promise<{ payments: Payment[]; total: number }>
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
  if (USE_MOCK) {
    return mockGetPaymentSummary()
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/summary`)

  if (!response.ok) {
    throw new Error('Unable to load payment summary.')
  }

  return response.json() as Promise<PaymentSummary>
}

export async function verifyPayment(id: string): Promise<Payment> {
  if (USE_MOCK) {
    return mockVerifyPayment(id)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/${id}/verify`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Unable to verify payment.')
  }

  return response.json() as Promise<Payment>
}

export async function rejectPayment(id: string): Promise<Payment> {
  if (USE_MOCK) {
    return mockRejectPayment(id)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/${id}/reject`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Unable to reject payment.')
  }

  return response.json() as Promise<Payment>
}

export async function uploadPaymentProof(payload: {
  houseLevyId: string
  amount: number
  paymentReference: string
  proofOfPaymentUrl: string
}): Promise<{ message: string }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { message: 'Proof of payment uploaded successfully.' }
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Unable to upload payment proof.')
  }

  return response.json() as Promise<{ message: string }>
}
