/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/_layout.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects Navigation
 *
 * Stack navigator for the Projects section.
 *
 * Responsibilities:
 *
 * - Define navigation for the Projects feature.
 * - Provide the Projects list screen.
 * - Provide the Create Project screen.
 * - Provide the dynamic Project detail stack.
 *
 * This layout does NOT:
 *
 * - Fetch project data.
 * - Perform API requests.
 * - Manage project state.
 * - Render project-specific business logic.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { Stack } from "expo-router";

/**
 * -----------------------------------------------------------------------------
 * Projects Layout
 * -----------------------------------------------------------------------------
 */

export default function ProjectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* -----------------------------------------------------------------
       * Projects List
       * ----------------------------------------------------------------- */}

      <Stack.Screen
        name="index"
        options={{
          title: "Projects",
        }}
      />

      {/* -----------------------------------------------------------------
       * Create Project
       * ----------------------------------------------------------------- */}

      <Stack.Screen
        name="create"
        options={{
          title: "Create Project",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      {/* -----------------------------------------------------------------
       * Project Detail
       * ----------------------------------------------------------------- */}

      <Stack.Screen
        name="[projectId]"
        options={{
          title: "Project",
        }}
      />
    </Stack>
  );
}
