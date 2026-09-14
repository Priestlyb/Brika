/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectHeader.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Header for the Project Details screen.
 *
 * Responsibilities:
 *
 * - Display the project name.
 * - Display the project description.
 * - Display project status.
 * - Display project visibility.
 * - Provide an optional back/action area.
 *
 * This component does NOT:
 *
 * - Fetch project data.
 * - Perform API requests.
 * - Navigate directly.
 * - Manage project state.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  PROJECT_STATUS_LABELS,
  PROJECT_VISIBILITY_LABELS,
} from "@/constants/project.constants";

import type { Project } from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";
import { typography } from "@/constants/theme/typography";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectHeaderProps {
  /**
   * Project being displayed.
   */
  project: Project;

  /**
   * Optional back handler.
   *
   * Navigation remains outside the component.
   */
  onBack?: () => void;

  /**
   * Optional action handler.
   *
   * Typically used for a project actions menu.
   */
  onActionPress?: () => void;

  /**
   * Disable interactive controls.
   */
  disabled?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectHeader({
  project,
  onBack,
  onActionPress,
  disabled = false,
}: ProjectHeaderProps) {
  return (
    <View style={styles.container}>
      {/* -----------------------------------------------------------------
       * Navigation / Actions
       * ----------------------------------------------------------------- */}

      {(onBack || onActionPress) && (
        <View style={styles.topBar}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityState={{
                disabled,
              }}
              disabled={disabled}
              hitSlop={8}
              onPress={onBack}
              style={({ pressed }) => [
                styles.iconButton,

                pressed && !disabled && styles.iconButtonPressed,

                disabled && styles.disabled,
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={colors.text.primary}
              />
            </Pressable>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}

          {onActionPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Project actions"
              accessibilityState={{
                disabled,
              }}
              disabled={disabled}
              hitSlop={8}
              onPress={onActionPress}
              style={({ pressed }) => [
                styles.iconButton,

                pressed && !disabled && styles.iconButtonPressed,

                disabled && styles.disabled,
              ]}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={22}
                color={colors.text.primary}
              />
            </Pressable>
          ) : null}
        </View>
      )}

      {/* -----------------------------------------------------------------
       * Project Identity
       * ----------------------------------------------------------------- */}

      <View style={styles.identity}>
        <View style={styles.titleRow}>
          <ThemedText type="subtitle" numberOfLines={2} style={styles.title}>
            {project.name}
          </ThemedText>

          <StatusIndicator status={project.status} />
        </View>

        {project.description ? (
          <ThemedText
            type="small"
            themeColor="secondary"
            numberOfLines={3}
            style={styles.description}
          >
            {project.description}
          </ThemedText>
        ) : null}
      </View>

      {/* -----------------------------------------------------------------
       * Metadata
       * ----------------------------------------------------------------- */}

      <View style={styles.metadata}>
        <MetadataItem
          icon={getVisibilityIcon(project.visibility)}
          label={PROJECT_VISIBILITY_LABELS[project.visibility]}
        />

        <View style={styles.metadataDivider} />

        <MetadataItem
          icon="calendar-outline"
          label={formatProjectDate(project.createdAt)}
          prefix="Created"
        />

        <View style={styles.metadataDivider} />

        <MetadataItem
          icon="time-outline"
          label={formatProjectDate(project.updatedAt)}
          prefix="Updated"
        />
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Status Indicator
 * -----------------------------------------------------------------------------
 */

interface StatusIndicatorProps {
  status: Project["status"];
}

function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <View style={[styles.statusBadge, getStatusBadgeStyle(status)]}>
      <View style={[styles.statusDot, getStatusDotStyle(status)]} />

      <ThemedText
        type="smallBold"
        themeColor="secondary"
        style={getStatusTextStyle(status)}
      >
        {PROJECT_STATUS_LABELS[status]}
      </ThemedText>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Metadata Item
 * -----------------------------------------------------------------------------
 */

interface MetadataItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  prefix?: string;
}

function MetadataItem({ icon, label, prefix }: MetadataItemProps) {
  return (
    <View style={styles.metadataItem}>
      <Ionicons name={icon} size={15} color={colors.text.secondary} />

      <View style={styles.metadataContent}>
        {prefix ? (
          <ThemedText
            type="small"
            themeColor="muted"
            style={styles.metadataPrefix}
          >
            {prefix}
          </ThemedText>
        ) : null}

        <ThemedText type="small" themeColor="secondary" numberOfLines={1}>
          {label}
        </ThemedText>
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Status Styles
 * -----------------------------------------------------------------------------
 */

function getStatusBadgeStyle(status: Project["status"]) {
  switch (status) {
    case "ACTIVE":
      return styles.statusBadgeActive;

    case "ARCHIVED":
      return styles.statusBadgeArchived;

    case "DELETED":
      return styles.statusBadgeDeleted;

    default:
      return styles.statusBadgeDefault;
  }
}

function getStatusDotStyle(status: Project["status"]) {
  switch (status) {
    case "ACTIVE":
      return styles.statusDotActive;

    case "ARCHIVED":
      return styles.statusDotArchived;

    case "DELETED":
      return styles.statusDotDeleted;

    default:
      return styles.statusDotDefault;
  }
}

function getStatusTextStyle(status: Project["status"]) {
  switch (status) {
    case "ACTIVE":
      return styles.statusTextActive;

    case "ARCHIVED":
      return styles.statusTextArchived;

    case "DELETED":
      return styles.statusTextDeleted;

    default:
      return styles.statusTextDefault;
  }
}

/**
 * -----------------------------------------------------------------------------
 * Visibility Icon
 * -----------------------------------------------------------------------------
 */

function getVisibilityIcon(
  visibility: Project["visibility"],
): keyof typeof Ionicons.glyphMap {
  switch (visibility) {
    case "PUBLIC":
      return "globe-outline";

    case "TEAM":
      return "people-outline";

    case "PRIVATE":
    default:
      return "lock-closed-outline";
  }
}

/**
 * -----------------------------------------------------------------------------
 * Date Formatting
 * -----------------------------------------------------------------------------
 */

function formatProjectDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface,

    borderBottomColor: colors.border.light,

    borderBottomWidth: 1,

    paddingHorizontal: spacing.lg,

    paddingTop: spacing.md,

    paddingBottom: spacing.xl,
  },

  topBar: {
    alignItems: "center",

    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: spacing.lg,
  },

  iconButton: {
    alignItems: "center",

    justifyContent: "center",

    minHeight: 40,

    minWidth: 40,
  },

  iconButtonPressed: {
    opacity: 0.6,
  },

  iconPlaceholder: {
    minHeight: 40,

    minWidth: 40,
  },

  disabled: {
    opacity: 0.5,
  },

  identity: {
    width: "100%",
  },

  titleRow: {
    alignItems: "flex-start",

    flexDirection: "row",

    gap: spacing.sm,
  },

  title: {
    flex: 1,

    fontSize: typography.h2.fontSize,

    lineHeight: typography.h2.lineHeight,
  },

  statusBadge: {
    alignItems: "center",

    borderRadius: 999,

    flexDirection: "row",

    gap: spacing.xs,

    marginTop: 4,

    paddingHorizontal: spacing.sm,

    paddingVertical: spacing.xs,
  },

  statusBadgeActive: {
    backgroundColor: colors.status.successBackground,
  },

  statusBadgeArchived: {
    backgroundColor: colors.background.secondary,
  },

  statusBadgeDeleted: {
    backgroundColor: colors.status.errorBackground,
  },

  statusBadgeDefault: {
    backgroundColor: colors.background.secondary,
  },

  statusDot: {
    borderRadius: 999,

    height: 6,

    width: 6,
  },

  statusDotActive: {
    backgroundColor: colors.status.success,
  },

  statusDotArchived: {
    backgroundColor: colors.text.tertiary,
  },

  statusDotDeleted: {
    backgroundColor: colors.status.error,
  },

  statusDotDefault: {
    backgroundColor: colors.text.tertiary,
  },

  statusTextActive: {
    color: colors.status.success,
  },

  statusTextArchived: {
    color: colors.text.secondary,
  },

  statusTextDeleted: {
    color: colors.status.error,
  },

  statusTextDefault: {
    color: colors.text.secondary,
  },

  description: {
    marginTop: spacing.sm,

    maxWidth: 720,
  },

  metadata: {
    alignItems: "center",

    flexDirection: "row",

    marginTop: spacing.xl,

    gap: spacing.md,
  },

  metadataItem: {
    alignItems: "center",

    flexDirection: "row",

    flexShrink: 1,

    gap: spacing.xs,
  },

  metadataContent: {
    flexShrink: 1,
  },

  metadataPrefix: {
    marginBottom: 2,
  },

  metadataDivider: {
    backgroundColor: colors.border.light,

    height: 28,

    width: 1,
  },
});

export default ProjectHeader;
