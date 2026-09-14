/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/BrikaBadge.tsx
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/constants/theme/index";

import { BrikaText } from "./BrikaText";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BrikaBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function BrikaBadge({ label, variant = "neutral" }: BrikaBadgeProps) {
  return (
    <View style={[styles.badge, styles[`${variant}Background`]]}>
      <BrikaText variant="captionMedium" color={styles[`${variant}Text`].color}>
        {label}
      </BrikaText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },

  successBackground: {
    backgroundColor: colors.status.successBackground,
  },

  warningBackground: {
    backgroundColor: colors.status.warningBackground,
  },

  errorBackground: {
    backgroundColor: colors.status.errorBackground,
  },

  infoBackground: {
    backgroundColor: colors.status.infoBackground,
  },

  neutralBackground: {
    backgroundColor: colors.background.secondary,
  },

  successText: {
    color: colors.status.success,
  },

  warningText: {
    color: colors.status.warning,
  },

  errorText: {
    color: colors.status.error,
  },

  infoText: {
    color: colors.status.info,
  },

  neutralText: {
    color: colors.text.secondary,
  },
});
