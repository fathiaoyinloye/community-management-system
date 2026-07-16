import { useState, type FormEvent } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

interface FieldErrors {
  email?: string
  password?: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function ResidentLogin() {
  const { login, logout, isAuthenticating, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [portalError, setPortalError] = useState<string | null>(null)
  
  const registerSuccess = location.state?.registrationSuccess


  const validate = (): boolean => {
    const errors: FieldErrors = {}
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
    if (!password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPortalError(null)
    if (!validate()) return

    try {
      const user = await login({ email, password })
      if (user.role !== 'resident') {
        // Enforce resident-only access
        logout()
        setPortalError('This portal is for residents only. If you are an administrator, please sign in via the Administrator Portal.')
      } else {
        navigate('/resident/dashboard', { replace: true })
      }
    } catch {
      // surfaced via error from useAuth()
    }
  }

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
          <h2 className="res-auth__panel-title">Simplified community living at your fingertips.</h2>
          <p className="res-auth__panel-copy">
            As a resident, you can securely access your billing statement, upload payment receipts, 
            and keep track of your community levies.
          </p>
          <ul className="res-auth__panel-list">
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              View outstanding balances and upcoming dues
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Track payment history and download digital receipts
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Receive instant updates and community notifications
            </li>
          </ul>
        </div>
      </div>

      <div className="res-auth__form-side">
        <div className="res-auth__card">
          {registerSuccess && (
            <div role="alert" className="res-auth__alert res-auth__alert--success">
              <span className="material-symbols-outlined res-auth__alert-icon">check_circle</span>
              Registration successful! Please sign in with your credentials.
            </div>
          )}

          {(error || portalError) && (
            <div role="alert" className="res-auth__alert">
              <span className="material-symbols-outlined res-auth__alert-icon">error</span>
              {portalError || error}
            </div>
          )}


          <form className="res-auth__form" onSubmit={handleSubmit} noValidate>
            <h1 className="res-auth__title">Resident Sign In</h1>
            <p className="res-auth__subtitle">
              Sign in with your registered resident credentials.
            </p>

            <label className="res-auth__field">
              <span className="res-auth__label">Email</span>
              <input
                type="email"
                className="res-auth__input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email && <span className="res-auth__field-error">{fieldErrors.email}</span>}
            </label>

            <label className="res-auth__field">
              <span className="res-auth__label">Password</span>
              <input
                type="password"
                className="res-auth__input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password && (
                <span className="res-auth__field-error">{fieldErrors.password}</span>
              )}
            </label>

            <button type="submit" className="btn btn-primary res-auth__submit" disabled={isAuthenticating}>
              {isAuthenticating ? 'Signing in…' : 'Log In'}
            </button>

             <div className="res-auth__footer">
              <div style={{ marginBottom: '8px' }}>
                <span className="res-auth__footer-text">New resident? </span>
                <Link to="/resident/register" className="res-auth__footer-link">
                  Register here
                </Link>
              </div>
              <div>
                <span className="res-auth__footer-text">Are you an administrator? </span>
                <Link to="/community-admin/login" className="res-auth__footer-link">
                  Sign in here
                </Link>
              </div>
            </div>
          </form>
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
          max-width: 440px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-lg) var(--space-md);
          box-shadow: 0 20px 45px -20px rgba(19, 27, 46, 0.25);
        }

        .res-auth__alert {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          padding: var(--space-sm);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-md);
        }

        .res-auth__alert--success {
          background: #e6f4ea;
          color: #137333;
        }

        .res-auth__alert-icon {
          font-size: 20px;
        }

        .res-auth__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .res-auth__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .res-auth__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-xs);
        }

        .res-auth__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .res-auth__label {
          font-size: var(--text-label-md);
          font-weight: 500;
          color: var(--color-on-surface);
        }

        .res-auth__input {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface);
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease;
        }

        .res-auth__input:focus {
          outline: none;
          border-color: var(--color-secondary);
        }

        .res-auth__input[aria-invalid='true'] {
          border-color: var(--color-error);
        }

        .res-auth__input:disabled {
          opacity: 0.6;
        }

        .res-auth__field-error {
          color: var(--color-error);
          font-size: 13px;
        }

        .res-auth__submit {
          margin-top: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          width: 100%;
        }

        .res-auth__footer {
          margin-top: var(--space-sm);
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
