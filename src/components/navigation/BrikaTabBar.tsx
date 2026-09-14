/**
 * -----------------------------------------------------------------------------
 * File: src/components/navigation/BrikaTabBar.tsx
 * -----------------------------------------------------------------------------
 * Brika Custom Tab Bar
 *
 * Custom bottom navigation for the authenticated Brika application.
 *
 * Navigation order:
 *
 *     Home
 *     Project
 *     Upload
 *     Notification
 *     Setting
 *
 * Upload is intentionally presented as a raised circular primary action.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { StyleSheet, View } from "react-native";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrikaTabItem } from "./BrikaTabItem";

import { colors } from "@/constants/theme/index";

/**
 * -----------------------------------------------------------------------------
 * Tab Configuration
 * -----------------------------------------------------------------------------
 */

const TAB_CONFIG = {
  "dashboard/index": {
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },

  dashboard: {
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },

  "projects/index": {
    label: "Project",
    icon: "folder-outline",
    activeIcon: "folder",
  },

  projects: {
    label: "Project",
    icon: "folder-outline",
    activeIcon: "folder",
  },

  "uploads/index": {
    label: "Upload",
    icon: "cloud-upload-outline",
    activeIcon: "cloud-upload",
  },

  uploads: {
    label: "Upload",
    icon: "cloud-upload-outline",
    activeIcon: "cloud-upload",
  },

  "notifications/index": {
    label: "Notification",
    icon: "notifications-outline",
    activeIcon: "notifications",
  },

  notifications: {
    label: "Notification",
    icon: "notifications-outline",
    activeIcon: "notifications",
  },

  "settings/index": {
    label: "Setting",
    icon: "settings-outline",
    activeIcon: "settings",
  },

  settings: {
    label: "Setting",
    icon: "settings-outline",
    activeIcon: "settings",
  },
} as const;

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

type TabRouteName = keyof typeof TAB_CONFIG;

/**
 * -----------------------------------------------------------------------------
 * Preferred Tab Order
 * -----------------------------------------------------------------------------
 */

const TAB_ORDER: TabRouteName[] = [
  "dashboard/index",
  "projects/index",
  "uploads/index",
  "notifications/index",
  "settings/index",
];

/**
 * -----------------------------------------------------------------------------
 * Route Resolver
 * -----------------------------------------------------------------------------
 *
 * Supports both:
 *
 *     projects/index
 *
 * and:
 *
 *     projects
 *
 * depending on how Expo Router exposes the route.
 * -----------------------------------------------------------------------------
 */

function resolveRoute(
  routes: BottomTabBarProps["state"]["routes"],
  preferredName: TabRouteName,
) {
  const directMatch = routes.find((route) => route.name === preferredName);

  if (directMatch) {
    return directMatch;
  }

  if (preferredName.endsWith("/index")) {
    const baseName = preferredName.replace("/index", "");

    return routes.find((route) => route.name === baseName);
  }

  return routes.find((route) => route.name === `${preferredName}/index`);
}

/**
 * -----------------------------------------------------------------------------
 * Main Component
 * -----------------------------------------------------------------------------
 */

