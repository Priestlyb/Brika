/**
 * -----------------------------------------------------------------------------
 * File: src/app/(auth)/forgot-password.tsx
 * -----------------------------------------------------------------------------
 * Brika forgot password screen.
 *
 * Allows a user to request a password reset email.
 * -----------------------------------------------------------------------------
 */

import React, { useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

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

import {
  useAuth,
} from "@/services/auth/auth.context";

/**
 * -----------------------------------------------------------------------------
 * Forgot Password Screen
 * -----------------------------------------------------------------------------
 */

export default function ForgotPasswordScreen() {
  const {
    forgotPassword,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  /**
   * ---------------------------------------------------------------------------
   * Submit
   * ---------------------------------------------------------------------------
   */

  const handleSubmit = async () => {
    clearError();

    setSubmitted(false);

    await forgotPassword({
      email,
    });

    /**
     * The backend intentionally returns the same
     * response whether or not the email exists.
     *
     * If the request succeeds, show a generic
     * confirmation message.
     */

    setSubmitted(true);
  };

  /**
   * ---------------------------------------------------------------------------
   * Email Change
   * ---------------------------------------------------------------------------
   */

  const handleEmailChange = (
    value: string,
  ) => {
    if (error) {
      clearError();
    }

    if (submitted) {
      setSubmitted(false);
    }

    setEmail(value);
  };

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.content}>
        <BrikaLogo />

        <View style={styles.header}>
          <BrikaText variant="h1">
            Forgot your password?
          </BrikaText>

          <BrikaText
            variant="body"
            color={colors.text.secondary}
          >
            Enter your email address and we'll send
            you instructions to reset your password.
          </BrikaText>
        </View>

        <BrikaInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={
            handleEmailChange
          }
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        {error ? (
          <View
            style={styles.errorContainer}
          >
            <BrikaText
              variant="caption"
              color={colors.status.error}
            >
              {error}
            </BrikaText>
          </View>
        ) : null}

        {submitted && !error ? (
          <View
            style={styles.successContainer}
          >
            <BrikaText
              variant="caption"
              color={colors.brand.accent}
            >
              If an account exists for this email,
              password reset instructions have been
              sent.
            </BrikaText>
          </View>
        ) : null}

        <View
          style={styles.buttonSpacing}
        />

        <BrikaButton
          title={
            isLoading
              ? "Sending..."
              : "Send Reset Link"
          }
          onPress={
            handleSubmit
          }
        />
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

    backgroundColor:
      colors.background.primary,
  },

  content: {
    flex: 1,

    padding:
      spacing.xxl,

    justifyContent:
      "center",
  },

  header: {
    marginTop:
      spacing.huge,

    marginBottom:
      spacing.xxxl,

    gap:
      spacing.md,
  },

  errorContainer: {
    marginTop:
      spacing.md,
  },

  successContainer: {
    marginTop:
      spacing.md,
  },

  buttonSpacing: {
    height:
      spacing.xxxl,
  },
});