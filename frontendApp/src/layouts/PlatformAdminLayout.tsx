import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import CreateCommunityModal from '../components/CreateCommunityModal'

interface NavItem {
  label: string
  icon: string
  to?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', to: '/platform-admin/dashboard' },
  { label: 'Communities', icon: 'domain', to: '/platform-admin/communities' },
  { label: 'Admins', icon: 'manage_accounts' },
  { label: 'Payments', icon: 'payments' },
  { label: 'Reports', icon: 'monitoring' },
  { label: 'Settings', icon: 'settings' },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface PlatformAdminLayoutProps {
  children: ReactNode
}

export default function PlatformAdminLayout({ children }: PlatformAdminLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/platform-admin/login', { replace: true })
  }

  return (
    <div className="pa-layout">
      <aside className="pa-layout__sidebar">
        <div className="pa-layout__brand">
          <div className="pa-layout__brand-mark">CT</div>
          <div>
            <h1 className="pa-layout__brand-name">CommunalTrust</h1>
            <p className="pa-layout__brand-label">Platform Admin</p>
          </div>
        </div>

        <nav className="pa-layout__nav">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'pa-layout__nav-item pa-layout__nav-item--active' : 'pa-layout__nav-item'
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                type="button"
                className="pa-layout__nav-item pa-layout__nav-item--soon"
                disabled
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
                <span className="pa-layout__soon-tag">Soon</span>
              </button>
            ),
          )}
        </nav>

        <div className="pa-layout__sidebar-footer">
          <button
            type="button"
            className="btn btn-dark pa-layout__invite"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="material-symbols-outlined">domain_add</span>
            New Community
          </button>
          <button type="button" className="pa-layout__footer-link" disabled>
            <span className="material-symbols-outlined">contact_support</span>
            Support
          </button>
          <button
            type="button"
            className="pa-layout__footer-link pa-layout__footer-link--danger"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="pa-layout__main">
        <header className="pa-layout__topbar">
          <div className="pa-layout__search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search across communities, admins, or payments…" />
          </div>

          <div className="pa-layout__topbar-actions">
            <button type="button" className="pa-layout__icon-btn" disabled>
              <span className="material-symbols-outlined">notifications</span>
              <span className="pa-layout__icon-dot" />
            </button>
            <button type="button" className="pa-layout__icon-btn" disabled>
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="pa-layout__divider" />
            <div className="pa-layout__profile">
              <div className="pa-layout__avatar">{user ? getInitials(user.name) : '--'}</div>
              <span className="pa-layout__status-dot" />
            </div>
            <button
              type="button"
              className="pa-layout__icon-btn pa-layout__icon-btn--danger"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <div className="pa-layout__content">{children}</div>
      </div>

      <style>{`
        .pa-layout {
          min-height: 100vh;
          background: var(--color-surface-container-low);
        }

        .pa-layout__sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 288px;
          background: #ffffff;
          border-right: 1px solid var(--color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          padding: var(--space-md) 0;
          z-index: 50;
        }

        .pa-layout__brand {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0 var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .pa-layout__brand-mark {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-xl);
          background: var(--color-secondary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .pa-layout__brand-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .pa-layout__brand-label {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.6;
        }

        .pa-layout__nav {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 var(--space-sm);
        }

        .pa-layout__nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 14px var(--space-sm);
          border-radius: var(--radius-xl);
          background: transparent;
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
        }

        .pa-layout__nav-item:hover:not(:disabled) {
          background: var(--color-surface-container-low);
          color: #0f172a;
        }

        .pa-layout__nav-item--active {
          background: var(--color-secondary);
          color: #ffffff;
        }

        .pa-layout__nav-item--soon {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pa-layout__soon-tag {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--color-surface-container);
          color: var(--color-on-surface-variant);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .pa-layout__sidebar-footer {
          padding: var(--space-md) var(--space-sm) 0;
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pa-layout__invite {
          width: 100%;
          padding: var(--space-sm) var(--space-sm);
          margin-bottom: var(--space-xs);
        }

        .pa-layout__footer-link {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 12px var(--space-sm);
          border-radius: var(--radius-xl);
          background: transparent;
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
          transition: background-color 0.2s ease;
        }

        .pa-layout__footer-link:hover:not(:disabled) {
          background: var(--color-surface-container-low);
        }

        .pa-layout__footer-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pa-layout__footer-link--danger {
          color: var(--color-error);
        }

        .pa-layout__footer-link--danger:hover {
          background: #fff1f2;
        }

        .pa-layout__main {
          margin-left: 288px;
          min-height: 100vh;
        }

        .pa-layout__topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-md);
          height: 80px;
          background: #ffffff;
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .pa-layout__search {
          position: relative;
          width: 480px;
          max-width: 100%;
          display: flex;
          align-items: center;
        }

        .pa-layout__search .material-symbols-outlined {
          position: absolute;
          left: var(--space-md);
          font-size: 20px;
          color: var(--color-on-surface-variant);
        }

        .pa-layout__search input {
          width: 100%;
          padding: 12px var(--space-md) 12px 44px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          background: var(--color-surface-container-low);
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .pa-layout__search input:focus {
          border-color: var(--color-secondary);
        }

        .pa-layout__topbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .pa-layout__icon-btn {
          position: relative;
          padding: 10px;
          border-radius: var(--radius-xl);
          background: transparent;
          color: var(--color-on-surface-variant);
          transition: background-color 0.2s ease;
        }

        .pa-layout__icon-btn:hover:not(:disabled) {
          background: var(--color-surface-container-low);
        }

        .pa-layout__icon-btn--danger {
          color: var(--color-error);
        }

        .pa-layout__icon-btn--danger:hover {
          background: #fff1f2;
        }

        .pa-layout__icon-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--color-secondary);
          border-radius: var(--radius-full);
        }

        .pa-layout__divider {
          width: 1px;
          height: 32px;
          background: var(--color-outline-variant);
        }

        .pa-layout__profile {
          position: relative;
        }

        .pa-layout__avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xl);
          background: var(--color-primary-container);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid var(--color-outline-variant);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .pa-layout__status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border: 2px solid #ffffff;
          border-radius: var(--radius-full);
        }

        .pa-layout__content {
          padding: var(--space-md);
          max-width: var(--container-max);
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .pa-layout__sidebar {
            display: none;
          }

          .pa-layout__main {
            margin-left: 0;
          }

          .pa-layout__search {
            width: 100%;
          }
        }
      `}</style>

      <CreateCommunityModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
