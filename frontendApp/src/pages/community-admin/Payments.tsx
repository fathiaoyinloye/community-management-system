import { useEffect, useRef, useState } from 'react'
import CommunityAdminLayout from '../../layouts/CommunityAdminLayout'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { getPayments, getPaymentSummary, rejectPayment, verifyPayment } from '../../api/payment'
import type { Payment, PaymentStatus, PaymentSummary } from '../../types/payment'

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return value.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  })
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  { bg: '#dae2fd', color: '#131b2e' },
  { bg: '#71f8e4', color: '#00201c' },
  { bg: '#e1e0ff', color: '#07006c' },
  { bg: '#ffdad6', color: '#93000a' },
  { bg: '#d4f1c6', color: '#1a4a0a' },
  { bg: '#fde8b0', color: '#5c3a00' },
]

function avatarColors(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

const LEVY_TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  'Annual Levy': { bg: 'rgba(113,248,228,0.18)', color: '#005048' },
  Maintenance: { bg: 'rgba(192,193,255,0.25)', color: '#2f2ebe' },
  'Security Fund': { bg: 'rgba(218,226,253,0.5)', color: '#3f465c' },
  'Security & Patrols': { bg: 'rgba(218,226,253,0.5)', color: '#3f465c' },
}

function levyBadgeStyle(levyType: string) {
  return LEVY_TYPE_STYLE[levyType] ?? { bg: '#eceef0', color: '#45464d' }
}

function isImageProof(reference: string) {
  return /\.(jpg|jpeg|png|webp)$/i.test(reference)
}

const ITEMS_PER_PAGE = 3
const FILTER_TABS: { label: string; value: 'all' | PaymentStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Verified', value: 'verified' },
  { label: 'Rejected', value: 'rejected' },
]

// ─── sub-components ──────────────────────────────────────────────────────────

interface ToastProps {
  message: string | null
  type: 'success' | 'error'
}

function Toast({ message, type }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-lg)',
        right: 'var(--space-lg)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        background: type === 'success' ? '#1e293b' : '#7f1d1d',
        color: '#ffffff',
        padding: '14px var(--space-md)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.35)',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        transform: message ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.9)',
        opacity: message ? 1 : 0,
        pointerEvents: 'none',
        maxWidth: 380,
      }}
    >
      <span className="material-symbols-outlined" style={{ color: type === 'success' ? '#71f8e4' : '#fca5a5', fontSize: 22 }}>
        {type === 'success' ? 'check_circle' : 'cancel'}
      </span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message}</span>
    </div>
  )
}

interface SummaryCardProps {
  icon: string
  iconBg: string
  iconColor: string
  label: string
  value: string
  subLabel: string
  subIcon: string
  subColor: string
}

