/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Spinner/Spinner.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable loading spinner component.
 *
 * Supports:
 *
 * - Multiple sizes
 * - Multiple visual variants
 * - Accessible loading status
 * - Custom accessible label
 * - Decorative mode
 * -----------------------------------------------------------------------------
 */

import type { HTMLAttributes } from "react";

import { cn } from "../../../lib/cn";

import "./Spinner.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SpinnerVariant = "default" | "inverse" | "accent";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Spinner size.
   *
   * @default md
   */
  size?: SpinnerSize;

  /**
   * Spinner visual variant.
   *
   * @default default
   */
  variant?: SpinnerVariant;

  /**
   * Accessible loading label.
   *
   * @default Loading
   */
  label?: string;

  /**
   * Whether the spinner should be hidden from assistive technologies.
   *
   * Use this when surrounding content already communicates the loading
   * state.
   *
   * @default false
   */
  decorative?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Spinner({
  size = "md",
  variant = "default",
  label = "Loading",
  decorative = false,
  className,
  ...props
}: SpinnerProps) {
  if (decorative) {
    return (
      <span
        className={cn(
          "brika-spinner",
          `brika-spinner--${size}`,
          `brika-spinner--${variant}`,
          className,
        )}
        aria-hidden="true"
        {...props}
      >
        <span className="brika-spinner__circle" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "brika-spinner",
        `brika-spinner--${size}`,
        `brika-spinner--${variant}`,
        className,
      )}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="brika-spinner__circle" aria-hidden="true" />
    </span>
  );
}

export default Spinner;
