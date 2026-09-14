/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectActivityItem.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Individual project activity item.
 *
 * Responsibilities:
 *
 * - Display the activity actor.
 * - Display the activity description/action.
 * - Display the activity timestamp.
 * - Display a contextual activity icon.
 * - Optionally allow the activity to be selected.
 *
 * This component does NOT:
 *
 * - Fetch activity.
 * - Perform API requests.
 * - Mutate activity.
 * - Navigate.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { ProjectActivity } from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectActivityItemProps {
  /**
   * Activity entry to render.
   */
  activity: ProjectActivity;

  /**
   * Optional callback when the activity is selected.
   */
  onPress?: () => void;

  /**
   * Optional custom container style.
   */
  style?: ViewStyle;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectActivityItem({
  activity,
  onPress,
  style,
}: ProjectActivityItemProps) {
  const actorName = getActorName(activity);

  const description = getActivityDescription(activity);

  const timestamp = getActivityTimestamp(activity);

  const activityType = getActivityType(activity);

  const icon = getActivityIcon(activityType);

  const iconColor = getActivityIconColor(activityType);

  const content = (
    <>
      {/* -----------------------------------------------------------------
       * Activity Icon
       * ----------------------------------------------------------------- */}

      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: getActivityIconBackground(activityType),
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      {/* -----------------------------------------------------------------
       * Activity Content
       * ----------------------------------------------------------------- */}

      <View style={styles.content}>
        <ThemedText type="small" numberOfLines={3}>
          {actorName !== "System" ? (
            <ThemedText type="smallBold">{actorName}</ThemedText>
          ) : null}

          {actorName !== "System" ? " " : ""}

          {description}
        </ThemedText>

        {timestamp ? (
          <ThemedText type="small" themeColor="tertiary" numberOfLines={1}>
            {timestamp}
          </ThemedText>
        ) : null}
      </View>

      {/* -----------------------------------------------------------------
       * Navigation Indicator
       * ----------------------------------------------------------------- */}

      {onPress ? (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.text.tertiary}
        />
      ) : null}
    </>
  );

  /**
   * -------------------------------------------------------------------------
   * Interactive Activity
   * -------------------------------------------------------------------------
   */

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${actorName} ${description}`}
        accessibilityHint="Open activity details."
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          style,
          pressed && styles.pressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * Static Activity
   * -------------------------------------------------------------------------
   */

  return <View style={[styles.container, style]}>{content}</View>;
}

/**
 * -----------------------------------------------------------------------------
 * Actor Name
 * -----------------------------------------------------------------------------
 */

function getActorName(activity: ProjectActivity): string {
  const value = activity as ProjectActivity & {
    user?: {
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      email?: string | null;
    };

    actor?: {
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      email?: string | null;
    };

    userName?: string | null;
    actorName?: string | null;
    createdByName?: string | null;
  };

  const profile = value.user ?? value.actor;

  if (profile) {
    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (fullName) {
      return fullName;
    }

    if (profile.name) {
      return profile.name;
    }

    if (profile.email) {
      return profile.email;
    }
  }

  return value.userName ?? value.actorName ?? value.createdByName ?? "System";
}

/**
 * -----------------------------------------------------------------------------
 * Activity Description
 * -----------------------------------------------------------------------------
 */

function getActivityDescription(activity: ProjectActivity): string {
  const value = activity as ProjectActivity & {
    description?: string | null;
    message?: string | null;
    action?: string | null;
    event?: string | null;
    type?: string | null;
  };

  if (value.description) {
    return value.description;
  }

  if (value.message) {
    return value.message;
  }

  const action = value.action ?? value.event ?? value.type;

  if (action) {
    return formatActivityAction(action);
  }

  return "updated the project";
}

/**
 * -----------------------------------------------------------------------------
 * Activity Type
 * -----------------------------------------------------------------------------
 */

function getActivityType(activity: ProjectActivity): string {
  const value = activity as ProjectActivity & {
    action?: string | null;
    event?: string | null;
    type?: string | null;
  };

  return (value.action ?? value.event ?? value.type ?? "updated").toLowerCase();
}

/**
 * -----------------------------------------------------------------------------
 * Activity Timestamp
 * -----------------------------------------------------------------------------
 */

function getActivityTimestamp(activity: ProjectActivity): string | null {
  const value = activity as ProjectActivity & {
    createdAt?: string | Date | null;
    timestamp?: string | Date | null;
    updatedAt?: string | Date | null;
  };

  /**
   * Treat the extracted value as unknown before narrowing.
   *
   * This prevents TypeScript from incorrectly rejecting the Date
   * instanceof check when ProjectActivity already defines one of these
   * properties with a narrower type.
   */
  const rawDate: unknown =
    value.createdAt ?? value.timestamp ?? value.updatedAt;

  if (rawDate == null) {
    return null;
  }

  let date: Date;

  if (rawDate instanceof Date) {
    date = rawDate;
  } else if (typeof rawDate === "string" || typeof rawDate === "number") {
    date = new Date(rawDate);
  } else {
    return null;
  }

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return formatRelativeTime(date);
}

/**
 * -----------------------------------------------------------------------------
 * Relative Time
 * -----------------------------------------------------------------------------
 */

function formatRelativeTime(date: Date): string {
  const difference = Date.now() - date.getTime();

  const seconds = Math.max(0, Math.floor(difference / 1000));

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

/**
 * -----------------------------------------------------------------------------
 * Activity Action Formatting
 * -----------------------------------------------------------------------------
 */

function formatActivityAction(action: string): string {
  const normalized = action.replace(/[_-]+/g, " ").trim().toLowerCase();

  const actionMap: Record<string, string> = {
    created: "created the project",

    project_created: "created the project",

    updated: "updated the project",

    project_updated: "updated the project",

    archived: "archived the project",

    project_archived: "archived the project",

    restored: "restored the project",

    project_restored: "restored the project",

    deleted: "deleted the project",

    project_deleted: "deleted the project",

    member_added: "added a member",

    member_removed: "removed a member",

    invited: "invited a member",

    member_invited: "invited a member",

    uploaded: "uploaded a file",

    file_uploaded: "uploaded a file",

    commented: "added a comment",

    comment_added: "added a comment",
  };

  return actionMap[normalized] ?? `performed ${normalized}`;
}

/**
 * -----------------------------------------------------------------------------
 * Activity Icon
 * -----------------------------------------------------------------------------
 */

function getActivityIcon(type: string): keyof typeof Ionicons.glyphMap {
  if (type.includes("create")) {
    return "add-circle-outline";
  }

  if (type.includes("archive")) {
    return "archive-outline";
  }

  if (type.includes("restore")) {
    return "refresh-outline";
  }

  if (type.includes("delete")) {
    return "trash-outline";
  }

  if (type.includes("member") || type.includes("invite")) {
    return "people-outline";
  }

  if (type.includes("upload") || type.includes("file")) {
    return "cloud-upload-outline";
  }

  if (type.includes("comment")) {
    return "chatbubble-outline";
  }

  if (type.includes("update") || type.includes("edit")) {
    return "create-outline";
  }

  return "pulse-outline";
}

/**
 * -----------------------------------------------------------------------------
 * Activity Icon Color
 * -----------------------------------------------------------------------------
 */

function getActivityIconColor(type: string): string {
  if (type.includes("create") || type.includes("restore")) {
    return colors.status.success;
  }

  if (type.includes("delete") || type.includes("remove")) {
    return colors.status.error;
  }

  if (type.includes("archive")) {
    return colors.status.warning;
  }

  if (type.includes("member") || type.includes("invite")) {
    return colors.status.info;
  }

  return colors.brand.accentDark;
}

/**
 * -----------------------------------------------------------------------------
 * Activity Icon Background
 * -----------------------------------------------------------------------------
 */

function getActivityIconBackground(type: string): string {
  if (type.includes("create") || type.includes("restore")) {
    return colors.status.successBackground;
  }

  if (type.includes("delete") || type.includes("remove")) {
    return colors.status.errorBackground;
  }

  if (type.includes("archive")) {
    return colors.status.warningBackground;
  }

  if (type.includes("member") || type.includes("invite")) {
    return colors.status.infoBackground;
  }

  return colors.brand.accentLight;
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    flexDirection: "row",

    gap: spacing.md,

    minHeight: 76,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.md,
  },

  iconContainer: {
    alignItems: "center",

    borderRadius: radius.pill,

    height: 40,

    justifyContent: "center",

    width: 40,
  },

  content: {
    flex: 1,

    gap: spacing.xs,

    minWidth: 0,
  },

  pressed: {
    opacity: 0.7,
  },
});

export default ProjectActivityItem;
