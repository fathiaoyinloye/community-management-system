import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommunityAdminLayout from "../../layouts/CommunityAdminLayout";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../store/AuthContext";
import { getHouses } from "../../api/house";
import { getAllPayments } from "../../api/payment";

function formatCurrency(value: number) {
  return value.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
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

interface ChartItem {
  label: string;
  amount: number;
  year: number;
  height: string;
}

// Generate past months list dynamically (e.g. Feb - Jul when current is July)
function generatePastMonths(count = 6): ChartItem[] {
  const list = [];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  for (let index = count - 1; index >= 0; index--) {
    const d = new Date(now.getFullYear(), now.getMonth() - index, 1);
    list.push({
      label: monthLabels[d.getMonth()],
      amount: 0,
      year: d.getFullYear(),
      height: "0%",
    });
  }
  return list;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalResidents: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    pendingMaintenance: 0,
  });
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>(() => generatePastMonths(6));

  useEffect(() => {
    async function loadData() {
      try {
        const { houses, summary } = await getHouses();

        // Fetch verified payments from the real backend API
        const paymentsList = await getAllPayments();
        const verifiedPayments = paymentsList.filter(
          (p: any) => p.status === "VERIFIED" || p.status === "verified"
        );
        const totalRevenue = verifiedPayments.reduce((acc: number, p: any) => acc + p.amount, 0);

        setStats({
          totalResidents: summary.occupiedCount,
          occupancyRate: summary.occupancyRate,
          totalRevenue,
          pendingMaintenance: summary.maintenanceAlertCount,
        });

        const pastMonths = generatePastMonths(6);
        const monthlyRevenues = pastMonths.map((m) => {
          const total = verifiedPayments
            .filter((p: any) => {
              const dateStr = p.paymentDate || p.createdAt || p.verifiedDate;
              if (!dateStr) return false;
              const date = new Date(dateStr);
              // Map 0-indexed month names to numbers
              const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const mIndex = monthLabels.indexOf(m.label);
              return date.getFullYear() === m.year && date.getMonth() === mIndex;
            })
            .reduce((acc: number, p: any) => acc + p.amount, 0);
          return {
            label: m.label,
            amount: total,
            year: m.year,
          };
        });

        const maxRev = Math.max(...monthlyRevenues.map((r) => r.amount));
        const computedChart = monthlyRevenues.map((r) => ({
          ...r,
          height: maxRev > 0 ? `${(r.amount / maxRev) * 100}%` : "0%",
        }));
        setChartData(computedChart);

        // Filter for occupied houses as resident updates
        const occupied = houses.filter((h) => h.status === "occupied");
        setRecentUpdates(occupied.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentYear = new Date().getFullYear();

  return (
    <CommunityAdminLayout>
      <div className="db-page">
        {/* Page Header */}
        <section className="db-page__header">
          <div>
            <h2 className="db-page__title">Executive Overview</h2>
            <p className="db-page__subtitle">
              Good morning, {user?.firstName || "Administrator"}. Here's what's happening in CommunalTrust today.
            </p>
          </div>
          <div className="db-page__date-badge">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>{formattedDate}</span>
          </div>
        </section>

        {/* Section 1: Executive KPIs (Bento Style) */}
        <section className="db-grid-kpi">
          <div className="db-kpi-card">
            <div className="db-kpi-card__top">
              <span className="db-kpi-card__icon">
                <span className="material-symbols-outlined">group</span>
              </span>
              <span className="db-kpi-card__badge">+0.0%</span>
            </div>
            <div className="db-kpi-card__bottom">
              <p className="db-kpi-card__label">Total Residents</p>
              <h3 className="db-kpi-card__value">{stats.totalResidents}</h3>
            </div>
          </div>

          <div className="db-kpi-card">
            <div className="db-kpi-card__top">
              <span className="db-kpi-card__icon">
                <span className="material-symbols-outlined">home_work</span>
              </span>
              <span className="db-kpi-card__badge">Live</span>
            </div>
            <div className="db-kpi-card__bottom">
              <p className="db-kpi-card__label">Occupancy Rate</p>
              <h3 className="db-kpi-card__value">{stats.occupancyRate.toFixed(1)}%</h3>
            </div>
          </div>

          <div className="db-kpi-card">
            <div className="db-kpi-card__top">
              <span className="db-kpi-card__icon">
                <span className="material-symbols-outlined">payments</span>
              </span>
              <span className="db-kpi-card__badge">Total</span>
            </div>
            <div className="db-kpi-card__bottom">
              <p className="db-kpi-card__label">Total Revenue</p>
              <h3 className="db-kpi-card__value">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
          </div>

          <div className="db-kpi-card db-kpi-card--error">
            <div className="db-kpi-card__top">
              <span className="db-kpi-card__icon db-kpi-card__icon--error">
                <span className="material-symbols-outlined">engineering</span>
              </span>
              <span className="db-kpi-card__badge db-kpi-card__badge--error">Alerts</span>
            </div>
            <div className="db-kpi-card__bottom">
              <p className="db-kpi-card__label">Pending Maintenance</p>
              <h3 className="db-kpi-card__value">{stats.pendingMaintenance}</h3>
            </div>
          </div>
        </section>

        {/* Section 2: Financial Snapshot & Quick Actions */}
        <section className="db-section-middle">
          {/* Revenue Chart */}
          <div className="db-chart-card">
            <div className="db-chart-card__header">
              <div className="db-chart-card__title-wrap">
                <h4 className="db-chart-card__title">{currentYear} Levy Collection Trends</h4>
                <p className="db-chart-card__subtitle">Monthly revenue comparison for {currentYear}</p>
              </div>
              <div className="db-chart-card__actions">
                <button className="db-chart-card__btn" type="button">6 Months</button>
                <button className="db-chart-card__btn db-chart-card__btn--active" type="button">Yearly</button>
              </div>
            </div>

            <div className="db-chart-canvas">
              {chartData.map((data, idx) => (
                <div key={idx} className="db-chart-column">
                  <div className="db-chart-bar-bg">
                    <div
                      className="db-chart-bar-fill"
                      style={{ height: isLoaded ? data.height : "0%" }}
                      title={`${data.label} ${data.year}: ${formatCurrency(data.amount)}`}
                    />
                  </div>
                  <span className="db-chart-label">{data.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="db-actions-card">
            <h4 className="db-actions-card__title">Quick Actions</h4>
            <div className="db-actions-list">
              <button
                type="button"
                className="db-action-btn"
                onClick={() => navigate("/community-admin/houses")}
              >
                <span className="db-action-btn__icon">
                  <span className="material-symbols-outlined">add_home</span>
                </span>
                <div className="db-action-btn__text-wrap">
                  <span className="db-action-btn__name">Register House</span>
                  <span className="db-action-btn__desc">Add a new unit to the grid</span>
                </div>
              </button>

              <button
                type="button"
                className="db-action-btn"
                onClick={() => navigate("/community-admin/levies")}
              >
                <span className="db-action-btn__icon">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </span>
                <div className="db-action-btn__text-wrap">
                  <span className="db-action-btn__name">Generate Bills</span>
                  <span className="db-action-btn__desc">Bulk invoice for all residents</span>
                </div>
              </button>

              <button
                type="button"
                className="db-action-btn"
                onClick={() => navigate("/community-admin/staff")}
              >
                <span className="db-action-btn__icon">
                  <span className="material-symbols-outlined">person_add</span>
                </span>
                <div className="db-action-btn__text-wrap">
                  <span className="db-action-btn__name">Invite Staff</span>
                  <span className="db-action-btn__desc">Grant portal access to new team</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Resident Quick View (Full Width) */}
        <section className="db-table-card">
          <div className="db-table-card__header">
            <h4 className="db-table-card__title">Recent Resident Updates</h4>
            <button
              className="db-table-card__btn"
              type="button"
              onClick={() => navigate("/community-admin/houses")}
            >
              View All
            </button>
          </div>

          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th className="db-table__th">Resident</th>
                  <th className="db-table__th">Unit</th>
                  <th className="db-table__th">Status</th>
                  <th className="db-table__th">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.length > 0 ? (
                  recentUpdates.map((house) => {
                    const fullName = `${house.resident.firstName} ${house.resident.lastName}`;
                    return (
                      <tr className="db-table__tr" key={house.id}>
                        <td className="db-table__td">
                          <div className="db-table__resident-cell">
                            <div className="db-table__avatar">
                              {getInitials(fullName)}
                            </div>
                            <span>{fullName}</span>
                          </div>
                        </td>
                        <td className="db-table__td">
                          {house.houseNumber}, {house.street}
                        </td>
                        <td className="db-table__td">
                          <Badge variant="success">Occupied</Badge>
                        </td>
                        <td className="db-table__td">
                          <span className="db-table__date">
                            {house.createdAt ? house.createdAt.slice(0, 10) : "Recently"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="db-table__tr">
                    <td className="db-table__td" colSpan={4} style={{ textAlign: "center", padding: "20px 0" }}>
                      No resident updates to display yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <style>{`
        .db-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .db-page__header {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--space-md);
        }

        @media (min-width: 768px) {
          .db-page__header {
            flex-direction: row;
            align-items: flex-end;
          }
        }

        .db-page__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.25;
        }

        .db-page__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-lg);
          margin-top: var(--space-xs);
          max-width: 600px;
        }

        .db-page__date-badge {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-on-surface-variant);
          font-family: var(--font-body);
          font-size: var(--text-label-md);
          font-weight: 500;
        }

        .db-page__date-badge .material-symbols-outlined {
          font-size: 20px;
        }

        /* KPI Bento Grid */
        .db-grid-kpi {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        @media (min-width: 640px) {
          .db-grid-kpi {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .db-grid-kpi {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .db-kpi-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .db-kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.08);
        }

        .db-kpi-card--error {
          border-left: 4px solid var(--color-error);
        }

        .db-kpi-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .db-kpi-card__icon {
          width: 40px;
          height: 40px;
          background: rgba(70, 72, 212, 0.1);
          color: var(--color-secondary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-kpi-card__icon--error {
          background: rgba(186, 26, 26, 0.1);
          color: var(--color-error);
        }

        .db-kpi-card__badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(113, 248, 228, 0.15);
          color: #007a6f;
        }

        .db-kpi-card__badge--error {
          background: var(--color-error-container);
          color: var(--color-on-error-container);
        }

        .db-kpi-card__bottom {
          margin-top: var(--space-md);
        }

        .db-kpi-card__label {
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
          font-weight: 500;
        }

        .db-kpi-card__value {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 700;
          color: var(--color-primary);
          margin-top: 4px;
        }

        /* Two Column Layout: Chart & Quick Actions */
        .db-section-middle {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        @media (min-width: 1024px) {
          .db-section-middle {
            grid-template-columns: 2fr 1fr;
          }
        }

        .db-chart-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .db-chart-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }

        .db-chart-card__title-wrap {
          display: flex;
          flex-direction: column;
        }

        .db-chart-card__title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
        }

        .db-chart-card__subtitle {
          color: var(--color-on-surface-variant);
          font-size: 13px;
          margin-top: 2px;
        }

        .db-chart-card__actions {
          display: flex;
          gap: var(--space-xs);
        }

        .db-chart-card__btn {
          padding: 4px 12px;
          border: 1px solid var(--color-outline-variant);
          background: transparent;
          font-size: 11px;
          font-weight: 600;
          border-radius: var(--radius-full);
          color: var(--color-on-surface-variant);
          transition: all 0.2s ease;
        }

        .db-chart-card__btn:hover {
          background: var(--color-surface-container-low);
          color: var(--color-primary);
        }

        .db-chart-card__btn--active {
          background: var(--color-secondary);
          border-color: var(--color-secondary);
          color: #ffffff;
        }

        .db-chart-card__btn--active:hover {
          background: var(--color-secondary);
          color: #ffffff;
        }

        .db-chart-canvas {
          height: 240px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-md);
          padding-top: var(--space-md);
        }

        .db-chart-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
        }

        .db-chart-bar-bg {
          width: 100%;
          height: 180px;
          background: rgba(70, 72, 212, 0.05);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          position: relative;
          overflow: hidden;
        }

        .db-chart-bar-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(to top, var(--color-secondary), var(--color-secondary-container));
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          transition: height 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .db-chart-label {
          font-size: 12px;
          color: var(--color-on-surface-variant);
          font-weight: 500;
        }

        /* Quick Actions Card */
        .db-actions-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .db-actions-card__title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-md);
        }

        .db-actions-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .db-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          padding: var(--space-sm);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-outline-variant);
          background: #ffffff;
          transition: all 0.2s ease;
          text-align: left;
        }

        .db-action-btn:hover {
          border-color: var(--color-secondary);
          background: var(--color-surface-container-low);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.05);
        }

        .db-action-btn__icon {
          width: 40px;
          height: 40px;
          background: rgba(70, 72, 212, 0.1);
          color: var(--color-secondary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--space-sm);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .db-action-btn:hover .db-action-btn__icon {
          background: var(--color-secondary);
          color: #ffffff;
        }

        .db-action-btn__text-wrap {
          display: flex;
          flex-direction: column;
        }

        .db-action-btn__name {
          font-weight: 700;
          font-size: 14px;
          color: var(--color-on-surface);
        }

        .db-action-btn__desc {
          font-size: 11px;
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        /* Recent Updates Table Card (Full Width) */
        .db-table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .db-table-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .db-table-card__title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
        }

        .db-table-card__btn {
          background: transparent;
          color: var(--color-secondary);
          font-size: 13px;
          font-weight: 600;
          transition: opacity 0.2s ease;
        }

        .db-table-card__btn:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .db-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .db-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .db-table__th {
          padding: 12px var(--space-md);
          background: var(--color-surface-container-low);
          color: var(--color-on-surface-variant);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .db-table__tr {
          border-bottom: 1px solid var(--color-surface-container);
          transition: background-color 0.2s ease;
        }

        .db-table__tr:hover {
          background-color: var(--color-surface-bright);
        }

        .db-table__td {
          padding: 16px var(--space-md);
          font-size: 14px;
          color: var(--color-on-surface);
        }

        .db-table__resident-cell {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .db-table__avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--color-secondary-fixed);
          color: var(--color-on-secondary-fixed);
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-table__avatar--primary {
          background: var(--color-primary-fixed);
          color: var(--color-on-primary-fixed);
        }

        .db-table__avatar--neutral {
          background: var(--color-surface-container-highest);
          color: var(--color-on-surface);
        }

        .db-table__date {
          color: var(--color-on-surface-variant);
          font-size: 13px;
        }
      `}</style>
    </CommunityAdminLayout>
  );
}
