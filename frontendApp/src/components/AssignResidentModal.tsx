import { useState, type FormEvent } from 'react'

interface AssignResidentModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (resident: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password?: string
  }) => Promise<void>
  houseNumber: string
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
}

export default function AssignResidentModal({
  isOpen,
  onClose,
  onAssign,
  houseNumber,
}: AssignResidentModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setError(null)
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Please enter the resident's full name.")
      return
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!form.phone.trim()) {
      setError("Please enter the resident's phone number.")
      return
    }
    if (!form.password || form.password.trim().length < 6) {
      setError('Please provide a password of at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      await onAssign({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password.trim(),
      })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to assign resident.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="arm__overlay" role="dialog" aria-modal="true">
      <div className="arm__panel">
        <button type="button" className="arm__close" onClick={handleClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="arm__title">Assign Resident</h2>
        <p className="arm__subtitle">
          Assign a primary resident to unit <strong>{houseNumber}</strong> and set their login credentials.
        </p>

        {error && (
          <div role="alert" className="arm__alert">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <form className="arm__form" onSubmit={handleSubmit} noValidate>
          <div className="arm__grid">
            <div className="arm__field">
              <label htmlFor="firstName" className="arm__label">First Name</label>
              <input
                id="firstName"
                type="text"
                className="arm__input"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="arm__field">
              <label htmlFor="lastName" className="arm__label">Last Name</label>
              <input
                id="lastName"
                type="text"
                className="arm__input"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="arm__grid">
            <div className="arm__field">
              <label htmlFor="email" className="arm__label">Email Address</label>
              <input
                id="email"
                type="email"
                className="arm__input"
                placeholder="e.g. resident@example.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="arm__field">
              <label htmlFor="phone" className="arm__label">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className="arm__input"
                placeholder="e.g. 08012345678"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="arm__field">
            <label htmlFor="password" className="arm__label">Portal Login Password</label>
            <input
              id="password"
              type="text"
              className="arm__input"
              placeholder="Set login password for resident (min 6 characters)"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="arm__actions">
            <button
              type="button"
              className="arm__btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary arm__btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Resident'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .arm__overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: var(--space-md);
        }

        .arm__panel {
          background: #ffffff;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: var(--space-md);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .arm__close {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          background: transparent;
          color: var(--color-on-surface-variant);
          padding: var(--space-xs);
          border-radius: var(--radius-full);
          transition: background-color 0.2s ease;
        }

        .arm__close:hover {
          background: var(--color-surface-container-low);
        }

        .arm__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .arm__subtitle {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .arm__alert {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          padding: var(--space-sm);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-md);
          font-weight: 500;
        }

        .arm__alert .material-symbols-outlined {
          color: var(--color-error);
        }

        .arm__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .arm__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        @media (min-width: 480px) {
          .arm__grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .arm__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .arm__label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }

        .arm__input {
          padding: 10px 14px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          outline: none;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
          background: #ffffff;
        }

        .arm__input:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 2px rgba(70, 72, 212, 0.25);
        }

        .arm__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .arm__btn-cancel {
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 600;
          background: transparent;
          color: var(--color-on-surface-variant);
          transition: background-color 0.2s ease;
        }

        .arm__btn-cancel:hover {
          background: var(--color-surface-container-low);
        }

        .arm__btn-submit {
          padding: var(--space-sm) var(--space-md);
          font-size: var(--text-label-md);
        }
      `}</style>
    </div>
  )
}
