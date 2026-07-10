import { useState } from 'react'

const NAV_LINKS = ['Platform', 'Solutions', 'Resources', 'Pricing']

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar__inner container">
        <div className="navbar__brand">
          <span className="material-symbols-outlined navbar__brand-icon">account_balance</span>
          <span className="navbar__brand-name">CommunalTrust</span>
        </div>

        <div className="navbar__links">
          {NAV_LINKS.map((label, index) => (
            <a
              key={label}
              href="#"
              className={index === 0 ? 'navbar__link navbar__link--active' : 'navbar__link'}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="navbar__actions">
          <button className="navbar__login">Log In</button>
          <button className="btn btn-primary navbar__cta">Get Started</button>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      <div id="navbar-mobile-menu" className={isMenuOpen ? 'navbar__mobile navbar__mobile--open' : 'navbar__mobile'}>
        <div className="navbar__mobile-inner">
          <div className="navbar__mobile-links">
            {NAV_LINKS.map((label, index) => (
              <a
                key={label}
                href="#"
                className={index === 0 ? 'navbar__mobile-link navbar__mobile-link--active' : 'navbar__mobile-link'}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="navbar__mobile-actions">
            <button className="navbar__login navbar__login--mobile" onClick={() => setIsMenuOpen(false)}>
              Log In
            </button>
            <button className="btn btn-primary navbar__cta" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(247, 249, 251, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .navbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .navbar__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
        }

        .navbar__brand-icon {
          color: var(--color-secondary);
          font-size: 30px;
          font-variation-settings: 'FILL' 1;
        }

        .navbar__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .navbar__links {
          display: none;
          align-items: center;
          gap: var(--space-lg);
        }

        .navbar__link {
          font-size: var(--text-label-md);
          font-weight: 500;
          color: var(--color-on-surface-variant);
          transition: color 0.2s ease;
          padding-bottom: 4px;
        }

        .navbar__link:hover {
          color: var(--color-secondary);
        }

        .navbar__link--active {
          color: var(--color-secondary);
          border-bottom: 2px solid var(--color-secondary);
        }

        .navbar__actions {
          display: none;
          align-items: center;
          gap: var(--space-md);
        }

        .navbar__login {
          background: none;
          font-size: var(--text-label-md);
          font-weight: 500;
          color: var(--color-secondary);
          padding: var(--space-xs) var(--space-md);
        }

        .navbar__login:hover {
          opacity: 0.8;
        }

        .navbar__cta {
          padding: var(--space-sm) var(--space-md);
          font-size: var(--text-label-md);
        }

        .navbar__toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: transparent;
          color: var(--color-primary);
          border-radius: var(--radius-lg);
          flex-shrink: 0;
        }

        .navbar__toggle:hover {
          background: var(--color-surface-container);
        }

        .navbar__mobile {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          background: var(--color-surface-bright);
          border-top: 1px solid transparent;
          transition: grid-template-rows 0.25s ease, border-color 0.25s ease;
        }

        .navbar__mobile--open {
          grid-template-rows: 1fr;
          border-top-color: var(--color-outline-variant);
        }

        .navbar__mobile-inner {
          min-height: 0;
          overflow: hidden;
        }

        .navbar__mobile-links {
          display: flex;
          flex-direction: column;
          padding: var(--space-sm) var(--space-lg);
        }

        .navbar__mobile-link {
          padding: var(--space-sm) 0;
          font-size: var(--text-body-md);
          font-weight: 500;
          color: var(--color-on-surface-variant);
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .navbar__mobile-link:last-child {
          border-bottom: none;
        }

        .navbar__mobile-link--active {
          color: var(--color-secondary);
          font-weight: 700;
        }

        .navbar__mobile-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-lg) var(--space-md);
        }

        .navbar__login--mobile {
          display: block;
          width: 100%;
          text-align: center;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
        }

        .navbar__mobile-actions .navbar__cta {
          width: 100%;
        }

        @media (min-width: 768px) {
          .navbar__links {
            display: flex;
          }

          .navbar__actions {
            display: flex;
          }

          .navbar__toggle,
          .navbar__mobile {
            display: none;
          }
        }
      `}</style>
    </nav>
  )
}
