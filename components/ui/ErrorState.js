/**
 * ErrorState component for error displays.
 */
export default function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-error-subtle flex items-center justify-center mb-4">
        <span className="text-2xl text-error">!</span>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-4">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="h-10 px-4 bg-surface-primary border border-border-secondary rounded text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
