/**
 * -----------------------------------------------------------------------------
 * File: src/components/feedback/LoadingState/LoadingState.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable loading state.
 *
 * Used for:
 *
 * - Page loading
 * - Section loading
 * - Project loading
 * - Model loading
 * - Data fetching states
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from "react";

import { Spinner } from "../../ui/Spinner";
import { cn } from "../../../lib/cn";

import "./LoadingState.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type LoadingStateSize = "sm" | "md" | "lg";

export interface LoadingStateProps {
  /**
   * Optional loading title.
   */
  title?: ReactNode;

  /**
   * Optional supporting message.
   */
  description?: ReactNode;

  /**
   * Spinner size.
   *
   * @default md
   */
  size?: LoadingStateSize;

  /**
   * Additional content.
   */
  children?: ReactNode;

  /**
   * Additional class name.
   */
  className?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function LoadingState({
  title = "Loading",
  description,
  size = "md",
  children,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "brika-loading-state",
        `brika-loading-state--${size}`,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
        decorative
      />

      {title && <p className="brika-loading-state__title">{title}</p>}

      {description && (
        <p className="brika-loading-state__description">{description}</p>
      )}

      {children && (
        <div className="brika-loading-state__content">{children}</div>
      )}
    </div>
  );
}

export default LoadingState;
