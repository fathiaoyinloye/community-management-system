import { useState, type FormEvent } from "react";
import { useCommunities } from "../store/CommunitiesContext";
import type { CreateCommunityPayload } from "../types/community";
import type { AssignCommunityAdminPayload } from "../types/community";
import { assignCommunityAdmin } from "../api/community";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  type: string;
  address: string;
  state: string;
  lga: string;
  phone: string;
  email: string;
  description: string;
  // Admin fields (used for the assign-admin call after community creation)
  adminFirstName: string;
  adminLastName: string;
  adminPhone: string;
  adminEmail: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  type: "gated_estate",
  address: "",
  state: "",
  lga: "",
  phone: "",
  email: "",
  description: "",
  adminFirstName: "",
  adminLastName: "",
  adminPhone: "",
  adminEmail: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function CreateCommunityModal({
  isOpen,
  onClose,
}: CreateCommunityModalProps) {
  const { createCommunity } = useCommunities();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    communityName: string;
    adminEmail: string;
    activationLink: string;
  } | null>(null);

  if (!isOpen) return null;

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setError(null);
    setCreated(null);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.state.trim() || !form.lga.trim() || !form.address.trim()) {
      setError("Please fill in all community fields.");
      return;
    }
    if (!form.adminFirstName.trim() || !form.adminLastName.trim()) {
      setError("Please enter the admin's full name.");
      return;
    }
    if (!isValidEmail(form.adminEmail)) {
      setError("Enter a valid admin email address.");
      return;
    }
    if (!form.adminPhone.trim()) {
      setError("Please enter the admin's phone number.");
      return;
    }

    const communityPayload: CreateCommunityPayload = {
      name: form.name.trim(),
      type: form.type,
      address: form.address.trim(),
      state: form.state.trim(),
      lga: form.lga.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      description: form.description.trim(),
    };

    const adminPayload: AssignCommunityAdminPayload = {
      firstName: form.adminFirstName.trim(),
      lastName: form.adminLastName.trim(),
      phone: form.adminPhone.trim(),
      email: form.adminEmail.trim(),
    };

    setIsSubmitting(true);
    try {
      const community = await createCommunity(communityPayload);
      const activation = await assignCommunityAdmin(community.id, adminPayload);
      setCreated({
        communityName: community.name,
        adminEmail: activation.email,
        activationLink: activation.activationLink,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create community.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ccm__overlay" role="dialog" aria-modal="true">
      <div className="ccm__panel">
        <button
          type="button"
          className="ccm__close"
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {created ? (
          <div className="ccm__success">
            <div className="ccm__success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h2 className="ccm__title">Community created</h2>
            <p className="ccm__success-copy">
              <strong>{created.communityName}</strong> is set up. An activation
              link has been sent to the admin. Share the link below if needed.
            </p>
            <div className="ccm__credentials">
              <div>
                <span>Admin Email</span>
                <p>{created.adminEmail}</p>
              </div>
              <div>
                <span>Activation Link</span>
                <p style={{ wordBreak: 'break-all', fontSize: 12 }}>{created.activationLink}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary ccm__done"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="ccm__title">New Community</h2>
            <p className="ccm__subtitle">
              Create a community and issue its admin a temporary password. They
              can change it after signing in.
            </p>

            {error && (
              <div role="alert" className="ccm__alert">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <form className="ccm__form" onSubmit={handleSubmit} noValidate>
              <div className="ccm__section-label">Community</div>
              <div className="ccm__grid">
                <label className="ccm__field ccm__field--full">
                  <span>Community Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    disabled={isSubmitting}
                  />
                </label>
                <label className="ccm__field ccm__field--full">
                  <span>Address</span>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g. 12 Estate Road, Phase 1"
                  />
                </label>
                <label className="ccm__field">
                  <span>State</span>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(event) => updateField("state", event.target.value)}
                    disabled={isSubmitting}
                  />
                </label>
                <label className="ccm__field">
                  <span>LGA</span>
                  <input
                    type="text"
                    value={form.lga}
                    onChange={(event) => updateField("lga", event.target.value)}
                    disabled={isSubmitting}
                  />
                </label>
                <label className="ccm__field">
                  <span>Phone</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    disabled={isSubmitting}
                    placeholder="+234..."
                  />
                </label>
                <label className="ccm__field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    disabled={isSubmitting}
                  />
                </label>
              </div>

              <div className="ccm__section-label">Community Admin</div>
              <div className="ccm__grid">
                <label className="ccm__field">
                  <span>First Name</span>
                  <input
                    type="text"
                    value={form.adminFirstName}
                    onChange={(event) => updateField("adminFirstName", event.target.value)}
                    disabled={isSubmitting}
                  />
                </label>
                <label className="ccm__field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    value={form.adminLastName}
                    onChange={(event) => updateField("adminLastName", event.target.value)}
                    disabled={isSubmitting}
                  />
                </label>
                <label className="ccm__field">
                  <span>Admin Email</span>
                  <input
                    type="email"
                    value={form.adminEmail}
                    onChange={(event) => updateField("adminEmail", event.target.value)}
                    disabled={isSubmitting}
                  />
                </label>
                <label className="ccm__field">
                  <span>Admin Phone</span>
                  <input
                    type="tel"
                    value={form.adminPhone}
                    onChange={(event) => updateField("adminPhone", event.target.value)}
                    disabled={isSubmitting}
                    placeholder="+234..."
                  />
                </label>
              </div>

              <div className="ccm__actions">
                <button
                  type="button"
                  className="ccm__cancel"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary ccm__submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating…" : "Create Community"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style>{`
        .ccm__overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          z-index: 200;
        }

        .ccm__panel {
          position: relative;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-lg) var(--space-md) var(--space-md);
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.4);
        }

        .ccm__close {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          color: var(--color-on-surface-variant);
          background: transparent;
        }

        .ccm__close:hover {
          background: var(--color-surface-container-low);
        }

        .ccm__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
        }

        .ccm__subtitle {
          color: var(--color-on-surface-variant);
          margin-top: var(--space-xs);
          margin-bottom: var(--space-md);
        }

        .ccm__alert {
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

        .ccm__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .ccm__section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-on-surface-variant);
          margin-top: var(--space-sm);
        }

        .ccm__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-sm);
        }

        .ccm__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          font-size: var(--text-label-md);
          color: var(--color-on-surface);
        }

        .ccm__field--full {
          grid-column: 1 / -1;
        }

        .ccm__field input {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: var(--color-surface-bright);
          color: var(--color-on-surface);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .ccm__field input:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(70, 72, 212, 0.15);
        }

        .ccm__field input:disabled {
          opacity: 0.6;
        }

        .ccm__password-row {
          display: flex;
          gap: var(--space-xs);
        }

        .ccm__password-row input {
          flex: 1;
        }

        .ccm__generate {
          padding: 0 var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: var(--color-secondary);
          background: #ffffff;
          white-space: nowrap;
        }

        .ccm__generate:hover:not(:disabled) {
          background: var(--color-surface-container-low);
        }

        .ccm__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .ccm__cancel {
          padding: var(--space-sm) var(--space-md);
          color: var(--color-on-surface-variant);
          background: transparent;
          border-radius: var(--radius-lg);
        }

        .ccm__cancel:hover:not(:disabled) {
          color: var(--color-primary);
        }

        .ccm__submit {
          padding: var(--space-sm) var(--space-md);
        }

        .ccm__success {
          text-align: center;
          padding: var(--space-md) 0;
        }

        .ccm__success-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto var(--space-md);
          border-radius: var(--radius-full);
          background: #f0fdf4;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ccm__success-icon .material-symbols-outlined {
          font-size: 32px;
        }

        .ccm__success-copy {
          color: var(--color-on-surface-variant);
          margin: var(--space-sm) auto var(--space-md);
          max-width: 420px;
        }

        .ccm__credentials {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          background: var(--color-surface-container-low);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          text-align: left;
          margin-bottom: var(--space-md);
        }

        .ccm__credentials span {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-on-surface-variant);
        }

        .ccm__credentials p {
          font-family: var(--font-display);
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-on-surface);
          margin-top: 2px;
        }

        .ccm__done {
          width: 100%;
        }

        @media (max-width: 560px) {
          .ccm__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
