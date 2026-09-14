/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/Dropdown/Dropdown.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable dropdown menu component.
 *
 * Intended for:
 *
 * - Action menus
 * - Contextual menus
 * - Project menus
 * - Account menus
 * - Navigation actions
 *
 * This component is intentionally separate from Select.
 *
 * Select:
 * - Form value selection
 * - Native <select>
 *
 * Dropdown:
 * - Actions and commands
 * - Menu items
 * -----------------------------------------------------------------------------
 */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "../../../lib/cn";

import "./Dropdown.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type DropdownItemVariant = "default" | "danger";

export interface DropdownItem {
  /**
   * Unique item identifier.
   */
  id: string;

  /**
   * Visible item content.
   */
  label: ReactNode;

  /**
   * Optional icon displayed before the label.
   */
  icon?: ReactNode;

  /**
   * Optional keyboard shortcut displayed on the right.
   */
  shortcut?: ReactNode;

  /**
   * Visual item variant.
   *
   * @default default
   */
  variant?: DropdownItemVariant;

  /**
   * Disables the item.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Called when the item is selected.
   */
  onSelect?: () => void;
}

export interface DropdownProps {
  /**
   * Element used to open the dropdown.
   */
  trigger?: ReactNode;

  /**
   * Menu items.
   */
  items?: DropdownItem[];

  /**
   * Optional custom menu content.
   *
   * When provided, it is rendered instead of `items`.
   */
  children?: ReactNode;

  /**
   * Dropdown alignment.
   *
   * @default start
   */
  align?: "start" | "end";

  /**
   * Dropdown width.
   *
   * @default auto
   */
  width?: "auto" | "sm" | "md" | "lg";

  /**
   * Controls the dropdown externally.
   */
  open?: boolean;

  /**
   * Called when the dropdown open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Accessible label for the trigger when the trigger itself does not
   * provide an accessible name.
   */
  ariaLabel?: string;

  /**
   * Additional class applied to the root element.
   */
  className?: string;
}

export interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * -----------------------------------------------------------------------------
 * Dropdown Trigger
 * -----------------------------------------------------------------------------
 */

export function DropdownTrigger({
  children,
  className,
  type = "button",
  ...props
}: DropdownTriggerProps) {
  return (
    <button
      type={type}
      className={cn("brika-dropdown__trigger", className)}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Dropdown({
  trigger,
  items,
  children,
  align = "start",
  width = "auto",
  open: controlledOpen,
  onOpenChange,
  ariaLabel = "Open menu",
  className,
}: DropdownProps) {
  const generatedId = useId();

  const menuId = `brika-dropdown-${generatedId}`;

  const rootRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;

  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value);
    }

    onOpenChange?.(value);
  };

  /**
   * -------------------------------------------------------------------------
   * Close when clicking outside.
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && rootRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  /**
   * -------------------------------------------------------------------------
   * Close on Escape.
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();

        setOpen(false);

        requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  /**
   * -------------------------------------------------------------------------
   * Focus first available menu item when opened.
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    requestAnimationFrame(() => {
      const firstItem = menuRef.current?.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      );

      firstItem?.focus();
    });
  }, [isOpen]);

  /**
   * -------------------------------------------------------------------------
   * Trigger keyboard interaction.
   * -------------------------------------------------------------------------
   */

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      setOpen(true);
    }

    if (event.key === "Escape") {
      event.preventDefault();

      setOpen(false);
    }
  };

  /**
   * -------------------------------------------------------------------------
   * Menu keyboard navigation.
   * -------------------------------------------------------------------------
   */

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const menuItems = Array.from(
      menu.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ),
    );

    const currentIndex = menuItems.indexOf(
      document.activeElement as HTMLElement,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();

      const nextIndex =
        currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;

      menuItems[nextIndex]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;

      menuItems[previousIndex]?.focus();
    }

    if (event.key === "Home") {
      event.preventDefault();

      menuItems[0]?.focus();
    }

    if (event.key === "End") {
      event.preventDefault();

      menuItems[menuItems.length - 1]?.focus();
    }

    if (event.key === "Escape") {
      event.preventDefault();

      setOpen(false);

      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  };

  /**
   * -------------------------------------------------------------------------
   * Item selection.
   * -------------------------------------------------------------------------
   */

  const handleItemSelect = (item: DropdownItem) => {
    if (item.disabled) {
      return;
    }

    item.onSelect?.();

    setOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <div
      ref={rootRef}
      className={cn("brika-dropdown", `brika-dropdown--${align}`, className)}
    >
      <button
        ref={triggerRef}
        type="button"
        className="brika-dropdown__trigger"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => {
          setOpen(!isOpen);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}

        <span
          className={cn(
            "brika-dropdown__trigger-icon",
            isOpen && "brika-dropdown__trigger-icon--open",
          )}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          className={cn(
            "brika-dropdown__menu",
            `brika-dropdown__menu--${width}`,
          )}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
        >
          {items
            ? items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className={cn(
                    "brika-dropdown__item",
                    item.variant === "danger" && "brika-dropdown__item--danger",
                    item.disabled && "brika-dropdown__item--disabled",
                  )}
                  aria-disabled={item.disabled || undefined}
                  disabled={item.disabled}
                  onClick={() => {
                    handleItemSelect(item);
                  }}
                >
                  {item.icon && (
                    <span
                      className="brika-dropdown__item-icon"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  )}

                  <span className="brika-dropdown__item-label">
                    {item.label}
                  </span>

                  {item.shortcut && (
                    <span className="brika-dropdown__item-shortcut">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              ))
            : children}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
