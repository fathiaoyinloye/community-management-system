interface EmptyStateProps {
  icon: string
  title: string
  description?: string
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <span className="material-symbols-outlined">{icon}</span>
      <p className="ui-empty-state__title">{title}</p>
      {description && <p>{description}</p>}
    </div>
  )
}
