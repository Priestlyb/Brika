/**
 * -----------------------------------------------------------------------------
 * File: src/components/files/FileEmptyState.tsx
 * -----------------------------------------------------------------------------
 * Brika File Empty State
 *
 * Responsibilities:
 *
 * - Display an empty state when a project has no files.
 * - Provide optional primary action support.
 * - Follow the centralized Brika design system.
 * - Remain responsive across web and mobile.
 * -----------------------------------------------------------------------------
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

export interface FileEmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}

export function FileEmptyState({
  title = "No files yet",
  message = "Upload a supported design file to get started.",
  actionLabel = "Upload file",
  onAction,
  disabled = false,
}: FileEmptyStateProps) {
  const hasAction = Boolean(onAction);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="document-outline"
          size={28}
          color={colors.text.secondary}
        />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.message}>{message}</Text>

      {hasAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          accessibilityState={{
            disabled,
          }}
          disabled={disabled}
          onPress={onAction}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && !disabled && styles.actionButtonPressed,
            disabled && styles.actionButtonDisabled,
          ]}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={18}
            color={colors.text.inverse}
          />

          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },

  iconContainer: {
    width: 64,
    height: 64,
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
  },

  title: {
    marginBottom: spacing.sm,
    color: colors.text.primary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
  },

  message: {
    maxWidth: 420,
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  actionButton: {
    minHeight: 44,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.brand.primary,
  },

  actionButtonPressed: {
    opacity: 0.85,
  },

  actionButtonDisabled: {
    opacity: 0.5,
  },

  actionLabel: {
    color: colors.text.inverse,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});

export default FileEmptyState;
