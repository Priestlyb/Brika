/**
 * -----------------------------------------------------------------------------
 * File: src/app/(auth)/_layout.tsx
 * -----------------------------------------------------------------------------
 * Authentication navigation layout for Brika.
 *
 * Responsibilities:
 *
 * - Configure the authentication stack.
 * - Keep authentication screens free of navigation headers.
 * - Provide consistent Brika background styling.
 * - Define the available authentication routes.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { Stack } from "expo-router";

import { colors } from "@/constants/theme/";

/**
 * -----------------------------------------------------------------------------
 * Authentication Layout
 * -----------------------------------------------------------------------------
 */

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,

        animation: "fade",

        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen name="login" />

      <Stack.Screen name="register" />

      <Stack.Screen name="forgot-password" />

      <Stack.Screen name="reset-password" />

      <Stack.Screen name="verify-email" />
    </Stack>
  );
}
