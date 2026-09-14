/**
 * -----------------------------------------------------------------------------
 * File: src/theme/breakpoints.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Responsive breakpoint system for the Brika application.
 *
 * The breakpoint scale is intentionally compact and covers the primary
 * responsive layouts used across Brika:
 *
 * - Mobile
 * - Small tablets / large phones
 * - Tablets / small laptops
 * - Desktop
 * - Large desktop displays
 *
 * Breakpoints should be used consistently across the application rather than
 * introducing arbitrary media-query values inside individual components.
 * -----------------------------------------------------------------------------
 */

import type { CSSSize } from "./types";

/**
 * -----------------------------------------------------------------------------
 * Brika Breakpoint Scale
 * -----------------------------------------------------------------------------
 *
 * Values represent the minimum viewport width at which each breakpoint becomes
 * active.
 *
 * These values follow a mobile-first responsive approach.
 */
export const breakpoints = {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    xxl: "1536px",
} as const satisfies Record<
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl",
    CSSSize
>;

/**
 * Complete Brika breakpoint-system type.
 */
export type Breakpoints = typeof breakpoints;

/**
 * Available breakpoint token names.
 */
export type Breakpoint = keyof Breakpoints;