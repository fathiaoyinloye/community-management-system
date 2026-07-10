import { useEffect, useState } from 'react'
import CommunityAdminLayout from '../../layouts/CommunityAdminLayout'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { getLevySummary, getLevyTypes, getScheduledAdjustments, updateLevyStatus } from '../../api/levy'
import type { LevyFrequency, LevySummary, LevyType, ScheduledAdjustment } from '../../types/levy'

const FREQUENCY_LABELS: Record<LevyFrequency, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  one_time: 'One-time',
}

function formatCurrency(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits,
  })
}

export default function LevyTypes() {
  const [levyTypes, setLevyTypes] = useState<LevyType[]>([])
  const [summary, setSummary] = useState<LevySummary | null>(null)
  const [scheduledAdjustments, setScheduledAdjustments] = useState<ScheduledAdjustment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([getLevyTypes(), getLevySummary(), getScheduledAdjustments()]).then(
      ([levyTypesData, summaryData, scheduledAdjustmentsData]) => {
        if (!cancelled) {
          setLevyTypes(levyTypesData)
          setSummary(summaryData)
          setScheduledAdjustments(scheduledAdjustmentsData)
          setIsLoading(false)
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [])

  const handleToggleStatus = async (levy: LevyType) => {
    const nextStatus = levy.status === 'active' ? 'inactive' : 'active'
    setPendingId(levy.id)
    try {
      const updated = await updateLevyStatus(levy.id, nextStatus)
      setLevyTypes((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
    } finally {
      setPendingId(null)
    }
  }

  return (
    <CommunityAdminLayout>
      <div className="lv">
        <section className="lv__hero">
          <div>
            <h3 className="lv__hero-title">Levy Type Management</h3>
            <p className="lv__hero-copy">
              Configure and maintain standard billing types for the community. Changes here affect
              all future invoice generation cycles.
            </p>
          </div>
          <button type="button" className="lv__create-btn">
            <span className="material-symbols-outlined">add</span>
            Create New Levy Type
          </button>
        </section>

        <section className="lv__stats">
          <div className="lv__stat-card">
            <div className="lv__stat-head">
              <span className="material-symbols-outlined lv__stat-icon">account_balance_wallet</span>
              <span className="lv__stat-tag">Total Active</span>
            </div>
            <p className="lv__stat-label">Total Active Levies</p>
            <p className="lv__stat-value">{isLoading || !summary ? '—' : summary.totalActiveLevies}</p>
          </div>
          <div className="lv__stat-card">
            <div className="lv__stat-head">
              <span className="material-symbols-outlined lv__stat-icon">insights</span>
              <span className="lv__stat-tag lv__stat-tag--positive">
                {isLoading || !summary ? '—' : `+${summary.monthlyRevenueChangePct}%`}
              </span>
            </div>
            <p className="lv__stat-label">Monthly Revenue Est.</p>
            <p className="lv__stat-value">
              {isLoading || !summary ? '—' : formatCurrency(summary.monthlyRevenueEstimate, 0)}
            </p>
          </div>
          <div className="lv__stat-card">
            <div className="lv__stat-head">
              <span className="material-symbols-outlined lv__stat-icon lv__stat-icon--warning">warning</span>
            </div>
            <p className="lv__stat-label">Pending Updates</p>
            <p className="lv__stat-value">{isLoading || !summary ? '—' : summary.pendingUpdates}</p>
          </div>
          <div className="lv__stat-card">
            <div className="lv__stat-head">
              <span className="material-symbols-outlined lv__stat-icon lv__stat-icon--muted">schedule</span>
            </div>
            <p className="lv__stat-label">Last Processed</p>
            <p className="lv__stat-value">{isLoading || !summary ? '—' : summary.lastProcessedLabel}</p>
          </div>
        </section>

        <section className="lv__table-card">
          <div className="lv__table-head">
            <h4 className="lv__card-title">Defined Levy Types</h4>
            <div className="lv__table-tools">
              <button type="button" className="lv__icon-btn">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button type="button" className="lv__icon-btn">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="lv__loading">
              <Spinner />
              <span>Loading levy types…</span>
            </div>
          ) : levyTypes.length === 0 ? (
            <EmptyState
              icon="receipt_long"
              title="No levy types yet"
              description="Levy types you create will show up here."
            />
          ) : (
            <div className="lv__table-scroll">
              <table className="lv__table">
                <thead>
                  <tr>
                    <th>Levy Name</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th className="lv__col-center">Status</th>
                    <th className="lv__col-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {levyTypes.map((levy) => (
                    <tr key={levy.id} className={levy.status === 'inactive' ? 'lv__row lv__row--inactive' : 'lv__row'}>
                      <td>
                        <div className="lv__name-cell">
                          <div className="lv__name-icon">
                            <span className="material-symbols-outlined">{levy.icon}</span>
                          </div>
                          <div>
                            <p className="lv__name">{levy.name}</p>
                            <p className="lv__description">{levy.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="lv__amount">{formatCurrency(levy.amount)}</p>
                      </td>
                      <td>
                        <span className="lv__frequency">{FREQUENCY_LABELS[levy.frequency]}</span>
                      </td>
                      <td className="lv__col-center">
                        <Badge variant={levy.status === 'active' ? 'success' : 'neutral'}>
                          {levy.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="lv__col-right">
                        <div className="lv__row-actions">
                          <button type="button" className="lv__row-action" title="Edit">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            type="button"
                            className={
                              levy.status === 'active'
                                ? 'lv__row-action lv__row-action--danger'
                                : 'lv__row-action lv__row-action--success'
                            }
                            title={levy.status === 'active' ? 'Deactivate' : 'Activate'}
                            onClick={() => handleToggleStatus(levy)}
                            disabled={pendingId === levy.id}
                          >
                            <span className="material-symbols-outlined">
                              {levy.status === 'active' ? 'block' : 'check_circle'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="lv__table-foot">
            <p>
              Showing {levyTypes.length} of {summary?.totalLevyTypes ?? levyTypes.length} levy types
            </p>
            <div className="lv__pagination">
              <button type="button" disabled>
                Previous
              </button>
              <button type="button">Next</button>
            </div>
          </div>
        </section>

        <section className="lv__bottom">
          <div className="lv__schedule-card">
            <div className="lv__schedule-head">
              <span className="material-symbols-outlined">update</span>
              <h5 className="lv__card-title">Scheduled Adjustments</h5>
            </div>
            <div className="lv__schedule-list">
              {scheduledAdjustments.map((item) => (
                <div key={item.id} className="lv__schedule-item">
                  <div className="lv__schedule-item-label">
                    <span className="lv__schedule-dot" />
                    <p>{item.label}</p>
                  </div>
                  <p className="lv__schedule-date">{item.effectiveLabel}</p>
                </div>
              ))}
            </div>
            <button type="button" className="lv__schedule-link">
              Manage all schedules
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="lv__wizard-card">
            <h5 className="lv__wizard-title">Need a custom levy type?</h5>
            <p className="lv__wizard-copy">
              Special levies for one-off projects can be created and targeted to specific property
              clusters.
            </p>
            <div className="lv__wizard-actions">
              <button type="button" className="lv__wizard-btn">
                Start Wizard
              </button>
              <button type="button" className="lv__wizard-btn lv__wizard-btn--ghost">
                Documentation
              </button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .lv__hero {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .lv__hero-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
        }

        .lv__hero-copy {
          font-size: var(--text-body-lg);
          color: var(--color-on-surface-variant);
          max-width: 640px;
          margin-top: var(--space-xs);
        }

        .lv__create-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          background: var(--color-secondary);
          color: #ffffff;
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 700;
          box-shadow: 0 10px 25px -10px rgba(70, 72, 212, 0.4);
          transition: transform 0.2s ease;
        }

        .lv__create-btn:active {
          transform: scale(0.97);
        }

        .lv__stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .lv__stat-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.05), 0 4px 6px -2px rgba(99, 102, 241, 0.03);
        }

        .lv__stat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }

        .lv__stat-icon {
          font-size: 28px;
          color: var(--color-secondary);
        }

        .lv__stat-icon--warning {
          color: var(--color-error);
        }

        .lv__stat-icon--muted {
          color: var(--color-outline);
        }

        .lv__stat-tag {
          font-size: 11px;
          padding: 2px var(--space-xs);
          border-radius: var(--radius-default);
          background: var(--color-on-tertiary-fixed);
          color: var(--color-tertiary-fixed-dim);
        }

        .lv__stat-tag--positive {
          background: var(--color-primary-container);
          color: var(--color-secondary-fixed-dim);
        }

        .lv__stat-label {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
        }

        .lv__stat-value {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          color: var(--color-primary);
        }

        .lv__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.05), 0 4px 6px -2px rgba(99, 102, 241, 0.03);
          margin-bottom: var(--space-xl);
        }

        .lv__table-head {
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
          background: rgba(242, 244, 246, 0.5);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lv__card-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          color: var(--color-primary);
        }

        .lv__table-tools {
          display: flex;
          gap: var(--space-xs);
        }

        .lv__icon-btn {
          padding: var(--space-xs);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-default);
          background: #ffffff;
          color: var(--color-on-surface-variant);
        }

        .lv__icon-btn:hover {
          background: var(--color-surface-container-high);
        }

        .lv__loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-xl);
          color: var(--color-on-surface-variant);
        }

        .lv__table-scroll {
          overflow-x: auto;
        }

        .lv__table {
          width: 100%;
          text-align: left;
          border-collapse: collapse;
        }

        .lv__table thead {
          background: var(--color-surface-container-low);
        }

        .lv__table th {
          padding: var(--space-sm) var(--space-md);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: var(--color-on-surface-variant);
        }

        .lv__col-center {
          text-align: center;
        }

        .lv__col-right {
          text-align: right;
        }

        .lv__row {
          border-top: 1px solid var(--color-surface-container);
          transition: background-color 0.2s ease;
        }

        .lv__row:hover {
          background: var(--color-surface-bright);
        }

        .lv__row--inactive {
          opacity: 0.75;
        }

        .lv__row td {
          padding: var(--space-md);
          vertical-align: middle;
        }

        .lv__name-cell {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .lv__name-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: var(--radius-lg);
          background: var(--color-secondary-fixed);
          color: var(--color-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lv__name {
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-on-surface);
        }

        .lv__description {
          font-size: 12px;
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .lv__amount {
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-primary);
        }

        .lv__frequency {
          display: inline-block;
          padding: 4px var(--space-sm);
          background: var(--color-surface-container);
          color: var(--color-on-surface-variant);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 500;
        }

        .lv__row-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-xs);
        }

        .lv__row-action {
          padding: var(--space-xs);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface-variant);
          background: transparent;
        }

        .lv__row-action:hover:not(:disabled) {
          background: var(--color-surface-container-low);
          color: var(--color-secondary);
        }

        .lv__row-action--danger:hover:not(:disabled) {
          color: var(--color-error);
          background: #fff1f2;
        }

        .lv__row-action--success:hover:not(:disabled) {
          color: var(--color-on-tertiary-container);
          background: var(--color-on-tertiary-fixed);
        }

        .lv__row-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lv__table-foot {
          padding: var(--space-sm) var(--space-md);
          background: rgba(242, 244, 246, 0.3);
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lv__table-foot p {
          font-size: 12px;
          color: var(--color-on-surface-variant);
        }

        .lv__pagination {
          display: flex;
          gap: var(--space-xs);
        }

        .lv__pagination button {
          padding: 4px var(--space-sm);
          font-size: 12px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-default);
          background: #ffffff;
          color: var(--color-on-surface);
        }

        .lv__pagination button:last-child {
          background: var(--color-secondary);
          color: #ffffff;
          border-color: var(--color-secondary);
        }

        .lv__pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lv__bottom {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
        }

        .lv__schedule-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid var(--color-surface-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.05), 0 4px 6px -2px rgba(99, 102, 241, 0.03);
        }

        .lv__schedule-head {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .lv__schedule-head .material-symbols-outlined {
          color: var(--color-secondary);
        }

        .lv__schedule-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .lv__schedule-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-sm);
          background: var(--color-surface-container-low);
          border-radius: var(--radius-lg);
        }

        .lv__schedule-item-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .lv__schedule-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--color-secondary);
          flex-shrink: 0;
        }

        .lv__schedule-item-label p {
          font-size: var(--text-label-md);
          color: var(--color-on-surface);
        }

        .lv__schedule-date {
          font-size: 12px;
          color: var(--color-on-surface-variant);
          white-space: nowrap;
        }

        .lv__schedule-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-secondary);
          font-size: var(--text-label-md);
          font-weight: 600;
          margin-top: var(--space-md);
        }

        .lv__schedule-link:hover {
          text-decoration: underline;
        }

        .lv__schedule-link .material-symbols-outlined {
          font-size: 16px;
        }

        .lv__wizard-card {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          min-height: 200px;
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(120deg, var(--color-primary-container) 0%, #1c2340 70%);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.05), 0 4px 6px -2px rgba(99, 102, 241, 0.03);
        }

        .lv__wizard-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          color: #ffffff;
          margin-bottom: var(--space-sm);
        }

        .lv__wizard-copy {
          color: rgba(255, 255, 255, 0.75);
          max-width: 380px;
          margin-bottom: var(--space-md);
        }

        .lv__wizard-actions {
          display: flex;
          gap: var(--space-sm);
        }

        .lv__wizard-btn {
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 600;
          background: #ffffff;
          color: var(--color-primary-container);
        }

        .lv__wizard-btn:hover {
          background: var(--color-secondary-fixed);
        }

        .lv__wizard-btn--ghost {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
        }

        .lv__wizard-btn--ghost:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (min-width: 768px) {
          .lv__stats {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .lv__bottom {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </CommunityAdminLayout>
  )
}
