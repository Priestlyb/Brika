/**
 * -----------------------------------------------------------------------------
 * File: src/constants/theme/themes/dark.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Dark theme token definitions.
 *
 * This file defines the semantic color tokens used by the Brika application
 * when dark mode is active.
 *
 * Brand colors remain stable across themes.
 *
 * The 3D viewer retains its dedicated dark environment and therefore uses the
 * same viewer palette in both light and dark application themes.
 * -----------------------------------------------------------------------------
 */

import {
    colors,
} from "../colors";

import type {
    CSSColor,
} from "../types";

/**
 * -----------------------------------------------------------------------------
 * Dark Theme
 * -----------------------------------------------------------------------------
 *
 * Semantic application tokens for dark mode.
 *
 * The palette is intentionally restrained:
 *
 * - Near-black surfaces provide the foundation.
 * - Slightly elevated charcoal surfaces establish hierarchy.
 * - Warm neutral text preserves Brika's architectural character.
 * - Gold remains the primary brand accent.
 * - Borders remain subtle rather than pure white.
 */
export const darkTheme = {
    /**
     * -------------------------------------------------------------------------
     * Brand
     * -------------------------------------------------------------------------
     *
     * Brand colors remain stable across themes.
     */
    brand: {
        primary:
            colors.brand.primary,

        accent:
            colors.brand.accent,

        accentDark:
            colors.brand.accentDark,

        accentLight:
            colors.brand.accentLight,
    },

    /**
     * -------------------------------------------------------------------------
     * Backgrounds
     * -------------------------------------------------------------------------
     */
    background: {
        primary:
            "#101010",

        secondary:
            "#181818",

        surface:
            "#202020",
    },

    /**
     * -------------------------------------------------------------------------
     * Text
     * -------------------------------------------------------------------------
     */
    text: {
        primary:
            "#F5F3EE",

        secondary:
            "#C2BEB5",

        tertiary:
            "#969188",

        inverse:
            "#171717",

        muted:
            "#77736B",
    },

    /**
     * -------------------------------------------------------------------------
     * Borders
     * -------------------------------------------------------------------------
     */
    border: {
        light:
            "#2A2926",

        medium:
            "#3A3834",

        dark:
            "#55514A",
    },

    /**
     * -------------------------------------------------------------------------
     * Semantic States
     * -------------------------------------------------------------------------
     *
     * Status foreground colors are adjusted for dark surfaces while retaining
     * the same semantic meaning.
     */
    status: {
        success:
            "#6FAF86",

        successBackground:
            "#1B3023",

        warning:
            "#D4A34A",

        warningBackground:
            "#332A18",

        error:
            "#D47773",

        errorBackground:
            "#351F1E",

        info:
            "#7FA6B8",

        infoBackground:
            "#1E2B31",
    },

    /**
     * -------------------------------------------------------------------------
     * Viewer
     * -------------------------------------------------------------------------
     *
     * The 3D viewer deliberately keeps its existing dark palette.
     */
    viewer: {
        background:
            colors.viewer.background,

        surface:
            colors.viewer.surface,

        surfaceElevated:
            colors.viewer.surfaceElevated,

        grid:
            colors.viewer.grid,

        text:
            colors.viewer.text,

        textMuted:
            colors.viewer.textMuted,
    },

    /**
     * -------------------------------------------------------------------------
     * Common
     * -------------------------------------------------------------------------
     */
    common: {
        transparent:
            colors.transparent,
    },
} satisfies {
    brand: Record<
        | "primary"
        | "accent"
        | "accentDark"
        | "accentLight",
        CSSColor
    >;

    background: Record<
        | "primary"
        | "secondary"
        | "surface",
        CSSColor
    >;

    text: Record<
        | "primary"
        | "secondary"
        | "tertiary"
        | "inverse"
        | "muted",
        CSSColor
    >;

    border: Record<
        | "light"
        | "medium"
        | "dark",
        CSSColor
    >;

    status: Record<
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

    viewer: Record<
        | "background"
        | "surface"
        | "surfaceElevated"
        | "grid"
        | "text"
        | "textMuted",
        CSSColor
    >;

    common: Record<
        "transparent",
        CSSColor
    >;
};

/**
 * -----------------------------------------------------------------------------
 * Complete Dark Theme Type
 * -----------------------------------------------------------------------------
 */

export type DarkTheme =
    typeof darkTheme;