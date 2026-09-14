/**
 * -----------------------------------------------------------------------------
 * File: src/theme/system-theme.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * System theme detection utilities.
 *
 * Responsibilities:
 *
 * - Detect the operating system's preferred color scheme.
 * - Determine whether dark mode is preferred.
 * - Subscribe to operating system theme changes.
 *
 * This module intentionally does not:
 *
 * - Manage React state.
 * - Persist theme preferences.
 * - Manipulate the DOM.
 * - Decide whether the application should use system mode.
 *
 * Those responsibilities belong to:
 *
 * - ThemeProvider.tsx
 * - theme-storage.ts
 *
 * -----------------------------------------------------------------------------
 */

import type {
    ResolvedTheme,
} from "./ThemeContext";

/**
 * -----------------------------------------------------------------------------
 * Media Query
 * -----------------------------------------------------------------------------
 */

const SYSTEM_THEME_QUERY =
    "(prefers-color-scheme: dark)";

/**
 * -----------------------------------------------------------------------------
 * Browser Environment
 * -----------------------------------------------------------------------------
 *
 * Checks whether the current environment supports matchMedia.
 *
 * This keeps the module safe during:
 *
 * - Server-side rendering.
 * - Build-time execution.
 * - Test environments without a browser.
 */
const canUseMatchMedia = (): boolean => {
    return (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function"
    );
};

/**
 * -----------------------------------------------------------------------------
 * Get System Theme
 * -----------------------------------------------------------------------------
 *
 * Returns the operating system's preferred theme.
 *
 * When system preference detection is unavailable, light is used as the safe
 * fallback.
 */
export const getSystemTheme = (): ResolvedTheme => {
    if (!canUseMatchMedia()) {
        return "light";
    }

    return window.matchMedia(
        SYSTEM_THEME_QUERY,
    ).matches
        ? "dark"
        : "light";
};

/**
 * -----------------------------------------------------------------------------
 * Is System Dark
 * -----------------------------------------------------------------------------
 *
 * Convenience helper for consumers that only need to know whether the system
 * currently prefers dark mode.
 */
export const isSystemDark = (): boolean => {
    return getSystemTheme() === "dark";
};

/**
 * -----------------------------------------------------------------------------
 * Subscribe To System Theme
 * -----------------------------------------------------------------------------
 *
 * Subscribes to operating system theme changes.
 *
 * Returns an unsubscribe function.
 *
 * Example:
 *
 * const unsubscribe = subscribeToSystemTheme(
 *     (theme) => {
 *         console.log(theme);
 *     },
 * );
 *
 * unsubscribe();
 */
export const subscribeToSystemTheme = (
    callback: (
        theme: ResolvedTheme,
    ) => void,
): (() => void) => {
    if (!canUseMatchMedia()) {
        return () => undefined;
    }

    const mediaQuery =
        window.matchMedia(
            SYSTEM_THEME_QUERY,
        );

    const handleChange = (
        event: MediaQueryListEvent,
    ): void => {
        callback(
            event.matches
                ? "dark"
                : "light",
        );
    };

    /**
     * Modern browsers.
     */
    mediaQuery.addEventListener(
        "change",
        handleChange,
    );

    return () => {
        mediaQuery.removeEventListener(
            "change",
            handleChange,
        );
    };
};