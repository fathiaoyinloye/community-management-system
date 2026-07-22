import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

interface NavItem {
  label: string;
  icon: string;
  to?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", to: "/community-admin/dashboard" },
  {
    label: "Community Info",
    icon: "info",
    to: "/community-admin/community-info",
  },
  { label: "Houses", icon: "home_work", to: "/community-admin/houses" },
  { label: "Levies", icon: "receipt_long", to: "/community-admin/levies" },
  { label: "Payments", icon: "payments", to: "/community-admin/payments" },
  { label: "Staff", icon: "group", to: "/community-admin/staff" },
  { label: "Settings", icon: "settings" },
];

interface CommunityAdminLayoutProps {
  children: ReactNode;
}

export default function CommunityAdminLayout({
  children,
}: CommunityAdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="ca-layout">
      <aside className="ca-layout__sidebar">
        <div className="ca-layout__brand">
          <div className="ca-layout__brand-mark">
            <span className="material-symbols-outlined">corporate_fare</span>
          </div>
          <div>
            <h1 className="ca-layout__brand-name">CommUnity Admin</h1>
            <p className="ca-layout__brand-label">Management Portal</p>
          </div>
        </div>

        <nav className="ca-layout__nav">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "ca-layout__nav-item ca-layout__nav-item--active"
                    : "ca-layout__nav-item"
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                type="button"
                className="ca-layout__nav-item ca-layout__nav-item--soon"
                disabled
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
                <span className="ca-layout__soon-tag">Soon</span>
              </button>
            ),
          )}
        </nav>

        <div className="ca-layout__sidebar-footer">
          <div className="ca-layout__profile-card">
            <div className="ca-layout__profile-info">
              <p className="ca-layout__profile-name">
                {user?.name ?? "Community Admin"}
              </p>
              <p className="ca-layout__profile-role">Community Admin</p>
            </div>
          </div>
          <button
            type="button"
            className="ca-layout__footer-link"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="ca-layout__main">
        <header className="ca-layout__topbar">
          <div className="ca-layout__search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search resources…" />
          </div>

          <div className="ca-layout__topbar-actions">
            <button type="button" className="ca-layout__icon-btn" disabled>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className="ca-layout__icon-btn" disabled>
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="ca-layout__divider" />
            <span className="ca-layout__brand-tag">CommUnity</span>
          </div>
        </header>

        <div className="ca-layout__content">{children}</div>
      </div>

      <style>{`
        .ca-layout {
          min-height: 100vh;
          background: var(--color-surface-container-low);
        }

        .ca-layout__sidebar {
          position: fixed;
          top: 0;
          left: 0;
          min-height: 100vh;
          height: 100vh;
          width: 256px;
          background: #ffffff;
          border-right: 1px solid var(--color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 0;
          z-index: 50;
          overflow: hidden;
        }

        .ca-layout__brand {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 var(--space-md);
          margin: 0 0 8px;
        }

        .ca-layout__brand-mark {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-lg);
          background: var(--color-secondary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ca-layout__brand-mark .material-symbols-outlined {
          font-size: 18px;
          line-height: 1;
        }

        .ca-layout__brand-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.015em;
        }

        .ca-layout__brand-label {
          font-size: 8px;
          color: var(--color-on-primary-container);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 1px;
        }

        .ca-layout__nav {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 10px;
          min-height: 0;
        }

        .ca-layout__nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 10px;
          border-radius: var(--radius-lg);
          background: transparent;
          color: var(--color-on-surface-variant);
          font-size: 13px;
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
        }

        .ca-layout__nav-item:hover:not(:disabled) {
          background: var(--color-surface-container-low);
          color: #0f172a;
        }

        .ca-layout__nav-item--active {
          background: var(--color-surface-container-low);
          color: var(--color-secondary);
          font-weight: 700;
          border-right: 4px solid var(--color-secondary);
        }

        .ca-layout__nav-item--soon {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ca-layout__soon-tag {
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

        .ca-layout__sidebar-footer {
          margin-top: auto;
          padding: 10px 10px 6px;
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #ffffff;
        }

        .ca-layout__profile-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 2px;
        }

        .ca-layout__avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: var(--color-primary-container);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          border: 2px solid var(--color-secondary-fixed);
          flex-shrink: 0;
        }

        .ca-layout__profile-info {
          overflow: hidden;
        }

        .ca-layout__profile-name {
          font-size: 12px;
          color: var(--color-on-surface);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ca-layout__profile-role {
          font-size: 11px;
          color: var(--color-on-surface-variant);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ca-layout__footer-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 10px;
          border-radius: var(--radius-lg);
          background: transparent;
          color: var(--color-error);
          font-size: 12px;
          font-weight: 600;
          transition: background-color 0.2s ease;
          min-height: 42px;
        }

        .ca-layout__footer-link:hover {
          background: #fff1f2;
        }

        .ca-layout__main {
          margin-left: 256px;
          min-height: 100vh;
        }

        .ca-layout__topbar {
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

        .ca-layout__search {
          position: relative;
          width: 384px;
          max-width: 100%;
          display: flex;
          align-items: center;
        }

        .ca-layout__search .material-symbols-outlined {
          position: absolute;
          left: var(--space-sm);
          font-size: 20px;
          color: var(--color-on-surface-variant);
        }

        .ca-layout__search input {
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

        .ca-layout__search input:focus {
          box-shadow: 0 0 0 2px rgba(70, 72, 212, 0.2);
        }

        .ca-layout__topbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .ca-layout__icon-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          background: transparent;
          color: var(--color-on-surface-variant);
          transition: background-color 0.2s ease;
        }

        .ca-layout__icon-btn:hover:not(:disabled) {
          background: var(--color-surface-container-high);
        }

        .ca-layout__icon-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ca-layout__divider {
          width: 1px;
          height: 32px;
          background: var(--color-outline-variant);
          margin: 0 var(--space-xs);
        }

        .ca-layout__brand-tag {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .ca-layout__content {
          padding: var(--space-md) var(--space-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .ca-layout__sidebar {
            display: none;
          }

          .ca-layout__main {
            margin-left: 0;
          }

          .ca-layout__search {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
