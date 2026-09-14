/**
 * -----------------------------------------------------------------------------
 * File: src/app/(auth)/verify-email.tsx
 * -----------------------------------------------------------------------------
 * Brika email verification screen.
 *
 * Handles the verification token supplied by the backend verification email.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";

import { SafeAreaView, StyleSheet, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { BrikaButton, BrikaLogo, BrikaText } from "@/components/ui/index";

import { colors, spacing } from "@/constants/theme/index";

import { useAuth } from "@/services/auth/auth.context";

/**
 * -----------------------------------------------------------------------------
 * Verify Email Screen
 * -----------------------------------------------------------------------------
 */

export default function VerifyEmailScreen() {
  const router = useRouter();

  const { token } = useLocalSearchParams<{
    token?: string;
  }>();

  const { verifyEmail, isLoading, error, clearError } = useAuth();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  /**
   * ---------------------------------------------------------------------------
   * Normalize Token
   * ---------------------------------------------------------------------------
   */

  const verificationToken = Array.isArray(token) ? token[0] : token;

  /**
   * ---------------------------------------------------------------------------
   * Verify Email
   * ---------------------------------------------------------------------------
   *
   * Automatically verify the email when the screen receives a valid token.
   */

  useEffect(() => {
    if (!verificationToken) {
      return;
    }

    let mounted = true;

    const verify = async () => {
      clearError();

      try {
        await verifyEmail(verificationToken);

        if (mounted) {
          setStatus("success");
        }
      } catch {
        if (mounted) {
          setStatus("error");
        }
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [verificationToken]);

  /**
   * ---------------------------------------------------------------------------
   * Missing Token
   * ---------------------------------------------------------------------------
   */

  if (!verificationToken) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <BrikaLogo />

          <View style={styles.header}>
            <BrikaText variant="h1">Invalid verification link</BrikaText>

            <BrikaText variant="body" color={colors.text.secondary}>
              This email verification link is missing its token or is no longer
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
   * Loading
   * ---------------------------------------------------------------------------
   */

  if (isLoading && status === "idle") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <BrikaLogo />

          <View style={styles.header}>
            <BrikaText variant="h1">Verifying your email</BrikaText>

            <BrikaText variant="body" color={colors.text.secondary}>
              Please wait while we verify your Brika account.
            </BrikaText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Success
   * ---------------------------------------------------------------------------
   */

  if (status === "success") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <BrikaLogo />

          <View style={styles.header}>
            <BrikaText variant="h1">Email verified</BrikaText>

            <BrikaText variant="body" color={colors.text.secondary}>
              Your email has been verified successfully. You can now sign in to
              your Brika account.
            </BrikaText>
          </View>

          <View style={styles.buttonSpacing} />

          <BrikaButton
            title="Continue to Sign In"
            onPress={() => router.replace("/(auth)/login")}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Error
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BrikaLogo />

        <View style={styles.header}>
          <BrikaText variant="h1">Verification failed</BrikaText>

          <BrikaText variant="body" color={colors.text.secondary}>
            {error ??
              "We couldn't verify your email. The link may have expired or is no longer valid."}
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

  buttonSpacing: {
    height: spacing.xxxl,
  },
});
