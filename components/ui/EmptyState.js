/**
 * EmptyState component for when there's no data to display.
 */
export default function EmptyState({
  title = "Nothing here yet",
  description = "",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
        <span className="text-2xl text-text-tertiary">∅</span>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
