"use client";

/**
 * Button component with variants.
 *
 * @param {object} props
 * @param {"primary"|"secondary"|"ghost"|"danger"} [props.variant="primary"]
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 * @param {boolean} [props.isLoading=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className=""]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent text-accent-text hover:bg-accent-hover active:bg-accent-active",
    secondary:
      "bg-transparent border border-border-secondary text-text-primary hover:bg-surface-primary active:bg-surface-secondary",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-primary",
    danger:
      "bg-error text-white hover:bg-red-600 active:bg-red-700",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
