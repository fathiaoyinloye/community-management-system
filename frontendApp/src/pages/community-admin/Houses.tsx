import { useEffect, useState } from 'react'
import CommunityAdminLayout from '../../layouts/CommunityAdminLayout'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import RegisterHouseModal from '../../components/RegisterHouseModal'
import { getHouses, registerHouse, updateHouse } from '../../api/house'
import type { House, HouseSummary, PropertyType, RegisterHousePayload } from '../../types/house'

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  single_family: 'Single Family Home',
  townhouse: 'Townhouse',
  apartment: 'Modern Apartment',
  duplex: 'Duplex',
  condominium: 'Condominium',
  commercial: 'Commercial',
}

export default function Houses() {
  const [houses, setHouses] = useState<House[]>([])
  const [summary, setSummary] = useState<HouseSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'residential' | 'commercial' | 'vacant'>('all')
  const [keyword, setKeyword] = useState('')
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [activeActionsId, setActiveActionsId] = useState<string | null>(null)

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadData = async (currentKeyword: string, currentTab: typeof tab) => {
    try {
      const response = await getHouses(currentKeyword, currentTab)
      setHouses(response.houses)
      setSummary(response.summary)
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load houses:', err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const debounce = setTimeout(() => {
      loadData(keyword, tab)
    }, 250)

    return () => clearTimeout(debounce)
  }, [keyword, tab])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleRegister = async (payload: RegisterHousePayload) => {
    try {
      const newHouse = await registerHouse(payload)
      showToast(`House ${newHouse.houseNumber} has been successfully registered.`)
      // Refresh list
      loadData(keyword, tab)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to register house.')
    }
  }

  const toggleMaintenanceAlert = async (house: House) => {
    try {
      const nextVal = !house.hasMaintenanceAlert
      await updateHouse(house.id, { hasMaintenanceAlert: nextVal })
      showToast(`Maintenance alert for ${house.houseNumber} has been ${nextVal ? 'raised' : 'cleared'}.`)
      loadData(keyword, tab)
    } catch (err) {
      console.error(err)
    } finally {
      setActiveActionsId(null)
    }
  }

  const toggleOccupancy = async (house: House) => {
    try {
      const nextStatus = house.status === 'occupied' ? 'vacant' : 'occupied'
      const updates: Partial<House> = { status: nextStatus }
      if (nextStatus === 'vacant') {
        updates.resident = undefined
      } else {
        updates.resident = {
          firstName: 'New',
          lastName: 'Resident',
          email: 'new.resident@example.com',
          phone: '08000000000',
        }
      }
      await updateHouse(house.id, updates)
      showToast(`Occupancy status for ${house.houseNumber} changed to ${nextStatus}.`)
      loadData(keyword, tab)
    } catch (err) {
      console.error(err)
    } finally {
      setActiveActionsId(null)
    }
  }

  const handleExport = () => {
    // Generate a simple CSV file mock
    const headers = 'House #,Street Address,Resident,Status,Property Type\n'
    const rows = houses
      .map(
        (h) =>
          `"${h.houseNumber}","${h.street}","${
            h.resident ? `${h.resident.firstName} ${h.resident.lastName}` : 'None'
          }","${h.status}","${PROPERTY_TYPE_LABELS[h.propertyType]}"`,
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `house_inventory_${tab}_${new Date().toISOString().slice(0, 10)}.csv`)
    a.click()
    showToast('Exporting house registry list...')
  }

  return (
    <CommunityAdminLayout>
      <div className="hs">
        {toastMessage && (
          <div className="hs__toast">
            <span className="material-symbols-outlined">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Page Header */}
        <section className="hs__header">
          <div>
            <h2 className="hs__title">House Management</h2>
            <p className="hs__subtitle">
              Oversee the community's residential assets, track occupancy health, and manage maintenance alerts in real-time.
            </p>
          </div>
          <button
            type="button"
            className="hs__register-btn"
            onClick={() => setIsRegisterOpen(true)}
          >
            <span className="material-symbols-outlined">add_home</span>
            Register New House
          </button>
        </section>

        {/* Metrics Grid */}
        <section className="hs__metrics">
          <div className="hs__metric-card">
            <div className="hs__metric-head">
              <div className="hs__metric-icon-wrap hs__metric-icon-wrap--primary">
                <span className="material-symbols-outlined">apartment</span>
              </div>
              <span className="hs__metric-tag">Total Inventory</span>
            </div>
            <div className="hs__metric-body">
              <h4 className="hs__metric-value">{isLoading || !summary ? '—' : summary.totalInventory.toLocaleString()}</h4>
              <p className="hs__metric-label">Verified Property Units</p>
            </div>
          </div>

          <div className="hs__metric-card">
            <div className="hs__metric-head">
              <div className="hs__metric-icon-wrap hs__metric-icon-wrap--tertiary">
                <span className="material-symbols-outlined">person_check</span>
              </div>
              <span className="hs__metric-tag hs__metric-tag--positive">{isLoading || !summary ? '—' : `${summary.occupancyRate}% Rate`}</span>
            </div>
            <div className="hs__metric-body">
              <h4 className="hs__metric-value">{isLoading || !summary ? '—' : summary.occupiedCount.toLocaleString()}</h4>
              <p className="hs__metric-label">Occupied Units</p>
            </div>
          </div>

          <div className="hs__metric-card">
            <div className="hs__metric-head">
              <div className="hs__metric-icon-wrap hs__metric-icon-wrap--neutral">
                <span className="material-symbols-outlined">meeting_room</span>
              </div>
              <span className="hs__metric-tag">{isLoading || !summary ? '—' : `${summary.vacantCount} Listed`}</span>
            </div>
            <div className="hs__metric-body">
              <h4 className="hs__metric-value">{isLoading || !summary ? '—' : summary.vacantCount.toLocaleString()}</h4>
              <p className="hs__metric-label">Vacant Units</p>
            </div>
          </div>

          <div className="hs__metric-card hs__metric-card--alert">
            <div className="hs__metric-head">
              <div className="hs__metric-icon-wrap hs__metric-icon-wrap--danger">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <span className="hs__metric-tag hs__metric-tag--danger">High Priority</span>
            </div>
            <div className="hs__metric-body">
              <h4 className="hs__metric-value hs__metric-value--danger">{isLoading || !summary ? '—' : summary.maintenanceAlertCount.toLocaleString()}</h4>
              <p className="hs__metric-label">Maintenance Alerts</p>
            </div>
          </div>
        </section>

        {/* Directory Controls */}
        <section className="hs__table-card">
          <div className="hs__table-toolbar">
            <div className="hs__tabs">
              {(['all', 'residential', 'commercial', 'vacant'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`hs__tab-btn ${tab === t ? 'hs__tab-btn--active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)} Houses
                </button>
              ))}
            </div>

            <div className="hs__toolbar-actions">
              <div className="hs__search-box">
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Filter by address/name..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="hs__tool-btn"
                onClick={handleExport}
                title="Export list as CSV"
              >
                <span className="material-symbols-outlined">download</span>
                Export
              </button>
            </div>
          </div>

          {/* Table Element */}
          {isLoading ? (
            <div className="hs__loading">
              <Spinner />
              <span>Fetching properties...</span>
            </div>
          ) : houses.length === 0 ? (
            <EmptyState
              icon="home_work"
              title="No houses found"
              description="No houses matched your filters or search keywords."
            />
          ) : (
            <div className="hs__table-scroll">
              <table className="hs__table">
                <thead>
                  <tr>
                    <th>House #</th>
                    <th>Street Address</th>
                    <th>Primary Resident</th>
                    <th>Occupancy Status</th>
                    <th>Property Type</th>
                    <th className="hs__col-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {houses.map((house) => (
                    <tr
                      key={house.id}
                      className={`hs__row ${
                        house.hasMaintenanceAlert ? 'hs__row--alert' : ''
                      }`}
                    >
                      <td className="hs__cell-number">{house.houseNumber}</td>
                      <td>{house.street}</td>
                      <td>
                        {house.resident ? (
                          <div className="hs__resident">
                            {house.resident.avatarUrl ? (
                              <img
                                className="hs__avatar"
                                src={house.resident.avatarUrl}
                                alt={`${house.resident.firstName} ${house.resident.lastName}`}
                              />
                            ) : (
                              <div className="hs__avatar hs__avatar--placeholder">
                                {house.resident.firstName[0]}
                                {house.resident.lastName[0]}
                              </div>
                            )}
                            <span className="hs__resident-name">
                              {house.resident.firstName} {house.resident.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="hs__no-resident">No resident listed</span>
                        )}
                      </td>
                      <td>
                        <div className="hs__status-col">
                          <Badge
                            variant={house.status === 'occupied' ? 'success' : 'neutral'}
                          >
                            <span
                              className={`hs__status-dot hs__status-dot--${house.status}`}
                            />
                            {house.status === 'occupied' ? 'Occupied' : 'Vacant'}
                          </Badge>

                          {house.hasMaintenanceAlert && (
                            <span className="hs__alert-label">
                              <span className="material-symbols-outlined">priority_high</span>
                              Maintenance Alert
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="hs__property-type">
                        {PROPERTY_TYPE_LABELS[house.propertyType]}
                      </td>
                      <td className="hs__col-right hs__cell-actions">
                        <button
                          type="button"
                          className="hs__actions-trigger"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveActionsId(
                              activeActionsId === house.id ? null : house.id
                            )
                          }}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>

                        {activeActionsId === house.id && (
                          <div className="hs__dropdown">
                            <button
                              type="button"
                              onClick={() => toggleOccupancy(house)}
                            >
                              <span className="material-symbols-outlined">
                                {house.status === 'occupied' ? 'logout' : 'login'}
                              </span>
                              {house.status === 'occupied' ? 'Mark as Vacant' : 'Set Occupied'}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleMaintenanceAlert(house)}
                            >
                              <span className="material-symbols-outlined">
                                {house.hasMaintenanceAlert ? 'check_circle' : 'warning'}
                              </span>
                              {house.hasMaintenanceAlert ? 'Clear Alert' : 'Raise Alert'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer of Table */}
          <div className="hs__table-foot">
            <p>
              Showing {houses.length} of {isLoading || !summary ? '—' : summary.totalInventory} properties
            </p>
            <div className="hs__pagination">
              <button type="button" disabled>
                Previous
              </button>
              <button type="button" className="hs__page-btn hs__page-btn--active">1</button>
              <button type="button" className="hs__page-btn">2</button>
              <button type="button" className="hs__page-btn">Next</button>
            </div>
          </div>
        </section>

        {/* Bottom Bento Section */}
        <section className="hs__bento">
          <div className="hs__bento-left">
            <div className="hs__bento-icon">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <h5 className="hs__bento-title">Occupancy Health is Up 2.4%</h5>
              <p className="hs__bento-desc">
                Your community inventory is reaching peak efficiency. Consider reviewing the upcoming vacancies for preemptive marketing.
              </p>
            </div>
            <button type="button" className="hs__bento-btn" onClick={() => showToast('Redirecting to report analysis...')}>
              View Report
            </button>
          </div>

          <div className="hs__bento-right">
            <div className="hs__progress-wrapper">
              <svg className="hs__progress-svg" viewBox="0 0 100 100">
                <circle
                  className="hs__progress-bg"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  className="hs__progress-fill"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="30" // 88% compliance progress (251.2 * 0.12)
                />
              </svg>
              <div className="hs__progress-text">88%</div>
            </div>
            <div className="hs__progress-labels">
              <span className="hs__progress-title">Safety Inspections</span>
              <span className="hs__progress-subtitle">Q3 Compliance Progress</span>
            </div>
          </div>
        </section>
      </div>

      {/* Register House Modal */}
      <RegisterHouseModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegister}
      />

      <style>{`
        .hs {
          position: relative;
        }

        .hs__toast {
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
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .hs__header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .hs__title {
          font-family: var(--font-display);
          font-size: var(--text-display-lg);
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.1;
        }

        .hs__subtitle {
          font-size: var(--text-body-lg);
          color: var(--color-on-surface-variant);
          max-width: 640px;
          margin-top: var(--space-xs);
        }

        .hs__register-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          background: var(--color-secondary);
          color: #ffffff;
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(70, 72, 212, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hs__register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(70, 72, 212, 0.35);
        }

        .hs__register-btn:active {
          transform: translateY(0);
        }

        .hs__metrics {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 640px) {
          .hs__metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .hs__metrics {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .hs__metric-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
          transition: box-shadow 0.2s ease;
        }

        .hs__metric-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
        }

        .hs__metric-card--alert {
          border-color: rgba(186, 26, 26, 0.15);
          box-shadow: 0 0 0 2px rgba(186, 26, 26, 0.03);
        }

        .hs__metric-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }

        .hs__metric-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hs__metric-icon-wrap--primary {
          background: rgba(70, 72, 212, 0.1);
          color: var(--color-secondary);
        }

        .hs__metric-icon-wrap--tertiary {
          background: rgba(79, 219, 200, 0.15);
          color: var(--color-on-tertiary-container);
        }

        .hs__metric-icon-wrap--neutral {
          background: var(--color-surface-variant);
          color: var(--color-on-surface-variant);
        }

        .hs__metric-icon-wrap--danger {
          background: var(--color-error-container);
          color: var(--color-error);
        }

        .hs__metric-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(0, 32, 28, 0.05);
          color: var(--color-on-tertiary-container);
        }

        .hs__metric-tag--positive {
          background: rgba(79, 219, 200, 0.15);
          color: var(--color-on-tertiary-container);
        }

        .hs__metric-tag--danger {
          background: var(--color-error-container);
          color: var(--color-error);
        }

        .hs__metric-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hs__metric-value {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 600;
          color: var(--color-primary);
          line-height: 1;
        }

        .hs__metric-value--danger {
          color: var(--color-error);
        }

        .hs__metric-label {
          font-size: var(--text-label-md);
          color: var(--color-on-surface-variant);
          font-weight: 500;
        }

        .hs__table-card {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          margin-bottom: var(--space-xl);
        }

        .hs__table-toolbar {
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-outline-variant);
          background: var(--color-surface-bright);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        @media (min-width: 768px) {
          .hs__table-toolbar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .hs__tabs {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          overflow-x: auto;
          padding-bottom: 4px;
        }

        @media (min-width: 768px) {
          .hs__tabs {
            padding-bottom: 0;
          }
        }

        .hs__tab-btn {
          white-space: nowrap;
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: var(--text-label-md);
          font-weight: 500;
          color: var(--color-on-surface-variant);
          background: transparent;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .hs__tab-btn:hover {
          background: var(--color-surface-container);
        }

        .hs__tab-btn--active {
          background: var(--color-secondary-container);
          color: var(--color-on-secondary-container);
        }

        .hs__tab-btn--active:hover {
          background: var(--color-secondary-container);
        }

        .hs__toolbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .hs__search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex-grow: 1;
        }

        .hs__search-box .material-symbols-outlined {
          position: absolute;
          left: 10px;
          font-size: 20px;
          color: var(--color-on-surface-variant);
        }

        .hs__search-box input {
          width: 100%;
          min-width: 200px;
          padding: 8px 12px 8px 36px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          outline: none;
          background: #ffffff;
          transition: border-color 0.2s ease;
        }

        .hs__search-box input:focus {
          border-color: var(--color-secondary);
        }

        .hs__tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px var(--space-md);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          font-weight: 600;
          background: #ffffff;
          color: var(--color-on-surface);
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .hs__tool-btn:hover {
          background: var(--color-surface-container-low);
          border-color: var(--color-secondary);
        }

        .hs__loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-xl);
          color: var(--color-on-surface-variant);
        }

        .hs__table-scroll {
          overflow-x: auto;
        }

        .hs__table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .hs__table thead {
          background: rgba(242, 244, 246, 0.5);
        }

        .hs__table th {
          padding: var(--space-sm) var(--space-md);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: var(--color-on-surface-variant);
          border-bottom: 1px solid var(--color-outline-variant);
        }

        .hs__table td {
          padding: var(--space-md);
          font-size: var(--text-body-md);
          border-bottom: 1px solid var(--color-surface-container);
          vertical-align: middle;
        }

        .hs__col-right {
          text-align: right;
        }

        .hs__row {
          transition: background-color 0.2s ease;
        }

        .hs__row:hover {
          background: rgba(247, 249, 2fb, 0.7);
        }

        .hs__row--alert {
          border-left: 4px solid var(--color-error);
          background: rgba(186, 26, 26, 0.03);
        }

        .hs__row--alert:hover {
          background: rgba(186, 26, 26, 0.05);
        }

        .hs__cell-number {
          font-weight: 700;
          color: var(--color-secondary);
        }

        .hs__resident {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .hs__avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          object-cover: cover;
          border: 1px solid var(--color-outline-variant);
        }

        .hs__avatar--placeholder {
          background: var(--color-secondary-fixed);
          color: var(--color-secondary);
          font-weight: 700;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
        }

        .hs__resident-name {
          font-weight: 500;
          color: var(--color-on-surface);
        }

        .hs__no-resident {
          color: var(--color-on-surface-variant);
          font-style: italic;
          opacity: 0.7;
        }

        .hs__status-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hs__status-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          display: inline-block;
          margin-right: 6px;
        }

        .hs__status-dot--occupied {
          background: #15803d;
        }

        .hs__status-dot--vacant {
          background: var(--color-outline);
        }

        .hs__alert-label {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          color: var(--color-error);
          font-weight: 700;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hs__alert-label .material-symbols-outlined {
          font-size: 12px;
        }

        .hs__property-type {
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
        }

        .hs__cell-actions {
          position: relative;
        }

        .hs__actions-trigger {
          background: transparent;
          color: var(--color-outline);
          padding: 4px;
          border-radius: var(--radius-lg);
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .hs__actions-trigger:hover {
          background: var(--color-surface-container-low);
          color: var(--color-secondary);
        }

        .hs__dropdown {
          position: absolute;
          right: 24px;
          top: 48px;
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 10;
          display: flex;
          flex-direction: column;
          width: 160px;
          overflow: hidden;
        }

        .hs__dropdown button {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 10px 14px;
          font-size: 13px;
          text-align: left;
          background: #ffffff;
          color: var(--color-on-surface);
          transition: background-color 0.2s ease;
        }

        .hs__dropdown button:hover {
          background: var(--color-surface-container-low);
        }

        .hs__dropdown button .material-symbols-outlined {
          font-size: 18px;
          color: var(--color-outline);
        }

        .hs__table-foot {
          padding: var(--space-md);
          background: var(--color-surface-bright);
          border-top: 1px solid var(--color-outline-variant);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hs__table-foot p {
          font-size: 12px;
          color: var(--color-on-surface-variant);
        }

        .hs__pagination {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .hs__pagination button {
          padding: 6px 12px;
          font-size: 12px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: #ffffff;
          color: var(--color-on-surface-variant);
          font-weight: 500;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .hs__pagination button:hover:not(:disabled) {
          background: var(--color-surface-container-low);
          color: var(--color-primary);
        }

        .hs__pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .hs__page-btn--active {
          background: var(--color-secondary) !important;
          color: #ffffff !important;
          border-color: var(--color-secondary) !important;
        }

        .hs__bento {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
          margin-top: var(--space-xl);
        }

        @media (min-width: 1024px) {
          .hs__bento {
            grid-template-columns: 2fr 1fr;
          }
        }

        .hs__bento-left {
          background: rgba(70, 72, 212, 0.03);
          border: 1px solid rgba(70, 72, 212, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        @media (min-width: 640px) {
          .hs__bento-left {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .hs__bento-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          background: var(--color-secondary-container);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hs__bento-icon .material-symbols-outlined {
          font-size: 28px;
        }

        .hs__bento-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .hs__bento-desc {
          font-size: var(--text-body-md);
          color: var(--color-on-surface-variant);
          margin-top: 4px;
          max-width: 460px;
        }

        .hs__bento-btn {
          color: var(--color-secondary);
          font-weight: 700;
          font-size: var(--text-label-md);
          background: transparent;
          white-space: nowrap;
          padding: 8px var(--space-md);
        }

        .hs__bento-btn:hover {
          text-decoration: underline;
        }

        .hs__bento-right {
          background: #ffffff;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: var(--space-sm);
        }

        @media (min-width: 480px) {
          .hs__bento-right {
            flex-direction: row;
            text-align: left;
            justify-content: center;
          }
        }

        .hs__progress-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .hs__progress-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .hs__progress-bg {
          stroke: var(--color-surface-container);
        }

        .hs__progress-fill {
          stroke: var(--color-tertiary-fixed-dim);
          stroke-linecap: round;
        }

        .hs__progress-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-primary);
        }

        .hs__progress-labels {
          display: flex;
          flex-direction: column;
        }

        .hs__progress-title {
          font-size: var(--text-label-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .hs__progress-subtitle {
          font-size: 12px;
          color: var(--color-on-surface-variant);
        }
      `}</style>
    </CommunityAdminLayout>
  )
}
