"use client";

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const base = `
    inline-flex items-center justify-center
    relative overflow-hidden isolate

    rounded-[10px]
    font-[560]
    tracking-[-0.02em]
    whitespace-nowrap
    select-none

    transition-all duration-300 ease-out
    active:scale-[0.985]

    disabled:pointer-events-none
    disabled:opacity-50

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-amber-300/50

    [text-rendering:optimizeLegibility]
    [-webkit-font-smoothing:antialiased]
    [-moz-osx-font-smoothing:grayscale]
  `;

  const variants = {
    primary: `
      text-[#4E3500]

      border
      border-[#E9C85A]

      bg-[#F4D86A]

      shadow-[inset_0_1px_0_rgba(255,255,255,.55),inset_0_-1px_0_rgba(176,124,18,.18),0_1px_2px_rgba(16,24,40,.05),0_4px_10px_rgba(16,24,40,.06)]

      hover:bg-[#F6DC75]
      hover:border-[#ECCA57]
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,.65),inset_0_-1px_0_rgba(176,124,18,.22),0_6px_16px_rgba(16,24,40,.08)]
    `,

    secondary: `
      bg-white
      text-neutral-800
      border border-neutral-200
      hover:bg-neutral-50
    `,

    ghost: `
      bg-transparent
      text-neutral-700
      hover:bg-black/5
    `,

    danger: `
      bg-red-600
      text-white
      hover:bg-red-700
    `,
  };

  const sizes = {
    sm: "h-9 px-4 text-sm gap-2",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-7 text-base gap-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,.18),rgba(255,255,255,0)_42%)]" />

      {isLoading && (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
}