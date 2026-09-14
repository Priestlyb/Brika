/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Checkbox/Checkbox.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable checkbox component.
 *
 * Supports:
 *
 * - Accessible labels
 * - Description / hint text
 * - Error messages
 * - Checked state
 * - Indeterminate state
 * - Disabled state
 * - Required state
 * - Native HTML checkbox behavior
 * -----------------------------------------------------------------------------
 */

import {
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../../lib/cn";

import "./Checkbox.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /**
   * Checkbox label.
   */
  label?: ReactNode;

  /**
   * Additional descriptive text displayed below the label.
   */
  description?: ReactNode;

  /**
   * Error message displayed below the checkbox.
   */
  error?: ReactNode;

  /**
   * Displays the checkbox in an indeterminate state.
   *
   * This is commonly used for parent checkboxes when only some child
   * checkboxes are selected.
   *
   * @default false
   */
  indeterminate?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Checkbox({
  id,
  label,
  description,
  error,
  indeterminate = false,
  checked,
  defaultChecked,
  disabled = false,
  required = false,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  onChange,
  ...props
}: CheckboxProps) {
  const generatedId = useId();

  const checkboxId = id ?? `brika-checkbox-${generatedId}`;

  const checkboxRef = useRef<HTMLInputElement>(null);

  const descriptionId = description ? `${checkboxId}-description` : undefined;

  const errorId = error ? `${checkboxId}-error` : undefined;

  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
    undefined;

  /**
   * Native checkbox elements expose the indeterminate state through the DOM
   * property rather than an HTML attribute.
   */
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const hasError = Boolean(error);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  return (
    <div
      className={cn(
        "brika-checkbox-field",
        disabled && "brika-checkbox-field--disabled",
        hasError && "brika-checkbox-field--error",
        className,
      )}
    >
      <label htmlFor={checkboxId} className="brika-checkbox">
        <span className="brika-checkbox__control">
          <input
            ref={checkboxRef}
            id={checkboxId}
            type="checkbox"
            className="brika-checkbox__input"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
            aria-describedby={describedBy}
            onChange={handleChange}
            {...props}
          />

          <span className="brika-checkbox__box" aria-hidden="true">
            <svg
              className="brika-checkbox__check"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8.5L6.5 12L13 4.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <svg
              className="brika-checkbox__indeterminate"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 8H12.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>

        {(label || description) && (
          <span className="brika-checkbox__content">
            {label && (
              <span className="brika-checkbox__label">
                {label}

                {required && (
                  <span className="brika-checkbox__required" aria-hidden="true">
                    *
                  </span>
                )}
              </span>
            )}

            {description && (
              <span id={descriptionId} className="brika-checkbox__description">
                {description}
              </span>
            )}
          </span>
        )}
      </label>

      {error && (
        <p id={errorId} className="brika-checkbox__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Checkbox;
