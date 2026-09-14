/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Modal/Modal.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable modal / dialog component.
 *
 * Supports:
 *
 * - Accessible dialog semantics
 * - React portal rendering
 * - Backdrop click
 * - Escape-to-close
 * - Body scroll locking
 * - Controlled open state
 * - Header / title / description
 * - Custom footer
 * - Close button
 * - Multiple sizes
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

import "./Modal.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /**
   * Controls whether the modal is visible.
   */
  open: boolean;

  /**
   * Called when the modal requests to close.
   */
  onClose: () => void;

  /**
   * Modal title.
   */
  title?: ReactNode;

  /**
   * Optional supporting description.
   */
  description?: ReactNode;

  /**
   * Modal content.
   */
  children: ReactNode;

  /**
   * Optional footer content.
   *
   * Usually contains action buttons.
   */
  footer?: ReactNode;

  /**
   * Modal width.
   *
   * @default md
   */
  size?: ModalSize;

  /**
   * Whether clicking the backdrop closes the modal.
   *
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing Escape closes the modal.
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
   * Accessible label for the dialog when no title is provided.
   */
  ariaLabel?: string;

  /**
   * Additional class applied to the modal panel.
   */
  className?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  ariaLabel,
  className,
}: ModalProps) {
  const generatedId = useId();

  const titleId = `brika-modal-title-${generatedId}`;

  const descriptionId = description
    ? `brika-modal-description-${generatedId}`
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
   * Focus modal when opened
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
   * Don't render anything when closed.
   * -------------------------------------------------------------------------
   */

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="brika-modal"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className={cn(
          "brika-modal__panel",
          `brika-modal__panel--${size}`,
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
          <header className="brika-modal__header">
            <div className="brika-modal__heading">
              {title && (
                <h2 id={titleId} className="brika-modal__title">
                  {title}
                </h2>
              )}

              {description && (
                <p id={descriptionId} className="brika-modal__description">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                className="brika-modal__close"
                aria-label="Close dialog"
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

        <div className="brika-modal__body">{children}</div>

        {footer && <footer className="brika-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
