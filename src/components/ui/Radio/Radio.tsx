/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Radio/Radio.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable radio button component.
 *
 * Supports:
 *
 * - Accessible labels
 * - Description / hint text
 * - Error messages
 * - Checked state
 * - Disabled state
 * - Required state
 * - Native HTML radio behavior
 * - Native radio-group behavior through the `name` prop
 * -----------------------------------------------------------------------------
 */

import {
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../../lib/cn";

import "./Radio.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /**
   * Radio label.
   */
  label?: ReactNode;

  /**
   * Additional descriptive text displayed below the label.
   */
  description?: ReactNode;

  /**
   * Error message displayed below the radio.
   */
  error?: ReactNode;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Radio({
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
}: RadioProps) {
  const generatedId = useId();

  const radioId = id ?? `brika-radio-${generatedId}`;

  const descriptionId = description ? `${radioId}-description` : undefined;

  const errorId = error ? `${radioId}-error` : undefined;

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
        "brika-radio-field",
        disabled && "brika-radio-field--disabled",
        hasError && "brika-radio-field--error",
        className,
      )}
    >
      <label htmlFor={radioId} className="brika-radio">
        <span className="brika-radio__control">
          <input
            id={radioId}
            type="radio"
            className="brika-radio__input"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
            aria-describedby={describedBy}
            onChange={handleChange}
            {...props}
          />

          <span className="brika-radio__circle" aria-hidden="true">
            <span className="brika-radio__dot" />
          </span>
        </span>

        {(label || description) && (
          <span className="brika-radio__content">
            {label && (
              <span className="brika-radio__label">
                {label}

                {required && (
                  <span className="brika-radio__required" aria-hidden="true">
                    *
                  </span>
                )}
              </span>
            )}

            {description && (
              <span id={descriptionId} className="brika-radio__description">
                {description}
              </span>
            )}
          </span>
        )}
      </label>

      {error && (
        <p id={errorId} className="brika-radio__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Radio;
