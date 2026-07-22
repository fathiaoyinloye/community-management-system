import type {
  Payment,
  PaymentSummary,
  UploadPaymentPayload,
  ReceiptResponse,
} from '../types/payment'
import type { House } from '../types/house'
import { apiUrl } from './config'

const ITEMS_PER_PAGE = 3

/** Resident: upload proof of payment — stored in localStorage since there is no payment backend endpoint */
export async function uploadPayment(payload: UploadPaymentPayload): Promise<{ message: string }> {
  // 1. Get logged-in user profile
  const userStr = localStorage.getItem('ct_auth_user')
  const user = userStr ? JSON.parse(userStr) : null

  // 2. Fetch houses to identify the resident's house
  let houseNumber = 'Unknown'
  let street = 'Unknown'
  try {
    const res = await fetch(apiUrl('/houses'), { credentials: 'include' })
    if (res.ok && user) {
      const houses = await res.json() as House[]
      const myHouse = houses.find(h => h.residentId === user.id)
      if (myHouse) {
        houseNumber = myHouse.houseNumber
        street = myHouse.street
      }
    }
  } catch (err) {
    console.error('Failed to resolve resident house for payment:', err)
  }

  // 3. Resolve levy name from localStorage
  let levyType = 'Custom Levy'
  try {
    const leviesStr = localStorage.getItem('ct_levies')
    if (leviesStr) {
      const levies = JSON.parse(leviesStr)
      const levy = levies.find((l: any) => l.id === payload.levyId)
      if (levy) {
        levyType = levy.name
      }
    }
  } catch (err) {
    console.error('Failed to resolve levy name for payment:', err)
  }

  // 4. Create payment entry
  const payment: Payment = {
    id: `pay-${Date.now()}`,
    residentName: user ? `${user.firstName} ${user.lastName}` : 'Resident',
    residentEmail: user ? `${user.username}@communaltrust.app` : 'resident@communaltrust.app',
    houseNumber,
    street,
    reference: payload.reference,
    proofUrl: payload.proofUrl || '#',
    amount: payload.amount,
    levyType,
    submittedAtLabel: 'Just now',
    status: 'pending',
    remarks: null,
  }

  // 5. Save to localStorage
  const storedPaymentsStr = localStorage.getItem('ct_payments')
  const paymentsList: Payment[] = storedPaymentsStr ? JSON.parse(storedPaymentsStr) : []
  paymentsList.unshift(payment)
  localStorage.setItem('ct_payments', JSON.stringify(paymentsList))

  return { message: 'Proof of payment uploaded successfully.' }
}

/** Community staff: verify a payment — stored in localStorage */
export async function verifyPayment(id: string): Promise<ReceiptResponse> {
  const stored = localStorage.getItem('ct_payments')
  const paymentsList: Payment[] = stored ? JSON.parse(stored) : []
  const idx = paymentsList.findIndex(p => p.id === id)
  if (idx === -1) throw new Error('Payment not found.')

  paymentsList[idx].status = 'verified'
  localStorage.setItem('ct_payments', JSON.stringify(paymentsList))

  return {
    id: `rec-${id}`,
    receiptNumber: `REC-${id.split('-')[1] || Date.now()}`,
    communityName: 'CommunalTrust',
    houseNumber: paymentsList[idx].houseNumber,
    residentName: paymentsList[idx].residentName,
    levyName: paymentsList[idx].levyType,
    amount: paymentsList[idx].amount,
    datePaid: new Date().toISOString().slice(0, 10),
  }
}

/** Community staff: reject a payment — stored in localStorage */
export async function rejectPayment(id: string, remarks = ''): Promise<Payment> {
  const stored = localStorage.getItem('ct_payments')
  const paymentsList: Payment[] = stored ? JSON.parse(stored) : []
  const idx = paymentsList.findIndex(p => p.id === id)
  if (idx === -1) throw new Error('Payment not found.')

  paymentsList[idx].status = 'rejected'
  paymentsList[idx].remarks = remarks
  localStorage.setItem('ct_payments', JSON.stringify(paymentsList))

  return paymentsList[idx]
}

/** Resident or staff: download receipt */
export async function getReceipt(paymentId: string): Promise<ReceiptResponse> {
  const stored = localStorage.getItem('ct_payments')
  const paymentsList: Payment[] = stored ? JSON.parse(stored) : []
  const payment = paymentsList.find(p => p.id === paymentId)

  if (!payment) {
    throw new Error('Payment not found.')
  }

  return {
    id: `rec-${payment.id}`,
    receiptNumber: `REC-${payment.id.split('-')[1] || Date.now()}`,
    communityName: 'CommunalTrust',
    houseNumber: payment.houseNumber,
    residentName: payment.residentName,
    levyName: payment.levyType,
    amount: payment.amount,
    datePaid: new Date().toISOString().slice(0, 10),
  }
}

export async function getPayments(
  page: number,
  filter: 'all' | 'pending' | 'verified' | 'rejected',
  keyword: string,
): Promise<{ payments: Payment[]; total: number }> {
  const stored = localStorage.getItem('ct_payments')
  const paymentsList: Payment[] = stored ? JSON.parse(stored) : []

  const filtered = paymentsList.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter
    const kw = keyword.toLowerCase()
    const matchesKeyword =
      !kw ||
      p.residentName.toLowerCase().includes(kw) ||
      p.houseNumber.toLowerCase().includes(kw) ||
      p.reference.toLowerCase().includes(kw)
    return matchesFilter && matchesKeyword
  })

  const total = filtered.length
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  return { payments: paged, total }
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
  const stored = localStorage.getItem('ct_payments')
  const paymentsList: Payment[] = stored ? JSON.parse(stored) : []

  const pending = paymentsList.filter((p) => p.status === 'pending')
  const verified = paymentsList.filter((p) => p.status === 'verified').length
  const total = paymentsList.length

  return {
    totalPending: pending.length,
    pendingValue: pending.reduce((acc, p) => acc + p.amount, 0),
    verificationRate: total === 0 ? 0 : Math.round((verified / total) * 1000) / 10,
    autoMatchedCount: 0,
    disputedCount: 0,
  }
}