export function BrikaTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  /**
   * ---------------------------------------------------------------------------
   * Safe Area
   * ---------------------------------------------------------------------------
   */

  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, 8);

  /**
   * ---------------------------------------------------------------------------
   * Ordered Routes
   * ---------------------------------------------------------------------------
   */

  const orderedRoutes = TAB_ORDER.map((preferredName) =>
    resolveRoute(state.routes, preferredName),
  ).filter((route): route is BottomTabBarProps["state"]["routes"][number] =>
    Boolean(route),
  );

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: bottomInset,
        },
      ]}
    >
      {/*
       * -----------------------------------------------------------------------
       * Upload Semicircle / Notch
       * -----------------------------------------------------------------------
       *
       * This white surface sits above the navigation bar and creates the
       * semicircular cut-out around the floating Upload action.
       *
       * It is intentionally behind the Upload button.
       */}

      <View pointerEvents="none" style={styles.uploadNotch} />

      <View style={styles.container}>
        {orderedRoutes.map((route) => {
          /**
           * ---------------------------------------------------------------
           * Configuration
           * ---------------------------------------------------------------
           */

          const routeName = route.name as TabRouteName;

          const config = TAB_CONFIG[routeName];

          if (!config) {
            return null;
          }

          /**
           * ---------------------------------------------------------------
           * Original Navigation Index
           * ---------------------------------------------------------------
           */

          const originalIndex = state.routes.findIndex(
            (stateRoute) => stateRoute.key === route.key,
          );

          const focused = state.index === originalIndex;

          /**
           * ---------------------------------------------------------------
           * Screen Options
           * ---------------------------------------------------------------
           */

          const descriptor = descriptors[route.key];

          const options = descriptor?.options;

          /**
           * ---------------------------------------------------------------
           * Accessibility
           * ---------------------------------------------------------------
           */

          const accessibilityLabel =
            options?.tabBarAccessibilityLabel ?? config.label;

          /**
           * ---------------------------------------------------------------
           * Tab Press
           * ---------------------------------------------------------------
           */

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          /**
           * ---------------------------------------------------------------
           * Tab Long Press
           * ---------------------------------------------------------------
           */

          const handleLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          /**
           * ---------------------------------------------------------------
           * Upload
           * ---------------------------------------------------------------
           *
           * Upload gets the special floating treatment.
           * ---------------------------------------------------------------
           */

          const isUpload =
            route.name === "uploads/index" || route.name === "uploads";

          if (isUpload) {
            return (
              <View key={route.key} style={styles.uploadSlot}>
                <BrikaTabItem
                  label={config.label}
                  icon={config.icon}
                  activeIcon={config.activeIcon}
                  focused={focused}
                  primary
                  onPress={handlePress}
                  onLongPress={handleLongPress}
                  accessibilityLabel={accessibilityLabel}
                  testID={options?.tabBarButtonTestID}
                />
              </View>
            );
          }

          /**
           * ---------------------------------------------------------------
           * Standard Tab
           * ---------------------------------------------------------------
           */

          return (
            <View key={route.key} style={styles.tabSlot}>
              <BrikaTabItem
                label={config.label}
                icon={config.icon}
                activeIcon={config.activeIcon}
                focused={focused}
                onPress={handlePress}
                onLongPress={handleLongPress}
                accessibilityLabel={accessibilityLabel}
                testID={options?.tabBarButtonTestID}
              />
            </View>
          );
        })}
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
  /**
   * -------------------------------------------------------------------------
   * Outer Navigation Surface
   * -------------------------------------------------------------------------
   */

  wrapper: {
    width: "100%",

    minHeight: 88,

    backgroundColor: colors.background.surface,

    borderTopWidth: 1,

    borderTopColor: colors.border.light,

    position: "relative",

    elevation: 0,

    shadowColor: "transparent",

    shadowOpacity: 0,

    shadowRadius: 0,

    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  /**
   * -------------------------------------------------------------------------
   * Navigation Container
   * -------------------------------------------------------------------------
   */

  container: {
    width: "100%",

    height: 72,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 8,

    position: "relative",

    zIndex: 2,
  },

  /**
   * -------------------------------------------------------------------------
   * Standard Tab Slot
   * -------------------------------------------------------------------------
   */

  tabSlot: {
    flex: 1,

    height: 72,

    alignItems: "center",

    justifyContent: "center",
  },

  /**
   * -------------------------------------------------------------------------
   * Upload Slot
   * -------------------------------------------------------------------------
   *
   * The slot reserves exactly the same horizontal width as every other tab,
   * while allowing the Upload button to float upward.
   * -------------------------------------------------------------------------
   */

  uploadSlot: {
    flex: 1,

    height: 72,

    alignItems: "center",

    justifyContent: "center",

    position: "relative",

    zIndex: 20,
  },

  /**
   * -------------------------------------------------------------------------
   * Upload Semicircle / Notch
   * -------------------------------------------------------------------------
   *
   * This creates the visual "dip" in the navigation surface behind the
   * floating Upload button.
   *
   * The circle is larger than the Upload button, producing a clean halo of
   * navigation-surface color around it.
   * -------------------------------------------------------------------------
   */

  uploadNotch: {
    position: "absolute",

    top: -24,

    left: "50%",

    width: 92,

    height: 92,

    marginLeft: -46,

    borderRadius: 46,

    backgroundColor: colors.background.surface,

    zIndex: 1,
  },
});

export default BrikaTabBar;
