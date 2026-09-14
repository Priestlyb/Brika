import React, { useState } from "react";

import { SafeAreaView, StyleSheet, View } from "react-native";

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
 * Register Screen
 * -----------------------------------------------------------------------------
 */

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * ---------------------------------------------------------------------------
   * Submit
   * ---------------------------------------------------------------------------
   */

  const handleRegister = async () => {
    clearError();

    await register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
  };

  /**
   * ---------------------------------------------------------------------------
   * Input Change Helpers
   * ---------------------------------------------------------------------------
   */

  const handleFirstNameChange = (value: string) => {
    if (error) {
      clearError();
    }

    setFirstName(value);
  };

  const handleLastNameChange = (value: string) => {
    if (error) {
      clearError();
    }

    setLastName(value);
  };

  const handleEmailChange = (value: string) => {
    if (error) {
      clearError();
    }

    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    if (error) {
      clearError();
    }

    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    if (error) {
      clearError();
    }

    setConfirmPassword(value);
  };

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
          <BrikaText variant="h1">Create your account</BrikaText>

          <BrikaText variant="body" color={colors.text.secondary}>
            Start building with Brika.
          </BrikaText>
        </View>

        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <BrikaInput
              label="First name"
              placeholder="John"
              value={firstName}
              onChangeText={handleFirstNameChange}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.nameField}>
            <BrikaInput
              label="Last name"
              placeholder="Doe"
              value={lastName}
              onChangeText={handleLastNameChange}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.fieldSpacing} />

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
          title={isLoading ? "Creating Account..." : "Create Account"}
          onPress={handleRegister}
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
  },

  nameRow: {
    flexDirection: "row",
    gap: spacing.md,
  },

  nameField: {
    flex: 1,
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