function SummaryCard({ icon, iconBg, iconColor, label, value, subLabel, subIcon, subColor }: SummaryCardProps) {
  return (
    <div className="pv-summary-card">
      <div className="pv-summary-card__icon" style={{ background: iconBg }}>
        <span className="material-symbols-outlined" style={{ fontSize: 26, color: iconColor }}>
          {icon}
        </span>
      </div>
      <div>
        <p className="pv-summary-card__label">{label}</p>
        <p className="pv-summary-card__value">{value}</p>
        <p className="pv-summary-card__sub" style={{ color: subColor }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            {subIcon}
          </span>
          {subLabel}
        </p>
      </div>
    </div>
  )
}

interface VerificationRateCardProps {
  rate: number
}

function VerificationRateCard({ rate }: VerificationRateCardProps) {
  const barHeights = [24, 32, 40, 28, 48, 36, 44]
  const barRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    barRef.current.forEach((el, i) => {
      if (!el) return
      el.style.height = '0px'
      setTimeout(() => {
        el.style.transition = `height 0.7s cubic-bezier(0.175,0.885,0.32,1.275) ${i * 80}ms`
        el.style.height = `${barHeights[i]}px`
      }, 400)
    })
  }, [])

  return (
    <div className="pv-summary-card pv-summary-card--rate">
      <div>
        <p className="pv-summary-card__label">Verification Rate</p>
        <p className="pv-summary-card__value">{rate}%</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48, marginTop: 'auto' }}>
        {barHeights.map((_h, i) => {
          const opacity = 0.15 + (i / barHeights.length) * 0.85
          return (
            <div
              key={i}
              ref={(el) => { if (el) barRef.current[i] = el }}
              style={{
                flex: 1,
                background: `rgba(70, 72, 212, ${opacity})`,
                borderRadius: 4,
                height: 0,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

interface PaymentRowProps {
  payment: Payment
  actionPendingId: string | null
  onVerify: (id: string) => void
  onReject: (id: string) => void
}

function PaymentRow({ payment, actionPendingId, onVerify, onReject }: PaymentRowProps) {
  const colors = avatarColors(payment.residentName)
  const levy = levyBadgeStyle(payment.levyType)
  const isPending = actionPendingId === payment.id
  const isImg = isImageProof(payment.reference)

  return (
    <tr className="pv-table__row">
      <td className="pv-table__cell">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div
            className="pv-avatar"
            style={{ background: colors.bg, color: colors.color }}
          >
            {getInitials(payment.residentName)}
          </div>
          <div>
            <p className="pv-table__name">{payment.residentName}</p>
            <p className="pv-table__email">{payment.residentEmail}</p>
          </div>
        </div>
      </td>
      <td className="pv-table__cell pv-table__cell--house">
        {payment.houseNumber}, {payment.street}
      </td>
      <td className="pv-table__cell">
        <a href={payment.proofUrl} className="pv-proof-link">
          <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
            {isImg ? 'image' : 'attachment'}
          </span>
          <span>{payment.reference}</span>
        </a>
      </td>
      <td className="pv-table__cell">
        <p className="pv-table__amount">{formatCurrency(payment.amount)}</p>
        <span className="pv-levy-badge" style={{ background: levy.bg, color: levy.color }}>
          {payment.levyType}
        </span>
      </td>
      <td className="pv-table__cell pv-table__cell--time">{payment.submittedAtLabel}</td>
      <td className="pv-table__cell pv-table__cell--status">
        <StatusBadge status={payment.status} />
      </td>
      <td className="pv-table__cell pv-table__cell--actions">
        {payment.status === 'pending' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', justifyContent: 'center' }}>
            <button
              className="pv-btn-verify"
              onClick={() => onVerify(payment.id)}
              disabled={isPending}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                    check_circle
                  </span>
                  Verify
                </>
              )}
            </button>
            <button
              className="pv-btn-reject"
              onClick={() => onReject(payment.id)}
              disabled={isPending}
              title="Reject payment"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                close
              </span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StatusBadge status={payment.status} />
          </div>
        )}
      </td>
    </tr>
  )
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  if (status === 'pending') {
    return (
      <span className="ui-badge ui-badge--warning">
        <span className="material-symbols-outlined">schedule</span>
        Pending
      </span>
    )
  }
  if (status === 'verified') {
    return (
      <span className="ui-badge ui-badge--success">
        <span className="material-symbols-outlined">check_circle</span>
        Verified
      </span>
    )
  }
  return (
    <span className="ui-badge ui-badge--danger">
      <span className="material-symbols-outlined">cancel</span>
      Rejected
    </span>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all')
  const [keyword, setKeyword] = useState('')
  const [actionPendingId, setActionPendingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadData = async (
    currentPage: number,
    currentFilter: typeof filter,
    currentKeyword: string,
  ) => {
    try {
      const [paymentData, summaryData] = await Promise.all([
        getPayments(currentPage, currentFilter, currentKeyword),
        getPaymentSummary(),
      ])
      setPayments(paymentData.payments)
      setTotalItems(paymentData.total)
      setSummary(summaryData)
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load payments:', err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    setPage(1)
    const debounce = setTimeout(() => loadData(1, filter, keyword), 250)
    return () => clearTimeout(debounce)
  }, [filter, keyword])

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true)
      loadData(page, filter, keyword)
    }
  }, [page])

  const handleVerify = async (id: string) => {
    setActionPendingId(id)
    try {
      await verifyPayment(id)
      showToast('Payment successfully verified!', 'success')
      await loadData(page, filter, keyword)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Verification failed.', 'error')
    } finally {
      setActionPendingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionPendingId(id)
    try {
      await rejectPayment(id)
      showToast('Payment has been rejected.', 'error')
      await loadData(page, filter, keyword)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Rejection failed.', 'error')
    } finally {
      setActionPendingId(null)
    }
  }

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(page * ITEMS_PER_PAGE, totalItems)

  return (
    <CommunityAdminLayout>
      <div className="pv-page">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="pv-page__header">
          <div>
            <h2 className="pv-page__title">Payment Verification</h2>
            <p className="pv-page__subtitle">Manage and audit incoming community trust contributions.</p>
          </div>
          <button className="pv-btn-export">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              download
            </span>
            Export Report
          </button>
        </div>

        {/* ── Summary Bar ────────────────────────────────────────── */}
        <div className="pv-summary-grid">
          <SummaryCard
            icon="pending_actions"
            iconBg="rgba(192,193,255,0.35)"
            iconColor="#2f2ebe"
            label="Total Pending"
            value={String(summary?.totalPending ?? '—')}
            subLabel="+12% from yesterday"
            subIcon="trending_up"
            subColor="var(--color-error)"
          />
          <SummaryCard
            icon="payments"
            iconBg="rgba(113,248,228,0.3)"
            iconColor="#005048"
            label="Pending Value"
            value={summary ? formatCurrency(summary.pendingValue) : '—'}
            subLabel="Awaiting audit"
            subIcon="update"
            subColor="var(--color-on-tertiary-container)"
          />
          <VerificationRateCard rate={summary?.verificationRate ?? 0} />
        </div>

        {/* ── Filters & Search ───────────────────────────────────── */}
        <div className="pv-toolbar">
          <div className="pv-filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`pv-filter-tab${filter === tab.value ? ' pv-filter-tab--active' : ''}`}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="pv-search">
            <span className="material-symbols-outlined pv-search__icon">search</span>
            <input
              type="text"
              className="pv-search__input"
              placeholder="Search by name, house, or reference…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────── */}
        <section className="pv-table-section">
          <div className="pv-table-section__header">
            <h3 className="pv-table-section__title">
              {filter === 'all' ? 'All Payments' : `${FILTER_TABS.find((t) => t.value === filter)?.label} Payments`}
            </h3>
            <div className="pv-filter-chip">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                filter_list
              </span>
              Filter
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="pv-table">
              <thead>
                <tr>
                  <th className="pv-table__th">Resident</th>
                  <th className="pv-table__th">House No.</th>
                  <th className="pv-table__th">Reference</th>
                  <th className="pv-table__th">Amount</th>
                  <th className="pv-table__th">Submitted</th>
                  <th className="pv-table__th pv-table__th--center">Status</th>
                  <th className="pv-table__th pv-table__th--center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon="payments"
                        title="No payments found"
                        description={
                          keyword
                            ? 'Try adjusting your search or filter.'
                            : 'There are no payments in this category yet.'
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <PaymentRow
                      key={payment.id}
                      payment={payment}
                      actionPendingId={actionPendingId}
                      onVerify={handleVerify}
                      onReject={handleReject}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pv-pagination">
            <p className="pv-pagination__info">
              {totalItems === 0
                ? 'No results'
                : `Showing ${startItem}–${endItem} of ${totalItems} ${filter === 'all' ? '' : filter} payment${totalItems !== 1 ? 's' : ''}`}
            </p>
            <div className="pv-pagination__controls">
              <button
                className="pv-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pv-page-btn${page === p ? ' pv-page-btn--active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="pv-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Bottom micro-stats ─────────────────────────────────── */}
        <div className="pv-micro-stats">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-tertiary-fixed-dim)', display: 'inline-block' }} />
              Auto-Matched: {summary?.autoMatchedCount ?? '—'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-error)', display: 'inline-block' }} />
              Disputed: {summary?.disputedCount ?? '—'}
            </span>
          </div>
          <p>Last sync: 12 minutes ago from Bank API</p>
        </div>
      </div>

      {/* ── Toast ──────────────────────────────────────────────── */}
      <Toast message={toast?.message ?? null} type={toast?.type ?? 'success'} />

      <style>{`
        .pv-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .pv-page__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .pv-page__title {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, var(--text-headline-lg));
          font-weight: 700;
          color: var(--color-on-surface);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .pv-page__subtitle {
          font-size: var(--text-body-md);
          color: var(--color-on-surface-variant);
          line-height: 1.6;
        }

        .pv-btn-export {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 10px var(--space-md);
          border: 1.5px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          background: #ffffff;
          color: var(--color-secondary);
          font-size: var(--text-label-md);
          font-weight: 700;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pv-btn-export:hover {
          background: var(--color-surface-container-low);
          transform: translateY(-1px);
        }

        /* ── Summary ─────────────────────────────────── */

        .pv-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-gutter);
        }

        @media (max-width: 900px) {
          .pv-summary-grid {
            grid-template-columns: 1fr;
          }
        }

        .pv-summary-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(198, 198, 205, 0.55);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .pv-summary-card:hover {
          box-shadow: 0 12px 30px -8px rgba(70,72,212,0.12);
          transform: translateY(-2px);
        }

        .pv-summary-card--rate {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-sm);
        }

        .pv-summary-card__icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pv-summary-card__label {
          font-size: var(--text-label-sm);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-outline);
          margin-bottom: 4px;
        }

        .pv-summary-card__value {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 700;
          color: var(--color-on-surface);
          letter-spacing: -0.01em;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .pv-summary-card__sub {
          font-size: var(--text-label-sm);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        /* ── Toolbar ─────────────────────────────────── */

        .pv-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .pv-filter-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--color-surface-container-low);
          padding: 4px;
          border-radius: var(--radius-xl);
        }

        .pv-filter-tab {
          padding: 7px 18px;
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-on-surface-variant);
          background: transparent;
          transition: all 0.2s ease;
        }

        .pv-filter-tab:hover {
          background: rgba(255,255,255,0.7);
          color: var(--color-on-surface);
        }

        .pv-filter-tab--active {
          background: #ffffff;
          color: var(--color-secondary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .pv-search {
          position: relative;
          width: 320px;
          max-width: 100%;
        }

        .pv-search__icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 19px;
          color: var(--color-on-surface-variant);
          pointer-events: none;
        }

        .pv-search__input {
          width: 100%;
          padding: 10px var(--space-md) 10px 40px;
          border: 1.5px solid var(--color-outline-variant);
          border-radius: var(--radius-full);
          background: #ffffff;
          font-family: var(--font-body);
          font-size: var(--text-label-md);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .pv-search__input:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(70,72,212,0.1);
        }

        /* ── Table ───────────────────────────────────── */

        .pv-table-section {
          background: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-outline-variant);
          overflow: hidden;
        }

        .pv-table-section__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-sm) var(--space-md);
          background: #f8fafc;
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .pv-table-section__title {
          font-size: var(--text-label-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-outline);
        }

        .pv-filter-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          cursor: pointer;
          transition: background 0.2s;
        }

        .pv-filter-chip:hover {
          background: var(--color-surface-container-low);
        }

        .pv-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .pv-table__th {
          padding: 14px var(--space-md);
          font-size: var(--text-label-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-outline);
          background: #f8fafc;
          border-bottom: 1px solid var(--color-outline-variant);
          white-space: nowrap;
        }

        .pv-table__th--center {
          text-align: center;
        }

        .pv-table__row {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }

        .pv-table__row:last-child {
          border-bottom: none;
        }

        .pv-table__row:hover {
          background: #fafbff;
        }

        .pv-table__cell {
          padding: 14px var(--space-md);
          vertical-align: middle;
        }

        .pv-table__cell--house {
          font-size: var(--text-body-md);
          font-weight: 500;
          color: var(--color-on-surface);
          white-space: nowrap;
        }

        .pv-table__cell--time {
          font-size: var(--text-label-sm);
          color: var(--color-outline);
          white-space: nowrap;
        }

        .pv-table__cell--status {
          text-align: center;
        }

        .pv-table__cell--actions {
          text-align: center;
        }

        .pv-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .pv-table__name {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-on-surface);
        }

        .pv-table__email {
          font-size: var(--text-label-sm);
          color: var(--color-outline);
        }

        .pv-proof-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--color-secondary);
          font-size: var(--text-label-md);
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .pv-proof-link:hover {
          opacity: 0.75;
          text-decoration: underline;
        }

        .pv-table__amount {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-on-surface);
          margin-bottom: 4px;
        }

        .pv-levy-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 10px;
          border-radius: var(--radius-full);
        }

        /* ── Action buttons ────────────────────────── */

        .pv-btn-verify {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: 36px;
          padding: 0 var(--space-md);
          border-radius: var(--radius-lg);
          background: var(--color-secondary);
          color: #ffffff;
          font-size: var(--text-label-md);
          font-weight: 700;
          transition: all 0.2s ease;
          white-space: nowrap;
          min-width: 88px;
        }

        .pv-btn-verify:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: scale(1.03);
        }

        .pv-btn-verify:active:not(:disabled) {
          transform: scale(0.97);
        }

        .pv-btn-verify:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .pv-btn-reject {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(186,26,26,0.3);
          border-radius: var(--radius-lg);
          color: var(--color-error);
          background: transparent;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .pv-btn-reject:hover:not(:disabled) {
          background: rgba(186,26,26,0.06);
          transform: scale(1.05);
        }

        .pv-btn-reject:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Pagination ──────────────────────────────── */

        .pv-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-sm) var(--space-md);
          background: #f8fafc;
          border-top: 1px solid var(--color-outline-variant);
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .pv-pagination__info {
          font-size: var(--text-label-sm);
          color: var(--color-outline);
        }

        .pv-pagination__controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pv-page-btn {
          min-width: 34px;
          height: 34px;
          padding: 0 6px;
          border-radius: var(--radius-lg);
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: var(--color-on-surface-variant);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .pv-page-btn:hover:not(:disabled) {
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .pv-page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .pv-page-btn--active {
          background: var(--color-secondary);
          color: #ffffff;
          box-shadow: 0 4px 12px -4px rgba(70,72,212,0.4);
        }

        .pv-page-btn--active:hover {
          filter: brightness(1.08);
          background: var(--color-secondary);
        }

        /* ── Micro-stats ─────────────────────────────── */

        .pv-micro-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-md);
          font-size: var(--text-label-sm);
          color: var(--color-outline);
          padding: 0 2px;
        }
      `}</style>
    </CommunityAdminLayout>
  )
}
