/**
 * -----------------------------------------------------------------------------
 * File: src/constants/theme/themes/light.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Light theme token definitions.
 *
 * This file maps Brika's foundational color palette into semantic application
 * tokens used by the UI.
 *
 * Brand colors remain stable across themes and are therefore not redefined
 * here.
 *
 * The 3D viewer also maintains its dedicated dark environment and is not
 * altered by the application light/dark theme.
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
 * Light Theme
 * -----------------------------------------------------------------------------
 *
 * Semantic tokens used by the application UI.
 *
 * Components should consume semantic tokens rather than referencing raw
 * colors directly.
 */
export const lightTheme = {
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
            colors.background.primary,

        secondary:
            colors.background.secondary,

        surface:
            colors.background.surface,
    },

    /**
     * -------------------------------------------------------------------------
     * Text
     * -------------------------------------------------------------------------
     */
    text: {
        primary:
            colors.text.primary,

        secondary:
            colors.text.secondary,

        tertiary:
            colors.text.tertiary,

        inverse:
            colors.text.inverse,

        muted:
            colors.text.muted,
    },

    /**
     * -------------------------------------------------------------------------
     * Borders
     * -------------------------------------------------------------------------
     */
    border: {
        light:
            colors.border.light,

        medium:
            colors.border.medium,

        dark:
            colors.border.dark,
    },

    /**
     * -------------------------------------------------------------------------
     * Semantic States
     * -------------------------------------------------------------------------
     */
    status: {
        success:
            colors.status.success,

        successBackground:
            colors.status.successBackground,

        warning:
            colors.status.warning,

        warningBackground:
            colors.status.warningBackground,

        error:
            colors.status.error,

        errorBackground:
            colors.status.errorBackground,

        info:
            colors.status.info,

        infoBackground:
            colors.status.infoBackground,
    },

    /**
     * -------------------------------------------------------------------------
     * Viewer
     * -------------------------------------------------------------------------
     *
     * The viewer intentionally retains its dedicated dark palette.
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
 * Complete Light Theme Type
 * -----------------------------------------------------------------------------
 */

export type LightTheme =
    typeof lightTheme;