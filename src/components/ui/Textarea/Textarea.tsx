/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Textarea/Textarea.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable multiline text input component.
 * -----------------------------------------------------------------------------
 */

import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";

import { cn } from "../../../lib/cn";

import "./Textarea.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type TextareaSize = "sm" | "md" | "lg";

export type TextareaState = "default" | "error" | "success";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea label.
   */
  label?: ReactNode;

  /**
   * Additional information displayed below the textarea.
   */
  hint?: ReactNode;

  /**
   * Error message displayed below the textarea.
   *
   * When provided, the textarea automatically enters the error state.
   */
  error?: ReactNode;

  /**
   * Visual validation state.
   *
   * @default default
   */
  state?: TextareaState;

  /**
   * Textarea size.
   *
   * @default md
   */
  size?: TextareaSize;

  /**
   * Makes the textarea span the available width.
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

export function Textarea({
  id,
  label,
  hint,
  error,
  state = "default",
  size = "md",
  fullWidth = true,
  required,
  disabled,
  readOnly,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: TextareaProps) {
  const generatedId = useId();

  const textareaId = id ?? `brika-textarea-${generatedId}`;

  const hintId = hint ? `${textareaId}-hint` : undefined;

  const errorId = error ? `${textareaId}-error` : undefined;

  const describedBy =
    [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

  const hasError = Boolean(error) || state === "error";

  const textareaState: TextareaState = hasError ? "error" : state;

  return (
    <div
      className={cn(
        "brika-textarea-field",
        fullWidth && "brika-textarea-field--full-width",
        disabled && "brika-textarea-field--disabled",
      )}
    >
      {label && (
        <label htmlFor={textareaId} className="brika-textarea-field__label">
          <span>{label}</span>

          {required && (
            <span className="brika-textarea-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        className={cn(
          "brika-textarea",
          `brika-textarea--${size}`,
          `brika-textarea--${textareaState}`,
          readOnly && "brika-textarea--readonly",
          className,
        )}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
        aria-describedby={describedBy}
        {...props}
      />

      {error ? (
        <p
          id={errorId}
          className={cn(
            "brika-textarea-field__message",
            "brika-textarea-field__message--error",
          )}
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="brika-textarea-field__message">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Textarea;
