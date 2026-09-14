/**
 * -----------------------------------------------------------------------------
 * File: src/constants/theme/index.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Central public entry point for the Brika theme system.
 *
 * All application theme imports should preferably come through this file.
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * Design Tokens
 * -----------------------------------------------------------------------------
 */

export {
    colors,
} from "./colors";

export {
    fontFamily,
    typography,
} from "./typography";

export {
    spacing,
} from "./spacing";

export {
    radius,
} from "./radius";

export {
    breakpoints,
} from "./breakpoints";

export {
    motion,
    motionDuration,
    motionEasing,
} from "./motion";

/**
 * -----------------------------------------------------------------------------
 * Theme Provider
 * -----------------------------------------------------------------------------
 */

export {
    ThemeProvider,
} from "./ThemeProvider";

export type {
    ThemeProviderProps,
} from "./ThemeProvider";

/**
 * -----------------------------------------------------------------------------
 * Theme Context
 * -----------------------------------------------------------------------------
 */

export {
    ThemeContext,
    useTheme,
} from "./ThemeContext";

export type {
    ThemeContextValue,
    ThemeMode,
    ResolvedTheme,
} from "./ThemeContext";

/**
 * -----------------------------------------------------------------------------
 * Theme Definitions
 * -----------------------------------------------------------------------------
 */

export {
    lightTheme,
} from "./themes/light";

export {
    darkTheme,
} from "./themes/dark";

export type {
    LightTheme,
} from "./themes/light";

export type {
    DarkTheme,
} from "./themes/dark";

/**
 * -----------------------------------------------------------------------------
 * Theme Persistence
 * -----------------------------------------------------------------------------
 */

export {
    THEME_STORAGE_KEY,
    getStoredTheme,
    saveTheme,
    clearStoredTheme,
} from "./theme-storage";

/**
 * -----------------------------------------------------------------------------
 * System Theme
 * -----------------------------------------------------------------------------
 */

export {
    getSystemTheme,
    isSystemDark,
    subscribeToSystemTheme,
} from "./system-theme";

/**
 * -----------------------------------------------------------------------------
 * Design Token Types
 * -----------------------------------------------------------------------------
 */

export type {
    Colors,
} from "./colors";

export type {
    Typography,
    TypographyToken,
    TypographyStyle,
} from "./typography";

export type {
    Spacing,
    SpacingToken,
} from "./spacing";

export type {
    Radius,
    RadiusToken,
} from "./radius";

export type {
    Breakpoints,
    Breakpoint,
} from "./breakpoints";

export type {
    Motion,
    MotionDuration,
    MotionEasing,
} from "./motion";

export {
    shadows,
} from "./shadows";

/**
 * -----------------------------------------------------------------------------
 * Shared Theme Types
 * -----------------------------------------------------------------------------
 */

export type {
    CSSColor,
    CSSDuration,
    CSSEasing,
    CSSSize,
    FontWeight,
} from "./types";