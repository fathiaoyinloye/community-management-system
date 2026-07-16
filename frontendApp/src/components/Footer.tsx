import { useState, type FormEvent } from 'react'

const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Contact Us', 'Careers', 'Blog']

const CONTACT_EMAIL = 'hello@communaltrust.com'
const CONTACT_ADDRESS = '312 Herbert Macaulay Wy, Sabo Yaba, Lagos 101212, Lagos'

/*
const SOCIAL_LINKS: { label: string; href: string; icon: 'twitter' | 'facebook' | 'instagram' | 'linkedin' }[] = [
  { label: 'Twitter', href: '#', icon: 'twitter' },
  { label: 'Facebook', href: '#', icon: 'facebook' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
]
*/

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/*
function SocialIcon({ type }: { type: (typeof SOCIAL_LINKS)[number]['icon'] }) {
  switch (type) {
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M18.9 3h2.7l-6 6.9L23 21h-5.6l-4.4-5.7L7.9 21H5.2l6.4-7.3L4 3h5.7l4 5.3L18.9 3Zm-1 16.2h1.5L7.3 4.7H5.7l12.2 14.5Z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9Z" />
        </svg>
      )
    default:
      return null
  }
}
*/

export default function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (!message.trim()) {
      setError('Write a message before sending.')
      return
    }

    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setEmail('')
      setMessage('')
      setTimeout(() => setStatus('idle'), 4000)
    }, 700)
  }

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand-block">
          <div className="footer__brand">
            <span className="material-symbols-outlined footer__brand-icon">account_balance</span>
            <span className="footer__brand-name">CommunalTrust</span>
          </div>
          <p className="footer__copy">
            Empowering community management with intelligence and integrity.
          </p>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <nav className="footer__links">
            {FOOTER_LINKS.map((label) => (
              <a key={label} href="#" className="footer__link">
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Contact</h4>
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer__contact-item">
            <span className="material-symbols-outlined">mail</span>
            {CONTACT_EMAIL}
          </a>
          <div className="footer__contact-item">
            <span className="material-symbols-outlined">location_on</span>
            <span>{CONTACT_ADDRESS}</span>
          </div>
        </div>

        <div className="footer__col footer__message-col">
          <h4 className="footer__col-title">Send Us a Message</h4>
          <form className="footer__message-form" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className="footer__input"
              placeholder="Your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === 'sending'}
            />
            <textarea
              className="footer__textarea"
              placeholder="Your message"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={status === 'sending'}
            />
            {error && <p className="footer__message-error">{error}</p>}
            {status === 'sent' && <p className="footer__message-success">Thanks! We&apos;ll get back to you soon.</p>}
            <button type="submit" className="btn btn-primary footer__message-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* <div className="container footer__bottom">
        <p className="footer__legal">© {new Date().getFullYear()} CommunalTrust. All rights reserved.</p>
        <div className="footer__social">
          {SOCIAL_LINKS.map((social) => (
            <a key={social.label} href={social.href} aria-label={social.label} className="footer__social-link">
              <SocialIcon type={social.icon} />
            </a>
          ))}
        </div>
      </div> */}

      <style>{`
        .footer {
          background: var(--color-surface-container-low);
          border-top: 1px solid var(--color-outline-variant);
        }

        .footer__top {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
          padding-top: var(--space-xl);
          padding-bottom: var(--space-lg);
        }

        .footer__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
          margin-bottom: var(--space-sm);
        }

        .footer__brand-icon {
          color: var(--color-secondary);
          font-size: 24px;
          font-variation-settings: 'FILL' 1;
        }

        .footer__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          color: var(--color-primary);
        }

        .footer__copy {
          color: var(--color-on-surface-variant);
          font-size: 14px;
          max-width: 280px;
          line-height: 1.6;
        }

        .footer__col-title {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-sm);
        }

        .footer__links {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .footer__link {
          color: var(--color-on-surface-variant);
          font-size: 14px;
          transition: color 0.2s ease;
          width: fit-content;
        }

        .footer__link:hover {
          color: var(--color-secondary);
        }

        .footer__contact-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-xs);
          color: var(--color-on-surface-variant);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: var(--space-sm);
          max-width: 260px;
        }

        .footer__contact-item .material-symbols-outlined {
          font-size: 18px;
          color: var(--color-secondary);
          flex-shrink: 0;
          margin-top: 1px;
        }

        a.footer__contact-item:hover {
          color: var(--color-secondary);
        }

        .footer__message-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          max-width: 320px;
        }

        .footer__input,
        .footer__textarea {
          font-family: var(--font-body);
          font-size: 14px;
          padding: var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          background: var(--color-surface-container-lowest);
          color: var(--color-on-surface);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .footer__input:focus,
        .footer__textarea:focus {
          border-color: var(--color-secondary);
        }

        .footer__textarea {
          resize: none;
        }

        .footer__message-error {
          color: var(--color-error);
          font-size: 12px;
        }

        .footer__message-success {
          color: #15803d;
          font-size: 12px;
          font-weight: 600;
        }

        .footer__message-submit {
          align-self: flex-start;
          padding: var(--space-xs) var(--space-md);
          font-size: 14px;
          margin-top: 2px;
        }

        .footer__bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          padding-top: var(--space-md);
          padding-bottom: var(--space-md);
          border-top: 1px solid var(--color-outline-variant);
        }

        .footer__legal {
          color: var(--color-on-surface-variant);
          font-size: 13px;
          text-align: center;
        }

        .footer__social {
          display: flex;
          gap: var(--space-sm);
        }

        .footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--color-surface-container);
          color: var(--color-on-surface-variant);
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .footer__social-link:hover {
          background: var(--color-secondary);
          color: #ffffff;
        }

        @media (min-width: 640px) {
          .footer__top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .footer__top {
            grid-template-columns: 1.3fr 0.8fr 1fr 1.2fr;
          }

          .footer__bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  )
}
