/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Toast/Toast.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable toast notification component.
 *
 * Supports:
 *
 * - Success, warning, error, and info variants
 * - Optional title
 * - Optional description
 * - Optional action
 * - Auto-dismiss
 * - Manual dismissal
 * - Accessible status / alert semantics
 * - Multiple sizes
 * - Progress indicator
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

import { cn } from "../../../lib/cn";

import "./Toast.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type ToastVariant = "success" | "warning" | "error" | "info";

export type ToastDuration = number | "persistent";

export interface ToastAction {
  /**
   * Action label.
   */
  label: ReactNode;

  /**
   * Called when the action is selected.
   */
  onClick: () => void;
}

export interface ToastProps {
  /**
   * Visual / semantic toast variant.
   *
   * @default info
   */
  variant?: ToastVariant;

  /**
   * Optional toast title.
   */
  title?: ReactNode;

  /**
   * Optional supporting message.
   */
  description?: ReactNode;

  /**
   * Optional action displayed inside the toast.
   */
  action?: ToastAction;

  /**
   * Controls how long the toast remains visible.
   *
   * Use "persistent" when the toast must be dismissed manually.
   *
   * @default 5000
   */
  duration?: ToastDuration;

  /**
   * Called when the toast is dismissed.
   */
  onClose?: () => void;

  /**
   * Whether the close button is displayed.
   *
   * @default true
   */
  dismissible?: boolean;

  /**
   * Additional class applied to the toast.
   */
  className?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Icons
 * -----------------------------------------------------------------------------
 */

function SuccessIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />

      <path
        d="M6.5 10L8.75 12.25L13.5 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 3.25L17 16.25H3L10 3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M10 7.5V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle cx="10" cy="13" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />

      <path
        d="M7.5 7.5L12.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M12.5 7.5L7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />

      <path
        d="M10 9V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Toast({
  variant = "info",
  title,
  description,
  action,
  duration = 5000,
  onClose,
  dismissible = true,
  className,
}: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * -------------------------------------------------------------------------
   * Auto dismiss
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    if (duration === "persistent" || !onClose) {
      return;
    }

    timerRef.current = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, onClose]);

  /**
   * -------------------------------------------------------------------------
   * Close
   * -------------------------------------------------------------------------
   */

  const handleClose = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    onClose?.();
  };

  /**
   * -------------------------------------------------------------------------
   * Icon
   * -------------------------------------------------------------------------
   */

  const icon = {
    success: <SuccessIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
  }[variant];

  const hasContent = Boolean(title) || Boolean(description);

  return (
    <div
      className={cn(
        "brika-toast",
        `brika-toast--${variant}`,
        duration === "persistent" && "brika-toast--persistent",
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <div className="brika-toast__icon" aria-hidden="true">
        {icon}
      </div>

      {hasContent && (
        <div className="brika-toast__content">
          {title && <p className="brika-toast__title">{title}</p>}

          {description && (
            <p className="brika-toast__description">{description}</p>
          )}

          {action && (
            <button
              type="button"
              className="brika-toast__action"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
        </div>
      )}

      {dismissible && onClose && (
        <button
          type="button"
          className="brika-toast__close"
          aria-label="Dismiss notification"
          onClick={handleClose}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 5L15 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <path
              d="M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {duration !== "persistent" && duration > 0 && (
        <span
          className="brika-toast__progress"
          style={{
            animationDuration: `${duration}ms`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default Toast;
