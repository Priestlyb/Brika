/**
 * -----------------------------------------------------------------------------
 * File: src/theme/typography.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Typography system for the Brika application.
 *
 * Primary typeface:
 *
 *     Inter
 *
 * Font assets:
 *
 *     assets/fonts/Inter-Regular.ttf
 *     assets/fonts/Inter-Medium.ttf
 *     assets/fonts/Inter-SemiBold.ttf
 *     assets/fonts/Inter-Bold.ttf
 *
 * Font weights:
 *
 *     400 — Regular
 *     500 — Medium
 *     600 — SemiBold
 *     700 — Bold
 *
 * Brika uses static Inter font files rather than the variable-font build.
 *
 * Typography is intentionally compact, precise, and architectural to support
 * Brika's product interface, project management surfaces, and 3D workflow.
 * -----------------------------------------------------------------------------
 */

import type { TextStyle } from "react-native";

/**
 * -----------------------------------------------------------------------------
 * Font Families
 * -----------------------------------------------------------------------------
 */

export const fontFamily = {
  inter: "Inter",
} as const;

/**
 * -----------------------------------------------------------------------------
 * Typography Style
 * -----------------------------------------------------------------------------
 *
 * React Native-compatible typography token.
 *
 * Keeping the token compatible with TextStyle means typography tokens can be
 * passed directly to:
 *
 *     <Text style={typography.body} />
 *
 *     StyleSheet.create(...)
 *
 *     Expo Router tabBarLabelStyle
 */
export type TypographyStyle = Pick<
  TextStyle,
  | "fontFamily"
  | "fontSize"
  | "lineHeight"
  | "letterSpacing"
  | "fontWeight"
>;

/**
 * -----------------------------------------------------------------------------
 * Brika Typography Scale
 * -----------------------------------------------------------------------------
 */

export const typography = {
  /*
   * Display
   *
   * Used for major page introductions and high-level product surfaces.
   */
  display: {
    fontFamily: fontFamily.inter,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1.2,
    fontWeight: "700",
  },

  /*
   * Headings
   */
  h1: {
    fontFamily: fontFamily.inter,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.8,
    fontWeight: "700",
  },

  h2: {
    fontFamily: fontFamily.inter,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
    fontWeight: "600",
  },

  h3: {
    fontFamily: fontFamily.inter,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
    fontWeight: "600",
  },

  /*
   * Title
   *
   * Used for component-level titles, cards, panels, and compact sections.
   */
  title: {
    fontFamily: fontFamily.inter,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
  },

  /*
   * Body
   */
  body: {
    fontFamily: fontFamily.inter,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },

  bodyMedium: {
    fontFamily: fontFamily.inter,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },

  /*
   * Small Body
   */
  bodySmall: {
    fontFamily: fontFamily.inter,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },

  bodySmallMedium: {
    fontFamily: fontFamily.inter,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },

  /*
   * Caption
   */
  caption: {
    fontFamily: fontFamily.inter,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
  },

  captionMedium: {
    fontFamily: fontFamily.inter,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },

  /*
   * Buttons
   */
  button: {
    fontFamily: fontFamily.inter,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
} as const satisfies Record<string, TypographyStyle>;

/**
 * Complete Brika typography-system type.
 */
export type Typography = typeof typography;

/**
 * Available typography token names.
 */
export type TypographyToken = keyof Typography;