import { useState, type FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { activateAccount } from "../../api/auth";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);
    if (!token) {
      setApiError("Activation token is missing. Please use a valid activation link.");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await activateAccount({
        token,
        password,
        confirmPassword,
      });
      setSuccessMessage(response.message || "Account activated successfully!");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unable to activate account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="act-page">
      <div className="act-page__glow act-page__glow--one" />
      <div className="act-page__glow act-page__glow--two" />

      <div className="act-page__container">
        <div className="act-page__brand">
          <span className="material-symbols-outlined act-page__brand-icon">
            account_balance
          </span>
          <span className="act-page__brand-name">CommunalTrust</span>
        </div>

        <div className="act-page__card">
          {successMessage ? (
            <div className="act-page__success">
              <span className="material-symbols-outlined act-page__success-icon">
                check_circle
              </span>
              <h1 className="act-page__title">Account Setup Complete</h1>
              <p className="act-page__subtitle">
                {successMessage} You can now log in using your new credentials to access your workspace.
              </p>
              <Link to="/login" className="btn btn-primary act-page__btn">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form className="act-page__form" onSubmit={handleSubmit} noValidate>
              <h1 className="act-page__title">Set Up Your Account</h1>
              <p className="act-page__subtitle">
                Choose a secure password to complete your CommunalTrust workspace activation.
              </p>

              {!token && (
                <div role="alert" className="act-page__alert act-page__alert--error">
                  <span className="material-symbols-outlined">warning</span>
                  <div>
                    <strong>Invalid Link:</strong> The activation token is missing. Please contact your platform administrator.
                  </div>
                </div>
              )}

              {apiError && (
                <div role="alert" className="act-page__alert act-page__alert--error">
                  <span className="material-symbols-outlined">error</span>
                  {apiError}
                </div>
              )}

              <label className="act-page__field">
                <span className="act-page__label">Choose Password</span>
                <div className="act-page__input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="act-page__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting || !token}
                    placeholder="At least 8 characters"
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  <button
                    type="button"
                    className="act-page__pw-toggle"
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
                  <span className="act-page__field-error">{fieldErrors.password}</span>
                )}
              </label>

              <label className="act-page__field">
                <span className="act-page__label">Confirm Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="act-page__input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting || !token}
                  placeholder="Repeat your password"
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                />
                {fieldErrors.confirmPassword && (
                  <span className="act-page__field-error">{fieldErrors.confirmPassword}</span>
                )}
              </label>

              <button
                type="submit"
                className="btn btn-primary act-page__submit"
                disabled={isSubmitting || !token}
              >
                {isSubmitting ? "Activating account…" : "Activate & Set Password"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .act-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            160deg,
            var(--color-primary-container) 0%,
            #0f1222 60%,
            var(--color-secondary) 150%
          );
          padding: var(--space-md);
          font-family: var(--font-body);
        }

        .act-page__glow {
          position: absolute;
          border-radius: var(--radius-full);
          filter: blur(100px);
          opacity: 0.2;
          pointer-events: none;
        }

        .act-page__glow--one {
          width: 400px;
          height: 400px;
          background: var(--color-secondary);
          top: -100px;
          right: -100px;
        }

        .act-page__glow--two {
          width: 350px;
          height: 350px;
          background: var(--color-tertiary-fixed);
          bottom: -100px;
          left: -100px;
        }

        .act-page__container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
        }

        .act-page__brand {
          display: flex;
          align-items: center;
          gap: var(--space-base);
          color: #ffffff;
        }

        .act-page__brand-icon {
          color: var(--color-tertiary-fixed);
          font-size: 32px;
          font-variation-settings: 'FILL' 1;
        }

        .act-page__brand-name {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .act-page__card {
          width: 100%;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          padding: 40px var(--space-md);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: actFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes actFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .act-page__success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .act-page__success-icon {
          font-size: 64px;
          color: #15803d;
          margin-bottom: 24px;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleUp {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .act-page__title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .act-page__subtitle {
          color: var(--color-on-surface-variant);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 24px;
          text-align: center;
        }

        .act-page__alert {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm);
          border-radius: var(--radius-lg);
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .act-page__alert--error {
          background: var(--color-error-container);
          color: var(--color-on-error-container);
        }

        .act-page__alert span {
          font-size: 20px;
          flex-shrink: 0;
        }

        .act-page__form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .act-page__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .act-page__label {
          font-size: var(--text-label-md);
          font-weight: 600;
          color: var(--color-on-surface);
        }

        .act-page__input {
          font-family: var(--font-body);
          font-size: var(--text-body-md);
          padding: 12px 16px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          color: var(--color-on-surface);
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
        }

        .act-page__input:focus {
          outline: none;
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(70, 72, 212, 0.15);
        }

        .act-page__input[aria-invalid='true'] {
          border-color: var(--color-error);
        }

        .act-page__input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .act-page__input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .act-page__input-wrap .act-page__input {
          padding-right: 48px;
        }

        .act-page__pw-toggle {
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

        .act-page__pw-toggle:hover {
          color: var(--color-on-surface);
          background: rgba(0, 0, 0, 0.05);
        }

        .act-page__pw-toggle .material-symbols-outlined {
          font-size: 20px;
        }

        .act-page__field-error {
          color: var(--color-error);
          font-size: 12px;
          font-weight: 500;
        }

        .act-page__submit {
          margin-top: 8px;
          padding: 12px 24px;
          width: 100%;
          font-size: 16px;
        }

        .act-page__btn {
          padding: 12px 24px;
          width: 100%;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
