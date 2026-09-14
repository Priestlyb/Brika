/**
 * -----------------------------------------------------------------------------
 * File: src/components/layout/Divider/Divider.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Visual separator used to divide related areas of content.
 *
 * Supports:
 *
 * - Horizontal dividers
 * - Vertical dividers
 * - Brika border tokens
 * - Native HTML attributes
 * - Custom class names
 *
 * The component uses a semantic <hr> element for horizontal dividers and
 * role="separator" with aria-orientation for vertical dividers.
 * -----------------------------------------------------------------------------
 */

import type {
    HTMLAttributes,
} from "react";

import { cn } from "../../lib/cn";

import "./Divider.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type DividerOrientation =
    | "horizontal"
    | "vertical";

export type DividerTone =
    | "light"
    | "medium"
    | "dark";

export interface DividerProps
    extends HTMLAttributes<HTMLHRElement> {
    /**
     * Orientation of the divider.
     *
     * @default horizontal
     */
    orientation?: DividerOrientation;

    /**
     * Visual tone of the divider.
     *
     * @default light
     */
    tone?: DividerTone;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Divider({
    orientation = "horizontal",
    tone = "light",
    className,
    ...props
}: DividerProps) {
    return (
        <hr
            className={cn(
                "brika-divider",
                `brika-divider--${orientation}`,
                `brika-divider--${tone}`,
                className,
            )}
            aria-orientation={
                orientation === "vertical"
                    ? "vertical"
                    : undefined
            }
            {...props}
        />
    );
}

export default Divider;