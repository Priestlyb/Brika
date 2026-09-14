/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/[projectId]/_layout.tsx
 * -----------------------------------------------------------------------------
 * Brika Project Detail Navigation
 *
 * Stack navigator for an individual project.
 *
 * Responsibilities:
 *
 * - Define navigation within a project.
 * - Provide the project overview screen.
 * - Provide the project members screen.
 * - Provide the project activity screen.
 * - Provide the project files screen.
 *
 * This layout does NOT:
 *
 * - Fetch project data.
 * - Perform API requests.
 * - Manage project state.
 * - Render project-specific business logic.
 * - Handle project mutations.
 * -----------------------------------------------------------------------------
 */

import React from "react";
import { Stack } from "expo-router";

/**
 * -----------------------------------------------------------------------------
 * Project Detail Layout
 * -----------------------------------------------------------------------------
 */

export default function ProjectDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* -----------------------------------------------------------------------
       * Project Overview
       * ----------------------------------------------------------------------- */}

      <Stack.Screen
        name="index"
        options={{
          title: "Project",
        }}
      />

      {/* -----------------------------------------------------------------------
       * Project Members
       * ----------------------------------------------------------------------- */}

      <Stack.Screen
        name="members"
        options={{
          title: "Members",
        }}
      />

      {/* -----------------------------------------------------------------------
       * Project Activity
       * ----------------------------------------------------------------------- */}

      <Stack.Screen
        name="activity"
        options={{
          title: "Activity",
        }}
      />

      {/* -----------------------------------------------------------------------
       * Project Files
       * ----------------------------------------------------------------------- */}

      <Stack.Screen
        name="files"
        options={{
          title: "Files",
        }}
      />
    </Stack>
  );
}
