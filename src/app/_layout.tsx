/**
 * -----------------------------------------------------------------------------
 * File: src/app/_layout.tsx
 * -----------------------------------------------------------------------------
 * Root Expo Router layout for Brika.
 *
 * Responsibilities:
 *
 * - Load Brika fonts before rendering the application.
 * - Load Ionicons before rendering navigation.
 * - Control the native Expo splash screen.
 * - Provide Brika's application theme.
 * - Provide React Navigation's corresponding theme.
 * - Provide Brika authentication state.
 * - Restore authenticated sessions on application startup.
 * - Protect authenticated application routes.
 * - Redirect unauthenticated users to the authentication entry screen.
 * - Allow public authentication routes to remain accessible.
 * - Allow the root "/" route to act as the Brika startup screen.
 * - Configure the root navigation stack.
 *
 * Navigation flow:
 *
 *     Native Splash
 *          ↓
 *     Startup "/"
 *          ↓
 *     Welcome "/welcome"
 *          ↓
 *     ┌───────────────┐
 *     │               │
 *   Login          Register
 *     │               │
 *     └───────┬───────┘
 *             ↓
 *        Main Application
 *
 * Authenticated users:
 *
 *     Startup "/" → Dashboard
 *
 * Unauthenticated users:
 *
 *     Startup "/" → Welcome
 *
 * IMPORTANT:
 *
 * Expo Router route groups such as:
 *
 *     /(auth)
 *     /(tabs)
 *
 * are NOT included in the pathname returned by usePathname().
 *
 * Therefore:
 *
 *     /(auth)/register
 *
 * becomes:
 *
 *     /register
 *
 * when inspected through usePathname().
 * -----------------------------------------------------------------------------
 */

import React, {
  useEffect,
  useState,
} from "react";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useFonts } from "expo-font";

import {
  Stack,
  usePathname,
  useRouter,
} from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import {
  ThemeProvider,
  colors,
  useTheme,
} from "@/constants/theme/index";

import {
  AuthProvider,
  useAuth,
} from "@/services/auth/auth.context";

/**
 * -----------------------------------------------------------------------------
 * Native Splash Screen
 * -----------------------------------------------------------------------------
 *
 * Keep the native Expo splash screen visible while fonts and icons load.
 */

void SplashScreen.preventAutoHideAsync();

/**
 * -----------------------------------------------------------------------------
 * Startup Duration
 * -----------------------------------------------------------------------------
 *
 * Duration of the branded startup experience after authentication restoration.
 */

const STARTUP_DURATION = 1200;

/**
 * -----------------------------------------------------------------------------
 * Public Authentication Routes
 * -----------------------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * These values intentionally do NOT contain "(auth)" because usePathname()
 * removes Expo Router route groups.
 *
 * Example:
 *
 *     /(auth)/register
 *
 * pathname:
 *
 *     /register
 */

const AUTH_ROUTES = [
  "/welcome",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const;

/**
 * -----------------------------------------------------------------------------
 * Authentication Guard
 * -----------------------------------------------------------------------------
 *
 * Routing rules:
 *
 *     Unauthenticated + "/"
 *         → "/(auth)/welcome"
 *
 *     Authenticated + "/"
 *         → "/(tabs)/dashboard"
 *
 *     Unauthenticated + public auth route
 *         → stay where they are
 *
 *     Authenticated + public auth route
 *         → "/(tabs)/dashboard"
 *
 *     Unauthenticated + protected route
 *         → "/(auth)/welcome"
 *
 *     Authenticated + protected route
 *         → stay where they are
 * -----------------------------------------------------------------------------
 */

function AuthenticationGuard() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  const [startupComplete, setStartupComplete] =
    useState(false);

  /**
   * ---------------------------------------------------------------------------
   * Startup Timer
   * ---------------------------------------------------------------------------
   *
   * Only the root startup route uses the startup timer.
   *
   * This is important because navigating directly to:
   *
   *     /register
   *
   * should NOT wait for the startup timer.
   */

  useEffect(() => {
    if (isLoading) {
      setStartupComplete(false);

      return;
    }

    /**
     * If the user is not currently on the startup route, there is no reason
     * to wait for the startup animation.
     */

    if (pathname !== "/") {
      setStartupComplete(true);

      return;
    }

    setStartupComplete(false);

    const timer = setTimeout(() => {
      setStartupComplete(true);
    }, STARTUP_DURATION);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, pathname]);

  /**
   * ---------------------------------------------------------------------------
   * Route Classification
   * ---------------------------------------------------------------------------
   */

  const isStartupRoute =
    pathname === "/";

  const isAuthRoute =
    AUTH_ROUTES.includes(
      pathname as (typeof AUTH_ROUTES)[number],
    );

  /**
   * ---------------------------------------------------------------------------
   * Authentication Redirect
   * ---------------------------------------------------------------------------
   */

  useEffect(() => {
    /**
     * -------------------------------------------------------------------------
     * Authentication Restoration
     * -------------------------------------------------------------------------
     *
     * Never make routing decisions while AuthProvider is restoring the stored
     * authentication session.
     */

    if (isLoading) {
      return;
    }

    /**
     * -------------------------------------------------------------------------
     * Startup Route
     * -------------------------------------------------------------------------
     *
     * Allow the startup screen to remain visible for the configured duration.
     */

    if (
      isStartupRoute &&
      !startupComplete
    ) {
      return;
    }

    /**
     * -------------------------------------------------------------------------
     * Authenticated User
     * -------------------------------------------------------------------------
     */

    if (isAuthenticated) {
      /**
       * Authenticated users should not remain on the startup screen.
       */

      if (isStartupRoute) {
        router.replace(
          "/(tabs)/dashboard",
        );

        return;
      }

      /**
       * Authenticated users should not remain inside the authentication flow.
       *
       * This includes:
       *
       *     /welcome
       *     /login
       *     /register
       *     /forgot-password
       *     /reset-password
       *     /verify-email
       */

      if (isAuthRoute) {
        router.replace(
          "/(tabs)/dashboard",
        );

        return;
      }

      /**
       * Any other route is considered an authenticated application route.
       *
       * Stay where we are.
       */

      return;
    }

    /**
     * -------------------------------------------------------------------------
     * Unauthenticated User
     * -------------------------------------------------------------------------
     */

    /**
     * The startup route sends unauthenticated users to Welcome.
     */

    if (isStartupRoute) {
      router.replace(
        "/(auth)/welcome",
      );

      return;
    }

    /**
     * Public authentication routes must remain accessible.
     *
     * This is what allows:
     *
     *     /(auth)/register
     *
     * to open without the guard redirecting back to Welcome.
     */

    if (isAuthRoute) {
      return;
    }

    /**
     * -------------------------------------------------------------------------
     * Protected Route
     * -------------------------------------------------------------------------
     *
     * The user is unauthenticated and is attempting to access a protected
     * application route.
     */

    router.replace(
      "/(auth)/welcome",
    );
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    startupComplete,
    isStartupRoute,
    isAuthRoute,
    router,
  ]);

  /**
   * ---------------------------------------------------------------------------
   * Guard Rendering
   * ---------------------------------------------------------------------------
   *
   * The guard itself renders nothing.
   *
   * The Expo Router Stack remains responsible for rendering the actual route.
   */

  return null;
}

