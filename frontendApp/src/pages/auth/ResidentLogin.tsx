import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export default function ResidentLogin() {
  const { login, logout, isAuthenticating, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [portalError, setPortalError] = useState<string | null>(null);

  const registerSuccess = location.state?.registrationSuccess;

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!identifier.trim())
      errors.identifier = "Username or email is required.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPortalError(null);
    if (!validate()) return;

    try {
      const user = await login({ username: identifier, password });
      if (user.role !== "resident") {
        // Enforce resident-only access
        logout();
        setPortalError("This portal is for residents only.");
      } else {
        navigate("/resident/dashboard", { replace: true });
      }
    } catch {
      // surfaced via error from useAuth()
    }
  };

  return (
    <div className="res-auth">
      <div className="res-auth__panel">
        <div className="res-auth__glow res-auth__glow--one" />
        <div className="res-auth__glow res-auth__glow--two" />
        <div className="res-auth__panel-content">
          <div className="res-auth__brand">
            <span className="material-symbols-outlined res-auth__brand-icon">
              account_balance
            </span>
            <span className="res-auth__brand-name">Resident Portal</span>
          </div>
          <h2 className="res-auth__panel-title">
            Simplified community living at your fingertips.
          </h2>
          <p className="res-auth__panel-copy">
            As a resident, you can securely access your billing statement,
            upload payment receipts, and keep track of your community levies.
          </p>
          <ul className="res-auth__panel-list">
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              View outstanding balances and upcoming dues
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Track payment history and download digital receipts
            </li>
            <li>
              <span className="material-symbols-outlined">check_circle</span>
              Receive instant updates and community notifications
            </li>
          </ul>
        </div>
      </div>

      <div className="res-auth__form-side">
        <div className="res-auth__card">
          {registerSuccess && (
            <div
              role="alert"
              className="res-auth__alert res-auth__alert--success"
            >
              <span className="material-symbols-outlined res-auth__alert-icon">
                check_circle
              </span>
              Registration successful! Please sign in with your credentials.
            </div>
          )}

          {(error || portalError) && (
            <div role="alert" className="res-auth__alert">
              <span className="material-symbols-outlined res-auth__alert-icon">
                error
              </span>
              {portalError || error}
            </div>
          )}

          <form className="res-auth__form" onSubmit={handleSubmit} noValidate>
            <h1 className="res-auth__title">Resident Sign In</h1>
            <p className="res-auth__subtitle">
              Sign in with your registered resident credentials.
            </p>

            <label className="res-auth__field">
              <span className="res-auth__label">Username or Email</span>
              <input
                type="text"
                className="res-auth__input"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.identifier)}
              />
              {fieldErrors.identifier && (
                <span className="res-auth__field-error">
                  {fieldErrors.identifier}
                </span>
              )}
            </label>

            <label className="res-auth__field">
              <span className="res-auth__label">Password</span>
              <div className="res-auth__input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="res-auth__input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  disabled={isAuthenticating}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  className="res-auth__pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {fieldErrors.password && (
                <span className="res-auth__field-error">
                  {fieldErrors.password}
                </span>
              )}
            </label>

            <button
              type="submit"
              className="btn btn-primary res-auth__submit"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? "Signing in…" : "Log In"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .res-auth {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
        }

        .res-auth__panel {
          display: none;
          position: relative;
          overflow: hidden;
          padding: var(--space-xl) var(--space-lg);
          background: linear-gradient(
            160deg,
            var(--color-primary-container) 0%,
            #0f172a 60%,
            var(--color-secondary) 150%
          );
          color: #ffffff;
          flex-direction: column;
          justify-content: center;
        }

        .res-auth__glow {
          position: absolute;
          border-radius: var(--radius-full);
          filter: blur(60px);
          opacity: 0.35;
        }

        .res-auth__glow--one {
          width: 320px;
          height: 320px;
          background: var(--color-secondary);
          top: -80px;
          right: -80px;
        }

        .res-auth__glow--two {
          width: 260px;
          height: 260px;
          background: var(--color-tertiary-fixed);
          bottom: -60px;
          left: -60px;
        }

        .res-auth__panel-content {
          position: relative;
          z-index: 10;
          max-width: 420px;
        }

        .res-auth__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
          margin-bottom: var(--space-xl);
        }

        .res-auth__brand-icon {
          color: var(--color-tertiary-fixed);
          font-size: 28px;
          font-variation-settings: 'FILL' 1;
        }

        .res-auth__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
        }

        .res-auth__panel-title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: var(--space-md);
        }

        .res-auth__panel-copy {
          font-size: var(--text-body-lg);
          opacity: 0.85;
          margin-bottom: var(--space-lg);
        }

        .res-auth__panel-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .res-auth__panel-list li {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-label-md);
          opacity: 0.9;
        }

        .res-auth__panel-list .material-symbols-outlined {
          color: var(--color-tertiary-fixed);
          font-size: 20px;
        }

        .res-auth__form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          background: var(--color-surface-container-low);
          min-height: 100vh;
        }

        .res-auth__card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-lg) var(--space-md);
          box-shadow: 0 20px 45px -20px rgba(19, 27, 46, 0.25);
        }

        .res-auth__alert {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          padding: var(--space-sm);
          border-radius: var(--radius-lg);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-md);
        }

        .res-auth__alert--success {
          background: #e6f4ea;
          color: #137333;
        }

        .res-auth__alert-icon {
          font-size: 20px;
        }

        .res-auth__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .res-auth__title {
          font-family: var(--font-display);
          font-size: var(--text-headline-lg);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--space-xs);
        }

        .res-auth__subtitle {
          color: var(--color-on-surface-variant);
          font-size: var(--text-label-md);
          margin-bottom: var(--space-xs);
        }

        .res-auth__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .res-auth__label {
          font-size: var(--text-label-md);
          font-weight: 500;
          color: var(--color-on-surface);
        }

        .res-auth__input {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: var(--space-sm);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface);
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease;
        }

        .res-auth__input:focus {
          outline: none;
          border-color: var(--color-secondary);
        }

        .res-auth__input[aria-invalid='true'] {
          border-color: var(--color-error);
        }

        .res-auth__input:disabled {
          opacity: 0.6;
        }

        .res-auth__input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .res-auth__input-wrap .res-auth__input {
          width: 100%;
          padding-right: 40px;
        }

        .res-auth__pw-toggle {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--color-on-surface-variant);
          display: flex;
          align-items: center;
        }

        .res-auth__pw-toggle .material-symbols-outlined {
          font-size: 20px;
        }

        .res-auth__pw-toggle:hover {
          color: var(--color-on-surface);
        }

        .res-auth__field-error {
          color: var(--color-error);
          font-size: 13px;
        }

        .res-auth__submit {
          margin-top: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          width: 100%;
        }


        @media (min-width: 1024px) {
          .res-auth {
            grid-template-columns: 1.1fr 1fr;
          }

          .res-auth__panel {
            display: flex;
          }

          .res-auth__form-side {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
}
