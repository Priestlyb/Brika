/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/ProjectMembersActions.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project members screen actions.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

export interface ProjectMembersActionsProps {
  onLeave: () => void;

  isLeaving?: boolean;

  canLeave?: boolean;

  leaveLabel?: string;

  leaveDescription?: string;
}

export function ProjectMembersActions({
  onLeave,
  isLeaving = false,
  canLeave = true,
  leaveLabel = "Leave project",
  leaveDescription = "Remove yourself from this project.",
}: ProjectMembersActionsProps) {
  if (!canLeave) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={leaveLabel}
        accessibilityState={{
          disabled: isLeaving,
          busy: isLeaving,
        }}
        disabled={isLeaving}
        onPress={onLeave}
        style={({ pressed }) => [
          styles.action,
          pressed && !isLeaving && styles.actionPressed,
          isLeaving && styles.actionDisabled,
        ]}
      >
        <View style={styles.iconContainer}>
          {isLeaving ? (
            <ActivityIndicator size="small" color={colors.status.error} />
          ) : (
            <Ionicons
              name="exit-outline"
              size={20}
              color={colors.status.error}
            />
          )}
        </View>

        <View style={styles.textContainer}>
          <ThemedText type="smallBold" style={styles.actionTitle}>
            {isLeaving ? "Leaving project..." : leaveLabel}
          </ThemedText>

          {!isLeaving ? (
            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.actionDescription}
            >
              {leaveDescription}
            </ThemedText>
          ) : null}
        </View>

        {!isLeaving ? (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.text.secondary}
          />
        ) : null}
      </Pressable>
    </View>
  );
}

export default ProjectMembersActions;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.light,
    marginBottom: spacing.md,
  },

  action: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
  },

  actionPressed: {
    opacity: 0.7,
  },

  actionDisabled: {
    opacity: 0.6,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    backgroundColor: colors.status.errorBackground,
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
  },

  actionTitle: {
    color: colors.status.error,
  },

  actionDescription: {
    marginTop: 2,
  },
});
