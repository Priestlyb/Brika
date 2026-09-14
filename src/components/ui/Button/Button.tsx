/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Button/Button.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Primary interactive button component.
 *
 * Supports:
 *
 * - Primary, secondary, outline, ghost, and danger variants
 * - Small, medium, and large sizes
 * - Loading state
 * - Disabled state
 * - Full-width layout
 * - Native button attributes
 * - Accessible keyboard interaction
 * -----------------------------------------------------------------------------
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../../lib/cn";

import "./Button.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button content.
   */
  children: ReactNode;

  /**
   * Visual button variant.
   *
   * @default primary
   */
  variant?: ButtonVariant;

  /**
   * Button size.
   *
   * @default md
   */
  size?: ButtonSize;

  /**
   * Displays a loading state and prevents interaction.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Makes the button span the available width.
   *
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        "brika-button",
        `brika-button--${variant}`,
        `brika-button--${size}`,
        fullWidth && "brika-button--full-width",
        loading && "brika-button--loading",
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="brika-button__spinner" aria-hidden="true" />}

      <span
        className={cn(
          "brika-button__content",
          loading && "brika-button__content--loading",
        )}
      >
        {children}
      </span>
    </button>
  );
}
