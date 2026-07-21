import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

interface NavItem {
  label: string
  icon: string
  to?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', to: '/resident/dashboard' },
  { label: 'Payments', icon: 'payments', to: '/resident/payments' },
  { label: 'Maintenance', icon: 'build' },
  { label: 'Community', icon: 'group' },
  { label: 'Governance', icon: 'gavel' },
  { label: 'Settings', icon: 'settings' },
]

interface ResidentLayoutProps {
  children: ReactNode
  onNewRequest?: () => void
}

export default function ResidentLayout({ children, onNewRequest }: ResidentLayoutProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="res-layout">
      {/* Sidebar for Desktop */}
      <aside className="res-layout__sidebar">
        <div className="res-layout__brand">
          <div className="res-layout__brand-mark">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <h1 className="res-layout__brand-name">CommunalTrust</h1>
            <p className="res-layout__brand-label">Resident Portal</p>
          </div>
        </div>

        <nav className="res-layout__nav">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'res-layout__nav-item res-layout__nav-item--active' : 'res-layout__nav-item'
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                type="button"
                className="res-layout__nav-item res-layout__nav-item--soon"
                disabled
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
                <span className="res-layout__soon-tag">Soon</span>
              </button>
            ),
          )}
        </nav>

        <div className="res-layout__sidebar-footer">
          <button
            type="button"
            className="res-layout__new-btn"
            onClick={onNewRequest}
          >
            <span className="material-symbols-outlined">add</span>
            New Request
          </button>

          <button type="button" className="res-layout__footer-link" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="res-layout__main">
        {/* Topbar */}
        <header className="res-layout__topbar">
          <div className="res-layout__search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search services..." />
          </div>

          <div className="res-layout__topbar-actions">
            <button type="button" className="res-layout__icon-btn" disabled>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className="res-layout__icon-btn" disabled>
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="res-layout__divider" />
            {/* <div className="res-layout__avatar-wrap">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMPJD-k6TizcqxRSIMuIpHdpSSrlNU03mShnAGwLuDrnwtRapfbVHRHdItkEKZF4_LFRpxA8CcRUk5dNMVFULQ5Tjy8twViGLFLcKd9BXJkPv_HrjCupltB5Q61xfIQQGVLfl2rVTROnkIMfxz2pfIjiJZ_AYPhSk6_l0xl7gxFopeDjTcHgiNQTqFXvg_7Rii2-uogzHpYCyqw85LZ4L7aBsUuIjrPI7HR5gQwp1foNKPf42DEnBHye5lSHFjnwc6ZKPUlfGfWhU"
                alt="Resident Avatar"
              />
            </div> */}
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="res-layout__content">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="res-layout__mobile-nav">
        <NavLink
          to="/resident/dashboard"
          className={({ isActive }) =>
            isActive
              ? 'res-layout__mobile-item res-layout__mobile-item--active'
              : 'res-layout__mobile-item'
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Home</span>
        </NavLink>
        <button type="button" className="res-layout__mobile-item" disabled>
          <span className="material-symbols-outlined">payments</span>
          <span>Pay</span>
        </button>
        <button type="button" className="res-layout__mobile-item" disabled>
          <span className="material-symbols-outlined">build</span>
          <span>Fix</span>
        </button>
        <button type="button" className="res-layout__mobile-item" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span>Exit</span>
        </button>
      </nav>

      <style>{`
        .res-layout {
          min-height: 100vh;
          background: var(--color-background);
        }

        .res-layout__sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 256px;
          background: #ffffff;
          border-right: 1px solid var(--color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          padding: var(--space-md) 0;
          z-index: 50;
        }

        .res-layout__brand {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0 var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .res-layout__brand-mark {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--color-secondary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .res-layout__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .res-layout__brand-label {
          font-size: 10px;
          color: var(--color-on-primary-container);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .res-layout__nav {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 var(--space-sm);
        }

        .res-layout__nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 14px var(--space-sm);
          border-radius: var(--radius-lg);
          background: transparent;
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-md);
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
        }

        .res-layout__nav-item:hover:not(:disabled) {
          background: var(--color-surface-container-low);
          color: #0f172a;
        }

        .res-layout__nav-item--active {
          background: var(--color-surface-container-low);
          color: var(--color-secondary);
          font-weight: 700;
          border-right: 4px solid var(--color-secondary);
        }

        .res-layout__nav-item--soon {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .res-layout__soon-tag {
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

        .res-layout__sidebar-footer {
          padding: var(--space-md) var(--space-sm) 0;
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .res-layout__new-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
          padding: 12px;
          border-radius: var(--radius-lg);
          background: var(--color-secondary);
          color: #ffffff;
          font-weight: 700;
          font-size: var(--text-label-md);
          box-shadow: 0 4px 10px rgba(70, 72, 212, 0.2);
          transition: transform 0.2s ease;
        }

        .res-layout__new-btn:hover {
          transform: translateY(-2px);
        }

        .res-layout__footer-link {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 12px var(--space-sm);
          border-radius: var(--radius-lg);
          background: transparent;
          color: var(--color-error);
          font-size: var(--text-label-md);
          transition: background-color 0.2s ease;
        }

        .res-layout__footer-link:hover {
          background: #fff1f2;
        }

        .res-layout__main {
          margin-left: 256px;
          min-height: 100vh;
          padding-bottom: 80px; /* Space for mobile nav */
        }

        .res-layout__topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-gutter);
          height: 64px;
          background: var(--color-surface-bright);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .res-layout__search {
          position: relative;
          width: 384px;
          max-width: 100%;
          display: flex;
          align-items: center;
        }

        .res-layout__search .material-symbols-outlined {
          position: absolute;
          left: var(--space-sm);
          font-size: 20px;
          color: var(--color-on-surface-variant);
        }

        .res-layout__search input {
          width: 100%;
          padding: 10px var(--space-md) 10px 40px;
          border: none;
          border-radius: var(--radius-full);
          background: var(--color-surface-container-low);
          font-family: var(--font-body);
          font-size: var(--text-label-md);
          outline: none;
          transition: box-shadow 0.2s ease;
        }

        .res-layout__search input:focus {
          box-shadow: 0 0 0 2px rgba(70, 72, 212, 0.2);
        }

        .res-layout__topbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .res-layout__icon-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          background: transparent;
          color: var(--color-on-surface-variant);
        }

        .res-layout__divider {
          width: 1px;
          height: 32px;
          background: var(--color-outline-variant);
        }

        .res-layout__avatar-wrap {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 1px solid var(--color-outline-variant);
        }

        .res-layout__avatar-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .res-layout__content {
          padding: var(--space-xl) var(--space-gutter);
          max-width: 1440px;
          margin: 0 auto;
        }

        .res-layout__mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #ffffff;
          box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid var(--color-outline-variant);
          z-index: 50;
        }

        .res-layout__mobile-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: transparent;
          color: var(--color-on-surface-variant);
          font-size: 10px;
          font-weight: 500;
        }

        .res-layout__mobile-item .material-symbols-outlined {
          font-size: 22px;
        }

        .res-layout__mobile-item--active {
          color: var(--color-secondary);
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .res-layout__sidebar {
            display: none;
          }

          .res-layout__main {
            margin-left: 0;
          }
        }

        @media (min-width: 769px) {
          .res-layout__mobile-nav {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
