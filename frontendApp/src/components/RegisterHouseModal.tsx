import { useState, type FormEvent } from 'react'
import type { RegisterHousePayload } from '../types/house'

interface RegisterHouseModalProps {
  isOpen: boolean
  onClose: () => void
  onRegister: (payload: RegisterHousePayload) => Promise<void>
}

interface FormState {
  houseNumber: string
  street: string
}

const EMPTY_FORM: FormState = {
  houseNumber: '',
  street: '',
}

export default function RegisterHouseModal({ isOpen, onClose, onRegister }: RegisterHouseModalProps) {
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

    if (!form.houseNumber.trim()) {
      setError('Please provide a house number.')
      return
    }
    if (!form.street.trim()) {
      setError('Please provide a street address.')
      return
    }

    const payload: RegisterHousePayload = {
      houseNumber: form.houseNumber.trim(),
      street: form.street.trim(),
    }

    setIsSubmitting(true)
    try {
      await onRegister(payload)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register house.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rhm__overlay" role="dialog" aria-modal="true">
      <div className="rhm__panel">
        <button type="button" className="rhm__close" onClick={handleClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="rhm__title">Register New House</h2>
        <p className="rhm__subtitle">
          Add a new property unit to your community registry database.
        </p>

        {error && (
          <div role="alert" className="rhm__alert">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <form className="rhm__form" onSubmit={handleSubmit} noValidate>
          <div className="rhm__grid">
            <div className="rhm__field">
              <label htmlFor="houseNumber" className="rhm__label">House Number / Unit #</label>
              <input
                id="houseNumber"
                type="text"
                className="rhm__input"
                placeholder="e.g. H-0512 or Apt 4B"
                value={form.houseNumber}
                onChange={(e) => updateField('houseNumber', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="rhm__field">
              <label htmlFor="street" className="rhm__label">Street Address</label>
              <input
                id="street"
                type="text"
                className="rhm__input"
                placeholder="e.g. 1422 Oakwood Avenue"
                value={form.street}
                onChange={(e) => updateField('street', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <p className="rhm__hint">
            To assign a resident, register the house first then use the "Set Occupied" action on the house.
          </p>

          <div className="rhm__actions">
            <button
              type="button"
              className="rhm__btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rhm__btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register House'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .rhm__overlay {
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

        .rhm__panel {
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

        .rhm__close {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          background: transparent;
          color: var(--color-on-surface-variant);
          padding: var(--space-xs);
          border-radius: var(--radius-full);
          transition: background-color 0.2s ease;
        }

        .rhm__close:hover {
          background: var(--color-surface-container-low);
        }

        .rhm__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .rhm__subtitle {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .rhm__alert {
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

        .rhm__alert .material-symbols-outlined {
          color: var(--color-error);
        }

        .rhm__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .rhm__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        @media (min-width: 480px) {
          .rhm__grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .rhm__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .rhm__label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }

        .rhm__input {
          padding: 10px 14px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          outline: none;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
          background: #ffffff;
        }

        .rhm__input:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 2px rgba(70, 72, 212, 0.25);
        }

        .rhm__hint {
          font-size: 13px;
          color: var(--color-on-surface-variant);
          font-style: italic;
          padding: var(--space-xs) 0;
        }
          display: flex;
          align-items: center;
          margin: var(--space-xs) 0;
        }

        .rhm__checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-on-surface);
          cursor: pointer;
        }

        .rhm__checkbox-label input {
          width: 18px;
          height: 18px;
          border-radius: var(--radius-default);
          accent-color: var(--color-secondary);
        }

        .rhm__resident-box {
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          background: var(--color-surface-container-low);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .rhm__section-title {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-secondary);
          margin-bottom: -4px;
        }

        .rhm__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .rhm__btn-cancel {
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 600;
          background: transparent;
          color: var(--color-on-surface-variant);
          transition: background-color 0.2s ease;
        }

        .rhm__btn-cancel:hover {
          background: var(--color-surface-container-low);
        }

        .rhm__btn-submit {
          padding: var(--space-sm) var(--space-md);
          font-size: var(--text-label-md);
        }
      `}</style>
    </div>
  )
}
