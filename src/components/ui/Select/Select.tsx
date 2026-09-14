/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Select/Select.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable select input component.
 *
 * Supports:
 *
 * - Accessible labels
 * - Hint and error messages
 * - Validation states
 * - Small, medium, and large sizes
 * - Full-width layouts
 * - Native HTML select behavior
 * - Required and disabled states
 * -----------------------------------------------------------------------------
 */

import { useId, type ReactNode, type SelectHTMLAttributes } from "react";

import { cn } from "../../../lib/cn";

import "./Select.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type SelectSize = "sm" | "md" | "lg";

export type SelectState = "default" | "error" | "success";

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  /**
   * Select label.
   */
  label?: ReactNode;

  /**
   * Additional information displayed below the select.
   */
  hint?: ReactNode;

  /**
   * Error message displayed below the select.
   *
   * When provided, the select automatically enters the error state.
   */
  error?: ReactNode;

  /**
   * Visual validation state.
   *
   * @default default
   */
  state?: SelectState;

  /**
   * Brika select size.
   *
   * @default md
   */
  size?: SelectSize;

  /**
   * Makes the select span the available width.
   *
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Select({
  id,
  label,
  hint,
  error,
  state = "default",
  size = "md",
  fullWidth = true,
  required,
  disabled,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();

  const selectId = id ?? `brika-select-${generatedId}`;

  const hintId = hint ? `${selectId}-hint` : undefined;

  const errorId = error ? `${selectId}-error` : undefined;

  const describedBy =
    [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

  const hasError = Boolean(error) || state === "error";

  const selectState: SelectState = hasError ? "error" : state;

  return (
    <div
      className={cn(
        "brika-select-field",
        fullWidth && "brika-select-field--full-width",
        disabled && "brika-select-field--disabled",
      )}
    >
      {label && (
        <label htmlFor={selectId} className="brika-select-field__label">
          <span>{label}</span>

          {required && (
            <span className="brika-select-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div
        className={cn(
          "brika-select-wrapper",
          `brika-select-wrapper--${size}`,
          `brika-select-wrapper--${selectState}`,
          disabled && "brika-select-wrapper--disabled",
        )}
      >
        <select
          id={selectId}
          className={cn(
            "brika-select",
            `brika-select--${size}`,
            `brika-select--${selectState}`,
            className,
          )}
          required={required}
          disabled={disabled}
          aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
          aria-describedby={describedBy}
          {...props}
        >
          {children}
        </select>

        <span className="brika-select-wrapper__icon" aria-hidden="true">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {error ? (
        <p
          id={errorId}
          className={cn(
            "brika-select-field__message",
            "brika-select-field__message--error",
          )}
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="brika-select-field__message">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Select;
