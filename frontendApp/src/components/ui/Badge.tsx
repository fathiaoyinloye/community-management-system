import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps {
  variant: BadgeVariant
  icon?: string
  children: ReactNode
}

export default function Badge({ variant, icon, children }: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge--${variant}`}>
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </span>
  )
}
