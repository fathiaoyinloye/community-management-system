export default function GlobalStyles() {
  return (
    <style>{`
      :root {
        /* Colors */
        --color-on-secondary-fixed: #07006c;
        --color-on-error-container: #93000a;
        --color-tertiary-fixed: #71f8e4;
        --color-on-tertiary-container: #009485;
        --color-outline-variant: #c6c6cd;
        --color-surface-variant: #e0e3e5;
        --color-inverse-primary: #bec6e0;
        --color-secondary-fixed: #e1e0ff;
        --color-on-primary-fixed: #131b2e;
        --color-inverse-on-surface: #eff1f3;
        --color-primary-fixed-dim: #bec6e0;
        --color-on-primary-fixed-variant: #3f465c;
        --color-primary: #000000;
        --color-inverse-surface: #2d3133;
        --color-surface-container-lowest: #ffffff;
        --color-on-secondary: #ffffff;
        --color-on-tertiary-fixed: #00201c;
        --color-tertiary-container: #00201c;
        --color-surface-container-highest: #e0e3e5;
        --color-on-primary-container: #7c839b;
        --color-surface-container-high: #e6e8ea;
        --color-on-error: #ffffff;
        --color-primary-container: #131b2e;
        --color-primary-fixed: #dae2fd;
        --color-on-tertiary: #ffffff;
        --color-surface-dim: #d8dadc;
        --color-surface-bright: #f7f9fb;
        --color-on-secondary-fixed-variant: #2f2ebe;
        --color-surface-container: #eceef0;
        --color-secondary: #4648d4;
        --color-surface: #f7f9fb;
        --color-error-container: #ffdad6;
        --color-outline: #76777d;
        --color-on-surface-variant: #45464d;
        --color-error: #ba1a1a;
        --color-on-tertiary-fixed-variant: #005048;
        --color-on-primary: #ffffff;
        --color-background: #f7f9fb;
        --color-surface-container-low: #f2f4f6;
        --color-on-secondary-container: #fffbff;
        --color-on-surface: #191c1e;
        --color-tertiary-fixed-dim: #4fdbc8;
        --color-on-background: #191c1e;
        --color-surface-tint: #565e74;
        --color-tertiary: #000000;
        --color-secondary-container: #6063ee;
        --color-secondary-fixed-dim: #c0c1ff;

        /* Radius */
        --radius-default: 0.25rem;
        --radius-lg: 0.5rem;
        --radius-xl: 0.75rem;
        --radius-2xl: 1rem;
        --radius-3xl: 1.5rem;
        --radius-full: 9999px;

        /* Spacing */
        --space-xs: 4px;
        --space-base: 8px;
        --space-sm: 12px;
        --space-md: 24px;
        --space-gutter: 24px;
        --space-lg: 48px;
        --space-xl: 80px;
        --container-max: 1280px;

        /* Fonts */
        --font-display: 'Hanken Grotesk', sans-serif;
        --font-body: 'Inter', sans-serif;

        /* Font sizes */
        --text-label-md: 14px;
        --text-label-sm: 12px;
        --text-body-md: 16px;
        --text-display-lg-mobile: 40px;
        --text-display-lg: 56px;
        --text-headline-lg: 32px;
        --text-body-lg: 18px;
        --text-headline-md: 24px;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        background: var(--color-background);
        color: var(--color-on-surface);
        font-family: var(--font-body);
        font-size: var(--text-body-md);
        line-height: 24px;
        overflow-x: hidden;
      }

      h1,
      h2,
      h3,
      h4,
      p,
      ul {
        margin: 0;
        padding: 0;
      }

      ul {
        list-style: none;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button {
        font-family: inherit;
        cursor: pointer;
        border: none;
      }

      img {
        max-width: 100%;
        display: block;
      }

      .container {
        max-width: var(--container-max);
        margin: 0 auto;
        padding-left: var(--space-lg);
        padding-right: var(--space-lg);
      }

      @media (max-width: 640px) {
        .container {
          padding-left: var(--space-md);
          padding-right: var(--space-md);
        }
      }

      .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';
        font-weight: normal;
        font-style: normal;
        font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-xs);
        font-family: var(--font-body);
        font-weight: 700;
        border-radius: var(--radius-xl);
        transition:
          transform 0.2s ease,
          background-color 0.2s ease,
          opacity 0.2s ease;
        white-space: nowrap;
      }

      .btn:hover {
        transform: scale(1.05);
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .btn-primary {
        background: var(--color-secondary);
        color: var(--color-on-secondary);
        box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.25);
      }

      .btn-primary:hover {
        opacity: 0.9;
      }

      .btn-ghost-light {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
      }

      .btn-ghost-light:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .btn-outline {
        background: #fff;
        border: 2px solid var(--color-secondary);
        color: var(--color-secondary);
      }

      .btn-outline:hover {
        background: var(--color-surface-container);
      }

      .btn-dark {
        background: var(--color-primary);
        color: var(--color-on-primary);
        box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.3);
      }

      .hover-lift {
        transition:
          transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
          box-shadow 0.3s ease,
          opacity 0.7s ease,
          translate 0.7s ease;
        opacity: 0;
        translate: 0 40px;
      }

      .hover-lift.is-visible {
        opacity: 1;
        translate: 0 0;
      }

      .hover-lift:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.15);
      }

      .ui-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: var(--radius-full);
        font-size: var(--text-label-sm);
        font-weight: 700;
        border: 1px solid transparent;
        white-space: nowrap;
      }

      .ui-badge .material-symbols-outlined {
        font-size: 16px;
      }

      .ui-badge--success {
        background: #f0fdf4;
        color: #15803d;
        border-color: #dcfce7;
      }

      .ui-badge--warning {
        background: #fffbeb;
        color: #b45309;
        border-color: #fef3c7;
      }

      .ui-badge--danger {
        background: #fff1f2;
        color: #e11d48;
        border-color: #ffe4e6;
      }

      .ui-badge--neutral {
        background: var(--color-surface-container);
        color: var(--color-on-surface-variant);
        border-color: var(--color-outline-variant);
      }

      .ui-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: var(--radius-full);
        border: 3px solid var(--color-outline-variant);
        border-top-color: var(--color-secondary);
        animation: ui-spin 0.7s linear infinite;
      }

      @keyframes ui-spin {
        to {
          transform: rotate(360deg);
        }
      }

      .ui-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--space-xl) var(--space-md);
        color: var(--color-on-surface-variant);
      }

      .ui-empty-state .material-symbols-outlined {
        font-size: 40px;
        color: var(--color-outline-variant);
        margin-bottom: var(--space-sm);
      }

      .ui-empty-state__title {
        font-weight: 700;
        color: var(--color-on-surface);
        margin-bottom: 4px;
      }
    `}</style>
  )
}
