import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerResident } from '../../api/auth'
import { getHouses } from '../../api/house'
import type { House } from '../../types/house'

interface FieldErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  houseId?: string
  password?: string
  confirmPassword?: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function ResidentRegister() {
  const navigate = useNavigate()

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [houseId, setHouseId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // State
  const [vacantHouses, setVacantHouses] = useState<House[]>([])
  const [isLoadingHouses, setIsLoadingHouses] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  // Fetch vacant houses on mount
  useEffect(() => {
    let active = true
    getHouses(undefined, 'vacant')
      .then((data) => {
        if (active) {
          setVacantHouses(data.houses || [])
          setIsLoadingHouses(false)
        }
      })
      .catch(() => {
        if (active) {
          setIsLoadingHouses(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const validate = (): boolean => {
    const errors: FieldErrors = {}
    
    if (!firstName.trim()) errors.firstName = 'First name is required.'
    if (!lastName.trim()) errors.lastName = 'Last name is required.'
    
    if (!email.trim()) {
      errors.email = 'Email is required.'
    } else if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address.'
    }
    
    if (!phone.trim()) {
      errors.phone = 'Phone number is required.'
    }
    
    if (!houseId) {
      errors.houseId = 'Please select your house.'
    }
    
    if (!password) {
      errors.password = 'Password is required.'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your password.'
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRegistrationError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Register resident account
      await registerResident({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        houseId,
        password,
      })

      // Redirect to login screen after successful registration
      navigate('/resident/login', { replace: true, state: { registrationSuccess: true } })
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : 'Unable to complete registration. Please try again.')
    } finally {
      setIsSubmitting(false)
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
          <h2 className="res-auth__panel-title">Welcome to your new community portal.</h2>
          <p className="res-auth__panel-copy">
            Register your resident account to manage levy statements, upload payment receipts, and stay connected with community executives.
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
          {registrationError && (
            <div role="alert" className="res-auth__alert">
              <span className="material-symbols-outlined res-auth__alert-icon">error</span>
              {registrationError}
            </div>
          )}

          <form className="res-auth__form" onSubmit={handleSubmit} noValidate>
            <h1 className="res-auth__title">Resident Registration</h1>
            <p className="res-auth__subtitle">
              Register your account to access resident services.
            </p>

            <div className="res-auth__row">
              <label className="res-auth__field">
                <span className="res-auth__label">First Name</span>
                <input
                  type="text"
                  className="res-auth__input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.firstName)}
                />
                {fieldErrors.firstName && <span className="res-auth__field-error">{fieldErrors.firstName}</span>}
              </label>

              <label className="res-auth__field">
                <span className="res-auth__label">Last Name</span>
                <input
                  type="text"
                  className="res-auth__input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.lastName)}
                />
                {fieldErrors.lastName && <span className="res-auth__field-error">{fieldErrors.lastName}</span>}
              </label>
            </div>

            <label className="res-auth__field">
              <span className="res-auth__label">Email Address</span>
              <input
                type="email"
                className="res-auth__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email && <span className="res-auth__field-error">{fieldErrors.email}</span>}
            </label>

            <label className="res-auth__field">
              <span className="res-auth__label">Phone Number</span>
              <input
                type="tel"
                className="res-auth__input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              {fieldErrors.phone && <span className="res-auth__field-error">{fieldErrors.phone}</span>}
            </label>

            <label className="res-auth__field">
              <span className="res-auth__label">Select Your House</span>
              <select
                className="res-auth__select"
                value={houseId}
                onChange={(e) => setHouseId(e.target.value)}
                disabled={isSubmitting || isLoadingHouses}
                aria-invalid={Boolean(fieldErrors.houseId)}
              >
                <option value="">
                  {isLoadingHouses ? 'Loading vacant houses...' : '-- Select Vacant House --'}
                </option>
                {vacantHouses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.houseNumber} - {house.street} ({house.propertyType.replace('_', ' ')})
                  </option>
                ))}
              </select>
              {fieldErrors.houseId && <span className="res-auth__field-error">{fieldErrors.houseId}</span>}
              {!isLoadingHouses && vacantHouses.length === 0 && (
                <span className="res-auth__field-info">
                  No vacant houses available. Please contact community admin.
                </span>
              )}
            </label>

            <div className="res-auth__row">
              <label className="res-auth__field">
                <span className="res-auth__label">Password</span>
                <input
                  type="password"
                  className="res-auth__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                {fieldErrors.password && <span className="res-auth__field-error">{fieldErrors.password}</span>}
              </label>

              <label className="res-auth__field">
                <span className="res-auth__label">Confirm Password</span>
                <input
                  type="password"
                  className="res-auth__input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                />
                {fieldErrors.confirmPassword && (
                  <span className="res-auth__field-error">{fieldErrors.confirmPassword}</span>
                )}
              </label>
            </div>

            <button type="submit" className="btn btn-primary res-auth__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Account'}
            </button>

            <div className="res-auth__footer">
              <span className="res-auth__footer-text">Already have an account? </span>
              <Link to="/resident/login" className="res-auth__footer-link">
                Sign In
              </Link>
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
          max-width: 520px;
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

        .res-auth__row {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        @media (min-width: 640px) {
          .res-auth__row {
            grid-template-columns: 1fr 1fr;
          }
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

        .res-auth__input,
        .res-auth__select {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface);
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease;
          width: 100%;
        }

        .res-auth__select {
          height: 42px;
          cursor: pointer;
        }

        .res-auth__input:focus,
        .res-auth__select:focus {
          outline: none;
          border-color: var(--color-secondary);
        }

        .res-auth__input[aria-invalid='true'],
        .res-auth__select[aria-invalid='true'] {
          border-color: var(--color-error);
        }

        .res-auth__input:disabled,
        .res-auth__select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .res-auth__field-error {
          color: var(--color-error);
          font-size: 13px;
        }

        .res-auth__field-info {
          color: var(--color-secondary);
          font-size: 13px;
          font-weight: 500;
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
