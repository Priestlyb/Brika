/**
 * -----------------------------------------------------------------------------
 * File: src/theme/theme-storage.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Theme persistence utilities.
 *
 * Responsibilities:
 *
 * - Read the user's saved theme preference.
 * - Save the user's theme preference.
 * - Remove the saved theme preference.
 *
 * This module intentionally does not:
 *
 * - Detect the system theme.
 * - Resolve "system" into light or dark.
 * - Manipulate the DOM.
 * - Manage React state.
 *
 * Those responsibilities belong to:
 *
 * - system-theme.ts
 * - ThemeProvider.tsx
 *
 * -----------------------------------------------------------------------------
 */

import type {
    ThemeMode,
} from "./ThemeContext";

/**
 * -----------------------------------------------------------------------------
 * Storage Key
 * -----------------------------------------------------------------------------
 *
 * Keep this key stable once released because changing it would cause existing
 * users to lose their saved theme preference.
 */
export const THEME_STORAGE_KEY =
    "brika-theme";

/**
 * -----------------------------------------------------------------------------
 * Storage Availability
 * -----------------------------------------------------------------------------
 *
 * Browser storage is not always available:
 *
 * - During server-side rendering.
 * - In restricted browser environments.
 * - When storage access is disabled.
 *
 * All storage operations therefore fail safely.
 */
const isStorageAvailable = (): boolean => {
    if (
        typeof window === "undefined" ||
        !window.localStorage
    ) {
        return false;
    }

    return true;
};

/**
 * -----------------------------------------------------------------------------
 * Read Theme
 * -----------------------------------------------------------------------------
 *
 * Returns the persisted theme preference.
 *
 * Invalid or missing values return null.
 */
export const getStoredTheme = (): ThemeMode | null => {
    if (!isStorageAvailable()) {
        return null;
    }

    try {
        const storedTheme =
            window.localStorage.getItem(
                THEME_STORAGE_KEY,
            );

        if (
            storedTheme === "light" ||
            storedTheme === "dark" ||
            storedTheme === "system"
        ) {
            return storedTheme;
        }

        return null;
    } catch {
        return null;
    }
};

/**
 * -----------------------------------------------------------------------------
 * Save Theme
 * -----------------------------------------------------------------------------
 *
 * Persists the user's selected theme preference.
 */
export const saveTheme = (
    theme: ThemeMode,
): void => {
    if (!isStorageAvailable()) {
        return;
    }

    try {
        window.localStorage.setItem(
            THEME_STORAGE_KEY,
            theme,
        );
    } catch {
        /**
         * Storage can fail because of browser privacy settings, disabled
         * storage, quota restrictions, or other runtime limitations.
         *
         * Theme functionality should continue to work even when persistence
         * is unavailable.
         */
    }
};

/**
 * -----------------------------------------------------------------------------
 * Remove Stored Theme
 * -----------------------------------------------------------------------------
 *
 * Removes the user's saved theme preference.
 *
 * After removal, the application can fall back to its default theme behavior.
 */
export const clearStoredTheme = (): void => {
    if (!isStorageAvailable()) {
        return;
    }

    try {
        window.localStorage.removeItem(
            THEME_STORAGE_KEY,
        );
    } catch {
        /**
         * Ignore storage failures.
         */
    }
};