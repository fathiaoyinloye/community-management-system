import { useState, type FormEvent } from 'react'
import ResidentLayout from '../../layouts/ResidentLayout'

interface LevyItem {
  id: string
  name: string
  period: string
  amount: number
  isAutoPay?: boolean
}

interface TransactionItem {
  id: string
  date: string
  description: string
  referenceId: string
  amount: number
  status: 'success' | 'pending' | 'failed'
}

export default function ResidentPayments() {
  // Balance and Stats state
  const [outstandingBalance, setOutstandingBalance] = useState(1240.00)
  const [lastPaymentAmount] = useState(850.00)
  const [lastPaymentDate] = useState('Oct 12, 2023')

  // Levies to Pay state
  const [levies, setLevies] = useState<LevyItem[]>([
    { id: '1', name: 'Monthly Maintenance', period: 'October 2023 Period', amount: 850.00 },
    { id: '2', name: 'Security Surcharge', period: 'Annual upgrade fund', amount: 240.00 },
    { id: '3', name: 'Parking Space B12', period: 'Optional subscription', amount: 150.00, isAutoPay: true },
  ])

  // Payment History state
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    { id: 't1', date: 'Oct 12, 2023', description: 'Monthly Maintenance', referenceId: '#TRX-82910', amount: 850.00, status: 'success' },
    { id: 't2', date: 'Oct 05, 2023', description: 'Pool Access Tag', referenceId: '#TRX-82451', amount: 25.00, status: 'success' },
    { id: 't3', date: 'Sep 30, 2023', description: 'Infrastructure Levy', referenceId: '#TRX-81002', amount: 120.00, status: 'pending' },
    { id: 't4', date: 'Sep 15, 2023', description: 'Guest Parking Pass', referenceId: '#TRX-80512', amount: 10.00, status: 'failed' },
    { id: 't5', date: 'Sep 12, 2023', description: 'Monthly Maintenance', referenceId: '#TRX-79883', amount: 850.00, status: 'success' },
  ])

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Upload Form state
  const [modalAmount, setModalAmount] = useState('')
  const [modalCategory, setModalCategory] = useState('Monthly Maintenance')
  const [modalReference, setModalReference] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const itemsPerPage = 5

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Pre-fill modal details when resident clicks "Pay Now" on a specific levy
  const handlePayNow = (levy: LevyItem) => {
    setModalAmount(levy.amount.toFixed(2))
    setModalCategory(levy.name)
    setModalReference(`REF-${Math.floor(100000 + Math.random() * 900000)}`)
    setIsModalOpen(true)
  }

  const handleOpenGeneralUpload = () => {
    setModalAmount('')
    setModalCategory('Monthly Maintenance')
    setModalReference(`REF-${Math.floor(100000 + Math.random() * 900000)}`)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (e: FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(modalAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.')
      return
    }

    setIsSubmitting(true)

    // Simulate server delay
    setTimeout(() => {
      const newTxn: TransactionItem = {
        id: `t_${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: modalCategory,
        referenceId: `#TRX-${modalReference || Math.floor(80000 + Math.random() * 20000)}`,
        amount: amount,
        status: 'pending'
      }

      setTransactions(prev => [newTxn, ...prev])
      setOutstandingBalance(prev => Math.max(0, prev - amount))
      
      // If payment matched a levy in the list, remove or mark it
      setLevies(prev => prev.filter(item => item.name !== modalCategory))

      setIsSubmitting(false)
      setIsModalOpen(false)
      triggerToast(`Proof of payment (₦${amount.toFixed(2)}) submitted successfully!`)
    }, 1200)
  }

  const handleToggleAutoPay = (id: string) => {
    setLevies(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isAutoPay
        triggerToast(nextState ? `Auto-Pay enabled for ${item.name}` : `Auto-Pay disabled for ${item.name}`)
        return { ...item, isAutoPay: nextState }
      }
      return item
    }))
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true
    return t.status === filter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <ResidentLayout onNewRequest={handleOpenGeneralUpload}>
      <div className="res-payments">
        {toastMessage && (
          <div className="res-payments__toast animate-slide-in">
            <span className="material-symbols-outlined">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <header className="res-payments__header">
          <div className="res-payments__title-section">
            <h2 className="res-payments__title">Payments</h2>
            <p className="res-payments__subtitle">Manage your levies, track history, and settle balances.</p>
          </div>
          <button onClick={handleOpenGeneralUpload} className="res-payments__upload-btn">
            <span className="material-symbols-outlined">upload_file</span>
            Upload Proof of Payment
          </button>
        </header>

        {/* Balance Overview Cards */}
        <section className="res-payments__stats-grid">
          {/* Total Outstanding */}
          <div className="res-payments__stat-card">
            <div className="res-payments__stat-icon-bg">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <p className="res-payments__stat-label">Total Outstanding</p>
            <h3 className="res-payments__stat-value">₦{outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            {outstandingBalance > 0 ? (
              <div className="res-payments__stat-footer text-error">
                <span className="material-symbols-outlined">warning</span>
                Overdue by 5 days
              </div>
            ) : (
              <div className="res-payments__stat-footer text-success">
                <span className="material-symbols-outlined">check_circle</span>
                All settled
              </div>
            )}
          </div>

          {/* Upcoming Due Date */}
          <div className="res-payments__stat-card">
            <div className="res-payments__stat-icon-bg">
              <span className="material-symbols-outlined">event_repeat</span>
            </div>
            <p className="res-payments__stat-label">Upcoming Due Date</p>
            <h3 className="res-payments__stat-value">Oct 31, 2023</h3>
            <div className="res-payments__stat-footer text-muted">
              <span className="material-symbols-outlined">calendar_today</span>
              Next: Monthly Maintenance
            </div>
          </div>

          {/* Last Payment */}
          <div className="res-payments__stat-card">
            <div className="res-payments__stat-icon-bg">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <p className="res-payments__stat-label">Last Payment</p>
            <h3 className="res-payments__stat-value">₦{lastPaymentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            <div className="res-payments__stat-footer text-success">
              <span className="material-symbols-outlined">verified</span>
              Verified on {lastPaymentDate}
            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <div className="res-payments__content-grid">
          {/* Levies list */}
          <div className="res-payments__levies-panel">
            <div className="res-payments__section-header">
              <h4 className="res-payments__section-title">Levies to Pay</h4>
              <span className="res-payments__badge">{levies.length} Items</span>
            </div>

            <div className="res-payments__levies-list">
              {levies.length === 0 ? (
                <div className="res-payments__empty-levies">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p>All levies paid up!</p>
                </div>
              ) : (
                levies.map((levy) => (
                  <div key={levy.id} className={`res-payments__levy-card ${levy.isAutoPay ? 'res-payments__levy-card--autopay' : ''}`}>
                    <div className="res-payments__levy-info">
                      <div>
                        <h5 className="res-payments__levy-name">{levy.name}</h5>
                        <p className="res-payments__levy-period">{levy.period}</p>
                      </div>
                      <span className="res-payments__levy-amount">₦{levy.amount.toFixed(2)}</span>
                    </div>

                    <div className="res-payments__levy-actions">
                      {levy.isAutoPay ? (
                        <button
                          onClick={() => handleToggleAutoPay(levy.id)}
                          className="btn-outline-pay w-full"
                        >
                          Enable Auto-Pay
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePayNow(levy)}
                            className="btn btn-primary flex-1"
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() => handleToggleAutoPay(levy.id)}
                            className="res-payments__action-menu-btn"
                            title="Toggle Auto-pay"
                          >
                            <span className="material-symbols-outlined">settings_backup_restore</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Warning Banner */}
              <div className="res-payments__warning-banner">
                <span className="material-symbols-outlined">info</span>
                <p>Bank transfer payments may take up to 48 hours to reflect in your history.</p>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="res-payments__table-panel">
            <div className="res-payments__table-header">
              <h4 className="res-payments__section-title">Payment History</h4>
              <div className="res-payments__filter-actions">
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  className="res-payments__filter-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="res-payments__table-container">
              <table className="res-payments__table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Reference ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td className="font-semibold">{tx.description}</td>
                      <td className="font-mono text-muted text-sm">{tx.referenceId}</td>
                      <td className="font-bold">₦{tx.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status-pill status-pill--${tx.status}`}>
                          <span className="status-pill__dot"></span>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginatedTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted">
                        No transactions found matching filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <footer className="res-payments__table-footer">
                <span className="text-muted text-sm">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </span>
                <div className="res-payments__pagination-btns">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-pagination"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn-pagination"
                  >
                    Next
                  </button>
                </div>
              </footer>
            )}
          </div>
        </div>

        {/* Upload modal */}
        {isModalOpen && (
          <div className="res-payments__modal-overlay">
            <div className="res-payments__modal">
              <header className="res-payments__modal-header">
                <h3>Upload Proof</h3>
                <button onClick={() => setIsModalOpen(false)} className="res-payments__modal-close">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </header>

              <form onSubmit={handleModalSubmit} className="res-payments__modal-form">
                <div className="res-payments__modal-dropzone">
                  <span className="material-symbols-outlined">cloud_upload</span>
                  <p className="font-bold">Click or drag files here</p>
                  <p className="text-muted text-sm mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                </div>

                <div className="res-payments__modal-fields">
                  <label className="res-payments__modal-label">
                    <span>Levy Category</span>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      required
                    >
                      <option value="Monthly Maintenance">Monthly Maintenance</option>
                      <option value="Security Surcharge">Security Surcharge</option>
                      <option value="Parking Space B12">Parking Space B12</option>
                      <option value="Utility / Other">Utility / Other</option>
                    </select>
                  </label>

                  <label className="res-payments__modal-label">
                    <span>Amount (₦)</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={modalAmount}
                      onChange={(e) => setModalAmount(e.target.value)}
                      placeholder="Enter amount paid"
                      required
                    />
                  </label>

                  <label className="res-payments__modal-label">
                    <span>Reference / Transaction ID</span>
                    <input
                      type="text"
                      value={modalReference}
                      onChange={(e) => setModalReference(e.target.value)}
                      placeholder="e.g. TXN-82910"
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-3"
                >
                  {isSubmitting ? 'Submitting for Verification...' : 'Submit for Verification'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .res-payments {
          position: relative;
        }

        .res-payments__toast {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #0f172a;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          z-index: 200;
          font-size: var(--text-label-md);
          font-weight: 500;
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .res-payments__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-xl);
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .res-payments__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 700;
          color: var(--color-primary);
        }

        .res-payments__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-md);
          margin-top: 4px;
        }

        .res-payments__upload-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 10px var(--space-md);
          border: 1px solid var(--color-outline);
          border-radius: var(--radius-xl);
          background: #ffffff;
          font-weight: 700;
          transition: background-color 0.2s ease;
        }

        .res-payments__upload-btn:hover {
          background: var(--color-surface-container-low);
        }

        .res-payments__stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 768px) {
          .res-payments__stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .res-payments__stat-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(225, 224, 255, 0.5);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .res-payments__stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -10px rgba(99, 102, 241, 0.12);
        }

        .res-payments__stat-icon-bg {
          position: absolute;
          top: 12px;
          right: 12px;
          opacity: 0.1;
        }

        .res-payments__stat-icon-bg .material-symbols-outlined {
          font-size: 64px;
        }

        .res-payments__stat-label {
          text-transform: uppercase;
          font-size: var(--text-label-sm);
          font-weight: 600;
          color: var(--color-on-surface-variant);
          letter-spacing: 0.05em;
        }

        .res-payments__stat-value {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 700;
          margin-top: 8px;
          color: var(--color-primary);
        }

        .res-payments__stat-footer {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .text-error {
          color: var(--color-error);
        }

        .text-success {
          color: var(--color-on-tertiary-container);
        }

        .text-muted {
          color: var(--color-on-surface-variant);
        }

        .res-payments__content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
        }

        @media (min-width: 1024px) {
          .res-payments__content-grid {
            grid-template-columns: 1fr 2fr;
          }
        }

        .res-payments__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .res-payments__section-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
        }

        .res-payments__badge {
          background: var(--color-secondary-fixed);
          color: var(--color-on-secondary-fixed-variant);
          font-size: var(--text-label-sm);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .res-payments__levies-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .res-payments__levy-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .res-payments__levy-card--autopay {
          opacity: 0.6;
          border-style: dashed;
        }

        .res-payments__levy-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-md);
        }

        .res-payments__levy-name {
          font-weight: 700;
          font-size: var(--text-body-lg);
          color: var(--color-primary);
        }

        .res-payments__levy-period {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .res-payments__levy-amount {
          font-weight: 700;
          font-size: var(--text-body-lg);
        }

        .res-payments__levy-actions {
          display: flex;
          gap: var(--space-sm);
        }

        .btn-outline-pay {
          background: transparent;
          border: 1px solid var(--color-secondary);
          color: var(--color-secondary);
          border-radius: var(--radius-lg);
          padding: 10px;
          font-weight: 700;
          font-size: var(--text-label-md);
          text-align: center;
          transition: background-color 0.2s ease;
        }

        .btn-outline-pay:hover {
          background: var(--color-secondary-fixed);
        }

        .res-payments__action-menu-btn {
          padding: 10px;
          border: 1px solid var(--color-outline-variant);
          background: transparent;
          color: var(--color-on-surface-variant);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .res-payments__action-menu-btn:hover {
          background: var(--color-surface-container-low);
        }

        .res-payments__warning-banner {
          background: var(--color-primary-container);
          color: #ffffff;
          padding: var(--space-md);
          border-radius: var(--radius-xl);
          display: flex;
          gap: var(--space-sm);
          align-items: flex-start;
        }

        .res-payments__warning-banner .material-symbols-outlined {
          font-size: 24px;
          opacity: 0.9;
        }

        .res-payments__warning-banner p {
          font-size: var(--text-label-md);
          line-height: 1.4;
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
        }

        .res-payments__table-panel {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }

        .res-payments__table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .res-payments__filter-select {
          padding: 6px 12px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          background: transparent;
          outline: none;
        }

        .res-payments__table-container {
          overflow-x: auto;
          flex-grow: 1;
        }

        .res-payments__table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .res-payments__table th {
          background: var(--color-surface-container-low);
          padding: var(--space-sm) var(--space-md);
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          color: var(--color-on-surface-variant);
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .res-payments__table td {
          padding: 16px var(--space-md);
          font-size: var(--text-label-md);
          border-bottom: 1px solid var(--color-surface-container-low);
        }

        .res-payments__table tr:hover td {
          background: var(--color-surface-container-lowest);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .status-pill--success {
          background: rgba(0, 148, 133, 0.1);
          color: var(--color-on-tertiary-container);
        }

        .status-pill--success .status-pill__dot {
          background: var(--color-on-tertiary-container);
        }

        .status-pill--pending {
          background: rgba(96, 99, 238, 0.1);
          color: var(--color-secondary);
        }

        .status-pill--pending .status-pill__dot {
          background: var(--color-secondary);
        }

        .status-pill--failed {
          background: var(--color-error-container);
          color: var(--color-error);
        }

        .status-pill--failed .status-pill__dot {
          background: var(--color-error);
        }

        .status-pill__dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
        }

        .res-payments__table-footer {
          padding: var(--space-md);
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .res-payments__pagination-btns {
          display: flex;
          gap: var(--space-sm);
        }

        .btn-pagination {
          padding: 6px 12px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-sm);
          background: #ffffff;
          transition: background-color 0.2s ease;
        }

        .btn-pagination:hover:not(:disabled) {
          background: var(--color-surface-container-low);
        }

        .btn-pagination:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Modal Overlay */
        .res-payments__modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          z-index: 150;
        }

        .res-payments__modal {
          background: #ffffff;
          width: 100%;
          max-width: 480px;
          border-radius: var(--radius-2xl);
          padding: var(--space-md);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
          animation: scaleUp 0.2s ease-out;
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .res-payments__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .res-payments__modal-header h3 {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
        }

        .res-payments__modal-close {
          background: transparent;
          color: var(--color-on-surface-variant);
          padding: 4px;
          display: flex;
        }

        .res-payments__modal-dropzone {
          border: 2px dashed var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-lg) var(--space-md);
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .res-payments__modal-dropzone:hover {
          border-color: var(--color-secondary);
        }

        .res-payments__modal-dropzone .material-symbols-outlined {
          font-size: 48px;
          color: var(--color-secondary);
          margin-bottom: var(--space-sm);
        }

        .res-payments__modal-fields {
          margin: var(--space-md) 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .res-payments__modal-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .res-payments__modal-label span {
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }

        .res-payments__modal-label select,
        .res-payments__modal-label input {
          padding: 10px 14px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          outline: none;
          background: #ffffff;
        }

        .res-payments__empty-levies {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          background: var(--color-surface-container-low);
          border-radius: var(--radius-xl);
          color: var(--color-on-tertiary-container);
          text-align: center;
          gap: var(--space-sm);
        }

        .res-payments__empty-levies .material-symbols-outlined {
          font-size: 36px;
        }
      `}</style>
    </ResidentLayout>
  )
}
