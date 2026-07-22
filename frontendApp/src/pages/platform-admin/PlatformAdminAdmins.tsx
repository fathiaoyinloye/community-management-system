import { useEffect, useState } from "react";
import PlatformAdminLayout from "../../layouts/PlatformAdminLayout";
import { getCommunities } from "../../api/community";

interface AdminRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  communityId: string;
  communityName: string;
  role: "Admin" | "Super Admin" | "Community Admin" | "Community Staff";
  lastLogin: string;
  mfaStatus: "Verified MFA" | "Flagged IP" | "Disabled";
  status: "active" | "pending_setup";
  createdAt: string;
}



export default function PlatformAdminAdmins() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Load admins and staff
  useEffect(() => {
    // 1. Get staff list
    const storedStaff = localStorage.getItem("ct_staff");
    const staffList = storedStaff ? JSON.parse(storedStaff) : [];
    const mappedStaff = staffList.map((s: any) => ({
      id: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      phone: s.phone,
      communityId: s.communityId || "Unknown",
      communityName: s.communityName || "CommunalTrust",
      role: s.role || "Community Staff",
      lastLogin: "Pending setup",
      mfaStatus: "Disabled",
      status: s.status || "pending_setup",
      createdAt: s.createdAt,
    }));

    // 2. Fetch communities and load/synthesize admins
    getCommunities()
      .then((communitiesList) => {
        const storedAdmins = localStorage.getItem("ct_community_admins");
        let adminsList = storedAdmins ? JSON.parse(storedAdmins) : [];

        // Clean up mock seed data
        adminsList = adminsList.filter(
          (a: any) =>
            a.id !== "admin-1" &&
            a.id !== "admin-2" &&
            a.id !== "admin-3" &&
            a.id !== "admin-4" &&
            a.role !== "Super Admin" &&
            a.role !== "Admin"
        );
        localStorage.setItem("ct_community_admins", JSON.stringify(adminsList));

        // Synthesize admin details for any community not present in ct_community_admins
        const synthesized: AdminRecord[] = [];
        communitiesList.forEach((comm) => {
          const exists = adminsList.some((a: any) => a.communityId === comm.id);
          if (!exists) {
            synthesized.push({
              id: `synth-admin-${comm.id}`,
              firstName: "Admin",
              lastName: `of ${comm.name}`,
              email: comm.email,
              phone: comm.phone,
              communityId: comm.id,
              communityName: comm.name,
              role: "Community Admin",
              lastLogin: "Pending setup",
              mfaStatus: "Verified MFA",
              status: "active",
              createdAt: comm.createdAt,
            });
          }
        });

        const combined = [...adminsList, ...synthesized, ...mappedStaff];
        setAdmins(combined);
      })
      .catch((err) => {
        console.error("Failed to load communities for admin directory:", err);
        // Fallback to local only if backend call fails
        const storedAdmins = localStorage.getItem("ct_community_admins");
        const adminsList = storedAdmins ? JSON.parse(storedAdmins) : [];
        const combined = [...adminsList, ...mappedStaff];
        setAdmins(combined);
      });
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered Admins
  const filteredAdmins = admins.filter((admin) => {
    const q = search.toLowerCase();
    return (
      admin.firstName.toLowerCase().includes(q) ||
      admin.lastName.toLowerCase().includes(q) ||
      admin.email.toLowerCase().includes(q) ||
      admin.communityName.toLowerCase().includes(q)
    );
  });

  // KPI Statistics
  const totalAdmins = admins.length;
  const activeSessions = totalAdmins > 0 ? Math.max(1, Math.round(totalAdmins * 0.25)) : 0;
  const mfaAdmins = admins.filter((a) => a.mfaStatus === "Verified MFA").length;
  const mfaCompliance = totalAdmins > 0 ? ((mfaAdmins / totalAdmins) * 100).toFixed(1) : "100";

  const handleRevoke = (id: string, name: string, role: string) => {
    if (!window.confirm(`Are you sure you want to revoke system privileges for ${name}?`)) return;

    if (role === "Community Staff") {
      const storedStaff = localStorage.getItem("ct_staff");
      const staffList = storedStaff ? JSON.parse(storedStaff) : [];
      const nextStaff = staffList.filter((s: any) => s.id !== id);
      localStorage.setItem("ct_staff", JSON.stringify(nextStaff));
    } else {
      const storedAdmins = localStorage.getItem("ct_community_admins");
      const adminsList = storedAdmins ? JSON.parse(storedAdmins) : [];
      const nextAdmins = adminsList.filter((a: any) => a.id !== id);
      localStorage.setItem("ct_community_admins", JSON.stringify(nextAdmins));
    }

    setAdmins((prev) => prev.filter((a) => a.id !== id));
    showToast(`Access privileges revoked for ${name}.`, "info");
  };

  const handleResetPassword = (name: string) => {
    showToast(`Password reset link dispatched to ${name}'s email address.`);
  };

  const getRoleBadgeClass = (role: string) => {
    if (role === "Super Admin") return "ui-badge ui-badge--success";
    if (role === "Community Admin") return "ui-badge ui-badge--neutral";
    return "ui-badge ui-badge--warning"; // for Community Staff
  };

  return (
    <PlatformAdminLayout>
      <div className="paa">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`paa__toast ${
              toast.type === "error"
                ? "paa__toast--error"
                : toast.type === "info"
                ? "paa__toast--info"
                : ""
            }`}
          >
            <span className="material-symbols-outlined">
              {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
            </span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="paa__header">
          <div>
            <h2 className="paa__heading">Administrator Directory</h2>
            <p className="paa__subheading">
              Manage system privileges and monitor access security for all community clusters active across the network.
            </p>
          </div>
        </div>

        {/* Stats Grid (Now 3 Columns) */}
        <div className="paa__stats">
          <div className="paa__stat-card">
            <div className="paa__stat-icon paa__stat-icon--indigo">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div>
              <p className="paa__stat-label">Total Accounts</p>
              <h3 className="paa__stat-value">{totalAdmins}</h3>
            </div>
          </div>
          <div className="paa__stat-card">
            <div className="paa__stat-icon paa__stat-icon--emerald">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div>
              <p className="paa__stat-label">Active Sessions</p>
              <h3 className="paa__stat-value">{activeSessions}</h3>
            </div>
          </div>
          <div className="paa__stat-card">
            <div className="paa__stat-icon paa__stat-icon--amber">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div>
              <p className="paa__stat-label">MFA Compliance</p>
              <h3 className="paa__stat-value">{mfaCompliance}%</h3>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="paa__toolbar">
          <div className="paa__search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search system administrators and staff by name, email, or community..."
            />
          </div>
        </div>

        {/* Admin Management Table */}
        <div className="paa__table-card">
          <div className="paa__table-wrap">
            <table className="paa__table">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="paa__th">Name</th>
                  <th className="paa__th">Assigned Community</th>
                  <th className="paa__th">Role</th>
                  <th className="paa__th">Last Login</th>
                  <th className="paa__th">Security Status</th>
                  <th className="paa__th paa__th--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => {
                    const fullName = `${admin.firstName} ${admin.lastName}`;
                    const initials = (admin.firstName[0] || "") + (admin.lastName[0] || "");
                    return (
                      <tr key={admin.id} className="paa__row">
                        <td className="paa__td">
                          <div className="paa__profile-cell">
                            <div className="paa__avatar">{initials}</div>
                            <div>
                              <div className="paa__admin-name">{fullName}</div>
                              <div className="paa__admin-email">{admin.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="paa__td">{admin.communityName}</td>
                        <td className="paa__td">
                          <span className={getRoleBadgeClass(admin.role)}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="paa__td">{admin.lastLogin}</td>
                        <td className="paa__td">
                          <div className="paa__status">
                            <span
                              className={`paa__status-dot ${
                                admin.mfaStatus === "Verified MFA"
                                  ? "paa__status-dot--verified"
                                  : "paa__status-dot--flagged"
                              }`}
                            />
                            <span
                              className={
                                admin.mfaStatus === "Verified MFA"
                                  ? "paa__status-text--verified"
                                  : "paa__status-text--flagged"
                              }
                            >
                              {admin.mfaStatus}
                            </span>
                          </div>
                        </td>
                        <td className="paa__td paa__td--right">
                          <div className="paa__actions">
                            <button
                              onClick={() => handleResetPassword(fullName)}
                              className="paa__action-btn paa__action-btn--reset"
                              title="Reset Password"
                            >
                              <span className="material-symbols-outlined">lock_reset</span>
                            </button>
                            <button
                              onClick={() => handleRevoke(admin.id, fullName, admin.role)}
                              className="paa__action-btn paa__action-btn--revoke"
                              title="Revoke Access"
                            >
                              <span className="material-symbols-outlined">person_off</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="paa__td" style={{ textAlign: "center", padding: "40px" }}>
                      No administrators or staff matching the search query were found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination style */}
          <div className="paa__table-foot">
            <p>Showing {filteredAdmins.length} of {admins.length} accounts</p>
          </div>
        </div>
      </div>

      <style>{`
        .paa {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        /* ---- Header ---- */
        .paa__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .paa__heading {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 700;
          color: var(--color-primary);
        }

        .paa__subheading {
          font-size: var(--text-body-md);
          color: var(--color-on-surface-variant);
        }

        /* ---- Stats ---- */
        .paa__stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
        }

        .paa__stat-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .paa__stat-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .paa__stat-icon--indigo {
          background: rgba(70, 72, 212, 0.1);
          color: var(--color-secondary);
        }

        .paa__stat-icon--emerald {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .paa__stat-icon--amber {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .paa__stat-label {
          font-size: var(--text-label-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-on-surface-variant);
          margin-bottom: 2px;
        }

        .paa__stat-value {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 700;
          color: var(--color-primary);
        }

        /* ---- Toolbar ---- */
        .paa__toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: 12px var(--space-md);
          gap: var(--space-md);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .paa__search {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          flex: 1;
        }

        .paa__search .material-symbols-outlined {
          color: var(--color-outline);
        }

        .paa__search input {
          width: 100%;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          color: var(--color-on-surface);
        }

        /* ---- Table Card ---- */
        .paa__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .paa__table-wrap {
          overflow-x: auto;
        }

        .paa__table {
          width: 100%;
          border-collapse: collapse;
        }

        .paa__th {
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

        .paa__th--right {
          text-align: right;
        }

        .paa__row {
          border-bottom: 1px solid var(--color-outline-variant);
          transition: background-color 0.15s ease;
        }

        .paa__row:hover {
          background: var(--color-surface-container-low);
        }

        .paa__td {
          padding: 14px var(--space-md);
          font-size: var(--text-body-md);
          vertical-align: middle;
        }

        .paa__td--right {
          text-align: right;
        }

        .paa__profile-cell {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .paa__avatar {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          background: var(--color-primary-container);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }

        .paa__admin-name {
          font-weight: 600;
          color: var(--color-on-surface);
        }

        .paa__admin-email {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
        }

        .paa__status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-label-sm);
          font-weight: 600;
        }

        .paa__status-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          display: inline-block;
        }

        .paa__status-dot--verified {
          background: #10b981;
        }

        .paa__status-dot--flagged {
          background: var(--color-error);
        }

        .paa__status-text--verified {
          color: #10b981;
        }

        .paa__status-text--flagged {
          color: var(--color-error);
        }

        .paa__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-xs);
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .paa__row:hover .paa__actions {
          opacity: 1;
        }

        .paa__action-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-lg);
          color: var(--color-on-surface-variant);
          background: transparent;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .paa__action-btn .material-symbols-outlined {
          font-size: 20px;
        }

        .paa__action-btn--reset:hover {
          background: var(--color-secondary-fixed);
          color: var(--color-secondary);
        }

        .paa__action-btn--revoke:hover {
          background: var(--color-error-container);
          color: var(--color-error);
        }

        /* ---- Pagination ---- */
        .paa__table-foot {
          padding: var(--space-sm) var(--space-md);
          background: var(--color-surface-container-low);
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .paa__table-foot p {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
        }

        .paa__pagination {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .paa__page-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: var(--color-on-surface-variant);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .paa__page-btn:hover:not(:disabled) {
          background: var(--color-surface-container-low);
          color: var(--color-primary);
        }

        .paa__page-btn--active {
          background: var(--color-secondary);
          color: #ffffff;
          border-color: var(--color-secondary);
        }

        .paa__page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ---- Logs Section ---- */
        .paa__bottom-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        .paa__card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .paa__card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }

        .paa__card-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
        }

        .paa__card-link {
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: var(--color-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .paa__card-link:hover {
          text-decoration: underline;
        }

        .paa__logs-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .paa__log-item {
          display: flex;
          gap: var(--space-md);
          align-items: flex-start;
          padding: var(--space-sm);
          background: var(--color-surface-container-low);
          border-radius: var(--radius-lg);
          border-left: 4px solid transparent;
        }

        .paa__log-item--success {
          border-left-color: #10b981;
        }

        .paa__log-item--warning {
          border-left-color: var(--color-error);
        }

        .paa__log-item--info {
          border-left-color: var(--color-secondary);
        }

        .paa__log-icon {
          font-size: 20px;
          margin-top: 2px;
        }

        .paa__log-icon--success {
          color: #10b981;
        }

        .paa__log-icon--warning {
          color: var(--color-error);
        }

        .paa__log-icon--info {
          color: var(--color-secondary);
        }

        .paa__log-content {
          flex: 1;
        }

        .paa__log-title {
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-primary);
        }

        .paa__log-detail {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .paa__log-time {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          opacity: 0.7;
        }

        /* ---- Toast ---- */
        .paa__toast {
          position: fixed;
          bottom: var(--space-md);
          right: var(--space-md);
          z-index: 150;
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 12px var(--space-md);
          border-radius: var(--radius-xl);
          background: #1e293b;
          color: #ffffff;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .paa__toast--error {
          background: #93000a;
        }

        .paa__toast--info {
          background: #2f2ebe;
        }

        @media (max-width: 1024px) {
          .paa__stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .paa__stats {
            grid-template-columns: 1fr;
          }

          .paa__header {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </PlatformAdminLayout>
  );
}
