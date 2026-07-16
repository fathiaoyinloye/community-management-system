import { useMemo, useState } from 'react'
import PlatformAdminLayout from '../../layouts/PlatformAdminLayout'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { useAuth } from '../../store/AuthContext'
import { CommunitiesProvider, useCommunities } from '../../store/CommunitiesContext'

type FilterTab = 'all' | 'active' | 'pending_setup' | 'archived'

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending_setup', label: 'Pending' },
  { key: 'archived', label: 'Archive' },
]

const ACTIVITY_FEED = [
  {
    icon: 'domain_add',
    tone: 'indigo',
    title: 'New Community Onboarded',
    description: 'Sunrise Meadows (Oyo) was added to the platform.',
    time: '2 hours ago',
  },
  {
    icon: 'mail',
    tone: 'emerald',
    title: 'Admin Invite Sent',
    description: 'Invitation issued to chidi.umeh@communaltrust.com for Harmony Heights.',
    time: '5 hours ago',
  },
  {
    icon: 'credit_card_off',
    tone: 'rose',
    title: 'Collection Below Target',
    description: 'Greenwood Court levy collection dropped to 78% this cycle.',
    time: 'Yesterday',
  },
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function PlatformAdminDashboardPage() {
  return (
    <CommunitiesProvider>
      <PlatformAdminDashboard />
    </CommunitiesProvider>
  )
}

function PlatformAdminDashboard() {
  const { user } = useAuth()
  const { communities, isLoading } = useCommunities()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const totalCommunities = communities.length
  const pendingCount = communities.filter((community) => community.status === 'pending_setup').length
  const activationRate =
    totalCommunities === 0 ? 0 : Math.round(((totalCommunities - pendingCount) / totalCommunities) * 100)

  const filteredCommunities = useMemo(() => {
    if (activeTab === 'all') return communities
    if (activeTab === 'archived') return []
    return communities.filter((community) => community.status === activeTab)
  }, [communities, activeTab])

  return (
    <PlatformAdminLayout>
      <div className="pa-dash">
        <div className="pa-dash__header">
          <div>
            <h2 className="pa-dash__heading">Overview</h2>
            <p className="pa-dash__subheading">
              Welcome back, {user?.name ?? 'Admin'}. Here&apos;s how the network is performing today.
            </p>
          </div>
          <button type="button" className="pa-dash__range-btn">
            <span className="material-symbols-outlined">calendar_today</span>
            Last 30 Days
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </button>
        </div>

        <div className="pa-dash__grid">
          <div className="pa-dash__card">
            <div className="pa-dash__stat-head">
              <span className="pa-dash__stat-label">Total Communities</span>
              <div className="pa-dash__stat-icon pa-dash__stat-icon--indigo">
                <span className="material-symbols-outlined">domain</span>
              </div>
            </div>
            <h3 className="pa-dash__stat-value">{isLoading ? '—' : totalCommunities}</h3>
            <div className="pa-dash__stat-foot">
              <Badge variant="success" icon="trending_up">
                +3.2%
              </Badge>
              <span className="pa-dash__stat-note">2 onboarded this month</span>
            </div>
          </div>

          <div className="pa-dash__card">
            <div className="pa-dash__stat-head">
              <span className="pa-dash__stat-label">Platform Collection Rate</span>
              <div className="pa-dash__stat-icon pa-dash__stat-icon--emerald">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
            </div>
            <h3 className="pa-dash__stat-value">94.2%</h3>
            <div className="pa-dash__stat-foot">
              <Badge variant="success" icon="check_circle">
                On Target
              </Badge>
              <span className="pa-dash__stat-note">Levies collected across all communities</span>
            </div>
          </div>

          <div className="pa-dash__card">
            <div className="pa-dash__stat-head">
              <span className="pa-dash__stat-label">Pending Admin Approvals</span>
              <div className="pa-dash__stat-icon pa-dash__stat-icon--rose">
                <span className="material-symbols-outlined">pending</span>
              </div>
            </div>
            <h3 className="pa-dash__stat-value">{isLoading ? '—' : pendingCount}</h3>
            <div className="pa-dash__stat-foot">
              <Badge variant="danger" icon="priority_high">
                Needs Action
              </Badge>
              <span className="pa-dash__stat-note">Awaiting account setup</span>
            </div>
          </div>

          <div className="pa-dash__card pa-dash__card--health">
            <div className="pa-dash__health-head">
              <div>
                <h4 className="pa-dash__card-title">Network Health Index</h4>
                <p className="pa-dash__card-subtitle">
                  Holistic performance tracking across the platform.
                </p>
              </div>
              <Badge variant="success">Excellent</Badge>
            </div>
            <div className="pa-dash__health-body">
              <div className="pa-dash__metrics">
                <div className="pa-dash__metric">
                  <div className="pa-dash__metric-head">
                    <span>Admin Activation Rate</span>
                    <span className="pa-dash__metric-value">
                      {isLoading ? '—' : `${activationRate}%`}
                    </span>
                  </div>
                  <div className="pa-dash__meter">
                    <div className="pa-dash__meter-fill" style={{ width: `${activationRate}%` }} />
                  </div>
                </div>
                <div className="pa-dash__metric">
                  <div className="pa-dash__metric-head">
                    <span>Aggregate Levy Collection</span>
                    <span className="pa-dash__metric-value">88%</span>
                  </div>
                  <div className="pa-dash__meter">
                    <div className="pa-dash__meter-fill" style={{ width: '88%' }} />
                  </div>
                </div>
                <div className="pa-dash__metric">
                  <div className="pa-dash__metric-head">
                    <span>Support Response Efficiency</span>
                    <span className="pa-dash__metric-value">95%</span>
                  </div>
                  <div className="pa-dash__meter">
                    <div className="pa-dash__meter-fill" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
              <div className="pa-dash__map">
                <span className="material-symbols-outlined">architecture</span>
                <p className="pa-dash__map-title">Community Distribution</p>
                <p className="pa-dash__map-copy">Geographic view of every onboarded community</p>
                <button type="button" className="pa-dash__map-btn">
                  View Full Map
                </button>
              </div>
            </div>
          </div>

          <div className="pa-dash__card pa-dash__card--feed">
            <div className="pa-dash__feed-head">
              <h4 className="pa-dash__card-title">Platform Activity</h4>
              <span className="material-symbols-outlined">more_horiz</span>
            </div>
            <div className="pa-dash__feed-list">
              {ACTIVITY_FEED.map((item) => (
                <div key={item.title} className="pa-dash__feed-item">
                  <div className={`pa-dash__feed-icon pa-dash__feed-icon--${item.tone}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="pa-dash__feed-title">{item.title}</p>
                    <p className="pa-dash__feed-desc">{item.description}</p>
                    <p className="pa-dash__feed-time">
                      <span className="material-symbols-outlined">schedule</span>
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="pa-dash__audit-btn">
              View Audit Log
            </button>
          </div>
        </div>

        <div className="pa-dash__table-card">
          <div className="pa-dash__table-head">
            <div>
              <h4 className="pa-dash__card-title">Communities</h4>
              <p className="pa-dash__card-subtitle">Manage every community onboarded to the platform.</p>
            </div>
            <div className="pa-dash__tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={activeTab === tab.key ? 'pa-dash__tab pa-dash__tab--active' : 'pa-dash__tab'}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="pa-dash__loading">
              <Spinner />
              <span>Loading communities…</span>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <EmptyState
              icon="domain"
              title="No communities here yet"
              description="Communities in this status will show up here."
            />
          ) : (
            <div className="pa-dash__rows">
              {filteredCommunities.map((community) => (
                <div key={community.id} className="pa-dash__row">
                  <div className="pa-dash__row-icon">
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                  <div className="pa-dash__row-main">
                    <h5>{community.name}</h5>
                    <p>
                      {community.adminName} · {community.lga}, {community.state}
                    </p>
                  </div>
                  <div className="pa-dash__row-meta">
                    <div className="pa-dash__row-date">
                      <p>{formatDate(community.createdAt)}</p>
                      <span>Onboarded</span>
                    </div>
                    <div className="pa-dash__row-houses">
                      <p>{community.housesCount}</p>
                      <span>Houses</span>
                    </div>
                    <Badge
                      variant={community.status === 'active' ? 'success' : 'warning'}
                      icon={community.status === 'active' ? 'verified' : undefined}
                    >
                      {community.status === 'active' ? 'Active' : 'Pending Setup'}
                    </Badge>
                    <button type="button" className="pa-dash__row-action">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pa-dash__table-foot">
            <p>
              Showing {filteredCommunities.length} of {communities.length} communities
            </p>
            <div className="pa-dash__pagination">
              <button type="button" disabled>
                Previous
              </button>
              <button type="button">Next</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pa-dash__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .pa-dash__heading {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .pa-dash__subheading {
          color: var(--color-on-surface-variant);
          margin-top: 4px;
        }

        .pa-dash__range-btn {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 10px var(--space-md);
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          font-size: var(--text-label-md);
          color: #0f172a;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .pa-dash__range-btn:hover {
          background: var(--color-surface-container-low);
        }

        .pa-dash__range-btn .material-symbols-outlined {
          font-size: 20px;
        }

        .pa-dash__grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .pa-dash__card {
          grid-column: span 12;
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-2xl);
          padding: var(--space-md);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }

        .pa-dash__card:hover {
          border-color: var(--color-secondary);
        }

        .pa-dash__stat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
        }

        .pa-dash__stat-label {
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: var(--color-on-surface-variant);
        }

        .pa-dash__stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pa-dash__stat-icon--indigo {
          background: #eef2ff;
          color: var(--color-secondary);
        }

        .pa-dash__stat-icon--emerald {
          background: #ecfdf5;
          color: #059669;
        }

        .pa-dash__stat-icon--rose {
          background: #fff1f2;
          color: #e11d48;
        }

        .pa-dash__stat-value {
          font-family: var(--font-display);
          font-size: var(--text-display-lg);
          color: #0f172a;
        }

        .pa-dash__stat-foot {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-sm);
          flex-wrap: wrap;
        }

        .pa-dash__stat-note {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
        }

        .pa-dash__card-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          color: #0f172a;
        }

        .pa-dash__card-subtitle {
          font-size: 14px;
          color: var(--color-on-surface-variant);
          margin-top: 4px;
        }

        .pa-dash__health-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
          gap: var(--space-sm);
        }

        .pa-dash__health-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-lg);
        }

        .pa-dash__metrics {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          padding: var(--space-xs) 0;
        }

        .pa-dash__metric-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-sm);
          font-size: var(--text-label-md);
          font-weight: 600;
          color: #0f172a;
        }

        .pa-dash__metric-value {
          font-family: var(--font-display);
          font-size: 24px;
          color: var(--color-secondary);
        }

        .pa-dash__meter {
          width: 100%;
          height: 12px;
          background: var(--color-surface-container);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .pa-dash__meter-fill {
          height: 100%;
          background: var(--color-secondary);
          border-radius: var(--radius-full);
          box-shadow: 0 0 8px rgba(70, 72, 212, 0.3);
          transition: width 0.4s ease;
        }

        .pa-dash__map {
          position: relative;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          border: 1px solid var(--color-outline-variant);
          background: #0f172a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          aspect-ratio: 16 / 9;
          padding: var(--space-md);
        }

        .pa-dash__map .material-symbols-outlined {
          color: #ffffff;
          font-size: 48px;
          opacity: 0.8;
          margin-bottom: var(--space-sm);
        }

        .pa-dash__map-title {
          color: #ffffff;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: var(--text-headline-md);
          margin-bottom: 4px;
        }

        .pa-dash__map-copy {
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: var(--space-md);
        }

        .pa-dash__map-btn {
          padding: 8px var(--space-md);
          background: #ffffff;
          color: #0f172a;
          border-radius: var(--radius-xl);
          font-size: var(--text-label-md);
        }

        .pa-dash__map-btn:hover {
          background: #eef2ff;
        }

        .pa-dash__feed-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
        }

        .pa-dash__feed-head .material-symbols-outlined {
          color: var(--color-on-surface-variant);
          cursor: pointer;
        }

        .pa-dash__feed-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          max-height: 420px;
          overflow-y: auto;
        }

        .pa-dash__feed-item {
          display: flex;
          gap: var(--space-sm);
        }

        .pa-dash__feed-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
        }

        .pa-dash__feed-icon--indigo {
          background: #eef2ff;
          color: var(--color-secondary);
          border-color: #e0e7ff;
        }

        .pa-dash__feed-icon--emerald {
          background: #ecfdf5;
          color: #059669;
          border-color: #d1fae5;
        }

        .pa-dash__feed-icon--rose {
          background: #fff1f2;
          color: #e11d48;
          border-color: #ffe4e6;
        }

        .pa-dash__feed-title {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: #0f172a;
        }

        .pa-dash__feed-desc {
          font-size: 14px;
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .pa-dash__feed-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-on-surface-variant);
          opacity: 0.6;
          margin-top: 8px;
        }

        .pa-dash__feed-time .material-symbols-outlined {
          font-size: 12px;
        }

        .pa-dash__audit-btn {
          margin-top: var(--space-lg);
          width: 100%;
          padding: 14px;
          text-align: center;
          color: #0f172a;
          font-weight: 700;
          font-size: var(--text-label-md);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
        }

        .pa-dash__audit-btn:hover {
          background: var(--color-surface-container-low);
        }

        .pa-dash__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }

        .pa-dash__table-head {
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
          align-items: center;
          justify-content: space-between;
        }

        .pa-dash__tabs {
          display: flex;
          padding: 4px;
          background: var(--color-surface-container);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
        }

        .pa-dash__tab {
          padding: 8px var(--space-md);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
        }

        .pa-dash__tab--active {
          background: #ffffff;
          color: #0f172a;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .pa-dash__loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-xl);
          color: var(--color-on-surface-variant);
        }

        .pa-dash__rows {
          display: flex;
          flex-direction: column;
        }

        .pa-dash__row {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
          transition: background-color 0.2s ease;
        }

        .pa-dash__row:last-child {
          border-bottom: none;
        }

        .pa-dash__row:hover {
          background: var(--color-surface-container-low);
        }

        .pa-dash__row-icon {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: var(--radius-2xl);
          background: #eef2ff;
          color: var(--color-secondary);
          border: 1px solid #e0e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pa-dash__row-main {
          flex-grow: 1;
          min-width: 0;
        }

        .pa-dash__row-main h5 {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: #0f172a;
        }

        .pa-dash__row-main p {
          font-size: 14px;
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .pa-dash__row-meta {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          flex-shrink: 0;
        }

        .pa-dash__row-date,
        .pa-dash__row-houses {
          text-align: right;
        }

        .pa-dash__row-date p,
        .pa-dash__row-houses p {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: #0f172a;
        }

        .pa-dash__row-date span,
        .pa-dash__row-houses span {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
        }

        .pa-dash__row-action {
          padding: var(--space-sm);
          border-radius: var(--radius-xl);
          color: var(--color-on-surface-variant);
          border: 1px solid transparent;
        }

        .pa-dash__row-action:hover {
          background: var(--color-secondary);
          color: #ffffff;
        }

        .pa-dash__table-foot {
          padding: var(--space-sm) var(--space-md);
          background: var(--color-surface-container-low);
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pa-dash__table-foot p {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
        }

        .pa-dash__pagination {
          display: flex;
          gap: var(--space-xs);
        }

        .pa-dash__pagination button {
          padding: 6px var(--space-sm);
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: #0f172a;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: #ffffff;
        }

        .pa-dash__pagination button:hover:not(:disabled) {
          background: var(--color-surface-container);
        }

        .pa-dash__pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (min-width: 768px) {
          .pa-dash__card {
            grid-column: span 4;
          }

          .pa-dash__card--health {
            grid-column: span 8;
          }

          .pa-dash__card--feed {
            grid-column: span 4;
          }
        }

        @media (min-width: 1024px) {
          .pa-dash__health-body {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </PlatformAdminLayout>
  )
}
