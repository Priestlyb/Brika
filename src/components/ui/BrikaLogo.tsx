/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/BrikaLogo.tsx
 * -----------------------------------------------------------------------------
 * Brika logo.
 *
 * Reusable image-based Brika logo component.
 *
 * The default logo is AppLogo.png, but a different image source can be
 * provided when required.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
} from "react-native";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface BrikaLogoProps {
  /**
   * Logo image source.
   *
   * Defaults to the primary Brika application logo.
   */
  source?: ImageSourcePropType;

  /**
   * Logo width.
   */
  width?: number;

  /**
   * Logo height.
   */
  height?: number;

  /**
   * Image resize mode.
   */
  resizeMode?: "contain" | "cover" | "stretch" | "center";

  /**
   * Additional image styles.
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Accessibility label.
   */
  accessibilityLabel?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Brika Logo
 * -----------------------------------------------------------------------------
 */

export function BrikaLogo({
  source = require("@/assets/images/AppLogo.png"),
  width = 120,
  height = 40,
  resizeMode = "contain",
  style,
  accessibilityLabel = "Brika",
}: BrikaLogoProps) {
  return (
    <Image
      source={source}
      style={[
        styles.logo,
        {
          width,
          height,
        },
        style,
      ]}
      resizeMode={resizeMode}
      accessibilityLabel={accessibilityLabel}
      accessible
    />
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  logo: {},
});