/**
 * -----------------------------------------------------------------------------
 * Navigation Theme Bridge
 * -----------------------------------------------------------------------------
 *
 * Bridges Brika's theme system with React Navigation.
 * -----------------------------------------------------------------------------
 */

function NavigationThemeBridge() {
  const {
    resolvedTheme,
  } = useTheme();

  const navigationTheme =
    resolvedTheme === "dark"
      ? NavigationDarkTheme
      : NavigationLightTheme;

  return (
    <NavigationThemeProvider
      value={{
        ...navigationTheme,

        colors: {
          ...navigationTheme.colors,

          background:
            colors.background.primary,

          card:
            colors.background.surface,

          text:
            colors.text.primary,

          border:
            colors.border.light,

          primary:
            colors.brand.accent,

          notification:
            colors.status.error,
        },
      }}
    >
      <AuthenticationGuard />

      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor:
              colors.background.primary,
          },
        }}
      />
    </NavigationThemeProvider>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Root Layout
 * -----------------------------------------------------------------------------
 */

export default function RootLayout() {
  /**
   * ---------------------------------------------------------------------------
   * Font Loading
   * ---------------------------------------------------------------------------
   *
   * Load all fonts required by the application before rendering navigation.
   *
   * Brika typography:
   *
   *     Inter-Regular
   *     Inter-Medium
   *     Inter-SemiBold
   *     Inter-Bold
   *
   * Navigation / UI icons:
   *
   *     Ionicons
   */

  const [
    fontsLoaded,
    fontError,
  ] = useFonts({
    /**
     * -------------------------------------------------------------------------
     * Brika Typography
     * -------------------------------------------------------------------------
     */

    "Inter-Regular":
      require("../../assets/fonts/Inter-Regular.ttf"),

    "Inter-Medium":
      require("../../assets/fonts/Inter-Medium.ttf"),

    "Inter-SemiBold":
      require("../../assets/fonts/Inter-SemiBold.ttf"),

    "Inter-Bold":
      require("../../assets/fonts/Inter-Bold.ttf"),

    /**
     * -------------------------------------------------------------------------
     * Ionicons
     * -------------------------------------------------------------------------
     */

    ...Ionicons.font,
  });

  /**
   * ---------------------------------------------------------------------------
   * Hide Native Splash Screen
   * ---------------------------------------------------------------------------
   *
   * Hide the native splash only after all required fonts have loaded.
   */

  useEffect(() => {
    if (
      fontsLoaded ||
      fontError
    ) {
      void SplashScreen.hideAsync();
    }
  }, [
    fontsLoaded,
    fontError,
  ]);

  /**
   * ---------------------------------------------------------------------------
   * Font Loading State
   * ---------------------------------------------------------------------------
   *
   * Keep the native Expo splash visible while fonts are loading.
   */

  if (
    !fontsLoaded &&
    !fontError
  ) {
    return null;
  }

  /**
   * ---------------------------------------------------------------------------
   * Application Providers
   * ---------------------------------------------------------------------------
   */

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationThemeBridge />
      </AuthProvider>
    </ThemeProvider>
  );
}