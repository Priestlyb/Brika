/**
 * -----------------------------------------------------------------------------
 * File: src/app/index.tsx
 * -----------------------------------------------------------------------------
 * Brika startup screen.
 *
 * This screen is displayed when the application first enters the root route.
 *
 * Responsibilities:
 *
 * - Display Brika's branded startup experience.
 * - Provide a visual transition between the native splash screen and the
 *   authentication/application flow.
 * - Keep the screen intentionally minimal.
 * - Respond to the active Brika theme.
 *
 * Authentication routing is handled by:
 *
 *     src/app/_layout.tsx
 *
 * The root route itself does not perform authentication logic.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect } from "react";

import { StyleSheet, View } from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { BrikaLogo, BrikaText } from "@/components/ui/index";

import { colors, spacing, typography } from "@/constants/theme/index";

/**
 * -----------------------------------------------------------------------------
 * Startup Screen
 * -----------------------------------------------------------------------------
 */

export default function StartupScreen() {
  /**
   * ---------------------------------------------------------------------------
   * Animation Values
   * ---------------------------------------------------------------------------
   */

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const logoTranslateY = useSharedValue(8);

  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(6);

  /**
   * ---------------------------------------------------------------------------
   * Start Animation
   * ---------------------------------------------------------------------------
   */

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });

    logoScale.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });

    logoTranslateY.value = withTiming(0, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });

    taglineOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 550,
        easing: Easing.out(Easing.cubic),
      }),
    );

    taglineTranslateY.value = withDelay(
      300,
      withTiming(0, {
        duration: 550,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, []);

  /**
   * ---------------------------------------------------------------------------
   * Animated Styles
   * ---------------------------------------------------------------------------
   */

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,

    transform: [
      {
        scale: logoScale.value,
      },
      {
        translateY: logoTranslateY.value,
      },
    ],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,

    transform: [
      {
        translateY: taglineTranslateY.value,
      },
    ],
  }));

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={logoAnimatedStyle}>
          <BrikaLogo style={styles.logo} />
        </Animated.View>

        <Animated.View style={taglineAnimatedStyle}>
          <BrikaText
            variant="bodySmall"
            color={colors.text.secondary}
            style={styles.tagline}
          >
            Design. Transform. Build.
          </BrikaText>
        </Animated.View>
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: colors.background.primary,
  },

  content: {
    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: spacing.xxl,
  },

  logo: {
    width: 160,

    height: 54,

    marginBottom: spacing.lg,
  },

  tagline: {
    fontFamily: typography.bodySmall.fontFamily,

    fontSize: 13,

    letterSpacing: 0.4,

    textAlign: "center",
  },
});
