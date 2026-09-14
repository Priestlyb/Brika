/**
 * -----------------------------------------------------------------------------
 * File: src/components/feedback/EmptyState/EmptyState.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable empty state.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

import "./EmptyState.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface EmptyStateProps {
  /**
   * Optional icon or illustration.
   */
  icon?: ReactNode;

  /**
   * Main empty-state heading.
   */
  title: ReactNode;

  /**
   * Optional supporting description.
   */
  description?: ReactNode;

  /**
   * Optional primary action.
   */
  action?: ReactNode;

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
 * Component
 * -----------------------------------------------------------------------------
 */

export function EmptyState({
  icon,
  title,
  description,
  action,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("brika-empty-state", className)}>
      {icon && (
        <div className="brika-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="brika-empty-state__content">
        <h2 className="brika-empty-state__title">{title}</h2>

        {description && (
          <p className="brika-empty-state__description">{description}</p>
        )}
      </div>

      {action && <div className="brika-empty-state__action">{action}</div>}

      {children && <div className="brika-empty-state__extra">{children}</div>}
    </div>
  );
}

export default EmptyState;
