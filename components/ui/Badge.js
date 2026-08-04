"use client";

/**
 * Badge component for status indicators and labels.
 *
 * @param {object} props
 * @param {"default"|"accent"|"success"|"error"|"warning"} [props.variant="default"]
 * @param {"sm"|"md"} [props.size="sm"]
 */
export default function Badge({
  variant = "default",
  size = "sm",
  className = "",
  children,
}) {
  const variants = {
    default: "bg-surface-tertiary text-text-secondary",
    accent: "bg-accent-subtle text-accent",
    success: "bg-success-subtle text-success",
    error: "bg-error-subtle text-error",
    warning: "bg-warning-subtle text-warning",
  };

  const sizes = {
    sm: "h-5 px-2 text-xs",
    md: "h-6 px-2.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
