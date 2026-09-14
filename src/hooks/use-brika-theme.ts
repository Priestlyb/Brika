/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/use-brika-theme.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Access the resolved semantic Brika theme.
 *
 * This hook converts the active ThemeContext mode into the corresponding
 * semantic design-token object.
 * -----------------------------------------------------------------------------
 */

import {
    darkTheme,
    lightTheme,
    useTheme,
} from "@/constants/theme";

import type {
    DarkTheme,
} from "@/constants/theme/themes/dark";

import type {
    LightTheme,
} from "@/constants/theme/themes/light";

/**
 * -----------------------------------------------------------------------------
 * Brika Theme Type
 * -----------------------------------------------------------------------------
 */

export type BrikaTheme =
    | LightTheme
    | DarkTheme;

/**
 * -----------------------------------------------------------------------------
 * Hook
 * -----------------------------------------------------------------------------
 */

export function useBrikaTheme(): BrikaTheme {
    const {
        resolvedTheme,
    } = useTheme();

    return resolvedTheme === "dark"
        ? darkTheme
        : lightTheme;
}