/**
 * -----------------------------------------------------------------------------
 * File: src/theme/types.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Shared TypeScript types for the Brika theme and design-token system.
 *
 * This file defines the contracts used by:
 *
 * - colors.ts
 * - typography.ts
 * - spacing.ts
 * - radii.ts
 * - shadows.ts
 * - breakpoints.ts
 * - motion.ts
 * - index.ts
 *
 * Design tokens should be defined centrally and consumed throughout the
 * application rather than introducing arbitrary visual values inside
 * individual components.
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * Primitive Types
 * -----------------------------------------------------------------------------
 */

/**
 * A CSS-compatible size value.
 *
 * Examples:
 * - "4px"
 * - "0.5rem"
 * - "1rem"
 * - "100%"
 * - "1fr"
 */
export type CSSSize = string;

/**
 * A CSS-compatible color value.
 *
 * Examples:
 * - "#111111"
 * - "rgb(17, 17, 17)"
 * - "var(--color-brand-primary)"
 */
export type CSSColor = string;

/**
 * A CSS-compatible duration value.
 *
 * Examples:
 * - "100ms"
 * - "200ms"
 * - "0.3s"
 */
export type CSSDuration = string;

/**
 * A CSS-compatible easing function.
 *
 * Examples:
 * - "ease"
 * - "ease-in-out"
 * - "cubic-bezier(0.4, 0, 0.2, 1)"
 */
export type CSSEasing = string;


/**
 * -----------------------------------------------------------------------------
 * Color Types
 * -----------------------------------------------------------------------------
 */

/**
 * Semantic color roles used throughout the application.
 *
 * These names describe the purpose of a color rather than the visual color
 * itself. This allows the underlying palette to evolve without requiring
 * components to change.
 */
export type ColorRole =
    | "primary"
    | "secondary"
    | "accent"
    | "accentDark"
    | "accentLight"
    | "background"
    | "surface"
    | "surfaceMuted"
    | "border"
    | "borderStrong"
    | "text"
    | "textMuted"
    | "textSubtle"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "white"
    | "black";

/**
 * A collection of named design-system colors.
 */
export type ColorTokens = Record<ColorRole, CSSColor>;


/**
 * -----------------------------------------------------------------------------
 * Typography Types
 * -----------------------------------------------------------------------------
 */

/**
 * Supported font weights.
 */
export type FontWeight =
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800;

/**
 * Typography size tokens.
 */
export type FontSizeToken =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";

/**
 * Typography style definition.
 */
export interface TypographyToken {
    fontSize: CSSSize;
    lineHeight: CSSSize | number;
    fontWeight: FontWeight;
    letterSpacing?: CSSSize;
}

/**
 * Collection of typography tokens.
 */
export type TypographyTokens = Record<
    FontSizeToken,
    TypographyToken
>;


/**
 * -----------------------------------------------------------------------------
 * Spacing Types
 * -----------------------------------------------------------------------------
 */

/**
 * Standard spacing scale.
 */
export type SpacingToken =
    | "0"
    | "px"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "8"
    | "10"
    | "12"
    | "16"
    | "20"
    | "24"
    | "32"
    | "40"
    | "48"
    | "64"
    | "80"
    | "96";

/**
 * Collection of spacing tokens.
 */
export type SpacingTokens = Record<SpacingToken, CSSSize>;


/**
 * -----------------------------------------------------------------------------
 * Radius Types
 * -----------------------------------------------------------------------------
 */

/**
 * Border-radius tokens.
 */
export type RadiusToken =
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "full";

/**
 * Collection of radius tokens.
 */
export type RadiusTokens = Record<RadiusToken, CSSSize>;


/**
 * -----------------------------------------------------------------------------
 * Shadow Types
 * -----------------------------------------------------------------------------
 */

/**
 * Supported elevation levels.
 */
export type ShadowToken =
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl";

/**
 * Collection of shadow tokens.
 */
export type ShadowTokens = Record<ShadowToken, string>;


/**
 * -----------------------------------------------------------------------------
 * Breakpoint Types
 * -----------------------------------------------------------------------------
 */

/**
 * Responsive breakpoint tokens.
 */
export type BreakpointToken =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl";

/**
 * Collection of responsive breakpoints.
 */
export type BreakpointTokens = Record<BreakpointToken, CSSSize>;


/**
 * -----------------------------------------------------------------------------
 * Motion Types
 * -----------------------------------------------------------------------------
 */

/**
 * Animation duration tokens.
 */
export type MotionDurationToken =
    | "instant"
    | "fast"
    | "normal"
    | "slow";

/**
 * Animation easing tokens.
 */
export type MotionEasingToken =
    | "linear"
    | "standard"
    | "emphasized"
    | "decelerated"
    | "accelerated";

/**
 * Motion token collection.
 */
export interface MotionTokens {
    duration: Record<MotionDurationToken, CSSDuration>;
    easing: Record<MotionEasingToken, CSSEasing>;
}


/**
 * -----------------------------------------------------------------------------
 * Theme Type
 * -----------------------------------------------------------------------------
 */

/**
 * Complete Brika design-system theme.
 *
 * Every design-token category is represented here so the final theme can be
 * strongly typed and consumed consistently across the application.
 */
export interface BrikaTheme {
    colors: ColorTokens;
    typography: TypographyTokens;
    spacing: SpacingTokens;
    radii: RadiusTokens;
    shadows: ShadowTokens;
    breakpoints: BreakpointTokens;
    motion: MotionTokens;
}


/**
 * -----------------------------------------------------------------------------
 * Theme Mode
 * -----------------------------------------------------------------------------
 */

/**
 * Supported application theme modes.
 */
export type ThemeMode =
    | "light"
    | "dark"
    | "system";