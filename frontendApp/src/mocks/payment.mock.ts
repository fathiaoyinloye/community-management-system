import type { Payment, PaymentSummary, UploadPaymentPayload } from '../types/payment'

let payments: Payment[] = [
  {
    id: 'pay1',
    residentName: 'Dotun Ola',
    residentEmail: 'dotunx123@gmail.com',
    houseNumber: 'B-124',
    street: 'Pinecrest Estates',
    reference: 'TXN_99210_PROOF.pdf',
    proofUrl: '#',
    amount: 1250,
    levyType: 'Annual Levy',
    submittedAtLabel: '2 hours ago',
    status: 'pending',
    remarks: null,
  },
  {
    id: 'pay6',
    residentName: 'Martins Olatunbosun',
    residentEmail: 'martins@gmail.com',
    houseNumber: 'F-007',
    street: 'Birchwood Lane',
    reference: 'RECEIPT_CEZ_001.jpg',
    proofUrl: '#',
    amount: 150,
    levyType: 'Security & Patrols',
    submittedAtLabel: '2 days ago',
    status: 'pending',
    remarks: null,
  },
]

const ITEMS_PER_PAGE = 3

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockGetPayments(
  page: number,
  filter: 'all' | 'pending' | 'verified' | 'rejected',
  keyword: string,
): Promise<{ payments: Payment[]; total: number }> {
  await delay(500)

  const filtered = payments.filter((p) => {
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

export async function mockGetPaymentSummary(): Promise<PaymentSummary> {
  await delay(300)
  const pending = payments.filter((p) => p.status === 'pending')
  const verified = payments.filter((p) => p.status === 'verified').length
  const total = payments.length
  return {
    totalPending: pending.length,
    pendingValue: pending.reduce((acc, p) => acc + p.amount, 0),
    verificationRate: total === 0 ? 0 : Math.round((verified / total) * 1000) / 10,
    autoMatchedCount: 82,
    disputedCount: 4,
  }
}

export async function mockVerifyPayment(id: string): Promise<Payment> {
  await delay(600)
  const payment = payments.find((p) => p.id === id)
  if (!payment) throw new Error('Payment not found.')
  payment.status = 'verified'
  return payment
}

export async function mockRejectPayment(id: string): Promise<Payment> {
  await delay(600)
  const payment = payments.find((p) => p.id === id)
  if (!payment) throw new Error('Payment not found.')
  payment.status = 'rejected'
  return payment
}

export async function mockUploadPayment(
  _payload: UploadPaymentPayload,
): Promise<{ message: string }> {
  await delay(1000)
  return { message: 'Proof of payment uploaded successfully.' }
}
