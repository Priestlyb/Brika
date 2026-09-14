/**
 * -----------------------------------------------------------------------------
 * File: src/theme/radius.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Central corner-radius scale for the Brika application.
 *
 * The radius system provides a consistent visual language across:
 *
 * - Buttons
 * - Inputs
 * - Cards
 * - Panels
 * - Modals
 * - Dropdowns
 * - Badges
 * - Avatars
 * - 3D viewer controls
 *
 * Brika uses restrained corner radii to maintain a clean, architectural
 * aesthetic without making the interface feel overly rounded.
 * -----------------------------------------------------------------------------
 */

import type { CSSSize } from "./types";

/**
 * -----------------------------------------------------------------------------
 * Brika Radius Scale
 * -----------------------------------------------------------------------------
 */
export const radius = {
    none: "0px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    xxl: "24px",
    pill: "999px",
} as const satisfies Record<
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "pill",
    CSSSize
>;

/**
 * Complete Brika radius-system type.
 */
export type Radius = typeof radius;

/**
 * Available radius token names.
 */
export type RadiusToken = keyof Radius;