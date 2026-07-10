const ADMIN_POINTS = [
  'Unified Dashboard for all maintenance and security tasks.',
  'Real-time Financial Analytics and reporting modules.',
  'Bulk Communication tools for urgent community updates.',
]

const RESIDENT_POINTS = [
  'Book amenities like the pool or clubhouse in seconds.',
  'Instant notifications for deliveries and visitor arrivals.',
  'Secure digital wallet for all community-related dues.',
]

export default function PersonaSections() {
  return (
    <section className="personas">
      <div className="container">
        <div className="personas__row">
          <div className="personas__image personas__image--first">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChpyZ7ACZW_R3t8uSdDpwmHVwq_jxrmA8UtRYyI3t71TZM7hyYNvTz5Tm55ydmVh6MBRwtHymNpolppDrP-FJ2y6RN7rc1A11r-pOoFMYmq8d4DfRsfQb-oaQRwIICc_CWff-YbUeeP9L_z5jpH3c9VGreDuFX2D220YWMQHe7i0hu6GHs3oGSF0dHF8HMGgg7TFfNM0cEW8Y4zWUOJNoC4m1WR1npkJcsxpFjqYqWhqkMKoCVCBK07IdmIZYzIempSoHCNu3vuCc"
              alt="A confident professional estate manager reviewing a tablet"
            />
          </div>
          <div className="personas__copy personas__copy--first">
            <span className="personas__tag">For Administrators</span>
            <h2 className="personas__heading">Effortless Administration.</h2>
            <ul className="personas__list">
              {ADMIN_POINTS.map((point) => (
                <li key={point} className="personas__list-item">
                  <span className="material-symbols-outlined personas__check personas__check--admin">
                    check
                  </span>
                  <p>{point}</p>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary personas__btn">Schedule Admin Demo</button>
          </div>
        </div>

        <div className="personas__row">
          <div className="personas__copy">
            <span className="personas__tag personas__tag--resident">For Residents</span>
            <h2 className="personas__heading">Simplified Living.</h2>
            <ul className="personas__list">
              {RESIDENT_POINTS.map((point) => (
                <li key={point} className="personas__list-item">
                  <span className="material-symbols-outlined personas__check personas__check--resident">
                    check
                  </span>
                  <p>{point}</p>
                </li>
              ))}
            </ul>
            <button className="btn btn-dark personas__btn">Download Resident App</button>
          </div>
          <div className="personas__image">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqscneOGlaidv5iz6aGYrcQqd4w4QeRxoUBMMPbajE9IlHdR_zL2moyhI2MS-KGWUWl7kXSzOSbOf1KHg4Y9SQjfyG2SJcYUqcspbBfn7uUVht6bWOJMDJXmmssP2q3zx_DnJ0RgWuPsqgPLULE87zUDOmxODOHUrQUWZ4_c_fgGRj6Nr_QrwDpAsxvF1z8v3OuO9G4zT07PWWDx6wWosADhduJwnetWCe1FSYTZ-tYYdHbKdlaSC4xnhrz6IRlqmgkHWxI1eNs7c"
              alt="Residents socializing near a pool, one using the CommunalTrust app"
            />
          </div>
        </div>
      </div>

      <style>{`
        .personas {
          padding-top: var(--space-xl);
          padding-bottom: var(--space-xl);
          background: var(--color-surface-container-low);
          overflow: hidden;
        }

        .personas__row {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
          align-items: center;
          margin-bottom: var(--space-xl);
        }

        .personas__row:last-child {
          margin-bottom: 0;
        }

        .personas__image img {
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 4px solid #fff;
          width: 100%;
        }

        .personas__image--first {
          order: 2;
        }

        .personas__copy--first {
          order: 1;
        }

        .personas__tag {
          display: inline-block;
          padding: 4px var(--space-md);
          border-radius: var(--radius-full);
          background: rgba(70, 72, 212, 0.1);
          color: var(--color-secondary);
          font-size: var(--text-label-sm);
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: var(--space-md);
        }

        .personas__tag--resident {
          background: rgba(79, 219, 200, 0.2);
          color: var(--color-on-tertiary-fixed-variant);
        }

        .personas__heading {
          font-family: var(--font-display);
          font-size: var(--text-display-lg-mobile);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-primary);
          margin-bottom: var(--space-md);
        }

        .personas__list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .personas__list-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
        }

        .personas__check {
          background: #fff;
          padding: var(--space-xs);
          border-radius: var(--radius-full);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-size: 20px;
          flex-shrink: 0;
        }

        .personas__check--admin {
          color: var(--color-secondary);
        }

        .personas__check--resident {
          color: var(--color-on-tertiary-fixed-variant);
        }

        .personas__list-item p {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-lg);
          line-height: 28px;
        }

        .personas__btn {
          padding: var(--space-md) var(--space-lg);
        }

        @media (min-width: 1024px) {
          .personas__row {
            grid-template-columns: 1fr 1fr;
          }

          .personas__image--first {
            order: 1;
          }

          .personas__copy--first {
            order: 2;
          }
        }
      `}</style>
    </section>
  )
}
