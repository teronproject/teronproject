"use client";

/**
 * Tooltip component.
 * Wraps a trigger element and shows tooltip on hover.
 */
export default function Tooltip({ content, children, className = "" }) {
  return (
    <div className={`relative group inline-flex ${className}`}>
      {children}
      <div
        role="tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-bg-primary border border-border-secondary rounded text-xs text-text-primary whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50"
      >
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-primary border-r border-b border-border-secondary rotate-45 -mt-1" />
      </div>
    </div>
  );
}
