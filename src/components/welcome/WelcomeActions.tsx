/**
 * -----------------------------------------------------------------------------
 * File: src/components/welcome/WelcomeActions.tsx
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { BrikaButton, BrikaText } from "@/components/ui/index";

import { colors, spacing } from "@/constants/theme/index";

type Props = {
  selectedPlanName: string;
  onCreateAccount: () => void;
  onSignIn: () => void;
};

export function WelcomeActions({
  selectedPlanName,
  onCreateAccount,
  onSignIn,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.selectedPlan}>
        <View style={styles.planDot} />

        <BrikaText
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.planText}
        >
          Selected plan:
        </BrikaText>

        <BrikaText
          variant="bodySmall"
          color={colors.text.primary}
          style={styles.planName}
        >
          {selectedPlanName}
        </BrikaText>
      </View>

      <BrikaButton
        title={
          selectedPlanName === "Free"
            ? "Start building"
            : `Continue with ${selectedPlanName}`
        }
        onPress={onCreateAccount}
      />

      <Pressable
        onPress={onSignIn}
        hitSlop={8}
        style={({ pressed }) => [
          styles.signInButton,
          pressed && styles.pressed,
        ]}
      >
        <BrikaText
          variant="body"
          color={colors.text.primary}
          style={styles.signInText}
        >
          Already have an account?{" "}
          <BrikaText
            variant="body"
            color={colors.brand.accent}
            style={styles.signInLink}
          >
            Sign in
          </BrikaText>
        </BrikaText>
      </Pressable>

      <BrikaText
        variant="bodySmall"
        color={colors.text.secondary}
        style={styles.footer}
      >
        You can change your plan at any time.
      </BrikaText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
  },

  selectedPlan: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  planDot: {
    width: 6,
    height: 6,
    marginRight: spacing.xs,
    borderRadius: 3,
    backgroundColor: colors.brand.accent,
  },

  planText: {
    marginRight: spacing.xs,
  },

  planName: {
    fontWeight: "700",
  },

  signInButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },

  pressed: {
    opacity: 0.6,
  },

  signInText: {
    textAlign: "center",
  },

  signInLink: {
    fontWeight: "700",
  },

  footer: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
