/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Switch/Switch.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable on/off switch component.
 *
 * Supports:
 *
 * - Accessible labels
 * - Description / hint text
 * - Error messages
 * - Controlled and uncontrolled states
 * - Disabled state
 * - Required state
 * - Native checkbox behavior
 * - Keyboard interaction
 * -----------------------------------------------------------------------------
 */

import {
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../../lib/cn";

import "./Switch.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /**
   * Switch label.
   */
  label?: ReactNode;

  /**
   * Additional descriptive text displayed below the label.
   */
  description?: ReactNode;

  /**
   * Error message displayed below the switch.
   */
  error?: ReactNode;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Switch({
  id,
  label,
  description,
  error,
  checked,
  defaultChecked,
  disabled = false,
  required = false,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  onChange,
  ...props
}: SwitchProps) {
  const generatedId = useId();

  const switchId = id ?? `brika-switch-${generatedId}`;

  const descriptionId = description ? `${switchId}-description` : undefined;

  const errorId = error ? `${switchId}-error` : undefined;

  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
    undefined;

  const hasError = Boolean(error);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  return (
    <div
      className={cn(
        "brika-switch-field",
        disabled && "brika-switch-field--disabled",
        hasError && "brika-switch-field--error",
        className,
      )}
    >
      <label htmlFor={switchId} className="brika-switch">
        <span className="brika-switch__control">
          <input
            id={switchId}
            type="checkbox"
            role="switch"
            className="brika-switch__input"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
            aria-describedby={describedBy}
            onChange={handleChange}
            {...props}
          />

          <span className="brika-switch__track" aria-hidden="true">
            <span className="brika-switch__thumb" />
          </span>
        </span>

        {(label || description) && (
          <span className="brika-switch__content">
            {label && (
              <span className="brika-switch__label">
                {label}

                {required && (
                  <span className="brika-switch__required" aria-hidden="true">
                    *
                  </span>
                )}
              </span>
            )}

            {description && (
              <span id={descriptionId} className="brika-switch__description">
                {description}
              </span>
            )}
          </span>
        )}
      </label>

      {error && (
        <p id={errorId} className="brika-switch__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Switch;
