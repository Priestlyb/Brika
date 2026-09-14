/**
 * -----------------------------------------------------------------------------
 * File: src/constants/theme/ThemeContext.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Theme context definitions and theme hook.
 *
 * Responsibilities:
 *
 * - Define available theme modes.
 * - Define the resolved application theme.
 * - Define the theme context contract.
 * - Provide access to theme state and controls.
 *
 * The actual semantic design tokens are defined in:
 *
 * - themes/light.ts
 * - themes/dark.ts
 *
 * -----------------------------------------------------------------------------
 */

import {
    createContext,
    useContext,
} from "react";

/**
 * -----------------------------------------------------------------------------
 * Theme Mode
 * -----------------------------------------------------------------------------
 */

export type ThemeMode =
    | "light"
    | "dark"
    | "system";

/**
 * -----------------------------------------------------------------------------
 * Resolved Theme
 * -----------------------------------------------------------------------------
 */

export type ResolvedTheme =
    | "light"
    | "dark";

/**
 * -----------------------------------------------------------------------------
 * Theme Context Value
 * -----------------------------------------------------------------------------
 */

export interface ThemeContextValue {
    /**
     * User's selected theme preference.
     */
    theme: ThemeMode;

    /**
     * Actual theme currently being rendered.
     *
     * This is never "system".
     */
    resolvedTheme: ResolvedTheme;

    /**
     * Change the user's theme preference.
     */
    setTheme: (
        theme: ThemeMode,
    ) => void;

    /**
     * Toggle between light and dark.
     *
     * When the current preference is "system", this switches to the opposite
     * of the currently resolved theme.
     */
    toggleTheme: () => void;
}

/**
 * -----------------------------------------------------------------------------
 * Theme Context
 * -----------------------------------------------------------------------------
 */

export const ThemeContext =
    createContext<
        ThemeContextValue | undefined
    >(undefined);

/**
 * -----------------------------------------------------------------------------
 * useTheme
 * -----------------------------------------------------------------------------
 *
 * Access the Brika theme context.
 *
 * This hook returns the theme state and controls.
 *
 * For semantic design tokens, use:
 *
 *     useBrikaTheme()
 *
 * -----------------------------------------------------------------------------
 */

export function useTheme(): ThemeContextValue {
    const context =
        useContext(ThemeContext);

    if (context === undefined) {
        throw new Error(
            "useTheme must be used within a ThemeProvider.",
        );
    }

    return context;
}