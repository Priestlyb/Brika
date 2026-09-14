/**
 * -----------------------------------------------------------------------------
 * File: src/theme/ThemeProvider.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Global theme provider for Expo / React Native.
 *
 * Responsibilities:
 *
 * - Provide theme state to the React application.
 * - Support light, dark, and system theme modes.
 * - Resolve the active theme when using system mode.
 * - React to operating-system theme changes.
 * - Persist the user's selected theme.
 * - Expose theme controls through useTheme().
 *
 * Theme detection is handled by:
 *
 * - system-theme.ts
 *
 * Theme persistence is handled by:
 *
 * - theme-storage.ts
 *
 * -----------------------------------------------------------------------------
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Appearance } from "react-native";

import {
  type ResolvedTheme,
  ThemeContext,
  type ThemeContextValue,
  type ThemeMode,
} from "./ThemeContext";

import { getStoredTheme, saveTheme } from "./theme-storage";

import { getSystemTheme, subscribeToSystemTheme } from "./system-theme";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ThemeProviderProps {
  /**
   * Application content.
   */
  children: ReactNode;

  /**
   * Initial theme preference used when no persisted preference exists.
   *
   * @default "system"
   */
  defaultTheme?: ThemeMode;
}

/**
 * -----------------------------------------------------------------------------
 * Initial Theme
 * -----------------------------------------------------------------------------
 *
 * Persistence is asynchronous, so the provider initially uses the supplied
 * default theme. The persisted preference is loaded after mounting.
 */

const resolveTheme = (theme: ThemeMode): ResolvedTheme => {
  if (theme === "system") {
    return getSystemTheme();
  }

  return theme;
};

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  /**
   * -------------------------------------------------------------------------
   * Theme Preference
   * -------------------------------------------------------------------------
   */

  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  /**
   * -------------------------------------------------------------------------
   * Resolved Theme
   * -------------------------------------------------------------------------
   *
   * This is the actual theme currently being displayed.
   */

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(defaultTheme),
  );

  /**
   * -------------------------------------------------------------------------
   * Load Persisted Theme
   * -------------------------------------------------------------------------
   *
   * The user's saved preference takes priority over the default theme.
   */

  useEffect(() => {
    let mounted = true;

    const loadStoredTheme = async (): Promise<void> => {
      try {
        const storedTheme = await getStoredTheme();

        if (!mounted || storedTheme === null) {
          return;
        }

        setThemeState(storedTheme);
        setResolvedTheme(resolveTheme(storedTheme));
      } catch {
        /**
         * Persistence failure should never prevent the application
         * from rendering.
         *
         * The provider simply continues using the default theme.
         */
      }
    };

    void loadStoredTheme();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * -------------------------------------------------------------------------
   * System Theme
   * -------------------------------------------------------------------------
   *
   * Keep the initial Appearance state synchronized with our system-theme
   * utility.
   *
   * Appearance is used as a React Native fallback because Expo applications
   * can run on native platforms where browser APIs do not exist.
   */

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    setResolvedTheme(getSystemTheme());

    const unsubscribe = subscribeToSystemTheme((nextTheme) => {
      setResolvedTheme(nextTheme);
    });

    return unsubscribe;
  }, [theme]);

  /**
   * -------------------------------------------------------------------------
   * React Native Appearance Fallback
   * -------------------------------------------------------------------------
   *
   * Appearance.addChangeListener is available on Expo's native platforms.
   *
   * system-theme.ts remains the primary abstraction, while this listener
   * ensures theme changes are also detected reliably in React Native.
   */

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const nextTheme: ResolvedTheme =
        colorScheme === "dark" ? "dark" : "light";

      setResolvedTheme(nextTheme);
    });

    return () => {
      subscription.remove();
    };
  }, [theme]);

  /**
   * -------------------------------------------------------------------------
   * Theme Setter
   * -------------------------------------------------------------------------
   */

  const setTheme = useCallback((nextTheme: ThemeMode): void => {
    setThemeState(nextTheme);

    setResolvedTheme(resolveTheme(nextTheme));

    void saveTheme(nextTheme);
  }, []);

  /**
   * -------------------------------------------------------------------------
   * Toggle Theme
   * -------------------------------------------------------------------------
   *
   * If the current preference is "system", toggle based on the currently
   * resolved theme and explicitly switch to the opposite theme.
   *
   * Example:
   *
   * system → dark
   *
   * becomes:
   *
   * light
   */

  const toggleTheme = useCallback((): void => {
    const currentResolvedTheme = resolvedTheme;

    const nextTheme: ThemeMode =
      currentResolvedTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  /**
   * -------------------------------------------------------------------------
   * Context Value
   * -------------------------------------------------------------------------
   */

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  /**
   * -------------------------------------------------------------------------
   * Render
   * -------------------------------------------------------------------------
   */

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Default Export
 * -----------------------------------------------------------------------------
 */

export default ThemeProvider;
