/**
 * -----------------------------------------------------------------------------
 * File: src/components/feedback/ErrorState/ErrorState.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable error state.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

import "./ErrorState.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface ErrorStateProps {
  /**
   * Main error heading.
   *
   * @default Something went wrong
   */
  title?: ReactNode;

  /**
   * Supporting error description.
   */
  description?: ReactNode;

  /**
   * Optional retry action.
   */
  action?: ReactNode;

  /**
   * Optional icon or illustration.
   */
  icon?: ReactNode;

  /**
   * Optional secondary content.
   */
  children?: ReactNode;

  /**
   * Additional class name.
   */
  className?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Default Icon
 * -----------------------------------------------------------------------------
 */

function DefaultErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />

      <path
        d="M9 9L15 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M15 9L9 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  icon,
  children,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("brika-error-state", className)} role="alert">
      <div className="brika-error-state__icon" aria-hidden="true">
        {icon ?? <DefaultErrorIcon />}
      </div>

      <div className="brika-error-state__content">
        <h2 className="brika-error-state__title">{title}</h2>

        {description && (
          <p className="brika-error-state__description">{description}</p>
        )}
      </div>

      {action && <div className="brika-error-state__action">{action}</div>}

      {children && <div className="brika-error-state__extra">{children}</div>}
    </div>
  );
}

export default ErrorState;
