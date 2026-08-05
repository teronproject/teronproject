"use client";

import { forwardRef } from "react";

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
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="input-label"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={`input ${
          error ? "input-error" : ""
        } ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
            ? `${inputId}-helper`
            : undefined
        }
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="input-error-text"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="input-helper"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;