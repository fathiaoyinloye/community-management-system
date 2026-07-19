import { useState, type FormEvent } from "react";
import type { CreateLevyTypePayload, LevyFrequency } from "../types/levy";

interface CreateLevyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateLevyTypePayload) => Promise<void>;
}

const ICONS = [
  { name: "security", label: "Security" },
  { name: "delete_sweep", label: "Waste" },
  { name: "construction", label: "Maintenance" },
  { name: "forest", label: "Landscaping" },
  { name: "water_drop", label: "Water" },
  { name: "bolt", label: "Electricity" },
  { name: "local_parking", label: "Parking" },
  { name: "gavel", label: "Legal/Fine" },
  { name: "payments", label: "General" },
];

interface FormState {
  name: string;
  description: string;
  amount: string;
  frequency: LevyFrequency;
  icon: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  amount: "",
  frequency: "monthly",
  icon: "security",
};

export default function CreateLevyTypeModal({
  isOpen,
  onClose,
  onCreate,
}: CreateLevyTypeModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Please provide a levy name.");
      return;
    }
    if (!form.description.trim()) {
      setError("Please provide a short description.");
      return;
    }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    const payload: CreateLevyTypePayload = {
      name: form.name.trim(),
      amount: amt,
      frequency: form.frequency,
      description: form.description.trim(),
      icon: form.icon,
    };

    setIsSubmitting(true);
    try {
      await onCreate(payload);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create levy type.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clm__overlay" role="dialog" aria-modal="true">
      <div className="clm__panel">
        <button
          type="button"
          className="clm__close"
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="clm__title">Create Levy Type</h2>
        <p className="clm__subtitle">
          Define a new billing fee standard category for your community members.
        </p>

        {error && (
          <div role="alert" className="clm__alert">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <form className="clm__form" onSubmit={handleSubmit} noValidate>
          <div className="clm__field">
            <label htmlFor="levyName" className="clm__label">
              Levy Category Name
            </label>
            <input
              id="levyName"
              type="text"
              className="clm__input"
              placeholder="e.g. Infrastructure Levy, Facility Fee"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="clm__field">
            <label htmlFor="description" className="clm__label">
              Short Description
            </label>
            <input
              id="description"
              type="text"
              className="clm__input"
              placeholder="e.g. Standard billing for estate gate guard patrols"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="clm__grid">
            <div className="clm__field">
              <label htmlFor="amount" className="clm__label">
                Amount (NGN)
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                className="clm__input"
                placeholder="e.g. 5000"
                value={form.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="clm__field">
              <label htmlFor="frequency" className="clm__label">
                Billing Frequency
              </label>
              <select
                id="frequency"
                className="clm__input"
                value={form.frequency}
                onChange={(e) =>
                  updateField("frequency", e.target.value as LevyFrequency)
                }
                disabled={isSubmitting}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
          </div>

          <div className="clm__field">
            <label className="clm__label">
              Select Visual Icon representation
            </label>
            <div className="clm__icons-grid">
              {ICONS.map((ico) => (
                <button
                  key={ico.name}
                  type="button"
                  className={`clm__icon-choice ${form.icon === ico.name ? "clm__icon-choice--active" : ""}`}
                  onClick={() => updateField("icon", ico.name)}
                  disabled={isSubmitting}
                >
                  <span className="material-symbols-outlined">{ico.name}</span>
                  <span className="clm__icon-choice-label">{ico.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="clm__actions">
            <button
              type="button"
              className="clm__btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary clm__btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Levy"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .clm__overlay {
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

        .clm__panel {
          background: #ffffff;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: var(--space-md);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .clm__close {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          background: transparent;
          color: var(--color-on-surface-variant);
          padding: var(--space-xs);
          border-radius: var(--radius-full);
          transition: background-color 0.2s ease;
        }

        .clm__close:hover {
          background: var(--color-surface-container-low);
        }

        .clm__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .clm__subtitle {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .clm__alert {
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

        .clm__alert .material-symbols-outlined {
          color: var(--color-error);
        }

        .clm__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .clm__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        @media (min-width: 480px) {
          .clm__grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .clm__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .clm__label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }

        .clm__input {
          padding: 10px 14px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          outline: none;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
          background: #ffffff;
        }

        .clm__input:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 2px rgba(70, 72, 212, 0.25);
        }

        .clm__icons-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xs);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-sm);
          background: var(--color-surface-container-lowest);
        }

        @media (min-width: 480px) {
          .clm__icons-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .clm__icon-choice {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xs);
          border-radius: var(--radius-lg);
          background: transparent;
          color: var(--color-on-surface-variant);
          transition: all 0.2s ease;
          gap: 2px;
        }

        .clm__icon-choice:hover {
          background: var(--color-surface-container-low);
          color: var(--color-secondary);
        }

        .clm__icon-choice--active {
          background: var(--color-secondary-fixed) !important;
          color: var(--color-secondary) !important;
          font-weight: 700;
        }

        .clm__icon-choice .material-symbols-outlined {
          font-size: 24px;
        }

        .clm__icon-choice-label {
          font-size: 10px;
          text-align: center;
          text-transform: capitalize;
        }

        .clm__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .clm__btn-cancel {
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 600;
          background: transparent;
          color: var(--color-on-surface-variant);
          transition: background-color 0.2s ease;
        }

        .clm__btn-cancel:hover {
          background: var(--color-surface-container-low);
        }

        .clm__btn-submit {
          padding: var(--space-sm) var(--space-md);
          font-size: var(--text-label-md);
        }
      `}</style>
    </div>
  );
}
