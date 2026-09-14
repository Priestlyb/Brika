/**
 * -----------------------------------------------------------------------------
 * File: src/constants/theme/colors.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Central color system for the Brika application.
 *
 * The palette is intentionally restrained and architectural:
 *
 * - Charcoal provides the primary visual foundation.
 * - Refined gold is the Brika brand accent.
 * - Warm ivory and stone create the primary light surfaces.
 * - Neutral borders provide structure without excessive contrast.
 * - Semantic colors communicate application state.
 * - Viewer colors are optimized for the Brika 3D environment.
 *
 * Brand colors should remain stable across the application.
 * -----------------------------------------------------------------------------
 */

import type { CSSColor } from "./types";

/**
 * -----------------------------------------------------------------------------
 * Brand Colors
 * -----------------------------------------------------------------------------
 *
 * Core Brika identity colors.
 *
 * These values should not be changed casually because they are part of the
 * visual identity of the Brika brand.
 */
const brand = {
    primary: "#171717",       // Architectural charcoal
    accent: "#C9A227",        // Refined gold
    accentDark: "#A98416",    // Deep gold
    accentLight: "#F5EAC5",   // Soft champagne
} satisfies Record<
    "primary" | "accent" | "accentDark" | "accentLight",
    CSSColor
>;

/**
 * -----------------------------------------------------------------------------
 * Backgrounds
 * -----------------------------------------------------------------------------
 *
 * Application-level surfaces and background colors.
 */
const background = {
    primary: "#FAF9F6",       // Warm ivory
    secondary: "#F3F1EB",     // Warm stone
    surface: "#FFFFFF",

    dark: "#101010",
    darkSurface: "#181818",
} satisfies Record<
    "primary" | "secondary" | "surface" | "dark" | "darkSurface",
    CSSColor
>;

/**
 * -----------------------------------------------------------------------------
 * Text
 * -----------------------------------------------------------------------------
 *
 * Text hierarchy for light and dark surfaces.
 */
const text = {
    primary: "#171717",
    secondary: "#5F5B52",
    tertiary: "#8A857A",
    inverse: "#FFFFFF",
    muted: "#A6A197",
} satisfies Record<
    "primary" | "secondary" | "tertiary" | "inverse" | "muted",
    CSSColor
>;

/**
 * -----------------------------------------------------------------------------
 * Borders
 * -----------------------------------------------------------------------------
 *
 * Border hierarchy used for cards, inputs, dividers, panels, and other
 * structural UI elements.
 */
const border = {
    light: "#E8E4DA",
    medium: "#D6D0C3",
    dark: "#30302D",
} satisfies Record<
    "light" | "medium" | "dark",
    CSSColor
>;

/**
 * -----------------------------------------------------------------------------
 * Semantic States
 * -----------------------------------------------------------------------------
 *
 * Colors communicate application state independently from the brand palette.
 *
 * Each semantic state has:
 *
 * - foreground color
 * - background color
 */
const status = {
    success: "#3F7D58",
    successBackground: "#E5F0E8",

    warning: "#B7791F",
    warningBackground: "#F7EEDC",

    error: "#B94A48",
    errorBackground: "#F7E5E4",

    info: "#527A8C",
    infoBackground: "#E7EFF2",
} satisfies Record<
    | "success"
    | "successBackground"
    | "warning"
    | "warningBackground"
    | "error"
    | "errorBackground"
    | "info"
    | "infoBackground",
    CSSColor
>;

/**
 * -----------------------------------------------------------------------------
 * 3D Viewer
 * -----------------------------------------------------------------------------
 *
 * Dedicated palette for Brika's 3D architectural viewer.
 *
 * The viewer uses a darker environment to provide strong contrast against
 * architectural geometry and model materials.
 */
const viewer = {
    background: "#0D0D0D",
    surface: "#171717",
    surfaceElevated: "#222222",
    grid: "#34322D",
    text: "#FFFFFF",
    textMuted: "#A6A197",
} satisfies Record<
    | "background"
    | "surface"
    | "surfaceElevated"
    | "grid"
    | "text"
    | "textMuted",
    CSSColor
>;

/**
 * -----------------------------------------------------------------------------
 * Common
 * -----------------------------------------------------------------------------
 */
const common = {
    transparent: "transparent",
} satisfies Record<"transparent", CSSColor>;

/**
 * -----------------------------------------------------------------------------
 * Brika Color System
 * -----------------------------------------------------------------------------
 */
export const colors = {
    brand,
    background,
    text,
    border,
    status,
    viewer,
    ...common,
} as const;

/**
 * Complete Brika color-system type.
 */
export type Colors = typeof colors;