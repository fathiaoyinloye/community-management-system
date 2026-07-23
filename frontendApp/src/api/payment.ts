import type {
  Payment,
  PaymentSummary,
  UploadPaymentPayload,
  ReceiptResponse,
  PaymentResponse,
  PaymentStatus,
} from '../types/payment'
import { apiUrl } from './config'
import { getHouses } from './house'
import { getLevyTypes } from './levy'
import { getCommunities } from './community'

/** Resident: upload proof of payment — POST /api/v1/payments */
export async function uploadPayment(payload: UploadPaymentPayload): Promise<{ message: string }> {
  const response = await fetch(apiUrl('/payments'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      houseLevyId: payload.houseLevyId,
      amount: payload.amount,
      paymentReference: payload.paymentReference,
      proofOfPaymentUrl: payload.proofOfPaymentUrl || 'https://communaltrust.s3.amazonaws.com/receipts/proof.pdf',
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message ?? 'Unable to upload proof of payment.')
  }

  return { message: 'Proof of payment uploaded successfully.' }
}

/** Community staff: verify a payment — PUT /api/v1/payments/{id}/verify */
export async function verifyPayment(id: string): Promise<ReceiptResponse> {
  const response = await fetch(apiUrl(`/payments/${id}/verify`), {
    method: 'PUT',
    credentials: 'include',
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message ?? 'Unable to verify payment.')
  }

  return response.json() as Promise<ReceiptResponse>
}

/** Community staff: reject a payment — PUT /api/v1/payments/{id}/reject */
export async function rejectPayment(id: string, remarks = ''): Promise<PaymentResponse> {
  const response = await fetch(apiUrl(`/payments/${id}/reject`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ remarks }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message ?? 'Unable to reject payment.')
  }

  return response.json() as Promise<PaymentResponse>
}

/** Resident: download receipt — GET /api/v1/resident/payments/{paymentId}/receipt */
export async function getReceipt(paymentId: string): Promise<ReceiptResponse> {
  const response = await fetch(apiUrl(`/resident/payments/${paymentId}/receipt`), {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Unable to load receipt.')
  }

  return response.json() as Promise<ReceiptResponse>
}

/** Helper: Get all raw payments from the backend */
export async function getAllPayments(): Promise<PaymentResponse[]> {
  const response = await fetch(apiUrl('/payments'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load payments.')
  const data = await response.json()
  if (Array.isArray(data)) return data as PaymentResponse[]
  if (data && Array.isArray(data.content)) return data.content as PaymentResponse[]
  return []
}

/** Helper: Get resident payments from the backend */
export async function getResidentPayments(): Promise<PaymentResponse[]> {
  const response = await fetch(apiUrl('/resident/payments'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load resident payments.')
  const data = await response.json()
  if (Array.isArray(data)) return data as PaymentResponse[]
  if (data && Array.isArray(data.content)) return data.content as PaymentResponse[]
  return []
}

/** Community staff: get page of enriched payments */
export async function getPayments(
  page: number,
  filter: 'all' | 'pending' | 'verified' | 'rejected',
  keyword: string,
): Promise<{ payments: Payment[]; total: number }> {
  // 1. Fetch backend raw data in parallel
  const [housesResult, levyTypes, leviesList, paymentsRaw] = await Promise.all([
    getHouses(),
    getLevyTypes(),
    fetch(apiUrl('/levies'), { credentials: 'include' }).then(r => r.ok ? r.json() : []),
    getAllPayments(),
  ])

  const houses = housesResult.houses
  const houseLevies = Array.isArray(leviesList) ? leviesList : (leviesList.content || [])

  // 2. Build lookup maps
  const housesMap = new Map(houses.map(h => [h.id, h]))
  const levyTypesMap = new Map(levyTypes.map(l => [l.id, l]))
  const houseLeviesMap = new Map(houseLevies.map((hl: any) => [hl.id, hl]))

  // 3. Map raw payments to UI-enriched Payments
  const enrichedPayments: Payment[] = paymentsRaw.map((p) => {
    const houseLevy = houseLeviesMap.get(p.houseLevyId)
    const house = houseLevy ? housesMap.get(houseLevy.houseId) : null
    const levyType = houseLevy ? levyTypesMap.get(houseLevy.levyTypeId) : null

    const residentName = house?.resident
      ? `${house.resident.firstName} ${house.resident.lastName}`
      : 'Resident'
    const residentEmail = house?.resident?.email || 'resident@communaltrust.app'
    const houseNumber = house?.houseNumber || 'Unknown'
    const street = house?.street || 'Unknown'
    const levyTypeName = levyType?.name || 'Custom Levy'

    // Status normalization
    let status: PaymentStatus = 'pending'
    const s = (p.status || '').toLowerCase()
    if (s === 'verified' || s === 'success') status = 'verified'
    else if (s === 'rejected' || s === 'failed') status = 'rejected'

    return {
      id: p.id,
      residentName,
      residentEmail,
      houseNumber,
      street,
      reference: p.paymentReference,
      proofUrl: '#',
      amount: p.amount,
      levyType: levyTypeName,
      submittedAtLabel: p.paymentDate ? p.paymentDate.slice(0, 10) : 'Recently',
      status,
      remarks: p.remarks,
    }
  })

  // 4. Apply filter and search keyword
  const filtered = enrichedPayments.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter
    const kw = keyword.toLowerCase()
    const matchesKeyword =
      !kw ||
      p.residentName.toLowerCase().includes(kw) ||
      p.houseNumber.toLowerCase().includes(kw) ||
      p.reference.toLowerCase().includes(kw)
    return matchesFilter && matchesKeyword
  })

  const ITEMS_PER_PAGE = 3
  const total = filtered.length
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  return { payments: paged, total }
}

/** Get payments summary dynamically */
export async function getPaymentSummary(): Promise<PaymentSummary> {
  const paymentsList = await getAllPayments()

  const pending = paymentsList.filter((p) => p.status === 'PENDING_REVIEW' || p.status === 'pending')
  const verified = paymentsList.filter((p) => p.status === 'VERIFIED' || p.status === 'verified').length
  const total = paymentsList.length

  return {
    totalPending: pending.length,
    pendingValue: pending.reduce((acc, p) => acc + p.amount, 0),
    verificationRate: total === 0 ? 0 : Math.round((verified / total) * 1000) / 10,
    autoMatchedCount: 0,
    disputedCount: 0,
  }
}

/** Helper: Get the community ID associated with the logged-in administrator/staff */
export async function getCurrentCommunityId(): Promise<string> {
  try {
    const communities = await getCommunities()
    if (communities && communities.length > 0) {
      return communities[0].id
    }
  } catch (e) {
    console.warn("Failed to get community from /communities", e)
  }

  try {
    const { houses } = await getHouses()
    if (houses && houses.length > 0) {
      return houses[0].communityId
    }
  } catch (e) {
    console.warn("Failed to get community from /houses", e)
  }

  return 'default-community-id'
}
