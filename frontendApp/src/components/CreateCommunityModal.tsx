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
  state: string;
  lga: string;
  phone: string;
  email: string;
  description: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhone: string;
  adminEmail: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  type: "gated_estate",
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

const STATE_LGA_MAP: Record<string, string[]> = {
  "Lagos": [
    "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", 
    "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", 
    "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", 
    "Shomolu", "Surulere"
  ],
  "Abuja (FCT)": [
    "Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council (AMAC)"
  ],
  "Ogun": [
    "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Ewekoro", "Ifo", 
    "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", 
    "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"
  ],
  "Oyo": [
    "Akinyele", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", 
    "Ibadan South-East", "Ibadan South-West", "Ido", "Irepo", "Iseyin", "Lagelu", 
    "Ogbomosho North", "Ogbomosho South", "Oyo East", "Oyo West", "Saki East", "Saki West"
  ],
  "Rivers": [
    "Bonny", "Degema", "Eleme", "Etche", "Gokana", "Ikwerre", "Khana", 
    "Obio/Akpor", "Okrika", "Port Harcourt", "Oyigbo"
  ],
  "Kano": [
    "Fagge", "Gwale", "Kano Municipal", "Nassarawa", "Tarauni", "Dala", "Ungogo"
  ],
  "Kaduna": [
    "Chikun", "Kaduna North", "Kaduna South", "Sabon Gari", "Zaria"
  ],
  "Enugu": [
    "Enugu East", "Enugu North", "Enugu South", "Nsukka", "Udi"
  ],
  "Delta": [
    "Asaba", "Oshimili South", "Warri South", "Uvwie", "Sapele", "Ughelli North"
  ],
  "Anambra": [
    "Awka South", "Onitsha North", "Onitsha South", "Nnewi North"
  ]
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function CreateCommunityModal({
  isOpen,
  onClose,
}: CreateCommunityModalProps) {
  const { createCommunity } = useCommunities();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Flow State
  const [createdCommunity, setCreatedCommunity] = useState<{ id: string; name: string } | null>(null);
  const [adminActivation, setAdminActivation] = useState<{ email: string; activationLink: string } | null>(null);
  
  const [isManualLocation, setIsManualLocation] = useState(false);

  if (!isOpen) return null;

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setStep(1);
    setError(null);
    setCreatedCommunity(null);
    setAdminActivation(null);
    setIsManualLocation(false);
    onClose();
  };

  const handleCreateCommunitySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.state.trim() || !form.lga.trim()) {
      setError("Please fill in all required community fields (Name, State, LGA).");
      return;
    }

    const communityPayload: CreateCommunityPayload = {
      name: form.name.trim(),
      type: form.type,
      address: `${form.lga.trim()}, ${form.state.trim()}`, // Construct address dynamically since it is required by the backend API
      state: form.state.trim(),
      lga: form.lga.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      description: form.description.trim(),
    };

    setIsSubmitting(true);
    try {
      const community = await createCommunity(communityPayload);
      setCreatedCommunity({ id: community.id, name: community.name });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create community.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignAdminSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!createdCommunity) {
      setError("No community has been created yet.");
      return;
    }
    if (!form.adminFirstName.trim() || !form.adminLastName.trim()) {
      setError("Please enter the admin's first and last name.");
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

    const adminPayload: AssignCommunityAdminPayload = {
      firstName: form.adminFirstName.trim(),
      lastName: form.adminLastName.trim(),
      phone: form.adminPhone.trim(),
      email: form.adminEmail.trim(),
    };

    setIsSubmitting(true);
    try {
      const activation = await assignCommunityAdmin(createdCommunity.id, adminPayload);
      
      // Parse token from the activationLink
      let token = "mock";
      try {
        const url = new URL(activation.activationLink);
        token = url.searchParams.get("token") || "mock";
      } catch (e) {
        const match = activation.activationLink.match(/token=([^&]+)/);
        if (match) token = match[1];
      }

      // Generate a local/current origin activation link with the username included
      const localActivationLink = `${window.location.origin}/activate-account?token=${token}&username=${encodeURIComponent(activation.username)}`;

      setAdminActivation({
        email: activation.email,
        activationLink: localActivationLink,
      });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to assign community admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ccm__overlay" role="dialog" aria-modal="true">
      <div className="ccm__panel">
        
        {/* Visual Progress Steps */}
        <div className="ccm__steps">
          <div className={`ccm__step ${step >= 1 ? "ccm__step--active" : ""}`}>
            <span className="ccm__step-num">1</span>
            <span className="ccm__step-txt">Community</span>
          </div>
          <div className="ccm__step-line" />
          <div className={`ccm__step ${step >= 2 ? "ccm__step--active" : ""}`}>
            <span className="ccm__step-num">2</span>
            <span className="ccm__step-txt">Admin</span>
          </div>
          <div className="ccm__step-line" />
          <div className={`ccm__step ${step >= 3 ? "ccm__step--active" : ""}`}>
            <span className="ccm__step-num">3</span>
            <span className="ccm__step-txt">Complete</span>
          </div>
        </div>

        {error && (
          <div role="alert" className="ccm__alert">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {/* STEP 1: CREATE COMMUNITY FORM */}
        {step === 1 && (
          <form className="ccm__form" onSubmit={handleCreateCommunitySubmit} noValidate>
            <h2 className="ccm__title">New Community</h2>
            <p className="ccm__subtitle">
              First, enter the community basic details. Click create to proceed.
            </p>

            <div className="ccm__grid">
              <label className="ccm__field ccm__field--full">
                <span>Community Name *</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. Greenwood Court"
                />
              </label>

              <label className="ccm__field">
                <span>Community Type</span>
                <select
                  value={form.type}
                  onChange={(event) => updateField("type", event.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="gated_estate">Gated Estate</option>
                  <option value="apartment_complex">Apartment Complex</option>
                  <option value="residential_association">Residential Association</option>
                  <option value="commercial_plaza">Commercial Plaza</option>
                </select>
              </label>

              {isManualLocation ? (
                <>
                  <label className="ccm__field">
                    <span>
                      State *
                      <button
                        type="button"
                        onClick={() => {
                          setIsManualLocation(false);
                          setForm((current) => ({ ...current, state: "", lga: "" }));
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--color-secondary)",
                          padding: 0,
                          textDecoration: "underline",
                          fontSize: "10px",
                          cursor: "pointer",
                          marginLeft: "6px",
                        }}
                      >
                        Select from list
                      </button>
                    </span>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. Ogun"
                    />
                  </label>

                  <label className="ccm__field">
                    <span>LGA *</span>
                    <input
                      type="text"
                      value={form.lga}
                      onChange={(event) => updateField("lga", event.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. Obafemi Owode"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="ccm__field">
                    <span>State *</span>
                    <select
                      value={form.state}
                      onChange={(event) => {
                        const val = event.target.value;
                        if (val === "Other") {
                          setIsManualLocation(true);
                          setForm((current) => ({ ...current, state: "", lga: "" }));
                        } else {
                          setForm((current) => ({ ...current, state: val, lga: "" }));
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <option value="">-- Select State --</option>
                      {Object.keys(STATE_LGA_MAP).map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                      <option value="Other">Other (Type manually)</option>
                    </select>
                  </label>

                  <label className="ccm__field">
                    <span>LGA *</span>
                    <select
                      value={form.lga}
                      onChange={(event) => updateField("lga", event.target.value)}
                      disabled={isSubmitting || !form.state}
                    >
                      <option value="">-- Select LGA --</option>
                      {form.state &&
                        STATE_LGA_MAP[form.state]?.map((lga) => (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        ))}
                    </select>
                  </label>
                </>
              )}

              <label className="ccm__field">
                <span>Contact Phone</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  disabled={isSubmitting}
                  placeholder="+234..."
                />
              </label>

              <label className="ccm__field ccm__field--full">
                <span>Contact Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. contact@greenwood.com"
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
                {isSubmitting ? "Creating…" : "Create & Next"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ASSIGN COMMUNITY ADMIN */}
        {step === 2 && (
          <form className="ccm__form" onSubmit={handleAssignAdminSubmit} noValidate>
            <h2 className="ccm__title">Configure Administrator</h2>
            <p className="ccm__subtitle">
              Assign an admin to manage <strong>{createdCommunity?.name}</strong>.
            </p>

            <div className="ccm__grid">
              <label className="ccm__field">
                <span>First Name *</span>
                <input
                  type="text"
                  value={form.adminFirstName}
                  onChange={(event) => updateField("adminFirstName", event.target.value)}
                  disabled={isSubmitting}
                />
              </label>
              <label className="ccm__field">
                <span>Last Name *</span>
                <input
                  type="text"
                  value={form.adminLastName}
                  onChange={(event) => updateField("adminLastName", event.target.value)}
                  disabled={isSubmitting}
                />
              </label>
              <label className="ccm__field ccm__field--full">
                <span>Admin Email *</span>
                <input
                  type="email"
                  value={form.adminEmail}
                  onChange={(event) => updateField("adminEmail", event.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. admin@example.com"
                />
              </label>
              <label className="ccm__field ccm__field--full">
                <span>Admin Phone *</span>
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
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary ccm__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Assigning…" : "Assign & Next"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SETUP SUMMARY & ACTIVATION */}
        {step === 3 && (
          <div className="ccm__success">
            <div className="ccm__success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h2 className="ccm__title">Setup Completed Successfully!</h2>
            <p className="ccm__success-copy">
              <strong>{createdCommunity?.name}</strong> has been created. Share the link below with the administrator to finalize account creation.
            </p>
            <div className="ccm__credentials">
              <div>
                <span>Admin Email</span>
                <p>{adminActivation?.email}</p>
              </div>
              <div>
                <span>Activation Link</span>
                <p style={{ wordBreak: 'break-all', fontSize: 12 }}>{adminActivation?.activationLink}</p>
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
          max-width: 500px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-md);
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
        }

        /* Step Progress indicators */
        .ccm__steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
          padding: var(--space-xs) 0;
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .ccm__step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          opacity: 0.4;
          transition: opacity 0.3s ease;
        }

        .ccm__step--active {
          opacity: 1;
        }

        .ccm__step-num {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          background: var(--color-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .ccm__step-txt {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-on-surface);
        }

        .ccm__step-line {
          flex: 1;
          height: 2px;
          background: var(--color-outline-variant);
          margin: 0 var(--space-xs);
          margin-top: -16px;
        }

        .ccm__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-sm);
          font-weight: 600;
          color: var(--color-primary);
        }

        .ccm__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-sm);
          margin-top: 4px;
          margin-bottom: var(--space-md);
        }

        .ccm__alert {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-sm);
        }

        .ccm__success-alert {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: #f0fdf4;
          color: #15803d;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-sm);
        }

        .ccm__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .ccm__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-xs);
        }

        .ccm__grid--compact {
          gap: 6px;
        }

        .ccm__field {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: var(--text-label-sm);
          color: var(--color-on-surface);
        }

        .ccm__field--full {
          grid-column: 1 / -1;
        }

        .ccm__field input,
        .ccm__field select {
          font-family: var(--font-body);
          font-size: var(--text-body-sm);
          padding: 8px var(--space-xs);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: var(--color-surface-bright);
          color: var(--color-on-surface);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .ccm__field input:focus,
        .ccm__field select:focus {
          border-color: var(--color-secondary);
        }

        .ccm__field input:disabled,
        .ccm__field select:disabled {
          opacity: 0.6;
        }

        .ccm__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .ccm__cancel {
          padding: var(--space-xs) var(--space-md);
          color: var(--color-on-surface-variant);
          background: transparent;
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
        }

        .ccm__cancel:hover:not(:disabled) {
          color: var(--color-primary);
        }

        .ccm__submit {
          padding: var(--space-xs) var(--space-md);
          font-size: var(--text-label-md);
        }

        .ccm__success {
          text-align: center;
          padding: var(--space-sm) 0;
        }

        .ccm__success-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto var(--space-sm);
          border-radius: var(--radius-full);
          background: #f0fdf4;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ccm__success-icon .material-symbols-outlined {
          font-size: 24px;
        }

        .ccm__success-copy {
          color: var(--color-on-surface-variant);
          margin: var(--space-xs) auto var(--space-md);
          font-size: var(--text-body-sm);
        }

        .ccm__credentials {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          background: var(--color-surface-container-low);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          padding: var(--space-sm);
          text-align: left;
          margin-bottom: var(--space-md);
        }

        .ccm__credentials span {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-on-surface-variant);
        }

        .ccm__credentials p {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--color-on-surface);
          margin-top: 2px;
        }

        .ccm__summary-staff {
          text-align: left;
          background: var(--color-surface-container-low);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          padding: var(--space-sm);
          margin-bottom: var(--space-md);
          max-height: 120px;
          overflow-y: auto;
        }

        .ccm__summary-staff span {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-xs);
        }

        .ccm__summary-staff ul {
          padding-left: var(--space-md);
          margin: 0;
          font-size: 12px;
          color: var(--color-on-surface);
        }

        .ccm__staff-list-container {
          margin-top: var(--space-md);
          background: var(--color-surface-container-low);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          padding: var(--space-sm);
          text-align: left;
          max-height: 100px;
          overflow-y: auto;
        }

        .ccm__staff-list-container h4 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-xs);
        }

        .ccm__staff-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ccm__done {
          width: 100%;
        }

        @media (max-width: 500px) {
          .ccm__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
