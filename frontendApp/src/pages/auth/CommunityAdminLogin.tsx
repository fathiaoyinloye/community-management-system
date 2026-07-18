import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'


interface FieldErrors {
  email?: string
  password?: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function CommunityAdminLogin() {
  const { login, logout, isAuthenticating, error } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [portalError, setPortalError] = useState<string | null>(null)

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
      if (user.role === 'resident') {
        logout()
        setPortalError('Residents must sign in via the Resident Portal.')
      } else {
        navigate('/community-admin/community-info', { replace: true })
      }
    } catch {
      // surfaced via error from useAuth()
    }
  }

  return (
    <div className="ca-auth">
      <div className="ca-auth__panel">
        <div className="ca-auth__glow ca-auth__glow--one" />
        <div className="ca-auth__glow ca-auth__glow--two" />
        <div className="ca-auth__panel-content">
          <div className="ca-auth__brand">
            <span className="material-symbols-outlined ca-auth__brand-icon">corporate_fare</span>
            <span className="ca-auth__brand-name">CommUnity Admin</span>
          </div>
          <h2 className="ca-auth__panel-title">Manage your community from one dashboard.</h2>
          <p className="ca-auth__panel-copy">
            Community administrators manage residents, houses, levies, and payments for their
            community, all in one place.
          </p>
          <ul className="ca-auth__panel-list">
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Keep your community profile up to date
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Track houses, levies, and payments
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Manage your staff and residents
            </li>
          </ul>
        </div>
      </div>

      <div className="ca-auth__form-side">
        <div className="ca-auth__card">
          {(error || portalError) && (
            <div role="alert" className="ca-auth__alert">
              <span className="material-symbols-outlined ca-auth__alert-icon">error</span>
              {portalError || error}
            </div>
          )}

          <form className="ca-auth__form" onSubmit={handleSubmit} noValidate>
            <h1 className="ca-auth__title">Community Admin Sign In</h1>
            <p className="ca-auth__subtitle">
              Sign in with your community administrator credentials.
            </p>

            <label className="ca-auth__field">
              <span className="ca-auth__label">Email</span>
              <input
                type="email"
                className="ca-auth__input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email && <span className="ca-auth__field-error">{fieldErrors.email}</span>}
            </label>

            <label className="ca-auth__field">
              <span className="ca-auth__label">Password</span>
              <input
                type="password"
                className="ca-auth__input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password && (
                <span className="ca-auth__field-error">{fieldErrors.password}</span>
              )}
            </label>

            <button type="submit" className="btn btn-primary ca-auth__submit" disabled={isAuthenticating}>
              {isAuthenticating ? 'Signing in…' : 'Log In'}
            </button>


          </form>
        </div>
      </div>

      <style>{`
        .ca-auth {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
        }

        .ca-auth__panel {
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

        .ca-auth__glow {
          position: absolute;
          border-radius: var(--radius-full);
          filter: blur(60px);
          opacity: 0.35;
        }

        .ca-auth__glow--one {
          width: 320px;
          height: 320px;
          background: var(--color-secondary);
          top: -80px;
          right: -80px;
        }

        .ca-auth__glow--two {
          width: 260px;
          height: 260px;
          background: var(--color-tertiary-fixed);
          bottom: -60px;
          left: -60px;
        }

        .ca-auth__panel-content {
          position: relative;
          z-index: 10;
          max-width: 420px;
        }

        .ca-auth__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
          margin-bottom: var(--space-xl);
        }

        .ca-auth__brand-icon {
          color: var(--color-tertiary-fixed);
          font-size: 28px;
          font-variation-settings: 'FILL' 1;
        }

        .ca-auth__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
        }

        .ca-auth__panel-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: var(--space-md);
        }

        .ca-auth__panel-copy {
          font-size: var(--text-body-lg);
          opacity: 0.85;
          margin-bottom: var(--space-lg);
        }

        .ca-auth__panel-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .ca-auth__panel-list li {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-label-md);
          opacity: 0.9;
        }

        .ca-auth__panel-list .material-symbols-outlined {
          color: var(--color-tertiary-fixed);
          font-size: 20px;
        }

        .ca-auth__form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          background: var(--color-surface-container-low);
          min-height: 100vh;
        }

        .ca-auth__card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-lg) var(--space-md);
          box-shadow: 0 20px 45px -20px rgba(19, 27, 46, 0.25);
        }

        .ca-auth__alert {
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

        .ca-auth__alert-icon {
          font-size: 20px;
        }

        .ca-auth__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .ca-auth__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .ca-auth__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-xs);
        }

        .ca-auth__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .ca-auth__label {
          font-size: var(--text-label-md);
          font-weight: 500;
          color: var(--color-on-surface);
        }

        .ca-auth__input {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface);
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease;
        }

        .ca-auth__input:focus {
          outline: none;
          border-color: var(--color-secondary);
        }

        .ca-auth__input[aria-invalid='true'] {
          border-color: var(--color-error);
        }

        .ca-auth__input:disabled {
          opacity: 0.6;
        }

        .ca-auth__field-error {
          color: var(--color-error);
          font-size: 13px;
        }

        .ca-auth__submit {
          margin-top: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          width: 100%;
        }


        @media (min-width: 1024px) {
          .ca-auth {
            grid-template-columns: 1.1fr 1fr;
          }

          .ca-auth__panel {
            display: flex;
          }

          .ca-auth__form-side {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  )
}
