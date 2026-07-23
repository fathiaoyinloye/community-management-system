import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ResidentLayout from "../../layouts/ResidentLayout";
import { getMyBalance } from "../../api/levy";
import { getResidentPayments, uploadPayment } from "../../api/payment";
import type { HouseLevy } from "../../types/levy";
import Badge from "../../components/ui/Badge";

interface UpdateItem {
  id: string;
  type: string;
  title: string;
  content: string;
  imageUrl: string;
}

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const [levies, setLevies] = useState<HouseLevy[]>([]);
  const [isLoadingLevies, setIsLoadingLevies] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLevy, setSelectedLevy] = useState<HouseLevy | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [proofUrl, setProofUrl] = useState(
    "https://communaltrust.s3.amazonaws.com/receipts/proof.pdf",
  );
  const [isPaying, setIsPaying] = useState(false);

  const [updates] = useState<UpdateItem[]>([
    {
      id: "u1",
      type: "Event",
      title: "Garden Clean-up Day",
      content:
        "Join us this Saturday for our quarterly community garden spruce-up and social mixer.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD3gIRL4dTvjrTlKYAuPkk4Cmb7VBCNH4l4VpA1_2X8vwupd5Dz7AlI9Hl1Dw2qG8l_QkKTyezKlry9lmBHhJc8f-gUoP_QC-HrjLoJ1Sm5bvDcy5b-tGVuS8rpvc3SBdD55d0_VBJQVrJQNydr1jMRfgfpg5pd7wEL8Sp6Sv3y9mDjnf9wfLAWNkp7djv0ljCQJWGB1KgAJW061vAckCpoinaL7tAARz1CEeQ-0xqPF-YHxZV3YIv3hIx1gkOxacnUKjvqmpWsv-8",
    },
    {
      id: "u2",
      type: "Project",
      title: "Solar Grid Integration",
      content:
        "The installation of Phase 2 solar panels is scheduled to begin next Tuesday on Roof A.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAOp2UM2-pBOQcG79XbnY-u1Y0DejHa-RZxUaskBI9DND7Jj6citJdjvH-6AUk_aUKi3YYVoKxGkLrXaywZ8U-DgEZkPohB6Se1X7V2XZ0pCZDc0r23ckwrK3IiCK-sV3i4kHvv23U89zT9rYC7u-kDRIaYGjISh4As0517P7vcPzchJGOl3vjjPc1gy3Ax39QNegCA6Pq6vLT2dHHmjWfbQIUKGf28G1kqPn3CtXlq9UMXUwn1Oh9UBA1zDfyjEqAH3RuAxRL2Vm0",
    },
    {
      id: "u3",
      type: "Facility",
      title: "Gym Maintenance",
      content:
        "The community gym will be closed for routine machine servicing from 8 AM to 12 PM this Friday.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBlElvjp8DBZ9k3eVIHRpuEjOjcVPlYqfV4uNqB2p6K4gwIFZpPM_svcrO5YybrXUERzHbgnhn7DWG3InHfiQb6942XsoOLDZ3e5M877g3a2F7_pxmQ2dvwFjKHjm73LbmZv-IyYJ3H3_Gr5Zgg-DtkYXc2l4gY1x8lsP5aD5v1tc3e7S5TcHRMo9Q496EZ2fC0vYWZIkOqEsZOWzTlwr-N1aRlPpoKR4Fgvy7FuzwzwKImX1WaID78upNuui4l4rKsWmLdEJc_1w0",
    },
    {
      id: "u4",
      type: "Notice",
      title: "Town Hall: Budget 2024",
      content:
        "Review the upcoming year's infrastructure budget in our annual resident town hall meeting.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuASSeGi6xr5USthTM0EM1GE9zPw3EhFmQHFWEzLiBJIBw-r3CUcWABdR452jOPSx74eC_WLV9FAitLhnTaZfCTJhEWecZNhsmegztoFe7YahpsqBmqFisI2QW2UY9xp9BPkyYJlnPdGujOWxy1mHLBQ1cgOcQ2yLByGAgZi39v9MhNqWdBg7qCBIIuVY2xYJrJFaQRlsyGxypFOcbgjYjdfPIkt0D2b-QWDiiEFOrnoUKW5Q6WTZ8kegyG95Z8pR4BiB_6kcfGpOgg",
    },
  ]);

  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyBalance().then(setLevies).catch(console.error),
      getResidentPayments().then(setRecentPayments).catch(console.error)
    ]).finally(() => {
      setIsLoadingLevies(false);
      setIsLoadingPayments(false);
    });
  }, []);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    });
  };

  const totalBalance = useMemo(
    () => levies.reduce((sum, item) => sum + item.balance, 0),
    [levies],
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePayNow = () => {
    const levyToPay = levies[0] ?? null;
    setSelectedLevy(levyToPay);
    setPaymentReference(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsPaymentModalOpen(true);
  };

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLevy) return;
    if (!paymentReference.trim()) {
      alert("Please enter a bank reference.");
      return;
    }

    setIsPaying(true);
    try {
      await uploadPayment({
        houseLevyId: selectedLevy.id,
        amount: selectedLevy.balance,
        paymentReference: paymentReference.trim(),
        proofOfPaymentUrl: proofUrl.trim(),
      });
      showToast(
        `Payment proof submitted for ${selectedLevy.levyName}. Pending review.`,
      );
      setIsPaymentModalOpen(false);
      const updated = await getMyBalance();
      setLevies(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit payment.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleNewRequest = () => {
    showToast("Maintenance requests coming soon.");
  };

  return (
    <ResidentLayout onNewRequest={handleNewRequest}>
      <div className="rd">
        {toastMessage && (
          <div className="rd__toast">
            <span className="material-symbols-outlined">check_circle</span>
            {toastMessage}
          </div>
        )}

        <section className="rd__hero">
          <div className="rd__hero-financial lift-hover">
            <div className="rd__hero-financial-content">
              <h2 className="rd__hero-title">Financial Overview</h2>
              <p className="rd__hero-subtitle">
                Current cycle outstanding balance
              </p>
              <div className="rd__balance-wrap">
                <span className="rd__balance-value">
                  ₦
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {totalBalance > 0 && (
                  <span className="rd__due-tag">Due in 5 days</span>
                )}
              </div>
            </div>
            <div className="rd__hero-actions">
              <button
                type="button"
                className="btn btn-primary rd__pay-btn"
                onClick={handlePayNow}
                disabled={isLoadingLevies || totalBalance === 0}
              >
                Pay Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                type="button"
                className="rd__statement-btn"
                onClick={() => showToast("Statement download coming soon.")}
              >
                Download Statement
              </button>
            </div>
            <div className="rd__hero-decor"></div>
          </div>

          <div className="rd__hero-property lift-hover">
            <div className="rd__property-banner">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC41KtUiL55WM0Os_T1-x7KxzPqnDx9cAuo3_ZjrQSJypho-wNs22pqmC4FWZTfJhNSVQlhBxwpVeK8hcudTu3OhG9Pni6nbNeEK0uA4nl994RhnHYjgvJ-lCpbnhMT6qmwd7cSC61r7r-rTo1AEkXVPtH2G8yREuMezP0tmd4Wsc8JPvC9RcHGmDJq5ugM1VyQuf6LPT7cndclz3RKe-j5DNl3N0MdYkFafqnc9XI21nZmbHmdLT8AK-n3JQbF2Gw2Xbu_WpydxZA"
                alt="Skyline View Estates Facade"
              />
              <div className="rd__residency-badge">
                <span className="rd__badge-dot animate-pulse"></span>
                Active Residency
              </div>
            </div>
            <div className="rd__property-body">
              <h2 className="rd__property-unit">Unit 402-B</h2>
              <p className="rd__property-name">Skyline View Estates</p>
              <div className="rd__property-details">
                <div className="rd__detail-row">
                  <span>Type</span>
                  <strong>3 Bedroom Luxury</strong>
                </div>
                <div className="rd__detail-row">
                  <span>Lease Term</span>
                  <strong>Ends Aug 2025</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rd__secondary">
          <div>
            <div className="rd__section-header">
              <h3 className="rd__section-title">Upcoming Levies</h3>
              <button
                type="button"
                className="rd__section-link"
                onClick={() => showToast("Redirecting to levy payments...")}
              >
                View All
              </button>
            </div>

            {isLoadingLevies ? (
              <div className="rd__loading">Loading balances…</div>
            ) : levies.length === 0 ? (
              <div className="rd__empty">
                No levy balances available right now.
              </div>
            ) : (
              <div className="rd__levy-list">
                {levies.map((levy) => (
                  <div key={levy.id} className="rd__levy-item lift-hover">
                    <div className="rd__levy-icon-wrap">
                      <span className="material-symbols-outlined">
                        payments
                      </span>
                    </div>
                    <div className="rd__levy-content">
                      <h4>{levy.levyName}</h4>
                      <p>{levy.dueDate}</p>
                    </div>
                    <div className="rd__levy-right">
                      <strong>₦{levy.balance.toFixed(2)}</strong>
                      <span>{levy.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="rd__section-header">
              <h3 className="rd__section-title">Recent Payments</h3>
              <button
                type="button"
                className="rd__section-link"
                onClick={() => navigate("/resident/payments")}
              >
                View History
              </button>
            </div>
            <div className="rd__table-card">
              <table className="rd__table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.length > 0 ? (
                    recentPayments.slice(0, 3).map((p) => {
                      let badgeVariant: "success" | "warning" | "danger" = "warning";
                      let displayStatus = "Pending Review";
                      const s = (p.status || "").toLowerCase();
                      if (s === "verified" || s === "success") {
                        badgeVariant = "success";
                        displayStatus = "Verified";
                      } else if (s === "rejected" || s === "failed") {
                        badgeVariant = "danger";
                        displayStatus = "Rejected";
                      }

                      return (
                        <tr key={p.id}>
                          <td className="rd__txn-id">#{p.paymentReference || p.reference || p.id.slice(0, 8)}</td>
                          <td>{new Date(p.paymentDate || p.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                          <td className="rd__txn-amount">{formatCurrency(p.amount)}</td>
                          <td>
                            <Badge variant={badgeVariant}>{displayStatus}</Badge>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "20px 0", color: "var(--color-on-surface-variant)" }}>
                        {isLoadingPayments ? "Loading recent payments..." : "No recent payments found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rd__updates">
          <div className="rd__section-header">
            <h3 className="rd__section-title">Community Updates</h3>
            <div className="rd__updates-nav">
              <button
                type="button"
                onClick={() => showToast("Navigating updates...")}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => showToast("Navigating updates...")}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="rd__updates-grid">
            {updates.map((item) => (
              <div key={item.id} className="rd__update-card lift-hover">
                <div className="rd__update-banner">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <div className="rd__update-body">
                  <span className="rd__update-type">{item.type}</span>
                  <h4 className="rd__update-title">{item.title}</h4>
                  <p className="rd__update-desc">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isPaymentModalOpen && selectedLevy && (
        <div className="rd-modal__overlay" role="dialog" aria-modal="true">
          <div className="rd-modal__panel">
            <button
              type="button"
              className="rd-modal__close"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="rd-modal__title">Submit Payment Proof</h3>
            <p className="rd-modal__subtitle">
              Upload bank transfer information to settle outstanding bills.
            </p>

            <form onSubmit={submitPayment} className="rd-modal__form">
              <div className="rd-modal__field">
                <label>Amount to Pay (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={selectedLevy.balance}
                  disabled
                />
              </div>

              <div className="rd-modal__field">
                <label>Bank Reference / Txn Ref</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  disabled={isPaying}
                  required
                />
              </div>

              <div className="rd-modal__field">
                <label>Proof of Payment Document URL</label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  disabled={isPaying}
                />
              </div>

              <div className="rd-modal__actions">
                <button
                  type="button"
                  className="rd-modal__btn-cancel"
                  onClick={() => setIsPaymentModalOpen(false)}
                  disabled={isPaying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rd-modal__btn-submit"
                  disabled={isPaying}
                >
                  {isPaying ? "Processing..." : "Submit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .rd {
          position: relative;
        }

        .rd__toast {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #0f172a;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          z-index: 200;
          font-size: var(--text-label-md);
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .rd__hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-gutter);
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 1024px) {
          .rd__hero {
            grid-template-columns: 2fr 1fr;
          }
        }

        .rd__hero-financial {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .rd__hero-financial-content {
          position: relative;
          z-index: 10;
        }

        .rd__hero-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .rd__hero-subtitle {
          font-size: var(--text-body-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .rd__balance-wrap {
          display: flex;
          align-items: baseline;
          gap: var(--space-xs);
          margin-bottom: var(--space-lg);
        }

        .rd__balance-value {
          font-family: var(--font-display);
          font-size: var(--text-display-lg);
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1;
        }

        .rd__due-tag {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          font-weight: 500;
        }

        .rd__hero-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          position: relative;
          z-index: 10;
        }

        .rd__pay-btn {
          padding: var(--space-sm) var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .rd__pay-btn .material-symbols-outlined {
          font-size: 18px;
        }

        .rd__statement-btn {
          background: transparent;
          border: 1px solid var(--color-outline-variant);
          color: var(--color-secondary);
          border-radius: var(--radius-lg);
          font-weight: 700;
          font-size: var(--text-label-md);
          padding: var(--space-sm) var(--space-md);
          transition: background-color 0.2s ease;
        }

        .rd__statement-btn:hover {
          background: var(--color-surface-container-low);
        }

        .rd__hero-decor {
          position: absolute;
          right: -64px;
          top: -64px;
          width: 256px;
          height: 256px;
          background: rgba(70, 72, 212, 0.04);
          border-radius: var(--radius-full);
          filter: blur(48px);
        }

        .rd__hero-property {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }

        .rd__property-banner {
          height: 160px;
          position: relative;
          background: var(--color-surface-variant);
        }

        .rd__property-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rd__residency-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 148, 133, 0.1);
          color: var(--color-on-tertiary-container);
          backdrop-filter: blur(8px);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: var(--text-label-sm);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rd__badge-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--color-on-tertiary-container);
        }

        .rd__property-body {
          padding: var(--space-md);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .rd__property-unit {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__property-name {
          font-size: var(--text-body-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .rd__property-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .rd__detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--color-surface-container-low);
        }

        .rd__detail-row:last-child {
          border-bottom: none;
        }

        .rd__detail-row span {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
        }

        .rd__detail-row strong {
          font-size: var(--text-label-md);
          color: var(--color-primary);
        }

        .rd__secondary {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 1200px) {
          .rd__secondary {
            grid-template-columns: 1fr 1fr;
          }
        }

        .rd__section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }

        .rd__section-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          color: var(--color-primary);
        }

        .rd__section-link {
          background: transparent;
          color: var(--color-secondary);
          font-weight: 700;
          font-size: var(--text-label-md);
        }

        .rd__section-link:hover {
          text-decoration: underline;
        }

        .rd__levy-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .rd__levy-item {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .rd__levy-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--color-surface-container-low);
          color: var(--color-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rd__levy-icon-wrap .material-symbols-outlined {
          font-size: 24px;
        }

        .rd__levy-content {
          flex-grow: 1;
        }

        .rd__levy-content h4 {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__levy-content p {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .rd__levy-right {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .rd__levy-right strong {
          font-size: var(--text-label-md);
          color: var(--color-primary);
        }

        .rd__levy-right span {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          margin-top: 2px;
        }

        .rd__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .rd__table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .rd__table thead {
          background: var(--color-surface-container-low);
        }

        .rd__table th {
          padding: 12px var(--space-md);
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          color: var(--color-on-surface-variant);
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .rd__table td {
          padding: 16px var(--space-md);
          font-size: var(--text-label-md);
          border-bottom: 1px solid var(--color-surface-container-low);
        }

        .rd__table tr:last-child td {
          border-bottom: none;
        }

        .rd__txn-id {
          color: var(--color-on-surface-variant);
        }

        .rd__txn-amount {
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__status-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .rd__status-badge--successful {
          background: rgba(79, 219, 200, 0.2);
          color: var(--color-on-tertiary-fixed-variant);
        }

        .rd__status-badge--pending {
          background: rgba(255, 218, 214, 0.4);
          color: var(--color-error);
        }

        .rd__updates {
          margin-bottom: var(--space-xl);
        }

        .rd__updates-nav {
          display: flex;
          gap: var(--space-xs);
        }

        .rd__updates-nav button {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-outline-variant);
          background: #ffffff;
          color: var(--color-on-surface-variant);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .rd__updates-nav button:hover {
          background: var(--color-surface-container-low);
        }

        .rd__updates-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-gutter);
        }

        @media (min-width: 640px) {
          .rd__updates-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .rd__updates-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .rd__update-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }

        .rd__update-banner {
          height: 128px;
          overflow: hidden;
          background: var(--color-surface-container-low);
        }

        .rd__update-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .rd__update-card:hover .rd__update-banner img {
          transform: scale(1.1);
        }

        .rd__update-body {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .rd__update-type {
          font-size: var(--text-label-sm);
          font-weight: 700;
          color: var(--color-secondary);
          text-transform: uppercase;
        }

        .rd__update-title {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd__update-desc {
          font-size: var(--text-label-sm);
          color: var(--color-on-surface-variant);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Modal styling */
        .rd-modal__overlay {
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

        .rd-modal__panel {
          background: #ffffff;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 500px;
          position: relative;
          padding: var(--space-md);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .rd-modal__close {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          background: transparent;
          color: var(--color-on-surface-variant);
        }

        .rd-modal__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .rd-modal__subtitle {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          margin-bottom: var(--space-md);
        }

        .rd-modal__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .rd-modal__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .rd-modal__field label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }

        .rd-modal__field input,
        .rd-modal__field select,
        .rd-modal__field textarea {
          padding: 10px 14px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          outline: none;
          background: #ffffff;
        }

        .rd-modal__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
        }

        .rd-modal__btn-cancel {
          padding: var(--space-sm) var(--space-md);
          background: transparent;
          color: var(--color-on-surface-variant);
          font-weight: 600;
          font-size: var(--text-label-md);
        }

        .rd-modal__btn-submit {
          padding: var(--space-sm) var(--space-md);
          font-size: var(--text-label-md);
        }

        .lift-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .lift-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(70, 72, 212, 0.08);
        }
      `}</style>
    </ResidentLayout>
  );
}
