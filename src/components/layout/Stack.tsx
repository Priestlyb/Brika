/**
 * -----------------------------------------------------------------------------
 * File: src/components/layout/Stack/Stack.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Flexible layout primitive for arranging content using CSS Flexbox.
 *
 * Stack supports:
 *
 * - Horizontal and vertical layouts
 * - Brika spacing tokens
 * - Alignment
 * - Justification
 * - Wrapping
 * - Native HTML div attributes
 *
 * The component intentionally contains no visual styling beyond layout.
 * -----------------------------------------------------------------------------
 */

import type {
    HTMLAttributes,
    ReactNode,
} from "react";

import { cn } from "../../lib/cn";

import "./Stack.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type StackDirection =
    | "row"
    | "column";

export type StackAlign =
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "baseline";

export type StackJustify =
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly";

export type StackGap =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "xxxl"
    | "huge"
    | "massive"
    | "section";

export interface StackProps
    extends HTMLAttributes<HTMLDivElement> {
    /**
     * Content rendered inside the Stack.
     */
    children: ReactNode;

    /**
     * Direction of the stack.
     *
     * @default column
     */
    direction?: StackDirection;

    /**
     * Gap between child elements.
     *
     * Uses the Brika spacing scale.
     *
     * @default md
     */
    gap?: StackGap;

    /**
     * Cross-axis alignment.
     *
     * @default stretch
     */
    align?: StackAlign;

    /**
     * Main-axis justification.
     *
     * @default start
     */
    justify?: StackJustify;

    /**
     * Whether children are allowed to wrap.
     *
     * @default false
     */
    wrap?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Stack({
    children,
    direction = "column",
    gap = "md",
    align = "stretch",
    justify = "start",
    wrap = false,
    className,
    ...props
}: StackProps) {
    return (
        <div
            className={cn(
                "brika-stack",
                `brika-stack--${direction}`,
                `brika-stack--gap-${gap}`,
                `brika-stack--align-${align}`,
                `brika-stack--justify-${justify}`,
                wrap && "brika-stack--wrap",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export default Stack;