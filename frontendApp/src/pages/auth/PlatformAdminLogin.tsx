import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

interface FieldErrors {
  identifier?: string
  password?: string
}

export default function PlatformAdminLogin() {
  const { login, logout, isAuthenticating, error } = useAuth()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [portalError, setPortalError] = useState<string | null>(null)

  const validate = (): boolean => {
    const errors: FieldErrors = {}
    if (!identifier.trim()) errors.identifier = 'Username or email is required.'
    if (!password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPortalError(null)
    if (!validate()) return

    try {
      const user = await login({ identifier, password })
      if (user.role !== 'platform_admin') {
        logout()
        setPortalError('This portal is restricted to platform administrators.')
      } else {
        navigate('/platform-admin/dashboard', { replace: true })
      }
    } catch {
      // surfaced via error from useAuth()
    }
  }

  return (
    <div className="pa-auth">
      <div className="pa-auth__panel">
        <div className="pa-auth__glow pa-auth__glow--one" />
        <div className="pa-auth__glow pa-auth__glow--two" />
        <div className="pa-auth__panel-content">
          <div className="pa-auth__brand">
            <span className="material-symbols-outlined pa-auth__brand-icon">account_balance</span>
            <span className="pa-auth__brand-name">CommunalTrust</span>
          </div>
          <h2 className="pa-auth__panel-title">Command every community from one dashboard.</h2>
          <p className="pa-auth__panel-copy">
            Platform administrators oversee every community, admin account, and levy
            configuration across the network, securely, in one place.
          </p>
          <ul className="pa-auth__panel-list">
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Full visibility across every community
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Centralized admin account management
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Enterprise-grade security
            </li>
          </ul>
        </div>
      </div>

      <div className="pa-auth__form-side">
        <div className="pa-auth__card">
          {(error || portalError) && (
            <div role="alert" className="pa-auth__alert">
              <span className="material-symbols-outlined pa-auth__alert-icon">error</span>
              {portalError || error}
            </div>
          )}

          <form className="pa-auth__form" onSubmit={handleSubmit} noValidate>
            <h1 className="pa-auth__title">Platform Admin Sign In</h1>
            <p className="pa-auth__subtitle">
              Restricted access. Sign in with your platform administrator credentials.
            </p>

            <label className="pa-auth__field">
              <span className="pa-auth__label">Username or Email</span>
              <input
                type="text"
                className="pa-auth__input"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.identifier)}
              />
              {fieldErrors.identifier && <span className="pa-auth__field-error">{fieldErrors.identifier}</span>}
            </label>

            <label className="pa-auth__field">
              <span className="pa-auth__label">Password</span>
              <input
                type="password"
                className="pa-auth__input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password && (
                <span className="pa-auth__field-error">{fieldErrors.password}</span>
              )}
            </label>

            <button type="submit" className="btn btn-primary pa-auth__submit" disabled={isAuthenticating}>
              {isAuthenticating ? 'Signing in…' : 'Log In'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .pa-auth {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
        }

        .pa-auth__panel {
          display: none;
          position: relative;
          overflow: hidden;
          padding: var(--space-xl) var(--space-lg);
          background: linear-gradient(
            160deg,
            var(--color-primary-container) 0%,
            #1c2340 60%,
            var(--color-secondary) 150%
          );
          color: #ffffff;
          flex-direction: column;
          justify-content: center;
        }

        .pa-auth__glow {
          position: absolute;
          border-radius: var(--radius-full);
          filter: blur(60px);
          opacity: 0.35;
        }

        .pa-auth__glow--one {
          width: 320px;
          height: 320px;
          background: var(--color-secondary);
          top: -80px;
          right: -80px;
        }

        .pa-auth__glow--two {
          width: 260px;
          height: 260px;
          background: var(--color-tertiary-fixed);
          bottom: -60px;
          left: -60px;
        }

        .pa-auth__panel-content {
          position: relative;
          z-index: 10;
          max-width: 420px;
        }

        .pa-auth__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
          margin-bottom: var(--space-xl);
        }

        .pa-auth__brand-icon {
          color: var(--color-tertiary-fixed);
          font-size: 28px;
          font-variation-settings: 'FILL' 1;
        }

        .pa-auth__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
        }

        .pa-auth__panel-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: var(--space-md);
        }

        .pa-auth__panel-copy {
          font-size: var(--text-body-lg);
          opacity: 0.85;
          margin-bottom: var(--space-lg);
        }

        .pa-auth__panel-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .pa-auth__panel-list li {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-label-md);
          opacity: 0.9;
        }

        .pa-auth__panel-list .material-symbols-outlined {
          color: var(--color-tertiary-fixed);
          font-size: 20px;
        }

        .pa-auth__form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          background: var(--color-surface-container-low);
          min-height: 100vh;
        }

        .pa-auth__card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-lg) var(--space-md);
          box-shadow: 0 20px 45px -20px rgba(19, 27, 46, 0.25);
        }

        .pa-auth__alert {
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

        .pa-auth__alert-icon {
          font-size: 20px;
        }

        .pa-auth__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .pa-auth__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .pa-auth__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-xs);
        }

        .pa-auth__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .pa-auth__label {
          font-size: var(--text-label-md);
          font-weight: 500;
          color: var(--color-on-surface);
        }

        .pa-auth__input {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface);
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease;
        }

        .pa-auth__input:focus {
          outline: none;
          border-color: var(--color-secondary);
        }

        .pa-auth__input[aria-invalid='true'] {
          border-color: var(--color-error);
        }

        .pa-auth__input:disabled {
          opacity: 0.6;
        }

        .pa-auth__field-error {
          color: var(--color-error);
          font-size: 13px;
        }

        .pa-auth__submit {
          margin-top: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          width: 100%;
        }

        }

        @media (min-width: 1024px) {
          .pa-auth {
            grid-template-columns: 1.1fr 1fr;
          }

          .pa-auth__panel {
            display: flex;
          }

          .pa-auth__form-side {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  )
}
