/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/ProjectMembersEmptyState.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project members loading, error, and empty states.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

export interface ProjectMembersEmptyStateProps {
  isLoading?: boolean;
  error?: unknown | null;
  canManageMembers?: boolean;
  onRetry?: () => void | Promise<void>;
  onAddMember?: () => void;
  getErrorMessage?: (error: unknown, fallback: string) => string;
}

function defaultGetErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

export function ProjectMembersEmptyState({
  isLoading = false,
  error = null,
  canManageMembers = true,
  onRetry,
  onAddMember,
  getErrorMessage = defaultGetErrorMessage,
}: ProjectMembersEmptyStateProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="small" color={colors.brand.accent} />

        <ThemedText
          type="small"
          themeColor="secondary"
          style={styles.loadingText}
        >
          Loading members...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={30}
            color={colors.brand.accent}
          />
        </View>

        <ThemedText type="title" style={styles.emptyTitle}>
          Unable to load members
        </ThemedText>

        <ThemedText
          type="small"
          themeColor="secondary"
          style={styles.emptyDescription}
        >
          {getErrorMessage(error, "Unable to load project members.")}
        </ThemedText>

        {onRetry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading members"
            onPress={() => {
              void onRetry();
            }}
            style={styles.emptyAction}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.text.inverse}
            />

            <ThemedText type="smallBold" themeColor="inverse">
              Try again
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="people-outline" size={30} color={colors.brand.accent} />
      </View>

      <ThemedText type="title" style={styles.emptyTitle}>
        No project members
      </ThemedText>

      <ThemedText
        type="small"
        themeColor="secondary"
        style={styles.emptyDescription}
      >
        Add people to this project to collaborate on files, models, comments,
        and project activity.
      </ThemedText>

      {canManageMembers && onAddMember ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add project member"
          onPress={onAddMember}
          style={styles.emptyAction}
        >
          <Ionicons
            name="person-add-outline"
            size={18}
            color={colors.text.inverse}
          />

          <ThemedText type="smallBold" themeColor="inverse">
            Add member
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

export default ProjectMembersEmptyState;

const styles = StyleSheet.create({
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },

  loadingText: {
    marginTop: spacing.sm,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    backgroundColor: colors.background.secondary,
  },

  emptyTitle: {
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  emptyDescription: {
    maxWidth: 420,
    textAlign: "center",
    lineHeight: 20,
  },

  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.brand.accent,
  },
});
