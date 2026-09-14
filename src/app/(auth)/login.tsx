/**
 * -----------------------------------------------------------------------------
 * File: src/app/(auth)/login.tsx
 * -----------------------------------------------------------------------------
 * Brika login screen.
 *
 * Responsibilities:
 *
 * - Allow existing users to sign in.
 * - Provide navigation to the registration screen.
 * - Provide clear authentication feedback.
 * - Provide inline validation feedback.
 * - Display safe backend authentication errors.
 * - Respond to the active Brika theme.
 * -----------------------------------------------------------------------------
 */

import React, { useState } from "react";

import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import {
  BrikaButton,
  BrikaInput,
  BrikaLogo,
  BrikaText,
} from "@/components/ui/index";

import {
  colors,
  spacing,
} from "@/constants/theme/index";

import { useAuth } from "@/services/auth/auth.context";

/**
 * -----------------------------------------------------------------------------
 * Login Screen
 * -----------------------------------------------------------------------------
 */

export default function LoginScreen() {
  const router = useRouter();

  const {
    login,
    isLoading,
    error: authError,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [validationError, setValidationError] = useState<string | null>(
    null,
  );

  /**
   * ---------------------------------------------------------------------------
   * Displayed Error
   * ---------------------------------------------------------------------------
   *
   * Validation errors belong to this screen.
   *
   * Authentication errors belong to AuthContext.
   *
   * Validation errors take priority because they are generated locally
   * before an API request is made.
   */

  const displayedError = validationError ?? authError;

  /**
   * ---------------------------------------------------------------------------
   * Submit
   * ---------------------------------------------------------------------------
   */

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    setValidationError(null);

    clearError();

    const trimmedEmail = email.trim();

    /**
     * -------------------------------------------------------------------------
     * Local Validation
     * -------------------------------------------------------------------------
     */

    if (!trimmedEmail) {
      setValidationError("Please enter your email address.");
      return;
    }

    if (!password) {
      setValidationError("Please enter your password.");
      return;
    }

    /**
     * -------------------------------------------------------------------------
     * Login Request
     * -------------------------------------------------------------------------
     */

    try {
      await login({
        email: trimmedEmail,
        password,
      });
    } catch {
      /**
       * AuthContext already stores the safe backend error message.
       *
       * Do not replace it here with a generic message.
       *
       * Examples:
       *
       * - "Invalid email or password."
       * - "Please verify your email before signing in."
       * - "This account has been deleted."
       *
       * The AuthContext remains responsible for translating the API error
       * into the authentication error state.
       */
    }
  };

  /**
   * ---------------------------------------------------------------------------
   * Registration Navigation
   * ---------------------------------------------------------------------------
   */

  const handleRegister = () => {
    if (isLoading) {
      return;
    }

    clearError();

    setValidationError(null);

    router.push("/(auth)/register");
  };

  /**
   * ---------------------------------------------------------------------------
   * Clear Error When Editing
   * ---------------------------------------------------------------------------
   */

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (validationError) {
      setValidationError(null);
    }

    if (authError) {
      clearError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (validationError) {
      setValidationError(null);
    }

    if (authError) {
      clearError();
    }
  };

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ----------------------------------------------------------------- */}
        {/* Logo                                                              */}
        {/* ----------------------------------------------------------------- */}

        <View style={styles.logoContainer}>
          <BrikaLogo />
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <View style={styles.header}>
          <BrikaText variant="h1">
            Welcome back
          </BrikaText>

          <BrikaText
            variant="body"
            color={colors.text.secondary}
            style={styles.subtitle}
          >
            Sign in to continue building with Brika.
          </BrikaText>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Email                                                             */}
        {/* ----------------------------------------------------------------- */}

        <BrikaInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        <View style={styles.fieldSpacing} />

        {/* ----------------------------------------------------------------- */}
        {/* Password                                                          */}
        {/* ----------------------------------------------------------------- */}

        <BrikaInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Authentication / Validation Error                                 */}
        {/* ----------------------------------------------------------------- */}

        {displayedError && (
          <View
            style={styles.errorContainer}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <BrikaText
              variant="bodySmall"
              color={colors.status.error}
              style={styles.errorText}
            >
              {displayedError}
            </BrikaText>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Sign In                                                           */}
        {/* ----------------------------------------------------------------- */}

        <View style={styles.buttonSpacing} />

        <BrikaButton
          title={isLoading ? "Signing In..." : "Sign In"}
          onPress={handleLogin}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Registration                                                      */}
        {/* ----------------------------------------------------------------- */}

        <View style={styles.registerContainer}>
          <BrikaText
            variant="bodySmall"
            color={colors.text.secondary}
          >
            Don't have an account?
          </BrikaText>

          <Pressable
            onPress={handleRegister}
            disabled={isLoading}
            hitSlop={8}
            style={({ pressed }) => [
              styles.registerButton,
              pressed &&
                !isLoading &&
                styles.registerButtonPressed,
            ]}
          >
            <BrikaText
              variant="bodySmall"
              color={colors.brand.accent}
              style={styles.registerText}
            >
              Create an account
            </BrikaText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
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

    backgroundColor: colors.background.primary,
  },

  content: {
    flex: 1,

    paddingHorizontal: spacing.xxl,

    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
  },

  header: {
    marginTop: spacing.xxl,

    marginBottom: spacing.xxl,
  },

  subtitle: {
    marginTop: spacing.sm,
  },

  fieldSpacing: {
    height: spacing.md,
  },

  errorContainer: {
    marginTop: spacing.md,

    paddingHorizontal: spacing.sm,
  },

  errorText: {
    lineHeight: 20,
  },

  buttonSpacing: {
    height: spacing.xl,
  },

  registerContainer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginTop: spacing.xl,
  },

  registerButton: {
    marginLeft: spacing.xs,

    paddingVertical: spacing.xs,
  },

  registerButtonPressed: {
    opacity: 0.65,
  },

  registerText: {
    fontWeight: "600",
  },
});