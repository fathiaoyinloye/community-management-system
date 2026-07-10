import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import CommunityAdminLayout from '../../layouts/CommunityAdminLayout'
import Spinner from '../../components/ui/Spinner'
import { getCommunityProfile, updateCommunityProfile } from '../../api/community'
import type { CommunityProfile, CommunityType } from '../../types/community'

const TYPE_OPTIONS: { value: CommunityType; label: string }[] = [
  { value: 'gated_estate', label: 'Gated Estate' },
  { value: 'apartment_complex', label: 'Apartment Complex' },
  { value: 'residential_association', label: 'Residential Association' },
  { value: 'commercial_plaza', label: 'Commercial Plaza' },
]

const DESCRIPTION_LIMIT = 1000

export default function CommunityInfo() {
  const [profile, setProfile] = useState<CommunityProfile | null>(null)
  const [form, setForm] = useState<CommunityProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false

    getCommunityProfile().then((data) => {
      if (!cancelled) {
        setProfile(data)
        setForm(data)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const updateField = <K extends keyof CommunityProfile>(field: K, value: CommunityProfile[K]) => {
    setForm((current) => (current ? { ...current, [field]: value } : current))
  }

  const handleDiscard = () => {
    setForm(profile)
  }

  const handleSave = async () => {
    if (!form) return
    setIsSaving(true)
    try {
      const updated = await updateCommunityProfile(form)
      setProfile(updated)
      setForm(updated)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    updateField('logoUrl', URL.createObjectURL(file))
    event.target.value = ''
  }

  const handleLogoRemove = () => {
    updateField('logoUrl', null)
  }

  if (isLoading || !form) {
    return (
      <CommunityAdminLayout>
        <div className="ci-loading">
          <Spinner />
          <span>Loading community profile…</span>
        </div>
      </CommunityAdminLayout>
    )
  }

  return (
    <CommunityAdminLayout>
      <div className="ci">
        <div className="ci__header">
          <div>
            <nav className="ci__breadcrumb">
              <span>Admin</span>
              <span className="material-symbols-outlined">chevron_right</span>
              <span className="ci__breadcrumb-active">Manage Community Information</span>
            </nav>
            <h2 className="ci__title">Community Profile</h2>
            <p className="ci__subtitle">
              Update your community&apos;s identity, contact details, and location metadata.
            </p>
          </div>
          <div className="ci__actions">
            <button type="button" className="ci__discard" onClick={handleDiscard} disabled={isSaving}>
              Discard
            </button>
            <button type="button" className="ci__save" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined ci__save-spinner">sync</span>
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        <div className="ci__grid">
          <div className="ci__col-left">
            <section className="ci__card">
              <h3 className="ci__card-title">Community Logo</h3>
              <div className="ci__logo-wrap">
                <div className="ci__logo-frame">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Community logo" />
                  ) : (
                    <span className="material-symbols-outlined ci__logo-placeholder">apartment</span>
                  )}
                  <button
                    type="button"
                    className="ci__logo-overlay"
                    onClick={() => logoInputRef.current?.click()}
                    aria-label="Upload community logo"
                  >
                    <span className="material-symbols-outlined">upload</span>
                  </button>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  hidden
                  onChange={handleLogoChange}
                />
                <p className="ci__logo-hint">
                  Recommended size: 512x512px.
                  <br />
                  PNG or SVG format preferred.
                </p>
                <div className="ci__logo-buttons">
                  <button type="button" className="ci__logo-change" onClick={() => logoInputRef.current?.click()}>
                    Change
                  </button>
                  <button
                    type="button"
                    className="ci__logo-delete"
                    onClick={handleLogoRemove}
                    disabled={!form.logoUrl}
                    aria-label="Remove logo"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="ci__card">
              <h3 className="ci__card-eyebrow">Profile Completeness</h3>
              <div className="ci__status">
                <div className="ci__status-row">
                  <span>Public Visibility</span>
                  <span className={form.isPublic ? 'ci__status-badge' : 'ci__status-badge ci__status-badge--off'}>
                    {form.isPublic ? 'ACTIVE' : 'HIDDEN'}
                  </span>
                </div>
                <div className="ci__meter">
                  <div className="ci__meter-fill" style={{ width: `${form.profileCompleteness}%` }} />
                </div>
                <p className="ci__status-note">Add a detailed description to reach 100%.</p>
              </div>
            </section>
          </div>

          <div className="ci__col-right">
            <div className="ci__form-card">
              <div className="ci__section">
                <h3 className="ci__section-title">
                  <span className="material-symbols-outlined">business</span>
                  Core Information
                </h3>
                <div className="ci__form-grid">
                  <label className="ci__field">
                    <span>Community Name</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => updateField('name', event.target.value)}
                    />
                  </label>
                  <label className="ci__field">
                    <span>Community Type</span>
                    <select
                      value={form.type}
                      onChange={(event) => updateField('type', event.target.value as CommunityType)}
                    >
                      {TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="ci__field ci__field--full">
                    <span>Full Address</span>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(event) => updateField('address', event.target.value)}
                    />
                  </label>
                  <label className="ci__field">
                    <span>State</span>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(event) => updateField('state', event.target.value)}
                    />
                  </label>
                  <label className="ci__field">
                    <span>LGA</span>
                    <input
                      type="text"
                      value={form.lga}
                      onChange={(event) => updateField('lga', event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="ci__section ci__section--muted">
                <h3 className="ci__section-title">
                  <span className="material-symbols-outlined">contact_mail</span>
                  Contact Details
                </h3>
                <div className="ci__form-grid">
                  <label className="ci__field">
                    <span>Official Phone</span>
                    <div className="ci__input-icon">
                      <span className="material-symbols-outlined">call</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(event) => updateField('phone', event.target.value)}
                      />
                    </div>
                  </label>
                  <label className="ci__field">
                    <span>Official Email</span>
                    <div className="ci__input-icon">
                      <span className="material-symbols-outlined">mail</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField('email', event.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="ci__section">
                <h3 className="ci__section-title">
                  <span className="material-symbols-outlined">description</span>
                  About the Community
                </h3>
                <label className="ci__field">
                  <span>Community Description</span>
                  <textarea
                    rows={6}
                    maxLength={DESCRIPTION_LIMIT}
                    placeholder="Enter a brief history and description of the community…"
                    value={form.description}
                    onChange={(event) => updateField('description', event.target.value)}
                  />
                  <p className="ci__char-count">
                    {form.description.length} / {DESCRIPTION_LIMIT} characters
                  </p>
                </label>
              </div>
            </div>

            <div className="ci__location">
              <div className="ci__location-icon">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div className="ci__location-copy">
                <h4>Location Verified</h4>
                <p>
                  Your community coordinates are correctly mapped to {form.lga}, {form.state}.
                </p>
              </div>
              <button type="button" className="ci__location-edit">
                Edit Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={showToast ? 'ci__toast ci__toast--visible' : 'ci__toast'}>
        <span className="material-symbols-outlined">check_circle</span>
        Changes saved successfully
      </div>

      <style>{`
        .ci-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-xl);
          color: var(--color-on-surface-variant);
        }

        .ci__header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .ci__breadcrumb {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-xs);
        }

        .ci__breadcrumb .material-symbols-outlined {
          font-size: 14px;
        }

        .ci__breadcrumb-active {
          color: var(--color-secondary);
          font-weight: 700;
        }

        .ci__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
        }

        .ci__subtitle {
          color: var(--color-on-surface-variant);
          margin-top: var(--space-xs);
        }

        .ci__actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .ci__discard {
          padding: 10px var(--space-md);
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          background: transparent;
          border-radius: var(--radius-lg);
        }

        .ci__discard:hover:not(:disabled) {
          color: var(--color-primary);
        }

        .ci__save {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 10px var(--space-md);
          background: var(--color-secondary);
          color: #ffffff;
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 700;
          box-shadow: 0 10px 25px -10px rgba(70, 72, 212, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ci__save:hover:not(:disabled) {
          box-shadow: 0 14px 30px -10px rgba(70, 72, 212, 0.5);
        }

        .ci__save:active:not(:disabled) {
          transform: scale(0.97);
        }

        .ci__save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ci__save-spinner {
          animation: ci-spin 0.7s linear infinite;
        }

        @keyframes ci-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .ci__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
        }

        .ci__col-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .ci__col-right {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .ci__card {
          background: #ffffff;
          padding: var(--space-md);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-outline-variant);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .ci__card-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          margin-bottom: var(--space-md);
        }

        .ci__logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
        }

        .ci__logo-frame {
          width: 192px;
          height: 192px;
          border-radius: var(--radius-2xl);
          border: 2px dashed var(--color-outline-variant);
          background: var(--color-surface-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .ci__logo-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ci__logo-placeholder {
          font-size: 56px;
          color: var(--color-outline-variant);
        }

        .ci__logo-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .ci__logo-overlay .material-symbols-outlined {
          font-size: 36px;
        }

        .ci__logo-frame:hover .ci__logo-overlay {
          opacity: 1;
        }

        .ci__logo-hint {
          text-align: center;
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
        }

        .ci__logo-buttons {
          display: flex;
          gap: var(--space-sm);
          width: 100%;
        }

        .ci__logo-change {
          flex: 1;
          padding: var(--space-xs) 0;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          background: #ffffff;
        }

        .ci__logo-change:hover {
          background: var(--color-surface-container);
        }

        .ci__logo-delete {
          padding: var(--space-xs);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-error);
          background: #ffffff;
        }

        .ci__logo-delete:hover:not(:disabled) {
          background: #fff1f2;
        }

        .ci__logo-delete:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ci__card-eyebrow {
          font-size: var(--text-label-md);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .ci__status {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .ci__status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--text-label-md);
        }

        .ci__status-badge {
          padding: 4px var(--space-xs);
          background: var(--color-tertiary-fixed);
          color: var(--color-on-tertiary-fixed);
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 700;
        }

        .ci__status-badge--off {
          background: var(--color-surface-container);
          color: var(--color-on-surface-variant);
        }

        .ci__meter {
          width: 100%;
          height: 8px;
          background: var(--color-surface-container-high);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .ci__meter-fill {
          height: 100%;
          background: var(--color-secondary);
          border-radius: var(--radius-full);
          transition: width 0.4s ease;
        }

        .ci__status-note {
          font-size: 12px;
          font-style: italic;
          color: var(--color-on-surface-variant);
        }

        .ci__form-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        .ci__section {
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .ci__section:last-child {
          border-bottom: none;
        }

        .ci__section--muted {
          background: rgba(242, 244, 246, 0.5);
        }

        .ci__section-title {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          margin-bottom: var(--space-lg);
        }

        .ci__section-title .material-symbols-outlined {
          color: var(--color-secondary);
        }

        .ci__form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        .ci__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          font-size: var(--text-label-md);
          color: var(--color-on-surface);
        }

        .ci__field input,
        .ci__field select,
        .ci__field textarea {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: var(--space-sm) var(--space-md);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: var(--color-surface-bright);
          color: var(--color-on-surface);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .ci__field textarea {
          resize: none;
        }

        .ci__field input:focus,
        .ci__field select:focus,
        .ci__field textarea:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(70, 72, 212, 0.15);
        }

        .ci__input-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ci__input-icon .material-symbols-outlined {
          position: absolute;
          left: var(--space-sm);
          font-size: 18px;
          color: var(--color-on-surface-variant);
        }

        .ci__input-icon input {
          width: 100%;
          padding-left: 40px;
        }

        .ci__char-count {
          text-align: right;
          font-size: 12px;
          color: var(--color-on-surface-variant);
        }

        .ci__location {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          padding: var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .ci__location-icon {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: var(--radius-lg);
          background: var(--color-surface-container-high);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ci__location-icon .material-symbols-outlined {
          font-size: 32px;
          color: var(--color-secondary);
        }

        .ci__location-copy {
          flex: 1;
        }

        .ci__location-copy h4 {
          font-weight: 700;
          font-size: var(--text-label-md);
        }

        .ci__location-copy p {
          font-size: 14px;
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .ci__location-edit {
          padding: var(--space-xs) var(--space-md);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          background: #ffffff;
          white-space: nowrap;
        }

        .ci__location-edit:hover {
          background: var(--color-surface-container);
        }

        .ci__toast {
          position: fixed;
          bottom: var(--space-gutter);
          right: var(--space-gutter);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background: var(--color-primary);
          color: #ffffff;
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.4);
          transform: translateY(120%);
          transition: transform 0.3s ease;
          z-index: 100;
        }

        .ci__toast--visible {
          transform: translateY(0);
        }

        .ci__toast .material-symbols-outlined {
          color: var(--color-tertiary-fixed);
        }

        @media (min-width: 768px) {
          .ci__form-grid {
            grid-template-columns: 1fr 1fr;
          }

          .ci__field--full {
            grid-column: 1 / -1;
          }
        }

        @media (min-width: 1024px) {
          .ci__grid {
            grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
          }
        }
      `}</style>
    </CommunityAdminLayout>
  )
}
