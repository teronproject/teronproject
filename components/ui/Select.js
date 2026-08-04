"use client";

import { forwardRef } from "react";

/**
 * Select component with label and error state.
 */
const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = "Select...", className = "", id, ...props },
  ref
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full h-10 px-3 bg-surface-primary border rounded text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent appearance-none cursor-pointer ${
          error
            ? "border-error focus:ring-error"
            : "border-border-primary hover:border-border-secondary"
        } ${className}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
