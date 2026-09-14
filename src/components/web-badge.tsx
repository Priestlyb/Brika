/**
 * -----------------------------------------------------------------------------
 * File: src/components/web-badge.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Expo web badge.
 *
 * This component is retained for Expo starter compatibility but uses the
 * current Brika design-token system rather than the legacy Expo Spacing API.
 * -----------------------------------------------------------------------------
 */

import { version } from "expo/package.json";
import { Image } from "expo-image";
import {
  StyleSheet,
  useColorScheme,
} from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { spacing } from "@/constants/theme";

/**
 * -----------------------------------------------------------------------------
 * Token Helper
 * -----------------------------------------------------------------------------
 *
 * Brika spacing tokens use CSS-style values such as "8px".
 * React Native requires numeric dimensions.
 * -----------------------------------------------------------------------------
 */

function px(value: string): number {
  return Number.parseFloat(value);
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText
        type="code"
        themeColor="secondary"
        style={styles.versionText}
      >
        v{version}
      </ThemedText>

      <Image
        source={
          scheme === "dark"
            ? require("@/assets/images/expo-badge-white.png")
            : require("@/assets/images/expo-badge.png")
        }
        style={styles.badgeImage}
        contentFit="contain"
      />
    </ThemedView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    padding: px(spacing.xl),
    alignItems: "center",
    gap: px(spacing.sm),
  },

  versionText: {
    textAlign: "center",
  },

  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});