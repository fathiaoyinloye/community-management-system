import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'


const SLIDE_COUNT = 2
const AUTO_ADVANCE_MS = 8000

export default function HeroCarousel() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const scrollToSlide = useCallback((index: number) => {
    const container = containerRef.current
    if (!container) return

    container.scrollTo({
      left: index * container.clientWidth,
      behavior: 'smooth',
    })
    setActiveSlide(index)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => {
        const next = (current + 1) % SLIDE_COUNT
        scrollToSlide(next)
        return next
      })
    }, AUTO_ADVANCE_MS)

    return () => clearInterval(interval)
  }, [scrollToSlide])

  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return
    const index = Math.round(container.scrollLeft / container.clientWidth)
    setActiveSlide(index)
  }

  return (
    <section className="hero">
      <div className="hero__carousel" ref={containerRef} onScroll={handleScroll}>
        <div className="hero__slide">
          <div className="hero__slide-bg">
            <img
              src="/community_aerial_view.jpg"
              alt="Aerial view of a modern sustainable community"
            />
          </div>
          <div className="hero__slide-content container">
            <div className="hero__copy">
              <h1 className="hero__title">Harmony in Every Household.</h1>
              <p className="hero__subtitle">
                Experience the next generation of community living. CommunalTrust brings
                transparency, security, and ease to your residential ecosystem.
              </p>
              <div className="hero__actions">
                <Link to="/resident/register" className="btn btn-primary hero__btn">Get Started</Link>
                <button className="btn btn-ghost-light hero__btn">Watch Demo</button>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__slide hero__slide--dashboard">
          <div className="hero__slide-content container hero__slide-content--split">
            <div className="hero__copy">
              <h2 className="hero__title">Your Resident Dashboard.</h2>
              <p className="hero__subtitle">
                Your personal command center. Track your financial statements, view upcoming community levies,
                and submit maintenance requests from a single, intuitive interface.
              </p>
              <Link to="/resident/register" className="btn btn-primary hero__btn">Get Started</Link>
            </div>
            <div className="hero__dashboard-preview">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWafVHRgWRnQvxXQhc7BDN-rqK6pOxHdmc6ElG8DX9rtEdPryNWjWb1rlatDAr8Cxsp4PAXUQulwDv506w8N-nRl-NWtWIomwv9d8M-NlNKEiS-cNJAtHKPEDgVUu8pYmClVewKUwnpOgjgAg6-iU_YHpKASOGC9OCZQCS-tOKPiAE1DPjMUKxZRLeJB_YJmcfIUiVNqVWj5g4Whevu-YFaFaCoTMiIsCv0TZbwoGRPYN94LjGy35h__M2owZ6hsetXuVC1VTtLrE"
                alt="A sleek dashboard for residents with financial graphs"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hero__dots">
        {Array.from({ length: SLIDE_COUNT }, (_, index) => (
          <button
            key={index}
            className={
              index === activeSlide ? 'hero__dot hero__dot--active' : 'hero__dot'
            }
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .hero {
          position: relative;
          height: 85vh;
          min-height: 600px;
          width: 100%;
          overflow: hidden;
        }

        .hero__carousel {
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          display: flex;
          height: 100%;
          width: 100%;
          overflow-x: auto;
        }

        .hero__carousel::-webkit-scrollbar {
          display: none;
        }

        .hero__slide {
          scroll-snap-align: start;
          position: relative;
          min-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .hero__slide--dashboard {
          background: var(--color-primary-container);
        }

        .hero__slide-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero__slide-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.5);
        }

        .hero__slide-content {
          position: relative;
          z-index: 10;
          width: 100%;
        }

        .hero__slide-content--split {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xl);
        }

        .hero__copy {
          max-width: 640px;
          color: #fff;
        }

        .hero__slide--dashboard .hero__copy {
          max-width: none;
        }

        .hero__badge {
          display: inline-block;
          padding: 4px var(--space-md);
          border-radius: var(--radius-full);
          background: rgba(96, 99, 238, 0.3);
          backdrop-filter: blur(12px);
          color: var(--color-tertiary-fixed);
          font-size: var(--text-label-sm);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: var(--space-md);
        }

        .hero__title {
          font-family: var(--font-display);
          font-size: var(--text-display-lg-mobile);
          line-height: 48px;
          letter-spacing: -0.02em;
          font-weight: 700;
          margin-bottom: var(--space-md);
        }

        .hero__subtitle {
          font-size: var(--text-body-lg);
          line-height: 28px;
          opacity: 0.9;
          margin-bottom: var(--space-lg);
        }

        .hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .hero__btn {
          padding: var(--space-md) var(--space-lg);
          font-size: 18px;
        }

        .hero__dashboard-preview {
          width: 100%;
          max-width: 576px;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero__dashboard-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero__dots {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          gap: var(--space-sm);
        }

        .hero__dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background: #fff;
          opacity: 0.4;
          transition: all 0.3s ease;
          padding: 0;
        }

        .hero__dot--active {
          width: 48px;
          opacity: 1;
        }

        @media (min-width: 768px) {
          .hero__slide-content--split {
            flex-direction: row;
          }

          .hero__slide--dashboard .hero__copy {
            flex: 1;
          }

          .hero__dashboard-preview {
            flex: 1;
          }
        }
      `}</style>
    </section>
  )
}
