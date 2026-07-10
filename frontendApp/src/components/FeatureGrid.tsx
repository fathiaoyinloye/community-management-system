import { useReveal } from '../hooks/useReveal'

export default function FeatureGrid() {
  const largeRef = useReveal<HTMLDivElement>()
  const securityRef = useReveal<HTMLDivElement>()
  const billingRef = useReveal<HTMLDivElement>()
  const appRef = useReveal<HTMLDivElement>()

  return (
    <section className="features container">
      <div className="features__intro">
        <h2 className="features__heading">The Future of Community Living</h2>
        <p className="features__subheading">
          Integrated solutions that connect administrators and residents in one seamless digital
          ecosystem.
        </p>
      </div>

      <div className="features__grid">
        <div ref={largeRef} className="features__card features__card--large hover-lift">
          <div>
            <div className="features__icon">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <h3 className="features__card-title">Smart Resource Allocation</h3>
            <p className="features__card-copy">
              Optimize facility usage and maintenance schedules with AI-driven insights that
              predict needs before they become problems.
            </p>
          </div>
          <div className="features__card-image">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzVCZBCgja4DSKK70rtlfsGaBMFfp-kWP3arehBUeFoee50IOT_0nLunvPZt99MeMfC2QZlJyVqtefuTX0PgnytFbIyw4-wUKgbEHEac16d1ucUffGurG8_nRAyg-9u-QofFWY-pqRBvh_ezLQh5q1ta4U5zUdtnc6OtsnXj1bRPNE5CnskVDwvQQdpRToKm0VVAenaajVtcU1FDrn5IO1HRzEgCSxO-J5aMCGrSrireaNgqWM0TwTpEgMUJmjdDlw_pD2Gx2bSfY"
              alt="Abstract data visualization of a residential community network"
            />
          </div>
        </div>

        <div ref={securityRef} className="features__card features__card--dark hover-lift">
          <div className="features__icon features__icon--light">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <h3 className="features__card-title features__card-title--light">Fortified Security</h3>
          <p className="features__card-copy features__card-copy--light">
            Biometric access control and digital visitor logs ensure your community stays safe
            without the friction.
          </p>
        </div>

        <div ref={billingRef} className="features__card features__card--muted hover-lift">
          <div className="features__icon">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <h3 className="features__card-title">Automated Billing</h3>
          <p className="features__card-copy">
            One-click levy payments and transparent financial reporting for peace of mind across
            the board.
          </p>
        </div>

        <div ref={appRef} className="features__card features__card--wide features__card--accent hover-lift">
          <div className="features__app-copy">
            <h3 className="features__card-title features__card-title--light">
              Resident Mobile App
            </h3>
            <p className="features__card-copy features__card-copy--light">
              Put the power of the community in your pocket. From amenity bookings to instant
              chat with management.
            </p>
            <div className="features__stores">
              <div className="features__store-badge">
                <span className="material-symbols-outlined">apps</span> App Store
              </div>
              <div className="features__store-badge">
                <span className="material-symbols-outlined">play_arrow</span> Google Play
              </div>
            </div>
          </div>
          <div className="features__app-glow" />
        </div>
      </div>

      <style>{`
        .features {
          padding-top: var(--space-xl);
          padding-bottom: var(--space-xl);
        }

        .features__intro {
          text-align: center;
          margin-bottom: var(--space-lg);
        }

        .features__heading {
          font-family: var(--font-display);
          font-size: var(--text-display-lg-mobile);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .features__subheading {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-lg);
          max-width: 640px;
          margin: 0 auto;
        }

        .features__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        .features__card {
          background: #fff;
          padding: var(--space-lg);
          border-radius: 1.5rem;
          border: 1px solid var(--color-outline-variant);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .features__card--dark {
          background: var(--color-primary-container);
          color: var(--color-on-primary-fixed);
          border: none;
        }

        .features__card--muted {
          background: var(--color-surface-container-high);
          border: none;
        }

        .features__card--accent {
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          border: none;
          flex-direction: row;
          align-items: center;
          gap: var(--space-lg);
          position: relative;
          overflow: hidden;
        }

        .features__icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-2xl);
          background: rgba(70, 72, 212, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-md);
        }

        .features__icon .material-symbols-outlined {
          color: var(--color-secondary);
          font-size: 30px;
        }

        .features__icon--light {
          background: rgba(255, 255, 255, 0.1);
        }

        .features__icon--light .material-symbols-outlined {
          color: var(--color-tertiary-fixed);
        }

        .features__card-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--space-base);
        }

        .features__card-title--light {
          color: #fff;
        }

        .features__card-copy {
          color: var(--color-on-surface-variant);
          max-width: 32rem;
        }

        .features__card-copy--light {
          color: #fff;
          opacity: 0.85;
        }

        .features__card-image {
          margin-top: var(--space-lg);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          border: 1px solid rgba(198, 198, 205, 0.3);
        }

        .features__card-image img {
          width: 100%;
          height: 192px;
          object-fit: cover;
        }

        .features__app-copy {
          flex: 1;
        }

        .features__stores {
          display: flex;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .features__store-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .features__app-glow {
          display: none;
          width: 192px;
          height: 192px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          filter: blur(40px);
        }

        @media (min-width: 768px) {
          .features__grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .features__card--large {
            grid-column: span 2 / span 2;
          }

          .features__card--wide {
            grid-column: span 2 / span 2;
          }
        }

        @media (min-width: 1024px) {
          .features__app-glow {
            display: block;
          }
        }
      `}</style>
    </section>
  )
}
