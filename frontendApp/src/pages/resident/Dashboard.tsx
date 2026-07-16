import { useState, type FormEvent } from 'react'
import ResidentLayout from '../../layouts/ResidentLayout'

interface LevyItem {
  id: string
  name: string
  period: string
  amount: number
  dueDate: string
  icon: string
}

interface PaymentItem {
  id: string
  date: string
  amount: number
  status: 'successful' | 'pending' | 'failed'
}

interface UpdateItem {
  id: string
  type: string
  title: string
  content: string
  imageUrl: string
}

export default function ResidentDashboard() {
  // Live State
  const [balance, setBalance] = useState(1240.50)
  const [payments, setPayments] = useState<PaymentItem[]>([
    { id: '#TXN-98210', date: 'Sep 12, 2023', amount: 1240.50, status: 'successful' },
    { id: '#TXN-98154', date: 'Aug 15, 2023', amount: 1240.50, status: 'successful' },
    { id: '#TXN-97882', date: 'Jul 20, 2023', amount: 85.00, status: 'pending' },
  ])

  const [levies] = useState<LevyItem[]>([
    {
      id: 'l1',
      name: 'Monthly Electricity Usage',
      period: 'Sept 1 - Sept 30, 2023',
      amount: 182.40,
      dueDate: 'Due Oct 15',
      icon: 'bolt',
    },
    {
      id: 'l2',
      name: 'Water & Sewage',
      period: 'Sept 1 - Sept 30, 2023',
      amount: 45.10,
      dueDate: 'Due Oct 15',
      icon: 'water_drop',
    },
    {
      id: 'l3',
      name: 'Community Security Levy',
      period: 'Fixed Monthly',
      amount: 75.00,
      dueDate: 'Due Oct 15',
      icon: 'security',
    },
  ])

  const [updates] = useState<UpdateItem[]>([
    {
      id: 'u1',
      type: 'Event',
      title: 'Garden Clean-up Day',
      content: 'Join us this Saturday for our quarterly community garden spruce-up and social mixer.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gIRL4dTvjrTlKYAuPkk4Cmb7VBCNH4l4VpA1_2X8vwupd5Dz7AlI9Hl1Dw2qG8l_QkKTyezKlry9lmBHhJc8f-gUoP_QC-HrjLoJ1Sm5bvDcy5b-tGVuS8rpvc3SBdD55d0_VBJQVrJQNydr1jMRfgfpg5pd7wEL8Sp6Sv3y9mDjnf9wfLAWNkp7djv0ljCQJWGB1KgAJW061vAckCpoinaL7tAARz1CEeQ-0xqPF-YHxZV3YIv3hIx1gkOxacnUKjvqmpWsv-8',
    },
    {
      id: 'u2',
      type: 'Project',
      title: 'Solar Grid Integration',
      content: 'The installation of Phase 2 solar panels is scheduled to begin next Tuesday on Roof A.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOp2UM2-pBOQcG79XbnY-u1Y0DejHa-RZxUaskBI9DND7Jj6citJdjvH-6AUk_aUKi3YYVoKxGkLrXaywZ8U-DgEZkPohB6Se1X7V2XZ0pCZDc0r23ckwrK3IiCK-sV3i4kHvv23U89zT9rYC7u-kDRIaYGjISh4As0517P7vcPzchJGOl3vjjPc1gy3Ax39QNegCA6Pq6vLT2dHHmjWfbQIUKGf28G1kqPn3CtXlq9UMXUwn1Oh9UBA1zDfyjEqAH3RuAxRL2Vm0',
    },
    {
      id: 'u3',
      type: 'Facility',
      title: 'Gym Maintenance',
      content: 'The community gym will be closed for routine machine servicing from 8 AM to 12 PM this Friday.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlElvjp8DBZ9k3eVIHRpuEjOjcVPlYqfV4uNqB2p6K4gwIFZpPM_svcrO5YybrXUERzHbgnhn7DWG3InHfiQb6942XsoOLDZ3e5M877g3a2F7_pxmQ2dvwFjKHjm73LbmZv-IyYJ3H3_Gr5Zgg-DtkYXc2l4gY1x8lsP5aD5v1tc3e7S5TcHRMo9Q496EZ2fC0vYWZIkOqEsZOWzTlwr-N1aRlPpoKR4Fgvy7FuzwzwKImX1WaID78upNuui4l4rKsWmLdEJc_1w0',
    },
    {
      id: 'u4',
      type: 'Notice',
      title: 'Town Hall: Budget 2024',
      content: 'Review the upcoming year\'s infrastructure budget in our annual resident town hall meeting.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASSeGi6xr5USthTM0EM1GE9zPw3EhFmQHFWEzLiBJIBw-r3CUcWABdR452jOPSx74eC_WLV9FAitLhnTaZfCTJhEWecZNhsmegztoFe7YahpsqBmqFisI2QW2UY9xp9BPkyYJlnPdGujOWxy1mHLBQ1cgOcQ2yLByGAgZi39v9MhNqWdBg7qCBIIuVY2xYJrJFaQRlsyGxypFOcbgjYjdfPIkt0D2b-QWDiiEFOrnoUKW5Q6WTZ8kegyG95Z8pR4BiB_6kcfGpOgg',
    },
  ])

  // Modals & User Feedback
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [isPaying, setIsPaying] = useState(false)

  // Maintenance Request Form State
  const [requestTitle, setRequestTitle] = useState('')
  const [requestDescription, setRequestDescription] = useState('')
  const [requestCategory, setRequestCategory] = useState('plumbing')
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handlePayNow = () => {
    setPaymentAmount(balance.toFixed(2))
    setPaymentReference(`REF-${Math.floor(100000 + Math.random() * 900000)}`)
    setIsPaymentModalOpen(true)
  }

  const submitPayment = (e: FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(paymentAmount)
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid payment amount.')
      return
    }

    setIsPaying(true)
    setTimeout(() => {
      const newTxn: PaymentItem = {
        id: `#TXN-${Math.floor(90000 + Math.random() * 10000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: amt,
        status: 'pending',
      }
      setPayments((current) => [newTxn, ...current])
      setBalance((current) => Math.max(0, current - amt))
      setIsPaying(false)
      setIsPaymentModalOpen(false)
      showToast(`Payment of ₦${amt.toLocaleString()} submitted successfully! Status is pending verification.`)
    }, 1000)
  }

  const handleNewRequest = () => {
    setIsRequestModalOpen(true)
  }

  const submitRequest = (e: FormEvent) => {
    e.preventDefault()
    if (!requestTitle.trim() || !requestDescription.trim()) {
      alert('Please fill in all request fields.')
      return
    }

    setIsSubmittingRequest(true)
    setTimeout(() => {
      setIsSubmittingRequest(false)
      setIsRequestModalOpen(false)
      setRequestTitle('')
      setRequestDescription('')
      showToast('Maintenance request submitted successfully! Community staff will review it shortly.')
    }, 1000)
  }

  const handleDownloadStatement = () => {
    const text = `CommunalTrust - Resident Financial Statement\nOutstanding Balance: ₦${balance.toFixed(2)}\n\nRecent Transactions:\n` +
      payments.map(p => `${p.date} - ${p.id} - ₦${p.amount.toFixed(2)} - ${p.status.toUpperCase()}`).join('\n')
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `financial_statement_${new Date().toISOString().slice(0, 10)}.txt`
    link.click()
    showToast('Statement statement download started...')
  }

  return (
    <ResidentLayout onNewRequest={handleNewRequest}>
      <div className="rd">
        {toastMessage && (
          <div className="rd__toast">
            <span className="material-symbols-outlined">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Hero Section: Financial & Property Overview */}
        <section className="rd__hero">
          {/* Financial Overview Card */}
          <div className="rd__hero-financial lift-hover">
            <div className="rd__hero-financial-content">
              <h2 className="rd__hero-title">Financial Overview</h2>
              <p className="rd__hero-subtitle">Current cycle outstanding balance</p>
              <div className="rd__balance-wrap">
                <span className="rd__balance-value">₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                {balance > 0 && <span className="rd__due-tag">Due in 5 days</span>}
              </div>
            </div>
            <div className="rd__hero-actions">
              <button
                type="button"
                className="btn btn-primary rd__pay-btn"
                onClick={handlePayNow}
                disabled={balance === 0}
              >
                Pay Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                type="button"
                className="rd__statement-btn"
                onClick={handleDownloadStatement}
              >
                Download Statement
              </button>
            </div>
            {/* Decorative background shape */}
            <div className="rd__hero-decor"></div>
          </div>

          {/* My Property Card */}
          <div className="rd__hero-property lift-hover">
            <div className="rd__property-banner">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC41KtUiL55WM0Os_T1-x7KxzPqnDx9cAuo3_ZjrQSJypho-wNs22pqmC4FWZTfJhNSVQlhBxwpVeK8hcudTu3OhG9Pni6nbNeEK0uA4nl994RhnHYjgvJ-lCpbnhMT6qmwd7cSC61r7r-rTo1AEkXVPtH2G8yREuMezP0tmd4Wsc8JPvC9RcHGmDJq5ugM1VyQuf6LPT7cndclz3RKe-j5DNl3N0MdYkFafqnc9XI21nZmbHmdLT8AK-n3JQbF2Gw2Xbu_WpydxZA"
                alt="Skyline View Estates Facade"
              />
              <div className="rd__residency-badge">
                <span className="rd__badge-dot animate-pulse"></span>
                Active Residency
              </div>
            </div>
            <div className="rd__property-body">
              <h2 className="rd__property-unit">Unit 402-B</h2>
              <p className="rd__property-name">Skyline View Estates</p>
              <div className="rd__property-details">
                <div className="rd__detail-row">
                  <span>Type</span>
                  <strong>3 Bedroom Luxury</strong>
                </div>
                <div className="rd__detail-row">
                  <span>Lease Term</span>
                  <strong>Ends Aug 2025</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Section: Levies and Transactions */}
        <section className="rd__secondary">
          {/* Upcoming Levies */}
          <div>
            <div className="rd__section-header">
              <h3 className="rd__section-title">Upcoming Levies</h3>
              <button type="button" className="rd__section-link" onClick={() => showToast('Redirecting to levy payments...')}>View All</button>
            </div>
            <div className="rd__levy-list">
              {levies.map((levy) => (
                <div key={levy.id} className="rd__levy-item lift-hover">
                  <div className="rd__levy-icon-wrap">
                    <span className="material-symbols-outlined">{levy.icon}</span>
                  </div>
                  <div className="rd__levy-content">
                    <h4>{levy.name}</h4>
                    <p>{levy.period}</p>
                  </div>
                  <div className="rd__levy-right">
                    <strong>₦{levy.amount.toFixed(2)}</strong>
                    <span>{levy.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payment History */}
          <div>
            <div className="rd__section-header">
              <h3 className="rd__section-title">Recent Payments</h3>
              <button type="button" className="rd__section-link" onClick={() => showToast('Redirecting to payment history...')}>View History</button>
            </div>
            <div className="rd__table-card">
              <table className="rd__table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="rd__txn-id">{p.id}</td>
                      <td>{p.date}</td>
                      <td className="rd__txn-amount">₦{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span className={`rd__status-badge rd__status-badge--${p.status}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Community Updates */}
        <section className="rd__updates">
          <div className="rd__section-header">
            <h3 className="rd__section-title">Community Updates</h3>
            <div className="rd__updates-nav">
              <button type="button" onClick={() => showToast('Navigating updates...')}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" onClick={() => showToast('Navigating updates...')}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="rd__updates-grid">
            {updates.map((item) => (
              <div key={item.id} className="rd__update-card lift-hover">
                <div className="rd__update-banner">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <div className="rd__update-body">
                  <span className="rd__update-type">{item.type}</span>
                  <h4 className="rd__update-title">{item.title}</h4>
                  <p className="rd__update-desc">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Pay Now Modal */}
      {isPaymentModalOpen && (
        <div className="rd-modal__overlay" role="dialog" aria-modal="true">
          <div className="rd-modal__panel">
            <button
              type="button"
              className="rd-modal__close"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="rd-modal__title">Submit Payment Proof</h3>
            <p className="rd-modal__subtitle">Upload bank transfer information to settle outstanding bills.</p>

            <form onSubmit={submitPayment} className="rd-modal__form">
              <div className="rd-modal__field">
                <label>Amount to Pay (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  disabled={isPaying}
                  required
                />
              </div>

              <div className="rd-modal__field">
                <label>Bank Reference / Txn Ref</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  disabled={isPaying}
                  required
                />
              </div>

              <div className="rd-modal__field">
                <label>Proof of Payment Document (Fake URL)</label>
                <input
                  type="text"
                  defaultValue="https://communaltrust.s3.amazonaws.com/receipts/proof_402b.pdf"
                  disabled={isPaying}
                />
              </div>

              <div className="rd-modal__actions">
                <button
                  type="button"
                  className="rd-modal__btn-cancel"
                  onClick={() => setIsPaymentModalOpen(false)}
                  disabled={isPaying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rd-modal__btn-submit"
                  disabled={isPaying}
                >
                  {isPaying ? 'Processing...' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Maintenance Request Modal */}
      {isRequestModalOpen && (
        <div className="rd-modal__overlay" role="dialog" aria-modal="true">
          <div className="rd-modal__panel">
            <button
              type="button"
              className="rd-modal__close"
              onClick={() => setIsRequestModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="rd-modal__title">Create Maintenance Request</h3>
            <p className="rd-modal__subtitle">Report structural or utility faults in your residential unit.</p>

            <form onSubmit={submitRequest} className="rd-modal__form">
              <div className="rd-modal__field">
                <label>Request Title</label>
                <input
                  type="text"
                  placeholder="e.g. Water leak in main bathroom"
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  disabled={isSubmittingRequest}
                  required
                />
              </div>

              <div className="rd-modal__field">
                <label>Utility Category</label>
                <select
                  value={requestCategory}
                  onChange={(e) => setRequestCategory(e.target.value)}
                  disabled={isSubmittingRequest}
                >
                  <option value="plumbing">Plumbing & Water</option>
                  <option value="electrical">Electrical Grid</option>
                  <option value="hvac">Air Conditioning & HVAC</option>
                  <option value="carpentry">Carpentry & Structural</option>
                  <option value="other">Other Concerns</option>
                </select>
              </div>

              <div className="rd-modal__field">
                <label>Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the severity of the fault..."
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  disabled={isSubmittingRequest}
                  required
                />
              </div>

              <div className="rd-modal__actions">
                <button
                  type="button"
                  className="rd-modal__btn-cancel"
                  onClick={() => setIsRequestModalOpen(false)}
                  disabled={isSubmittingRequest}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rd-modal__btn-submit"
                  disabled={isSubmittingRequest}
                >
                  {isSubmittingRequest ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .rd {
          position: relative;
        }

        .rd__toast {
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
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .rd__hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-gutter);
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 1024px) {
          .rd__hero {
            grid-template-columns: 2fr 1fr;
          }
        }

        .rd__hero-financial {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .rd__hero-financial-content {
          position: relative;
          z-index: 10;
        }

        .rd__hero-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .rd__hero-subtitle {
          font-size: var(--text-body-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .rd__balance-wrap {
          display: flex;
          align-items: baseline;
          gap: var(--space-xs);
          margin-bottom: var(--space-lg);
        }

        .rd__balance-value {
          font-family: var(--font-display);
          font-size: var(--text-display-lg);
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1;
        }

        .rd__due-tag {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          font-weight: 500;
        }

        .rd__hero-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          position: relative;
          z-index: 10;
        }

        .rd__pay-btn {
          padding: var(--space-sm) var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .rd__pay-btn .material-symbols-outlined {
          font-size: 18px;
        }

        .rd__statement-btn {
          background: transparent;
          border: 1px solid var(--color-outline-variant);
          color: var(--color-secondary);
          border-radius: var(--radius-lg);
          font-weight: 700;
          font-size: var(--text-label-md);
          padding: var(--space-sm) var(--space-md);
          transition: background-color 0.2s ease;
        }

        .rd__statement-btn:hover {
          background: var(--color-surface-container-low);
        }

        .rd__hero-decor {
          position: absolute;
          right: -64px;
          top: -64px;
          width: 256px;
          height: 256px;
          background: rgba(70, 72, 212, 0.04);
          border-radius: var(--radius-full);
          filter: blur(48px);
        }

        .rd__hero-property {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }

        .rd__property-banner {
          height: 160px;
          position: relative;
          background: var(--color-surface-variant);
        }

        .rd__property-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rd__residency-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 148, 133, 0.1);
          color: var(--color-on-tertiary-container);
          backdrop-filter: blur(8px);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: var(--text-label-sm);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rd__badge-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--color-on-tertiary-container);
        }

        .rd__property-body {
          padding: var(--space-md);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .rd__property-unit {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__property-name {
          font-size: var(--text-body-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .rd__property-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .rd__detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--color-surface-container-low);
        }

        .rd__detail-row:last-child {
          border-bottom: none;
        }

        .rd__detail-row span {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
        }

        .rd__detail-row strong {
          font-size: var(--text-label-md);
          color: var(--color-primary);
        }

        .rd__secondary {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 1200px) {
          .rd__secondary {
            grid-template-columns: 1fr 1fr;
          }
        }

        .rd__section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }

        .rd__section-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          color: var(--color-primary);
        }

        .rd__section-link {
          background: transparent;
          color: var(--color-secondary);
          font-weight: 700;
          font-size: var(--text-label-md);
        }

        .rd__section-link:hover {
          text-decoration: underline;
        }

        .rd__levy-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .rd__levy-item {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .rd__levy-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--color-surface-container-low);
          color: var(--color-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rd__levy-icon-wrap .material-symbols-outlined {
          font-size: 24px;
        }

        .rd__levy-content {
          flex-grow: 1;
        }

        .rd__levy-content h4 {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__levy-content p {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .rd__levy-right {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .rd__levy-right strong {
          font-size: var(--text-label-md);
          color: var(--color-primary);
        }

        .rd__levy-right span {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .rd__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .rd__table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .rd__table thead {
          background: var(--color-surface-container-low);
        }

        .rd__table th {
          padding: 12px var(--space-md);
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          color: var(--color-on-surface-variant);
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .rd__table td {
          padding: 16px var(--space-md);
          font-size: var(--text-label-md);
          border-bottom: 1px solid var(--color-surface-container-low);
        }

        .rd__table tr:last-child td {
          border-bottom: none;
        }

        .rd__txn-id {
          color: var(--color-on-surface-variant);
        }

        .rd__txn-amount {
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__status-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .rd__status-badge--successful {
          background: rgba(79, 219, 200, 0.2);
          color: var(--color-on-tertiary-fixed-variant);
        }

        .rd__status-badge--pending {
          background: rgba(255, 218, 214, 0.4);
          color: var(--color-error);
        }

        .rd__updates {
          margin-bottom: var(--space-xl);
        }

        .rd__updates-nav {
          display: flex;
          gap: var(--space-xs);
        }

        .rd__updates-nav button {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-outline-variant);
          background: #ffffff;
          color: var(--color-on-surface-variant);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .rd__updates-nav button:hover {
          background: var(--color-surface-container-low);
        }

        .rd__updates-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-gutter);
        }

        @media (min-width: 640px) {
          .rd__updates-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .rd__updates-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .rd__update-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }

        .rd__update-banner {
          height: 128px;
          overflow: hidden;
          background: var(--color-surface-container-low);
        }

        .rd__update-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .rd__update-card:hover .rd__update-banner img {
          transform: scale(1.1);
        }

        .rd__update-body {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .rd__update-type {
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: var(--color-secondary);
          text-transform: uppercase;
        }

        .rd__update-title {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__update-desc {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Modal styling */
        .rd-modal__overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: var(--space-md);
        }

        .rd-modal__panel {
          background: #ffffff;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 500px;
          position: relative;
          padding: var(--space-md);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .rd-modal__close {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          background: transparent;
          color: var(--color-on-surface-variant);
        }

        .rd-modal__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd-modal__subtitle {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .rd-modal__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .rd-modal__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .rd-modal__field label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }

        .rd-modal__field input,
        .rd-modal__field select,
        .rd-modal__field textarea {
          padding: 10px 14px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          outline: none;
          background: #ffffff;
        }

        .rd-modal__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
        }

        .rd-modal__btn-cancel {
          padding: var(--space-sm) var(--space-md);
          background: transparent;
          color: var(--color-on-surface-variant);
          font-weight: 600;
          font-size: var(--text-label-md);
        }

        .rd-modal__btn-submit {
          padding: var(--space-sm) var(--space-md);
          font-size: var(--text-label-md);
        }

        .lift-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .lift-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(70, 72, 212, 0.08);
        }
      `}</style>
    </ResidentLayout>
  )
}
