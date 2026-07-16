import { useNavigate, Link } from 'react-router-dom'

export default function ResidentRegister() {
  const navigate = useNavigate()

  return (
    <div className="res-auth">
      <div className="res-auth__panel">
        <div className="res-auth__glow res-auth__glow--one" />
        <div className="res-auth__glow res-auth__glow--two" />
        <div className="res-auth__panel-content">
          <div className="res-auth__brand">
            <span className="material-symbols-outlined res-auth__brand-icon">account_balance</span>
            <span className="res-auth__brand-name">Resident Portal</span>
          </div>
          <h2 className="res-auth__panel-title">Welcome to your new community portal.</h2>
          <p className="res-auth__panel-copy">
            Access your resident account to manage levy statements, upload payment receipts, and stay connected with community executives.
          </p>
          <ul className="res-auth__panel-list">
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Instant online payment verification and digital receipts
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Submit maintenance requests to staff directly
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Receive urgent broadcasts and event notices
            </li>
          </ul>
        </div>
      </div>

      <div className="res-auth__form-side">
        <div className="res-auth__card">
          <div className="res-auth__notice-container">
            <div className="res-auth__icon-wrap">
              <span className="material-symbols-outlined res-auth__notice-icon">lock_person</span>
            </div>
            
            <h1 className="res-auth__title" style={{ textAlign: 'center' }}>Self-Registration Disabled</h1>
            <p className="res-auth__notice-text">
              Resident accounts can no longer be self-registered. The Community Administrator is responsible for creating and setting up your resident account.
            </p>
            <div className="res-auth__steps">
              <div className="res-auth__step">
                <span className="res-auth__step-num">1</span>
                <div>
                  <strong>Contact Admin:</strong> Reach out to your community management office or administrator.
                </div>
              </div>
              <div className="res-auth__step">
                <span className="res-auth__step-num">2</span>
                <div>
                  <strong>Get Credentials:</strong> They will register your unit and provide your secure email and login password.
                </div>
              </div>
              <div className="res-auth__step">
                <span className="res-auth__step-num">3</span>
                <div>
                  <strong>Sign In:</strong> Use the login credentials provided to access your account services.
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary res-auth__submit" 
              onClick={() => navigate('/resident/login')}
              style={{ marginTop: '24px' }}
            >
              Back to Sign In
            </button>

            <div className="res-auth__footer" style={{ marginTop: '24px' }}>
              <span className="res-auth__footer-text">Are you an administrator? </span>
              <Link to="/community-admin/login" className="res-auth__footer-link">
                Admin Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .res-auth {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
        }

        .res-auth__panel {
          display: none;
          position: relative;
          overflow: hidden;
          padding: var(--space-xl) var(--space-lg);
          background: linear-gradient(
            160deg,
            var(--color-primary-container) 0%,
            #0f172a 60%,
            var(--color-secondary) 150%
          );
          color: #ffffff;
          flex-direction: column;
          justify-content: center;
        }

        .res-auth__glow {
          position: absolute;
          border-radius: var(--radius-full);
          filter: blur(60px);
          opacity: 0.35;
        }

        .res-auth__glow--one {
          width: 320px;
          height: 320px;
          background: var(--color-secondary);
          top: -80px;
          right: -80px;
        }

        .res-auth__glow--two {
          width: 260px;
          height: 260px;
          background: var(--color-tertiary-fixed);
          bottom: -60px;
          left: -60px;
        }

        .res-auth__panel-content {
          position: relative;
          z-index: 10;
          max-width: 420px;
        }

        .res-auth__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
          margin-bottom: var(--space-xl);
        }

        .res-auth__brand-icon {
          color: var(--color-tertiary-fixed);
          font-size: 28px;
          font-variation-settings: 'FILL' 1;
        }

        .res-auth__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
        }

        .res-auth__panel-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: var(--space-md);
        }

        .res-auth__panel-copy {
          font-size: var(--text-body-lg);
          opacity: 0.85;
          margin-bottom: var(--space-lg);
        }

        .res-auth__panel-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .res-auth__panel-list li {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-label-md);
          opacity: 0.9;
        }

        .res-auth__panel-list .material-symbols-outlined {
          color: var(--color-tertiary-fixed);
          font-size: 20px;
        }

        .res-auth__form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          background: var(--color-surface-container-low);
          min-height: 100vh;
        }

        .res-auth__card {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-xl) var(--space-lg);
          box-shadow: 0 20px 45px -20px rgba(19, 27, 46, 0.25);
        }

        .res-auth__notice-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .res-auth__icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: var(--color-primary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-md);
          color: var(--color-primary);
        }

        .res-auth__notice-icon {
          font-size: 40px;
          font-variation-settings: 'FILL' 1;
        }

        .res-auth__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-sm);
        }

        .res-auth__notice-text {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-md);
          text-align: center;
          line-height: 1.5;
          margin-bottom: var(--space-lg);
        }

        .res-auth__steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          width: 100%;
          background: var(--color-surface-container-lowest);
          padding: var(--space-md);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-outline-variant);
        }

        .res-auth__step {
          display: flex;
          gap: var(--space-sm);
          font-size: 14px;
          color: var(--color-on-surface);
          line-height: 1.4;
        }

        .res-auth__step-num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          min-width: 24px;
          border-radius: var(--radius-full);
          background: var(--color-secondary);
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
        }

        .res-auth__submit {
          padding: var(--space-sm) var(--space-md);
          width: 100%;
        }

        .res-auth__footer {
          text-align: center;
          font-size: 14px;
        }

        .res-auth__footer-text {
          color: var(--color-on-surface-variant);
        }

        .res-auth__footer-link {
          color: var(--color-secondary);
          font-weight: 600;
          text-decoration: none;
        }

        .res-auth__footer-link:hover {
          text-decoration: underline;
        }

        @media (min-width: 1024px) {
          .res-auth {
            grid-template-columns: 1.1fr 1fr;
          }

          .res-auth__panel {
            display: flex;
          }

          .res-auth__form-side {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  )
}
