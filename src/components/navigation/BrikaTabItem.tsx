/**
 * -----------------------------------------------------------------------------
 * File: src/components/navigation/BrikaTabItem.tsx
 * -----------------------------------------------------------------------------
 * Brika Tab Item
 *
 * Reusable individual tab item used by the custom Brika bottom navigation.
 *
 * Standard tabs:
 *
 *     Home
 *     Project
 *     Notification
 *     Setting
 *
 * Primary tab:
 *
 *     Upload
 *
 * The Upload tab receives a raised circular treatment.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  colors,
  typography,
} from "@/constants/theme/index";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type BrikaTabItemProps = {
  /**
   * Visible tab label.
   */
  label: string;

  /**
   * Ionicons icon shown when inactive.
   */
  icon: React.ComponentProps<
    typeof Ionicons
  >["name"];

  /**
   * Ionicons icon shown when active.
   */
  activeIcon?: React.ComponentProps<
    typeof Ionicons
  >["name"];

  /**
   * Whether the tab is currently active.
   */
  focused: boolean;

  /**
   * Whether this is Brika's primary action.
   *
   * Currently used by Upload.
   */
  primary?: boolean;

  /**
   * Called when the tab is pressed.
   */
  onPress: () => void;

  /**
   * Called when the tab is long-pressed.
   */
  onLongPress?: () => void;

  /**
   * Accessibility label.
   */
  accessibilityLabel?: string;

  /**
   * Optional test identifier.
   */
  testID?: string;
};

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function BrikaTabItem({
  label,
  icon,
  activeIcon,
  focused,
  primary = false,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
}: BrikaTabItemProps) {
  /**
   * ---------------------------------------------------------------------------
   * Standard Tab Colors
   * ---------------------------------------------------------------------------
   */

  const standardIconColor =
    focused
      ? colors.brand.accent
      : colors.text.tertiary;

  const standardLabelColor =
    focused
      ? colors.brand.accent
      : colors.text.tertiary;

  /**
   * ---------------------------------------------------------------------------
   * Icon
   * ---------------------------------------------------------------------------
   */

  const iconName =
    focused && activeIcon
      ? activeIcon
      : icon;

  /**
   * ---------------------------------------------------------------------------
   * Primary Upload Colors
   * ---------------------------------------------------------------------------
   *
   * Upload deliberately uses the Brika accent as its visual anchor.
   *
   * White is used for the icon so the circular button has strong contrast.
   * ---------------------------------------------------------------------------
   */

  const primaryIconColor =
    colors.background.primary;

  const primaryLabelColor =
    focused
      ? colors.brand.accent
      : colors.text.tertiary;

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={
        accessibilityLabel ?? label
      }
      accessibilityState={{
        selected: focused,
      }}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.container,

        primary &&
          styles.primaryContainer,

        pressed &&
          styles.pressed,

        primary &&
          pressed &&
          styles.primaryPressed,
      ]}
    >
      {primary ? (
        <>
          {/*
           * -----------------------------------------------------------------
           * Floating Upload Circle
           * -----------------------------------------------------------------
           */}

          <View
            style={[
              styles.primaryCircle,
              focused &&
                styles.primaryCircleFocused,
            ]}
          >
            <Ionicons
              name={iconName}
              size={26}
              color={
                primaryIconColor
              }
            />
          </View>

          {/*
           * -----------------------------------------------------------------
           * Upload Label
           * -----------------------------------------------------------------
           */}

          <Text
            style={[
              styles.label,
              styles.primaryLabel,
              {
                color:
                  primaryLabelColor,
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </>
      ) : (
        <>
          {/*
           * -----------------------------------------------------------------
           * Standard Icon
           * -----------------------------------------------------------------
           */}

          <View
            style={
              styles.iconContainer
            }
          >
            <Ionicons
              name={iconName}
              size={23}
              color={
                standardIconColor
              }
            />
          </View>

          {/*
           * -----------------------------------------------------------------
           * Standard Label
           * -----------------------------------------------------------------
           */}

          <Text
            style={[
              styles.label,
              {
                color:
                  standardLabelColor,
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles =
  StyleSheet.create({
    /**
     * -------------------------------------------------------------------------
     * Base Tab Container
     * -------------------------------------------------------------------------
     */

    container: {
      flex: 1,

      minHeight: 60,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 4,

      paddingVertical: 6,
    },

    /**
     * -------------------------------------------------------------------------
     * Press State
     * -------------------------------------------------------------------------
     */

    pressed: {
      opacity: 0.72,
    },

    /**
     * -------------------------------------------------------------------------
     * Standard Icon Container
     * -------------------------------------------------------------------------
     */

    iconContainer: {
      width: 28,

      height: 28,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom: 2,
    },

    /**
     * -------------------------------------------------------------------------
     * Label
     * -------------------------------------------------------------------------
     */

    label: {
      ...typography.captionMedium,

      fontSize: 11,

      lineHeight: 14,

      textAlign:
        "center",
    },

    /**
     * -------------------------------------------------------------------------
     * Primary Upload Container
     * -------------------------------------------------------------------------
     *
     * The container is shifted upward so the Upload action visibly breaks out
     * of the navigation bar.
     * -------------------------------------------------------------------------
     */

    primaryContainer: {
      minHeight: 88,

      paddingTop: 0,

      paddingBottom: 4,

      justifyContent:
        "flex-start",

      transform: [
        {
          translateY: -18,
        },
      ],

      zIndex: 30,
    },

    /**
     * -------------------------------------------------------------------------
     * Primary Upload Circle
     * -------------------------------------------------------------------------
     */

    primaryCircle: {
      width: 60,

      height: 60,

      borderRadius: 30,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        colors.brand.accent,

      borderWidth: 4,

      borderColor:
        colors.background.surface,

      elevation: 6,

      shadowColor:
        "#000000",

      shadowOpacity: 0.16,

      shadowRadius: 7,

      shadowOffset: {
        width: 0,

        height: 3,
      },
    },

    /**
     * -------------------------------------------------------------------------
     * Primary Upload Active State
     * -------------------------------------------------------------------------
     */

    primaryCircleFocused: {
      transform: [
        {
          scale: 1.04,
        },
      ],

      elevation: 8,

      shadowOpacity: 0.22,
    },

    /**
     * -------------------------------------------------------------------------
     * Primary Upload Press State
     * -------------------------------------------------------------------------
     */

    primaryPressed: {
      transform: [
        {
          translateY: -16,
        },
      ],
    },

    /**
     * -------------------------------------------------------------------------
     * Primary Upload Label
     * -------------------------------------------------------------------------
     */

    primaryLabel: {
      marginTop: 4,
    },
  });

export default BrikaTabItem;