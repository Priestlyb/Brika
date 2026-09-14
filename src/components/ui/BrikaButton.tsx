/**

* ---
* File: src/components/ui/BrikaButton.tsx
* ---
* Brika Design System
*
* Theme-aware React Native button.
*
* Supports:
*
* * Primary, secondary, outline, ghost, and danger variants
* * Small, medium, and large sizes
* * Loading state
* * Disabled state
* * Full-width layout
* * Accessibility
* ---

*/

import React from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { radius, spacing } from "@/constants/theme";

import { useBrikaTheme } from "@/hooks/use-brika-theme";

import { BrikaText } from "./BrikaText";

/**

* ---
* Types
* ---

*/

export type BrikaButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type BrikaButtonSize = "sm" | "md" | "lg";

export interface BrikaButtonProps {
  /**
   * Button label.
   */
  title: string;

  /**
   * Called when the button is pressed.
   */
  onPress: () => void;

  /**
   * Visual button variant.
   *
   * @default primary
   */
  variant?: BrikaButtonVariant;

  /**
   * Button size.
   *
   * @default md
   */
  size?: BrikaButtonSize;

  /**
   * Displays a loading state and prevents interaction.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Disables the button.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Makes the button span the available width.
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Optional React Native button style.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Accessibility label.
   */
  accessibilityLabel?: string;
}

/**

* ---
* Helpers
* ---
*
* Brika design tokens use CSS-style values such as "12px".
* React Native dimensions must be numeric.
* ---

*/

function px(value: string | number): number {
  return typeof value === "number" ? value : Number.parseFloat(value);
}

/**

* ---
* Component
* ---

*/

export function BrikaButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  accessibilityLabel,
}: BrikaButtonProps) {
  /**
   * useBrikaTheme() returns the resolved semantic Brika theme.
   *
   * This is intentionally different from useTheme(), which returns the
   * ThemeContext API itself.
   */
  const theme = useBrikaTheme();

  const isDisabled = disabled || loading;

  /**
   * -------------------------------------------------------------------------
   * Variant Colors
   * -------------------------------------------------------------------------
   */

  const backgroundColor =
    variant === "primary"
      ? theme.brand.primary
      : variant === "secondary"
        ? theme.background.secondary
        : variant === "danger"
          ? theme.status.error
          : "transparent";

  const borderColor =
    variant === "outline" ? theme.border.medium : "transparent";

  const textColor =
    variant === "primary"
      ? theme.text.inverse
      : variant === "secondary"
        ? theme.text.primary
        : variant === "danger"
          ? theme.text.inverse
          : variant === "outline"
            ? theme.text.primary
            : theme.brand.accent;

  /**
   * -------------------------------------------------------------------------
   * Render
   * -------------------------------------------------------------------------
   */

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,

        size === "sm" && styles.small,
        size === "md" && styles.medium,
        size === "lg" && styles.large,

        fullWidth && styles.fullWidth,

        {
          backgroundColor,
          borderColor,
        },

        variant === "outline" && styles.outline,

        variant === "ghost" && styles.ghost,

        isDisabled && styles.disabled,

        pressed && !isDisabled && styles.pressed,

        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          <BrikaText
            variant={size === "sm" ? "bodySmallMedium" : "bodyMedium"}
            color={textColor}
            style={styles.label}
          >
            {title}
          </BrikaText>
        </View>
      )}
    </Pressable>
  );
}

/**

* ---
* Styles
* ---

*/

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: px(radius.md),
  },

  small: {
    minHeight: 36,
    paddingHorizontal: px(spacing.md),
  },

  medium: {
    minHeight: 44,
    paddingHorizontal: px(spacing.lg),
  },

  large: {
    minHeight: 52,
    paddingHorizontal: px(spacing.xxl),
  },

  fullWidth: {
    width: "100%",
  },

  outline: {
    backgroundColor: "transparent",
  },

  ghost: {
    borderWidth: 0,
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    textAlign: "center",
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },
});
