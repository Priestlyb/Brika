/**
 * -----------------------------------------------------------------------------
 * File: src/app/(auth)/reset-password.tsx
 * -----------------------------------------------------------------------------
 * Brika reset password screen.
 *
 * Allows a user to create a new password using the password reset token
 * received through the reset email.
 * -----------------------------------------------------------------------------
 */

import React, { useState } from "react";

import { SafeAreaView, StyleSheet, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import {
  BrikaButton,
  BrikaInput,
  BrikaLogo,
  BrikaText,
} from "@/components/ui/index";

import { colors, spacing } from "@/constants/theme/index";

import { useAuth } from "@/services/auth/auth.context";

/**
 * -----------------------------------------------------------------------------
 * Reset Password Screen
 * -----------------------------------------------------------------------------
 */

export default function ResetPasswordScreen() {
  const router = useRouter();

  const { token } = useLocalSearchParams<{
    token?: string;
  }>();

  const { resetPassword, isLoading, error, clearError } = useAuth();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [success, setSuccess] = useState(false);

  /**
   * ---------------------------------------------------------------------------
   * Reset Token
   * ---------------------------------------------------------------------------
   *
   * Expo Router can provide query parameters as either a string or an array.
   * Normalize the value before sending it to the backend.
   */

  const resetToken = Array.isArray(token) ? token[0] : token;

  /**
   * ---------------------------------------------------------------------------
   * Submit
   * ---------------------------------------------------------------------------
   */

  const handleResetPassword = async () => {
    clearError();

    setSuccess(false);

    if (!resetToken) {
      return;
    }

    await resetPassword({
      token: resetToken,
      password,
      confirmPassword,
    });

    setSuccess(true);
  };

  /**
   * ---------------------------------------------------------------------------
   * Password Change
   * ---------------------------------------------------------------------------
   */

  const handlePasswordChange = (value: string) => {
    if (error) {
      clearError();
    }

    if (success) {
      setSuccess(false);
    }

    setPassword(value);
  };

  /**
   * ---------------------------------------------------------------------------
   * Confirm Password Change
   * ---------------------------------------------------------------------------
   */

  const handleConfirmPasswordChange = (value: string) => {
    if (error) {
      clearError();
    }

    if (success) {
      setSuccess(false);
    }

    setConfirmPassword(value);
  };

  /**
   * ---------------------------------------------------------------------------
   * Missing Token
   * ---------------------------------------------------------------------------
   */

  if (!resetToken) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <BrikaLogo />

          <View style={styles.header}>
            <BrikaText variant="h1">Invalid reset link</BrikaText>

            <BrikaText variant="body" color={colors.text.secondary}>
              This password reset link is missing its token or is no longer
              valid.
            </BrikaText>
          </View>

          <View style={styles.buttonSpacing} />

          <BrikaButton
            title="Back to Sign In"
            onPress={() => router.replace("/(auth)/login")}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Success
   * ---------------------------------------------------------------------------
   */

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <BrikaLogo />

          <View style={styles.header}>
            <BrikaText variant="h1">Password updated</BrikaText>

            <BrikaText variant="body" color={colors.text.secondary}>
              Your password has been reset successfully. You can now sign in
              with your new password.
            </BrikaText>
          </View>

          <View style={styles.buttonSpacing} />

          <BrikaButton
            title="Back to Sign In"
            onPress={() => router.replace("/(auth)/login")}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BrikaLogo />

        <View style={styles.header}>
          <BrikaText variant="h1">Create a new password</BrikaText>

          <BrikaText variant="body" color={colors.text.secondary}>
            Choose a strong password for your Brika account.
          </BrikaText>
        </View>

        <BrikaInput
          label="New password"
          placeholder="••••••••"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        <View style={styles.fieldSpacing} />

        <BrikaInput
          label="Confirm password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        {error ? (
          <View style={styles.errorContainer}>
            <BrikaText variant="caption" color={colors.status.error}>
              {error}
            </BrikaText>
          </View>
        ) : null}

        <View style={styles.buttonSpacing} />

        <BrikaButton
          title={isLoading ? "Updating Password..." : "Update Password"}
          onPress={handleResetPassword}
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

    backgroundColor: colors.background.primary,
  },

  content: {
    flex: 1,

    padding: spacing.xxl,

    justifyContent: "center",
  },

  header: {
    marginTop: spacing.huge,

    marginBottom: spacing.xxxl,

    gap: spacing.md,
  },

  fieldSpacing: {
    height: spacing.lg,
  },

  errorContainer: {
    marginTop: spacing.md,
  },

  buttonSpacing: {
    height: spacing.xxxl,
  },
});
