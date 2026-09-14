/**
 * -----------------------------------------------------------------------------
 * File: src/components/themed-text.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Theme-aware typography component for Expo / React Native.
 *
 * Responsibilities:
 *
 * - Render text using Brika typography tokens.
 * - Resolve semantic text colors from the active Brika theme.
 * - Support light, dark, and system themes.
 * - Preserve compatibility with the existing Expo starter text API.
 *
 * Typography is defined in:
 *
 * - constants/theme/typography.ts
 *
 * Colors are defined in:
 *
 * - constants/theme/colors.ts
 *
 * Semantic themes are defined in:
 *
 * - constants/theme/themes/light.ts
 * - constants/theme/themes/dark.ts
 *
 * Theme resolution is handled by:
 *
 * - hooks/use-theme.ts
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { typography } from "@/constants/theme";

import { useTheme } from "@/hooks/use-theme";

/**
 * -----------------------------------------------------------------------------
 * Theme Color
 * -----------------------------------------------------------------------------
 *
 * Semantic colors available to Brika text components.
 */
export type ThemeColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverse"
  | "muted"
  | "accent";

/**
 * -----------------------------------------------------------------------------
 * Text Variant
 * -----------------------------------------------------------------------------
 *
 * These variants preserve the existing application API while mapping
 * directly onto the Brika typography system.
 */
export type ThemedTextType =
  | "default"
  | "title"
  | "small"
  | "smallBold"
  | "subtitle"
  | "link"
  | "linkPrimary"
  | "button"
  | "code";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export type ThemedTextProps = TextProps & {
  /**
   * Brika typography variant.
   *
   * @default "default"
   */
  type?: ThemedTextType;

  /**
   * Semantic Brika text color.
   *
   * @default "primary"
   */
  themeColor?: ThemeColor;
};

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ThemedText({
  style,
  type = "default",
  themeColor = "primary",
  ...rest
}: ThemedTextProps) {
  /**
   * ---------------------------------------------------------------------------
   * Semantic Theme
   * ---------------------------------------------------------------------------
   *
   * useTheme() returns the resolved semantic Brika theme.
   *
   * Examples:
   *
   *     theme.text.primary
   *     theme.background.surface
   *     theme.brand.accent
   */
  const theme = useTheme();

  /**
   * ---------------------------------------------------------------------------
   * Resolve Text Color
   * ---------------------------------------------------------------------------
   */

  const textColor =
    themeColor === "accent" ? theme.brand.accent : theme.text[themeColor];

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <Text
      {...rest}
      style={[
        styles.base,

        {
          color: textColor,
        },

        type === "default" && styles.default,

        type === "title" && styles.title,

        type === "small" && styles.small,

        type === "smallBold" && styles.smallBold,

        type === "subtitle" && styles.subtitle,

        type === "link" && styles.link,

        type === "linkPrimary" && [
          styles.linkPrimary,
          {
            color: theme.brand.accent,
          },
        ],

        type === "button" && styles.button,

        type === "code" && styles.code,

        style,
      ]}
    />
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  /**
   * ---------------------------------------------------------------------------
   * Base
   * ---------------------------------------------------------------------------
   *
   * Inter is the primary Brika typeface.
   */
  base: {
    fontFamily: typography.body.fontFamily,

    fontSize: typography.body.fontSize,

    lineHeight: typography.body.lineHeight,

    fontWeight: "400",
  },

  /**
   * ---------------------------------------------------------------------------
   * Default
   * ---------------------------------------------------------------------------
   *
   * Standard application body text.
   */
  default: {
    fontFamily: typography.bodyMedium.fontFamily,

    fontSize: typography.bodyMedium.fontSize,

    lineHeight: typography.bodyMedium.lineHeight,

    fontWeight: "500",
  },

  /**
   * ---------------------------------------------------------------------------
   * Title
   * ---------------------------------------------------------------------------
   */
  title: {
    fontFamily: typography.title.fontFamily,

    fontSize: typography.title.fontSize,

    lineHeight: typography.title.lineHeight,

    fontWeight: "600",
  },

  /**
   * ---------------------------------------------------------------------------
   * Subtitle
   * ---------------------------------------------------------------------------
   *
   * Maps the legacy "subtitle" variant to Brika h2 typography.
   */
  subtitle: {
    fontFamily: typography.h2.fontFamily,

    fontSize: typography.h2.fontSize,

    lineHeight: typography.h2.lineHeight,

    letterSpacing: typography.h2.letterSpacing ?? 0,

    fontWeight: "600",
  },

  /**
   * ---------------------------------------------------------------------------
   * Small
   * ---------------------------------------------------------------------------
   */
  small: {
    fontFamily: typography.bodySmall.fontFamily,

    fontSize: typography.bodySmall.fontSize,

    lineHeight: typography.bodySmall.lineHeight,

    fontWeight: "400",
  },

  /**
   * ---------------------------------------------------------------------------
   * Small Bold
   * ---------------------------------------------------------------------------
   *
   * Uses Brika's medium small-body typography rather than introducing
   * another arbitrary font size.
   */
  smallBold: {
    fontFamily: typography.bodySmallMedium.fontFamily,

    fontSize: typography.bodySmallMedium.fontSize,

    lineHeight: typography.bodySmallMedium.lineHeight,

    fontWeight: "600",
  },

  /**
   * ---------------------------------------------------------------------------
   * Link
   * ---------------------------------------------------------------------------
   */
  link: {
    fontFamily: typography.bodySmallMedium.fontFamily,

    fontSize: typography.bodySmallMedium.fontSize,

    lineHeight: typography.bodySmallMedium.lineHeight,

    fontWeight: "500",

    textDecorationLine: "underline",
  },

  /**
   * ---------------------------------------------------------------------------
   * Primary Link
   * ---------------------------------------------------------------------------
   *
   * The actual color is applied dynamically from
   * theme.brand.accent.
   */
  linkPrimary: {
    fontFamily: typography.bodySmallMedium.fontFamily,

    fontSize: typography.bodySmallMedium.fontSize,

    lineHeight: typography.bodySmallMedium.lineHeight,

    fontWeight: "500",

    textDecorationLine: "underline",
  },

  /**
   * ---------------------------------------------------------------------------
   * Button
   * ---------------------------------------------------------------------------
   *
   * Uses Brika's dedicated button typography token.
   *
   * The button token currently defines:
   *
   * - fontFamily
   * - fontSize
   * - lineHeight
   * - fontWeight
   *
   * No letterSpacing is defined for this token.
   */
  button: {
    fontFamily: typography.button.fontFamily,

    fontSize: typography.button.fontSize,

    lineHeight: typography.button.lineHeight,

    fontWeight: "600",
  },

  /**
   * ---------------------------------------------------------------------------
   * Code
   * ---------------------------------------------------------------------------
   *
   * Brika's primary UI typeface is Inter, but code remains monospace because
   * code and technical values benefit from fixed-width characters.
   */
  code: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),

    fontSize: typography.caption.fontSize,

    lineHeight: typography.caption.lineHeight,

    fontWeight: Platform.select({
      android: "700",
      default: "500",
    }),
  },
});
