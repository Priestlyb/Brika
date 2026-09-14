/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Drawer/Drawer.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable drawer / side-panel component.
 *
 * Supports:
 *
 * - Left, right, top, and bottom placement
 * - Multiple sizes
 * - Accessible dialog semantics
 * - React portal rendering
 * - Backdrop click
 * - Escape-to-close
 * - Body scroll locking
 * - Header / title / description
 * - Custom footer
 * - Close button
 * -----------------------------------------------------------------------------
 */

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";

import { cn } from "../../../lib/cn";

import "./Drawer.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type DrawerSide = "left" | "right" | "top" | "bottom";

export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps {
  /**
   * Controls whether the drawer is visible.
   */
  open: boolean;

  /**
   * Called when the drawer requests to close.
   */
  onClose: () => void;

  /**
   * Drawer title.
   */
  title?: ReactNode;

  /**
   * Optional supporting description.
   */
  description?: ReactNode;

  /**
   * Drawer content.
   */
  children: ReactNode;

  /**
   * Optional footer content.
   */
  footer?: ReactNode;

  /**
   * Side from which the drawer opens.
   *
   * @default right
   */
  side?: DrawerSide;

  /**
   * Drawer size.
   *
   * @default md
   */
  size?: DrawerSize;

  /**
   * Whether clicking the backdrop closes the drawer.
   *
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing Escape closes the drawer.
   *
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether the close button is displayed.
   *
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Accessible label used when no title is provided.
   */
  ariaLabel?: string;

  /**
   * Additional class applied to the drawer panel.
   */
  className?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  ariaLabel,
  className,
}: DrawerProps) {
  const generatedId = useId();

  const titleId = `brika-drawer-title-${generatedId}`;

  const descriptionId = description
    ? `brika-drawer-description-${generatedId}`
    : undefined;

  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * -------------------------------------------------------------------------
   * Escape key
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEscape, onClose]);

  /**
   * -------------------------------------------------------------------------
   * Body scroll lock
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /**
   * -------------------------------------------------------------------------
   * Focus drawer when opened
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
  }, [open]);

  /**
   * -------------------------------------------------------------------------
   * Backdrop click
   * -------------------------------------------------------------------------
   */

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdropClick) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  /**
   * -------------------------------------------------------------------------
   * Closed state
   * -------------------------------------------------------------------------
   */

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="brika-drawer"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className={cn(
          "brika-drawer__panel",
          `brika-drawer__panel--${side}`,
          `brika-drawer__panel--${size}`,
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={descriptionId}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
      >
        {(title || description || showCloseButton) && (
          <header className="brika-drawer__header">
            <div className="brika-drawer__heading">
              {title && (
                <h2 id={titleId} className="brika-drawer__title">
                  {title}
                </h2>
              )}

              {description && (
                <p id={descriptionId} className="brika-drawer__description">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                className="brika-drawer__close"
                aria-label="Close drawer"
                onClick={onClose}
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
          </header>
        )}

        <div className="brika-drawer__body">{children}</div>

        {footer && <footer className="brika-drawer__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

export default Drawer;
