import type { Payment, PaymentSummary } from '../types/payment'

let payments: Payment[] = [
  {
    id: 'pay1',
    residentName: 'Alex Mercer',
    residentEmail: 'alex.m@example.com',
    houseNumber: 'B-124',
    street: 'Pinecrest Estates',
    reference: 'TXN_99210_PROOF.pdf',
    proofUrl: '#',
    amount: 1250,
    levyType: 'Annual Levy',
    submittedAtLabel: '2 hours ago',
    status: 'pending',
  },
  {
    id: 'pay2',
    residentName: 'Sarah Lopez',
    residentEmail: 'sarah.lopez@cloud.net',
    houseNumber: 'A-042',
    street: 'Sunset Ridge',
    reference: 'RECEIPT_IMG_002.jpg',
    proofUrl: '#',
    amount: 450,
    levyType: 'Maintenance',
    submittedAtLabel: '5 hours ago',
    status: 'pending',
  },
  {
    id: 'pay3',
    residentName: 'Jameson Dunn',
    residentEmail: 'jdunn_admin@domain.com',
    houseNumber: 'C-509',
    street: 'Highland View',
    reference: 'TRANSFER_CONFIRM_99.pdf',
    proofUrl: '#',
    amount: 3000,
    levyType: 'Security Fund',
    submittedAtLabel: 'Yesterday, 4:45 PM',
    status: 'pending',
  },
  {
    id: 'pay4',
    residentName: 'Miriam Okafor',
    residentEmail: 'm.okafor@mail.com',
    houseNumber: 'D-011',
    street: 'Greenfields Close',
    reference: 'PROOF_MOK_88.pdf',
    proofUrl: '#',
    amount: 750,
    levyType: 'Maintenance',
    submittedAtLabel: 'Yesterday, 10:20 AM',
    status: 'pending',
  },
  {
    id: 'pay5',
    residentName: 'Tunde Afolabi',
    residentEmail: 't.afolabi@homes.ng',
    houseNumber: 'E-203',
    street: 'Maple Court',
    reference: 'LEVY_TAF_2026.pdf',
    proofUrl: '#',
    amount: 2200,
    levyType: 'Annual Levy',
    submittedAtLabel: '2 days ago',
    status: 'pending',
  },
  {
    id: 'pay6',
    residentName: 'Chioma Eze',
    residentEmail: 'chioma.eze@corp.io',
    houseNumber: 'F-007',
    street: 'Birchwood Lane',
    reference: 'RECEIPT_CEZ_001.jpg',
    proofUrl: '#',
    amount: 150,
    levyType: 'Security & Patrols',
    submittedAtLabel: '2 days ago',
    status: 'pending',
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

  let filtered = payments.filter((p) => {
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
  const start = (page - 1) * ITEMS_PER_PAGE
  const paged = filtered.slice(start, start + ITEMS_PER_PAGE)

  return { payments: paged, total }
}

export async function mockGetPaymentSummary(): Promise<PaymentSummary> {
  await delay(300)
  const pending = payments.filter((p) => p.status === 'pending')
  const pendingValue = pending.reduce((acc, p) => acc + p.amount, 0)
  const verified = payments.filter((p) => p.status === 'verified').length
  const total = payments.length
  const verificationRate = total === 0 ? 0 : Math.round((verified / total) * 1000) / 10

  return {
    totalPending: pending.length,
    pendingValue,
    verificationRate,
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
