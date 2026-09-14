/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectOverview.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Overview section for the Project Details screen.
 *
 * Responsibilities:
 *
 * - Display the project's description.
 * - Display core project metadata.
 * - Display project status.
 * - Display project visibility.
 * - Display useful project statistics when available.
 *
 * This component does NOT:
 *
 * - Fetch project data.
 * - Perform API requests.
 * - Navigate.
 * - Mutate project state.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  PROJECT_STATUS_LABELS,
  PROJECT_VISIBILITY_LABELS,
} from "@/constants/project.constants";

import type { Project } from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import { typography } from "@/constants/theme/typography";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectOverviewProps {
  /**
   * Project displayed by the overview.
   */
  project: Project;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <View style={styles.container}>
      {/* -----------------------------------------------------------------
       * Section Header
       * ----------------------------------------------------------------- */}

      <View style={styles.sectionHeader}>
        <ThemedText type="title">Overview</ThemedText>

        <ThemedText type="small" themeColor="secondary">
          Project information and details
        </ThemedText>
      </View>

      {/* -----------------------------------------------------------------
       * Description
       * ----------------------------------------------------------------- */}

      <View style={styles.descriptionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.brand.accent}
            />
          </View>

          <ThemedText type="smallBold">Description</ThemedText>
        </View>

        {project.description ? (
          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.description}
          >
            {project.description}
          </ThemedText>
        ) : (
          <ThemedText
            type="small"
            themeColor="muted"
            style={styles.emptyDescription}
          >
            No project description has been added yet.
          </ThemedText>
        )}
      </View>

      {/* -----------------------------------------------------------------
       * Project Details
       * ----------------------------------------------------------------- */}

      <View style={styles.detailsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.brand.accent}
            />
          </View>

          <ThemedText type="smallBold">Project details</ThemedText>
        </View>

        <View style={styles.detailsGrid}>
          <DetailItem
            icon="pulse-outline"
            label="Status"
            value={PROJECT_STATUS_LABELS[project.status]}
            valueStyle={getStatusTextStyle(project.status)}
          />

          <DetailItem
            icon={getVisibilityIcon(project.visibility)}
            label="Visibility"
            value={PROJECT_VISIBILITY_LABELS[project.visibility]}
          />

          <DetailItem
            icon="calendar-outline"
            label="Created"
            value={formatDate(project.createdAt)}
          />

          <DetailItem
            icon="refresh-outline"
            label="Last updated"
            value={formatDate(project.updatedAt)}
          />
        </View>
      </View>

      {/* -----------------------------------------------------------------
       * Project Statistics
       * -----------------------------------------------------------------
       *
       * These values are intentionally derived only when the Project
       * object exposes them. This keeps the component compatible with
       * a minimal Project API response.
       * ----------------------------------------------------------------- */}

      <ProjectStatistics project={project} />
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Detail Item
 * -----------------------------------------------------------------------------
 */

interface DetailItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueStyle?: object;
}

function DetailItem({ icon, label, value, valueStyle }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Ionicons name={icon} size={17} color={colors.text.secondary} />

      <View style={styles.detailContent}>
        <ThemedText type="small" themeColor="muted">
          {label}
        </ThemedText>

        <ThemedText type="smallBold" style={valueStyle}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Project Statistics
 * -----------------------------------------------------------------------------
 *
 * The backend may not currently return all of these values on every Project
 * response. Therefore we only render statistics that actually exist.
 */

function ProjectStatistics({ project }: { project: Project }) {
  const projectRecord = project as Project & Record<string, unknown>;

  const membersCount = getNumericValue(projectRecord.membersCount);

  const filesCount = getNumericValue(projectRecord.filesCount);

  const modelsCount = getNumericValue(projectRecord.modelsCount);

  const hasStatistics =
    membersCount !== null || filesCount !== null || modelsCount !== null;

  if (!hasStatistics) {
    return null;
  }

  return (
    <View style={styles.statisticsCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="stats-chart-outline"
            size={18}
            color={colors.brand.accent}
          />
        </View>

        <ThemedText type="smallBold">Project summary</ThemedText>
      </View>

      <View style={styles.statisticsGrid}>
        {membersCount !== null ? (
          <StatisticItem
            icon="people-outline"
            label="Members"
            value={membersCount}
          />
        ) : null}

        {filesCount !== null ? (
          <StatisticItem
            icon="document-outline"
            label="Files"
            value={filesCount}
          />
        ) : null}

        {modelsCount !== null ? (
          <StatisticItem
            icon="cube-outline"
            label="Models"
            value={modelsCount}
          />
        ) : null}
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Statistic Item
 * -----------------------------------------------------------------------------
 */

function StatisticItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statisticItem}>
      <Ionicons name={icon} size={18} color={colors.brand.accent} />

      <View style={styles.statisticContent}>
        <ThemedText type="subtitle" style={styles.statisticValue}>
          {value}
        </ThemedText>

        <ThemedText type="small" themeColor="secondary">
          {label}
        </ThemedText>
      </View>
    </View>
  );
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
 * Status Color
 * -----------------------------------------------------------------------------
 */

function getStatusTextStyle(status: Project["status"]) {
  switch (status) {
    case "ACTIVE":
      return {
        color: colors.status.success,
      };

    case "ARCHIVED":
      return {
        color: colors.text.secondary,
      };

    case "DELETED":
      return {
        color: colors.status.error,
      };

    default:
      return {
        color: colors.text.secondary,
      };
  }
}

/**
 * -----------------------------------------------------------------------------
 * Numeric Value Helper
 * -----------------------------------------------------------------------------
 */

function getNumericValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * -----------------------------------------------------------------------------
 * Date Formatting
 * -----------------------------------------------------------------------------
 */

function formatDate(value: string): string {
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
    gap: spacing.lg,

    paddingHorizontal: spacing.lg,

    paddingVertical: spacing.xl,
  },

  sectionHeader: {
    gap: spacing.xs,
  },

  descriptionCard: {
    backgroundColor: colors.background.surface,

    borderColor: colors.border.light,

    borderRadius: radius.lg,

    borderWidth: 1,

    padding: spacing.lg,
  },

  detailsCard: {
    backgroundColor: colors.background.surface,

    borderColor: colors.border.light,

    borderRadius: radius.lg,

    borderWidth: 1,

    padding: spacing.lg,
  },

  statisticsCard: {
    backgroundColor: colors.background.surface,

    borderColor: colors.border.light,

    borderRadius: radius.lg,

    borderWidth: 1,

    padding: spacing.lg,
  },

  cardHeader: {
    alignItems: "center",

    flexDirection: "row",

    gap: spacing.sm,

    marginBottom: spacing.md,
  },

  iconContainer: {
    alignItems: "center",

    backgroundColor: colors.brand.accentLight,

    borderRadius: radius.sm,

    height: 34,

    justifyContent: "center",

    width: 34,
  },

  description: {
    lineHeight: typography.bodySmall.lineHeight,
  },

  emptyDescription: {
    fontStyle: "italic",
  },

  detailsGrid: {
    gap: spacing.lg,
  },

  detailItem: {
    alignItems: "flex-start",

    flexDirection: "row",

    gap: spacing.sm,
  },

  detailContent: {
    flex: 1,

    gap: 2,
  },

  statisticsGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: spacing.lg,
  },

  statisticItem: {
    alignItems: "center",

    flexDirection: "row",

    gap: spacing.sm,

    minWidth: 100,
  },

  statisticContent: {
    gap: 2,
  },

  statisticValue: {
    fontSize: typography.h3.fontSize,

    lineHeight: typography.h3.lineHeight,
  },
});

export default ProjectOverview;
