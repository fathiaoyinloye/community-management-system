const TRUST_ITEMS = [
  {
    icon: 'enhanced_encryption',
    title: 'End-to-End',
    copy: 'Your data is encrypted both in transit and at rest.',
  },
  {
    icon: 'cloud_done',
    title: '99.9% Uptime',
    copy: 'Reliability you can count on for critical community services.',
  },
  {
    icon: 'admin_panel_settings',
    title: 'Compliance',
    copy: 'Fully GDPR and POPIA compliant data management.',
  },
]

export default function TrustSection() {
  return (
    <section className="trust">
      <div className="container">
        <div className="trust__panel">
          <div className="trust__content">
            <h2 className="trust__heading">Built on Trust.</h2>
            <p className="trust__subheading">
              Security is not a feature; it&apos;s our foundation. We employ bank-grade encryption
              and strict data protocols to protect your community&apos;s private information.
            </p>
            <div className="trust__grid">
              {TRUST_ITEMS.map((item) => (
                <div key={item.title} className="trust__card">
                  <span className="material-symbols-outlined trust__icon">{item.icon}</span>
                  <h4 className="trust__card-title">{item.title}</h4>
                  <p className="trust__card-copy">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .trust {
          padding-top: var(--space-xl);
          padding-bottom: var(--space-xl);
          background: #fff;
        }

        .trust__panel {
          background: var(--color-primary-container);
          border-radius: 40px;
          padding: var(--space-lg) var(--space-md);
          position: relative;
          overflow: hidden;
        }

        .trust__content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 768px;
          margin: 0 auto;
          color: #ffffff;
        }

        .trust__heading {
          font-family: var(--font-display);
          font-size: var(--text-display-lg-mobile);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-md);
        }

        .trust__subheading {
          font-size: var(--text-body-lg);
          opacity: 0.8;
          margin-bottom: var(--space-xl);
        }

        .trust__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-lg);
          text-align: left;
        }

        .trust__card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: var(--space-md);
          border-radius: var(--radius-2xl);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .trust__icon {
          color: var(--color-tertiary-fixed);
          font-size: 36px;
          margin-bottom: var(--space-base);
        }

        .trust__card-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 600;
          margin-bottom: var(--space-xs);
        }

        .trust__card-copy {
          font-size: 14px;
          opacity: 0.7;
        }

        @media (min-width: 768px) {
          .trust__panel {
            padding: var(--space-xl);
          }

          .trust__grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  )
}
