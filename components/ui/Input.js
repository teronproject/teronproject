"use client";

import { forwardRef } from "react";

/**
 * Input component with label, error state, and helper text.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    className = "",
    id,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full h-10 px-3 bg-surface-primary border rounded text-sm text-text-primary placeholder:text-text-disabled transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
          error
            ? "border-error focus:ring-error"
            : "border-border-primary hover:border-border-secondary"
        } ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-text-tertiary">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
