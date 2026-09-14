/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/collapsible.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Collapsible content section.
 *
 * Responsibilities:
 *
 * - Render an accessible collapsible section.
 * - Use the active Brika semantic theme.
 * - Use Brika spacing and radius tokens.
 * - Provide pressed-state feedback.
 * - Animate expanded content.
 * -----------------------------------------------------------------------------
 */

import { SymbolView } from "expo-symbols";
import { PropsWithChildren, useState } from "react";
import {
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import {
  radius,
  spacing,
} from "@/constants/theme";

import { useBrikaTheme } from "@/hooks/use-brika-theme";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

interface CollapsibleProps extends PropsWithChildren {
  /**
   * Section heading.
   */
  title: string;
}

/**
 * -----------------------------------------------------------------------------
 * Token Helpers
 * -----------------------------------------------------------------------------
 *
 * Brika's design tokens intentionally use CSS-style values such as "12px".
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

export function Collapsible({
  children,
  title,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * useBrikaTheme() returns the resolved semantic Brika theme.
   *
   * Do not use useTheme() here because that hook returns ThemeContextValue,
   * which contains theme state and controls rather than semantic colors.
   */
  const theme = useBrikaTheme();

  /**
   * ---------------------------------------------------------------------------
   * Toggle
   * ---------------------------------------------------------------------------
   */

  const handlePress = () => {
    setIsOpen((value) => !value);
  };

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <ThemedView>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          expanded: isOpen,
        }}
        accessibilityLabel={title}
        onPress={handlePress}
        style={({ pressed }): ViewStyle => ({
          ...styles.heading,
          ...(pressed ? styles.pressedHeading : {}),
        })}
      >
        <ThemedView
          type="backgroundElement"
          style={[
            styles.button,
            {
              backgroundColor:
                theme.background.secondary,
            },
          ]}
        >
          <SymbolView
            name="chevron.right"
            size={14}
            weight="bold"
            tintColor={theme.text.primary}
            style={{
              transform: [
                {
                  rotate: isOpen
                    ? "-90deg"
                    : "90deg",
                },
              ],
            }}
          />
        </ThemedView>

        <ThemedText type="small">
          {title}
        </ThemedText>
      </Pressable>

      {isOpen ? (
        <Animated.View
          entering={FadeIn.duration(200)}
        >
          <ThemedView
            type="backgroundElement"
            style={[
              styles.content,
              {
                backgroundColor:
                  theme.background.secondary,
              },
            ]}
          >
            {children}
          </ThemedView>
        </Animated.View>
      ) : null}
    </ThemedView>
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
   * Heading
   * ---------------------------------------------------------------------------
   */

  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: px(spacing.sm),
  },

  /**
   * ---------------------------------------------------------------------------
   * Pressed Heading
   * ---------------------------------------------------------------------------
   */

  pressedHeading: {
    opacity: 0.7,
  },

  /**
   * ---------------------------------------------------------------------------
   * Toggle Button
   * ---------------------------------------------------------------------------
   */

  button: {
    width: 32,
    height: 32,
    borderRadius: px(radius.sm),

    alignItems: "center",
    justifyContent: "center",
  },

  /**
   * ---------------------------------------------------------------------------
   * Content
   * ---------------------------------------------------------------------------
   */

  content: {
    marginTop: px(spacing.md),
    marginLeft: 32,
    padding: px(spacing.lg),
    borderRadius: px(radius.md),
  },
});