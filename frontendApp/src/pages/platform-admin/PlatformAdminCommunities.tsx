import { useMemo, useState } from "react";
import PlatformAdminLayout from "../../layouts/PlatformAdminLayout";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  CommunitiesProvider,
  useCommunities,
} from "../../store/CommunitiesContext";
import type { Community } from "../../types/community";

type FilterTab = "all" | "active" | "pending_setup";
type SortKey = "name" | "housesCount" | "createdAt" | "state";
type SortDir = "asc" | "desc";

const TABS: { key: FilterTab; label: string; icon: string }[] = [
  { key: "all", label: "All Communities", icon: "apps" },
  { key: "active", label: "Active", icon: "verified" },
  { key: "pending_setup", label: "Pending Setup", icon: "pending" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PlatformAdminCommunitiesPage() {
  return (
    <CommunitiesProvider>
      <PlatformAdminCommunities />
    </CommunitiesProvider>
  );
}

function PlatformAdminCommunities() {
  const { communities, isLoading } = useCommunities();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (list: Community[]) => {
    if (selectedIds.size === list.length && list.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(list.map((c) => c.id)));
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = communities;

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((c) => c.status === activeTab);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.adminName ?? "").toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.lga.toLowerCase().includes(q),
      );
    }

    // Sort
    const sorted = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "housesCount":
          cmp = (a.housesCount ?? 0) - (b.housesCount ?? 0);
          break;
        case "createdAt":
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "state":
          cmp = a.state.localeCompare(b.state);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [communities, activeTab, search, sortKey, sortDir]);

  const totalActive = communities.filter((c) => c.status === "active").length;
  const totalPending = communities.filter(
    (c) => c.status === "pending_setup",
  ).length;
  const totalHouses = communities.reduce(
    (acc, c) => acc + (c.housesCount ?? 0),
    0,
  );

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return "unfold_more";
    return sortDir === "asc" ? "arrow_upward" : "arrow_downward";
  };

  return (
    <PlatformAdminLayout>
      <div className="pac">
        {/* Page Header */}
        <div className="pac__header">
          <div>
            <h2 className="pac__heading">Communities</h2>
            <p className="pac__subheading">
              View and manage every community onboarded to the platform.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="pac__stats">
          <div className="pac__stat-card">
            <div className="pac__stat-icon pac__stat-icon--indigo">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <div>
              <p className="pac__stat-label">Total Communities</p>
              <h3 className="pac__stat-value">
                {isLoading ? "—" : communities.length}
              </h3>
            </div>
          </div>
          <div className="pac__stat-card">
            <div className="pac__stat-icon pac__stat-icon--emerald">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <p className="pac__stat-label">Active</p>
              <h3 className="pac__stat-value">
                {isLoading ? "—" : totalActive}
              </h3>
            </div>
          </div>
          <div className="pac__stat-card">
            <div className="pac__stat-icon pac__stat-icon--amber">
              <span className="material-symbols-outlined">pending</span>
            </div>
            <div>
              <p className="pac__stat-label">Pending Setup</p>
              <h3 className="pac__stat-value">
                {isLoading ? "—" : totalPending}
              </h3>
            </div>
          </div>
          <div className="pac__stat-card">
            <div className="pac__stat-icon pac__stat-icon--slate">
              <span className="material-symbols-outlined">home</span>
            </div>
            <div>
              <p className="pac__stat-label">Total Houses</p>
              <h3 className="pac__stat-value">
                {isLoading ? "—" : totalHouses.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="pac__table-card">
          {/* Toolbar */}
          <div className="pac__toolbar">
            <div className="pac__tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={
                    activeTab === tab.key
                      ? "pac__tab pac__tab--active"
                      : "pac__tab"
                  }
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSelectedIds(new Set());
                  }}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  {tab.label}
                  {tab.key === "all" && (
                    <span className="pac__tab-count">{communities.length}</span>
                  )}
                  {tab.key === "active" && (
                    <span className="pac__tab-count">{totalActive}</span>
                  )}
                  {tab.key === "pending_setup" && (
                    <span className="pac__tab-count">{totalPending}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="pac__search">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search communities…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="pac__search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="pac__loading">
              <Spinner />
              <span>Loading communities…</span>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <EmptyState
              icon="domain"
              title={search ? "No results found" : "No communities here yet"}
              description={
                search
                  ? `No communities match "${search}". Try a different term.`
                  : "Communities in this status will appear here."
              }
            />
          ) : (
            <div className="pac__table-wrap">
              <table className="pac__table">
                <thead>
                  <tr>
                    <th className="pac__th pac__th--check">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.size === filteredAndSorted.length &&
                          filteredAndSorted.length > 0
                        }
                        onChange={() => toggleSelectAll(filteredAndSorted)}
                      />
                    </th>
                    <th
                      className="pac__th pac__th--sortable"
                      onClick={() => toggleSort("name")}
                    >
                      Community
                      <span className="material-symbols-outlined pac__sort-icon">
                        {sortIcon("name")}
                      </span>
                    </th>
                    <th className="pac__th">Admin</th>
                    <th
                      className="pac__th pac__th--sortable"
                      onClick={() => toggleSort("state")}
                    >
                      Location
                      <span className="material-symbols-outlined pac__sort-icon">
                        {sortIcon("state")}
                      </span>
                    </th>
                    <th
                      className="pac__th pac__th--sortable pac__th--right"
                      onClick={() => toggleSort("housesCount")}
                    >
                      Houses
                      <span className="material-symbols-outlined pac__sort-icon">
                        {sortIcon("housesCount")}
                      </span>
                    </th>
                    <th className="pac__th">Status</th>
                    <th
                      className="pac__th pac__th--sortable"
                      onClick={() => toggleSort("createdAt")}
                    >
                      Onboarded
                      <span className="material-symbols-outlined pac__sort-icon">
                        {sortIcon("createdAt")}
                      </span>
                    </th>
                    <th className="pac__th pac__th--right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.map((community) => (
                    <tr
                      key={community.id}
                      className={
                        selectedIds.has(community.id)
                          ? "pac__row pac__row--selected"
                          : "pac__row"
                      }
                    >
                      <td className="pac__td pac__td--check">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(community.id)}
                          onChange={() => toggleSelect(community.id)}
                        />
                      </td>
                      <td className="pac__td">
                        <div className="pac__community-cell">
                          <div className="pac__community-avatar">
                            {getInitials(community.name)}
                          </div>
                          <span className="pac__community-name">
                            {community.name}
                          </span>
                        </div>
                      </td>
                      <td className="pac__td">
                        <div className="pac__admin-cell">
                          <div className="pac__admin-badge">
                            {getInitials(
                              community.adminName ?? "Community Admin",
                            )}
                          </div>
                          <span>
                            {community.adminName ?? "Community Admin"}
                          </span>
                        </div>
                      </td>
                      <td className="pac__td">
                        <div className="pac__location-cell">
                          <span className="material-symbols-outlined">
                            location_on
                          </span>
                          <span>
                            {community.lga}, {community.state}
                          </span>
                        </div>
                      </td>
                      <td className="pac__td pac__td--right">
                        <span className="pac__houses-value">
                          {community.housesCount ?? 0}
                        </span>
                      </td>
                      <td className="pac__td">
                        <Badge
                          variant={
                            community.status === "active"
                              ? "success"
                              : "warning"
                          }
                          icon={
                            community.status === "active"
                              ? "verified"
                              : "pending"
                          }
                        >
                          {community.status === "active" ? "Active" : "Pending"}
                        </Badge>
                      </td>
                      <td className="pac__td">
                        {formatDate(community.createdAt)}
                      </td>
                      <td className="pac__td pac__td--right">
                        <div className="pac__actions">
                          <button
                            type="button"
                            className="pac__action-btn"
                            title="View details"
                          >
                            <span className="material-symbols-outlined">
                              visibility
                            </span>
                          </button>
                          <button
                            type="button"
                            className="pac__action-btn"
                            title="More options"
                          >
                            <span className="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="pac__table-foot">
            <p>
              {selectedIds.size > 0 ? `${selectedIds.size} selected · ` : ""}
              Showing {filteredAndSorted.length} of {communities.length}{" "}
              communities
            </p>
            <div className="pac__pagination">
              <button type="button" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
                Previous
              </button>
              <span className="pac__page-indicator">Page 1 of 1</span>
              <button type="button" disabled>
                Next
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ============================================================
           Platform Admin Communities Page
           ============================================================ */

        .pac__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .pac__heading {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .pac__subheading {
          color: var(--color-on-surface-variant);
          margin-top: 4px;
        }

        /* ---- Stat Cards ---- */

        .pac__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .pac__stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-2xl);
          padding: var(--space-md);
          transition: all 0.3s ease;
        }

        .pac__stat-card:hover {
          border-color: var(--color-secondary);
          box-shadow: 0 4px 12px rgba(70, 72, 212, 0.08);
        }

        .pac__stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pac__stat-icon--indigo {
          background: #eef2ff;
          color: var(--color-secondary);
        }

        .pac__stat-icon--emerald {
          background: #ecfdf5;
          color: #059669;
        }

        .pac__stat-icon--amber {
          background: #fffbeb;
          color: #d97706;
        }

        .pac__stat-icon--slate {
          background: #f1f5f9;
          color: #475569;
        }

        .pac__stat-label {
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: var(--color-on-surface-variant);
        }

        .pac__stat-value {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          color: #0f172a;
          margin-top: 2px;
        }

        /* ---- Table Card ---- */

        .pac__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }

        /* ---- Toolbar ---- */

        .pac__toolbar {
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
          align-items: center;
          justify-content: space-between;
        }

        .pac__tabs {
          display: flex;
          padding: 4px;
          background: var(--color-surface-container);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          gap: 2px;
        }

        .pac__tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px var(--space-sm);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          background: transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .pac__tab .material-symbols-outlined {
          font-size: 18px;
        }

        .pac__tab:hover {
          color: #0f172a;
        }

        .pac__tab--active {
          background: #ffffff;
          color: #0f172a;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .pac__tab-count {
          font-size: 11px;
          font-weight: 700;
          background: var(--color-surface-container);
          padding: 1px 7px;
          border-radius: var(--radius-full);
          color: var(--color-on-surface-variant);
        }

        .pac__tab--active .pac__tab-count {
          background: var(--color-secondary);
          color: #ffffff;
        }

        .pac__search {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 260px;
        }

        .pac__search > .material-symbols-outlined {
          position: absolute;
          left: 12px;
          font-size: 20px;
          color: var(--color-on-surface-variant);
          pointer-events: none;
        }

        .pac__search input {
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

        .pac__search input:focus {
          border-color: var(--color-secondary);
        }

        .pac__search-clear {
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

        .pac__search-clear .material-symbols-outlined {
          font-size: 18px;
        }

        .pac__search-clear:hover {
          background: var(--color-surface-container);
        }

        /* ---- Loading ---- */

        .pac__loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-xl);
          color: var(--color-on-surface-variant);
        }

        /* ---- Table ---- */

        .pac__table-wrap {
          overflow-x: auto;
        }

        .pac__table {
          width: 100%;
          border-collapse: collapse;
        }

        .pac__th {
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
          user-select: none;
        }

        .pac__th--check {
          width: 48px;
          text-align: center;
        }

        .pac__th--right {
          text-align: right;
        }

        .pac__th--sortable {
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .pac__th--sortable:hover {
          color: var(--color-secondary);
        }

        .pac__sort-icon {
          font-size: 16px !important;
          vertical-align: middle;
          margin-left: 2px;
          opacity: 0.5;
        }

        .pac__th--sortable:hover .pac__sort-icon {
          opacity: 1;
        }

        .pac__row {
          border-bottom: 1px solid var(--color-outline-variant);
          transition: background-color 0.15s ease;
        }

        .pac__row:last-child {
          border-bottom: none;
        }

        .pac__row:hover {
          background: var(--color-surface-container-low);
        }

        .pac__row--selected {
          background: #eef2ff;
        }

        .pac__row--selected:hover {
          background: #e0e7ff;
        }

        .pac__td {
          padding: 14px var(--space-md);
          font-size: var(--text-label-md);
          color: #0f172a;
          vertical-align: middle;
        }

        .pac__td--check {
          width: 48px;
          text-align: center;
        }

        .pac__td--right {
          text-align: right;
        }

        /* ---- Cell Variants ---- */

        .pac__community-cell {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .pac__community-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-xl);
          background: #eef2ff;
          color: var(--color-secondary);
          border: 1px solid #e0e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .pac__community-name {
          font-weight: 700;
          color: #0f172a;
        }

        .pac__admin-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pac__admin-badge {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background: var(--color-primary-container);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 10px;
          flex-shrink: 0;
        }

        .pac__location-cell {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--color-on-surface-variant);
        }

        .pac__location-cell .material-symbols-outlined {
          font-size: 18px;
          color: var(--color-outline);
        }

        .pac__houses-value {
          font-family: var(--font-display);
          font-weight: 700;
          color: #0f172a;
        }

        /* ---- Actions ---- */

        .pac__actions {
          display: flex;
          align-items: center;
          gap: 4px;
          justify-content: flex-end;
        }

        .pac__action-btn {
          padding: 6px;
          border-radius: var(--radius-lg);
          color: var(--color-on-surface-variant);
          background: transparent;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pac__action-btn .material-symbols-outlined {
          font-size: 20px;
        }

        .pac__action-btn:hover {
          background: var(--color-secondary);
          color: #ffffff;
        }

        /* ---- Footer ---- */

        .pac__table-foot {
          padding: var(--space-sm) var(--space-md);
          background: var(--color-surface-container-low);
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .pac__table-foot p {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
        }

        .pac__pagination {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .pac__pagination button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px var(--space-sm);
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: #0f172a;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .pac__pagination button:hover:not(:disabled) {
          background: var(--color-surface-container-low);
        }

        .pac__pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pac__pagination button .material-symbols-outlined {
          font-size: 18px;
        }

        .pac__page-indicator {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          font-weight: 600;
        }

        /* ---- Checkbox Styling ---- */

        .pac__th--check input[type="checkbox"],
        .pac__td--check input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--color-secondary);
          cursor: pointer;
        }

        /* ---- Responsive ---- */

        @media (max-width: 1024px) {
          .pac__stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .pac__toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .pac__tabs {
            overflow-x: auto;
          }

          .pac__search {
            min-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .pac__stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PlatformAdminLayout>
  );
}
