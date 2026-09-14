/** * ----------------------------------------------------------------------------- * File: src/components/ui/Input/Input.tsx * ----------------------------------------------------------------------------- * Brika Design System * * Reusable text input component. * * Supports: * * - Accessible labels * - Hint and error messages * - Validation states * - Small, medium, and large sizes * - Full-width layouts * - Native HTML input attributes * - Required and disabled states * ----------------------------------------------------------------------------- */ import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import "./Input.css";
/** * ----------------------------------------------------------------------------- * Types * ----------------------------------------------------------------------------- */ export type InputSize =
  "sm" | "md" | "lg";
export type InputState = "default" | "error" | "success";
export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** * Input label. */ label?: ReactNode;
  /** * Additional information displayed below the input. */ hint?: ReactNode;
  /** * Error message displayed below the input. * * When provided, the input automatically enters the error state. */ error?: ReactNode;
  /** * Visual validation state. * * @default default */ state?: InputState;
  /** * Input size. * * @default md */ size?: InputSize;
  /** * Makes the input span the available width. * * @default true */ fullWidth?: boolean;
}
/** * ----------------------------------------------------------------------------- * Component * ----------------------------------------------------------------------------- */ export function Input({
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
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? `brika-input-${generatedId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;
  const hasError = Boolean(error) || state === "error";
  const inputState: InputState = hasError ? "error" : state;
  return (
    <div
      className={cn(
        "brika-input-field",
        fullWidth && "brika-input-field--full-width",
        disabled && "brika-input-field--disabled",
      )}
    >
      {" "}
      {label && (
        <label htmlFor={inputId} className="brika-input-field__label">
          {" "}
          <span> {label} </span>{" "}
          {required && (
            <span className="brika-input-field__required" aria-hidden="true">
              {" "}
              *{" "}
            </span>
          )}{" "}
        </label>
      )}{" "}
      <input
        id={inputId}
        className={cn(
          "brika-input",
          `brika-input--${size}`,
          `brika-input--${inputState}`,
          readOnly && "brika-input--readonly",
          className,
        )}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
        aria-describedby={describedBy}
        {...props}
      />{" "}
      {error ? (
        <p
          id={errorId}
          className="brika-input-field__message brika-input-field__message--error"
          role="alert"
        >
          {" "}
          {error}{" "}
        </p>
      ) : hint ? (
        <p id={hintId} className="brika-input-field__message">
          {" "}
          {hint}{" "}
        </p>
      ) : null}{" "}
    </div>
  );
}
