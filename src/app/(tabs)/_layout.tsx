/**

* ---
* File: src/app/(tabs)/_layout.tsx
* ---
* Brika Main Application Tab Navigation
*
* This layout owns the authenticated application's primary navigation.
*
* Routes:
*
* ```
  /(tabs)/dashboard
  ```
* ```
  /(tabs)/projects
  ```
* ```
  /(tabs)/uploads
  ```
* ```
  /(tabs)/notifications
  ```
* ```
  /(tabs)/settings
  ```
*
* Navigation architecture:
*
* ```
  Expo Router
  ```
* ```
       ↓
  ```
* ```
  Tabs Navigator
  ```
* ```
       ↓
  ```
* ```
  BrikaTabBar
  ```
* ```
       ↓
  ```
* ```
  BrikaTabItem
  ```
*
* Expo Router remains responsible for:
*
* * Route discovery
* * Navigation state
* * Active route state
* * Navigation events
* * Screen rendering
*
* BrikaTabBar is responsible for:
*
* * Visual tab bar presentation
* * Icons
* * Labels
* * Active/inactive states
* * Press interactions
*
* The actual route files use index.tsx:
*
* ```
  dashboard/index.tsx
  ```
* ```
  projects/index.tsx
  ```
* ```
  uploads/index.tsx
  ```
* ```
  notifications/index.tsx
  ```
* ```
  settings/index.tsx
  ```
*
* Therefore the Tabs.Screen names must match the route names reported by
* Expo Router:
*
* ```
  dashboard/index
  ```
* ```
  projects/index
  ```
* ```
  uploads/index
  ```
* ```
  notifications/index
  ```
* ```
  settings/index
  ```
* ---

*/

import React from "react";

import { Tabs } from "expo-router";

import { BrikaTabBar } from "@/components/navigation/BrikaTabBar";

/**

* ---
* Main Tabs Layout
* ---

*/

export default function TabsLayout() {
  return (
    <Tabs
      /**
       * -------------------------------------------------------------------------
       * Custom Brika Tab Bar
       * -------------------------------------------------------------------------
       *
       * React Navigation supplies the navigation state, route descriptors, and
       * navigation object to BrikaTabBar.
       *
       * BrikaTabBar then renders the actual Brika navigation interface.
       */

      tabBar={(props) => <BrikaTabBar {...props} />}
      /**
       * -------------------------------------------------------------------------
       * Global Tab Screen Options
       * -------------------------------------------------------------------------
       */

      screenOptions={{
        /**
         * -----------------------------------------------------------------------
         * Headers
         * -----------------------------------------------------------------------
         *
         * Brika screens provide their own headers.
         */

        headerShown: false,

        /**
         * -----------------------------------------------------------------------
         * Tab Bar Presentation
         * -----------------------------------------------------------------------
         *
         * BrikaTabBar owns all visual tab-bar styling.
         *
         * Do NOT configure the following here:
         *
         * - tabBarStyle
         * - tabBarIcon
         * - tabBarLabelStyle
         * - tabBarItemStyle
         *
         * Those responsibilities belong to BrikaTabBar and BrikaTabItem.
         */
      }}
    >
      {/* -----------------------------------------------------------------------
       * Dashboard
       * -----------------------------------------------------------------------
       *
       * File:
       *
       *     src/app/(tabs)/dashboard/index.tsx
       *
       * Route:
       *
       *     /dashboard
       *
       * Expo Router child name:
       *
       *     dashboard/index
       * --------------------------------------------------------------------- */}

      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Home",

          tabBarAccessibilityLabel: "Home",
        }}
      />

      {/* -----------------------------------------------------------------------
       * Projects
       * -----------------------------------------------------------------------
       *
       * File:
       *
       *     src/app/(tabs)/projects/index.tsx
       *
       * Route:
       *
       *     /projects
       *
       * Expo Router child name:
       *
       *     projects/index
       * --------------------------------------------------------------------- */}

      <Tabs.Screen
        name="projects/index"
        options={{
          title: "Projects",

          tabBarAccessibilityLabel: "Projects",
        }}
      />

      {/* -----------------------------------------------------------------------
       * Uploads
       * -----------------------------------------------------------------------
       *
       * File:
       *
       *     src/app/(tabs)/uploads/index.tsx
       *
       * Route:
       *
       *     /uploads
       *
       * Expo Router child name:
       *
       *     uploads/index
       * --------------------------------------------------------------------- */}

      <Tabs.Screen
        name="uploads/index"
        options={{
          title: "Uploads",

          tabBarAccessibilityLabel: "Uploads",
        }}
      />

      {/* -----------------------------------------------------------------------
       * Notifications
       * -----------------------------------------------------------------------
       *
       * File:
       *
       *     src/app/(tabs)/notifications/index.tsx
       *
       * Route:
       *
       *     /notifications
       *
       * Expo Router child name:
       *
       *     notifications/index
       * --------------------------------------------------------------------- */}

      <Tabs.Screen
        name="notifications/index"
        options={{
          title: "Alerts",

          tabBarAccessibilityLabel: "Notifications",
        }}
      />

      {/* -----------------------------------------------------------------------
       * Settings
       * -----------------------------------------------------------------------
       *
       * File:
       *
       *     src/app/(tabs)/settings/index.tsx
       *
       * Route:
       *
       *     /settings
       *
       * Expo Router child name:
       *
       *     settings/index
       * --------------------------------------------------------------------- */}

      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",

          tabBarAccessibilityLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
