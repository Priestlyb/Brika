/**
 * -----------------------------------------------------------------------------
 * File: src/components/layout/Container/Container.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Responsive content container.
 *
 * Provides:
 *
 * - Consistent maximum content width
 * - Responsive horizontal padding
 * - Centered page content
 * - Optional full-width behavior
 *
 * The Container is intentionally layout-focused. It should not define
 * application-specific spacing, colors, typography, or component styling.
 * -----------------------------------------------------------------------------
 */

import type {
    HTMLAttributes,
    ReactNode,
} from "react";

import { cn } from "../../lib/cn";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface ContainerProps
    extends HTMLAttributes<HTMLDivElement> {
    /**
     * Content rendered inside the container.
     */
    children: ReactNode;

    /**
     * Maximum width variant.
     *
     * - sm: Compact content
     * - md: Standard content
     * - lg: Wide content
     * - xl: Large application content
     * - full: No maximum width
     *
     * @default xl
     */
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Container({
    children,
    size = "xl",
    className,
    ...props
}: ContainerProps) {
    return (
        <div
            className={cn(
                "brika-container",
                `brika-container--${size}`,
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export default Container;