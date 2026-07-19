const DEFAULT_API_BASE_URL = 'https://community-management-system-41c7.onrender.com'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL)
  .replace(/\/$/, '')

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/api/v1${path}`
}
