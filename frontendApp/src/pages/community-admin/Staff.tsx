import { useState, useEffect } from "react";
import CommunityAdminLayout from "../../layouts/CommunityAdminLayout";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { inviteStaff } from "../../api/community";
import type { UserActivationResponse } from "../../types/auth";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "pending_setup";
  createdAt: string;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "staff-1",
    firstName: "Adewale",
    lastName: "Ojo",
    email: "a.ojo@communaltrust.app",
    phone: "+2348033221100",
    role: "Community Staff",
    status: "active",
    createdAt: "2026-05-10",
  },
  {
    id: "staff-2",
    firstName: "Blessing",
    lastName: "Nwachukwu",
    email: "b.nwachukwu@communaltrust.app",
    phone: "+2348122334455",
    role: "Community Staff",
    status: "active",
    createdAt: "2026-06-15",
  },
];

export default function Staff() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Result state
  const [activationResult, setActivationResult] = useState<{
    username: string;
    activationLink: string;
    email: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (activationResult) {
      navigator.clipboard.writeText(activationResult.activationLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter the staff member's first and last name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response: UserActivationResponse = await inviteStaff({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });

      // Parse token from the activationLink to make it local origin aware
      let token = "mock";
      try {
        const url = new URL(response.activationLink);
        token = url.searchParams.get("token") || "mock";
      } catch {
        const match = response.activationLink.match(/token=([^&]+)/);
        if (match) token = match[1];
      }

      const localActivationLink = `${window.location.origin}/activate-account?token=${token}&username=${encodeURIComponent(response.username)}`;

      // Add to local state
      const newStaff: StaffMember = {
        id: response.userId || `staff-${Date.now()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "Community Staff",
        status: "pending_setup",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setStaffList((prev) => [newStaff, ...prev]);

      setActivationResult({
        username: response.username,
        activationLink: localActivationLink,
        email: response.email,
      });

      // Clear inputs
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to invite staff member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsInviteOpen(false);
    setActivationResult(null);
    setError(null);
    setCopiedLink(false);
  };

  const filteredStaff = staffList.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  });

  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === "active").length;
  const pendingStaff = staffList.filter((s) => s.status === "pending_setup").length;

  return (
    <CommunityAdminLayout>
      <div className="st-page">
        {/* Page Header */}
        <div className="st-page__header">
          <div>
            <nav className="st-page__breadcrumb">
              <span>Admin</span>
              <span className="material-symbols-outlined">chevron_right</span>
              <span className="st-page__breadcrumb-active">Staff Management</span>
            </nav>
            <h2 className="st-page__title">Community Staff</h2>
            <p className="st-page__subtitle">
              Manage, invite and review staff members permitted to run operations in your community.
            </p>
          </div>
          <button
            type="button"
            className="st-page__invite-btn"
            onClick={() => setIsInviteOpen(true)}
          >
            <span className="material-symbols-outlined">person_add</span>
            Invite Staff Member
          </button>
        </div>

        {/* Stats Section */}
        <section className="st-page__stats">
          <div className="st-page__stat-card">
            <div className="st-page__stat-icon st-page__stat-icon--indigo">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <p className="st-page__stat-label">Total Staff</p>
              <h3 className="st-page__stat-value">{totalStaff}</h3>
            </div>
          </div>
          <div className="st-page__stat-card">
            <div className="st-page__stat-icon st-page__stat-icon--emerald">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <p className="st-page__stat-label">Active Staff</p>
              <h3 className="st-page__stat-value">{activeStaff}</h3>
            </div>
          </div>
          <div className="st-page__stat-card">
            <div className="st-page__stat-icon st-page__stat-icon--amber">
              <span className="material-symbols-outlined">pending</span>
            </div>
            <div>
              <p className="st-page__stat-label">Pending Setup</p>
              <h3 className="st-page__stat-value">{pendingStaff}</h3>
            </div>
          </div>
        </section>

        {/* Search Bar & Table */}
        <div className="st-page__table-card">
          <div className="st-page__toolbar">
            <div className="st-page__search">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search staff by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="st-page__search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <EmptyState
              icon="group"
              title={search ? "No matches found" : "No staff members invited"}
              description={
                search
                  ? `No staff matches the search term "${search}".`
                  : "Invite your first staff member to help manage community houses, payments and levies."
              }
            />
          ) : (
            <div className="st-page__table-wrap">
              <table className="st-page__table">
                <thead>
                  <tr>
                    <th className="st-page__th">Staff Member</th>
                    <th className="st-page__th">Contact Email</th>
                    <th className="st-page__th">Phone</th>
                    <th className="st-page__th">Role</th>
                    <th className="st-page__th">Status</th>
                    <th className="st-page__th">Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="st-page__row">
                      <td className="st-page__td">
                        <div className="st-page__member-cell">
                          <div className="st-page__member-avatar">
                            {staff.firstName[0]}
                            {staff.lastName[0]}
                          </div>
                          <span className="st-page__member-name">
                            {staff.firstName} {staff.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="st-page__td">{staff.email}</td>
                      <td className="st-page__td">{staff.phone}</td>
                      <td className="st-page__td">
                        <span className="st-page__role-tag">{staff.role}</span>
                      </td>
                      <td className="st-page__td">
                        <Badge
                          variant={staff.status === "active" ? "success" : "warning"}
                          icon={staff.status === "active" ? "verified" : "pending"}
                        >
                          {staff.status === "active" ? "Active" : "Pending Setup"}
                        </Badge>
                      </td>
                      <td className="st-page__td">
                        {new Date(staff.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="st-modal__overlay" role="dialog" aria-modal="true">
          <div className="st-modal__panel">
            <button
              type="button"
              className="st-modal__close-btn"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {activationResult ? (
              <div className="st-modal__success">
                <div className="st-modal__success-icon">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <h3 className="st-modal__title">Staff Invitation Created!</h3>
                <p className="st-modal__subtitle">
                  Give these credentials to the staff member so they can set their password and log in.
                </p>

                <div className="st-modal__credentials">
                  <div className="st-modal__cred-field">
                    <span>Generated Username</span>
                    <p className="st-modal__cred-value">{activationResult.username}</p>
                  </div>
                  <div className="st-modal__cred-field">
                    <span>Activation Link</span>
                    <p className="st-modal__cred-link">{activationResult.activationLink}</p>
                  </div>
                </div>

                <div className="st-modal__actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCopyLink}
                  >
                    <span className="material-symbols-outlined">
                      {copiedLink ? "check" : "content_copy"}
                    </span>
                    {copiedLink ? "Copied!" : "Copy Activation Link"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCloseModal}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="st-modal__form" noValidate>
                <h3 className="st-modal__title">Invite Staff Member</h3>
                <p className="st-modal__subtitle">
                  Create a new staff profile. They will receive credentials to activate their account.
                </p>

                {error && (
                  <div role="alert" className="st-modal__alert">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                  </div>
                )}

                <div className="st-modal__grid">
                  <label className="st-modal__field">
                    <span>First Name *</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. John"
                    />
                  </label>
                  <label className="st-modal__field">
                    <span>Last Name *</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. Doe"
                    />
                  </label>
                  <label className="st-modal__field st-modal__field--full">
                    <span>Email Address *</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. j.doe@example.com"
                    />
                  </label>
                  <label className="st-modal__field st-modal__field--full">
                    <span>Phone Number *</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. +234..."
                    />
                  </label>
                </div>

                <div className="st-modal__actions">
                  <button
                    type="button"
                    className="st-modal__cancel"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Spinner /> : "Send Invitation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* ============================================================
           Staff Management Page Style
           ============================================================ */

        .st-page__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .st-page__breadcrumb {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-xs);
        }

        .st-page__breadcrumb .material-symbols-outlined {
          font-size: 14px;
        }

        .st-page__breadcrumb-active {
          color: var(--color-secondary);
          font-weight: 700;
        }

        .st-page__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          color: var(--color-primary);
        }

        .st-page__subtitle {
          color: var(--color-on-surface-variant);
          font-size: 13px;
          margin-top: 2px;
        }

        .st-page__invite-btn {
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

        .st-page__invite-btn:hover {
          box-shadow: 0 14px 30px -10px rgba(70, 72, 212, 0.5);
        }

        .st-page__invite-btn:active {
          transform: scale(0.97);
        }

        /* Stats Cards */
        .st-page__stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .st-page__stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .st-page__stat-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .st-page__stat-icon--indigo {
          background: #eef2ff;
          color: var(--color-secondary);
        }

        .st-page__stat-icon--emerald {
          background: #ecfdf5;
          color: #059669;
        }

        .st-page__stat-icon--amber {
          background: #fffbeb;
          color: #d97706;
        }

        .st-page__stat-label {
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: var(--color-on-surface-variant);
        }

        .st-page__stat-value {
          font-family: var(--font-display);
          font-size: var(--text-headline-sm);
          color: #0f172a;
          margin-top: 2px;
        }

        /* Table Card */
        .st-page__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .st-page__toolbar {
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .st-page__search {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 400px;
        }

        .st-page__search > .material-symbols-outlined {
          position: absolute;
          left: 12px;
          font-size: 20px;
          color: var(--color-on-surface-variant);
          pointer-events: none;
        }

        .st-page__search input {
          width: 100%;
          padding: 10px 36px 10px 40px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          background: var(--color-surface-container-low);
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .st-page__search input:focus {
          border-color: var(--color-secondary);
        }

        .st-page__search-clear {
          position: absolute;
          right: 8px;
          padding: 4px;
          border-radius: var(--radius-full);
          color: var(--color-on-surface-variant);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .st-page__search-clear:hover {
          background: var(--color-surface-container);
        }

        .st-page__table-wrap {
          overflow-x: auto;
        }

        .st-page__table {
          width: 100%;
          border-collapse: collapse;
        }

        .st-page__th {
          text-align: left;
          padding: 12px var(--space-md);
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
          color: var(--color-on-surface-variant);
          background: var(--color-surface-container-low);
          border-bottom: 1px solid var(--color-outline-variant);
          white-space: nowrap;
        }

        .st-page__td {
          padding: 14px var(--space-md);
          font-size: var(--text-label-md);
          color: #0f172a;
          vertical-align: middle;
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .st-page__row:last-child .st-page__td {
          border-bottom: none;
        }

        .st-page__row:hover {
          background: var(--color-surface-container-low);
        }

        .st-page__member-cell {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .st-page__member-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: #eef2ff;
          color: var(--color-secondary);
          border: 1px solid #e0e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          flex-shrink: 0;
        }

        .st-page__member-name {
          font-weight: 700;
          color: #0f172a;
        }

        .st-page__role-tag {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-on-surface-variant);
          background: var(--color-surface-container);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        /* Modal styling */
        .st-modal__overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          z-index: 200;
        }

        .st-modal__panel {
          position: relative;
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: 32px var(--space-md);
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.4);
          animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .st-modal__close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px;
          border-radius: var(--radius-full);
          color: var(--color-on-surface-variant);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .st-modal__close-btn:hover {
          background: var(--color-surface-container);
        }

        .st-modal__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-sm);
          font-weight: 600;
          color: var(--color-primary);
        }

        .st-modal__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-sm);
          margin-top: 4px;
          margin-bottom: var(--space-md);
          line-height: 1.4;
        }

        .st-modal__alert {
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

        .st-modal__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .st-modal__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-xs);
        }

        .st-modal__field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: var(--text-label-sm);
          color: var(--color-on-surface);
        }

        .st-modal__field--full {
          grid-column: 1 / -1;
        }

        .st-modal__field input {
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

        .st-modal__field input:focus {
          border-color: var(--color-secondary);
        }

        .st-modal__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .st-modal__cancel {
          padding: var(--space-xs) var(--space-md);
          color: var(--color-on-surface-variant);
          background: transparent;
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
        }

        .st-modal__cancel:hover {
          color: var(--color-primary);
        }

        /* Success State */
        .st-modal__success {
          text-align: center;
        }

        .st-modal__success-icon {
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

        .st-modal__success-icon .material-symbols-outlined {
          font-size: 24px;
        }

        .st-modal__credentials {
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

        .st-modal__cred-field {
          display: flex;
          flex-direction: column;
        }

        .st-modal__cred-field span {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-on-surface-variant);
        }

        .st-modal__cred-value {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--color-secondary);
          margin-top: 2px;
        }

        .st-modal__cred-link {
          font-size: 12px;
          color: var(--color-on-surface);
          word-break: break-all;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .st-page__stats {
            grid-template-columns: 1fr;
          }
          .st-modal__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </CommunityAdminLayout>
  );
}
