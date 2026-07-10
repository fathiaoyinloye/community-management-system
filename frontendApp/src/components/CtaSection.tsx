export default function CtaSection() {
  return (
    <section className="cta">
      <div className="cta__backdrop" />
      <div className="container cta__content">
        <h2 className="cta__heading">Ready to transform your community?</h2>
        <p className="cta__subheading">
          Join over 500+ premium estates worldwide trust CommunalTrust for their daily
          management.
        </p>
        <div className="cta__actions">
          <button className="btn btn-primary cta__btn">Get Started Today</button>
          <button className="btn btn-outline cta__btn">Contact Sales</button>
        </div>
        <p className="cta__fineprint">No credit card required. Free 14-day trial for new estates.</p>
      </div>

      <style>{`
        .cta {
          padding-top: var(--space-xl);
          padding-bottom: var(--space-xl);
          position: relative;
        }

        .cta__backdrop {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom right,
            var(--color-secondary),
            var(--color-secondary-container),
            var(--color-on-secondary-fixed)
          );
          opacity: 0.05;
        }

        .cta__content {
          position: relative;
          z-index: 10;
          text-align: center;
        }

        .cta__heading {
          font-family: var(--font-display);
          font-size: var(--text-display-lg-mobile);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-primary);
          margin-bottom: var(--space-md);
        }

        .cta__subheading {
          color: var(--color-on-surface-variant);
          font-size: var(--text-body-lg);
          max-width: 576px;
          margin: 0 auto var(--space-xl);
        }

        .cta__actions {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--space-md);
        }

        .cta__btn {
          padding: var(--space-lg) var(--space-xl);
          font-size: var(--text-headline-md);
        }

        .cta__fineprint {
          margin-top: var(--space-lg);
          color: var(--color-on-surface-variant);
          font-size: 14px;
        }

        @media (min-width: 640px) {
          .cta__actions {
            flex-direction: row;
          }
        }
      `}</style>
    </section>
  )
}
