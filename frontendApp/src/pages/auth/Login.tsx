import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export default function Login() {
  const { login, isAuthenticating, error } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
    if (!validate()) return;

    try {
      const user = await login({ username: identifier, password });
      
      // Dynamic routing based on authenticated user's role
      if (user.role === "platform_admin") {
        navigate("/platform-admin/dashboard", { replace: true });
      } else if (user.role === "community_admin" || user.role === "community_staff") {
        navigate("/community-admin/community-info", { replace: true });
      } else if (user.role === "resident") {
        navigate("/resident/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      // surfaced via error from useAuth()
    }
  };

  return (
    <div className="uni-auth">
      {/* Left decorative/benefit panel */}
      <div className="uni-auth__panel">
        <div className="uni-auth__glow uni-auth__glow--one" />
        <div className="uni-auth__glow uni-auth__glow--two" />
        <div className="uni-auth__panel-content">
          <div className="uni-auth__brand">
            <span className="material-symbols-outlined uni-auth__brand-icon">
              account_balance
            </span>
            <span className="uni-auth__brand-name">CommunalTrust</span>
          </div>
          <h2 className="uni-auth__panel-title">
            Securing Trust, Simplifying Operations.
          </h2>
          <p className="uni-auth__panel-copy">
            CommunalTrust is a unified community management platform bringing transparency, efficiency, and modern convenience to shared residential spaces. We connect administrators and residents in one digital ecosystem.
          </p>

        </div>
      </div>

      {/* Right form panel */}
      <div className="uni-auth__form-side">
        <div className="uni-auth__card">
          {error && (
            <div role="alert" className="uni-auth__alert">
              <span className="material-symbols-outlined uni-auth__alert-icon">
                error
              </span>
              {error}
            </div>
          )}

          <form className="uni-auth__form" onSubmit={handleSubmit} noValidate>
            <h1 className="uni-auth__title">Sign In</h1>
            <p className="uni-auth__subtitle">
              Enter your credentials to access your CommunalTrust workspace.
            </p>
            <label className="uni-auth__field">
              <span className="uni-auth__label">
                Username or Email
              </span>
              <input
                type="text"
                className="uni-auth__input"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                disabled={isAuthenticating}
                aria-invalid={Boolean(fieldErrors.identifier)}
                placeholder="e.g. username"
              />
              {fieldErrors.identifier && (
                <span className="uni-auth__field-error">
                  {fieldErrors.identifier}
                </span>
              )}
            </label>

            <label className="uni-auth__field">
              <span className="uni-auth__label">Password</span>
              <div className="uni-auth__input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="uni-auth__input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  disabled={isAuthenticating}
                  aria-invalid={Boolean(fieldErrors.password)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="uni-auth__pw-toggle"
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
                <span className="uni-auth__field-error">
                  {fieldErrors.password}
                </span>
              )}
            </label>

            <button
              type="submit"
              className="btn btn-primary uni-auth__submit"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? "Signing in…" : "Log In"}
            </button>
          </form>


        </div>
      </div>

      <style>{`
        .uni-auth {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          font-family: var(--font-body);
        }

        .uni-auth__panel {
          display: none;
          position: relative;
          overflow: hidden;
          padding: var(--space-xl) var(--space-lg);
          background: linear-gradient(
            160deg,
            var(--color-primary-container) 0%,
            #15192c 60%,
            var(--color-secondary) 150%
          );
          color: #ffffff;
          flex-direction: column;
          justify-content: center;
        }

        .uni-auth__glow {
          position: absolute;
          border-radius: var(--radius-full);
          filter: blur(80px);
          opacity: 0.25;
          pointer-events: none;
        }

        .uni-auth__glow--one {
          width: 320px;
          height: 320px;
          background: var(--color-secondary);
          top: -80px;
          right: -80px;
        }

        .uni-auth__glow--two {
          width: 260px;
          height: 260px;
          background: var(--color-tertiary-fixed);
          bottom: -60px;
          left: -60px;
        }

        .uni-auth__panel-content {
          position: relative;
          z-index: 10;
          max-width: 460px;
          margin: 0 auto;
        }

        .uni-auth__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
          margin-bottom: var(--space-xl);
        }

        .uni-auth__brand-icon {
          color: var(--color-tertiary-fixed);
          font-size: 32px;
          font-variation-settings: 'FILL' 1;
        }

        .uni-auth__brand-name {
          font-family: var(--font-display);
          font-size: var(--text-headline-md);
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .uni-auth__panel-title {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: var(--space-md);
          letter-spacing: -0.02em;
        }

        .uni-auth__panel-copy {
          font-size: var(--text-body-lg);
          opacity: 0.85;
          line-height: 1.6;
          margin-bottom: var(--space-xl);
        }


        .uni-auth__form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          background: var(--color-surface-container-low);
          min-height: 100vh;
        }

        .uni-auth__card {
          width: 100%;
          max-width: 460px;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: var(--space-lg) var(--space-md);
          box-shadow: 0 20px 45px -20px rgba(19, 27, 46, 0.15);
          animation: uniAuthFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes uniAuthFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .uni-auth__alert {
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

        .uni-auth__alert-icon {
          font-size: 20px;
        }

        .uni-auth__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .uni-auth__title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .uni-auth__subtitle {
          color: var(--color-on-surface-variant);
          font-size: 14px;
          margin-bottom: var(--space-sm);
          line-height: 1.5;
        }

        .uni-auth__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .uni-auth__label {
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-on-surface);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .uni-auth__hint-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          animation: badgePulse 1.5s infinite alternate;
        }

        @keyframes badgePulse {
          from { opacity: 0.8; }
          to { opacity: 1; }
        }

        .uni-auth__hint-badge--pa {
          background: rgba(113, 248, 228, 0.15);
          color: #007a6f;
        }

        .uni-auth__hint-badge--ca {
          background: rgba(255, 170, 68, 0.15);
          color: #b45309;
        }

        .uni-auth__hint-badge--res {
          background: rgba(70, 72, 212, 0.1);
          color: var(--color-secondary);
        }

        .uni-auth__hint-badge .material-symbols-outlined {
          font-size: 14px;
        }

        .uni-auth__input {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: 12px 16px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface);
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .uni-auth__input:focus {
          outline: none;
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(70, 72, 212, 0.15);
        }

        .uni-auth__input[aria-invalid='true'] {
          border-color: var(--color-error);
        }

        .uni-auth__input:disabled {
          opacity: 0.6;
        }

        .uni-auth__input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .uni-auth__input-wrap .uni-auth__input {
          width: 100%;
          padding-right: 48px;
        }

        .uni-auth__pw-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: var(--color-on-surface-variant);
          display: flex;
          align-items: center;
          border-radius: var(--radius-full);
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .uni-auth__pw-toggle:hover {
          color: var(--color-on-surface);
          background: rgba(0, 0, 0, 0.05);
        }

        .uni-auth__pw-toggle .material-symbols-outlined {
          font-size: 20px;
        }

        .uni-auth__field-error {
          color: var(--color-error);
          font-size: 12px;
          font-weight: 500;
        }

        .uni-auth__submit {
          margin-top: var(--space-xs);
          padding: 12px 24px;
          width: 100%;
          font-size: 16px;
        }



        @media (min-width: 1024px) {
          .uni-auth {
            grid-template-columns: 1.2fr 1fr;
          }

          .uni-auth__panel {
            display: flex;
          }

          .uni-auth__form-side {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
}
