const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? ''
  : 'https://community-management-system-41c7.onrender.com'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL)
  .replace(/\/$/, '')

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/api/v1${path}`
}

// ── GLOBAL MOCK TOGGLE ────────────────────────────────────────────────────────
// Set this to true to run the frontend entirely with mock data in-memory.
// Set to false to connect to the backend (either local or live Render backend).
// Defaults to false unless explicitly set to 'true'.
export const GLOBAL_USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';


