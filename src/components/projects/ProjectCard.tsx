/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectCard.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Displays a single project inside the project list.
 *
 * Responsibilities:
 *
 * - Display project name.
 * - Display project description.
 * - Display project status.
 * - Display project visibility.
 * - Display the last updated date.
 * - Notify the parent when the card is pressed.
 * - Provide swipe-to-archive / swipe-to-restore interaction.
 *
 * This component does NOT:
 *
 * - Fetch project data.
 * - Perform API requests.
 * - Navigate directly.
 * - Manage project state.
 *
 * Swipe behavior:
 *
 * ACTIVE project:
 *     Swipe left → Archive
 *
 * ARCHIVED project:
 *     Swipe left → Restore
 *
 * The actual mutation remains owned by the parent/hook layer.
 * -----------------------------------------------------------------------------
 */

import React, { useCallback, useRef } from "react";

import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

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
 * Constants
 * -----------------------------------------------------------------------------
 */

const SWIPE_THRESHOLD = 90;

const MAX_SWIPE_DISTANCE = 112;

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectCardProps {
  project: Project;

  onPress?: (project: Project) => void;

  /**
   * Called after the user completes a left swipe.
   *
   * ACTIVE:
   *     Archive
   *
   * ARCHIVED:
   *     Restore
   */
  onSwipeAction?: (project: Project) => void;

  disabled?: boolean;

  /**
   * Optional loading state for an archive/restore mutation.
   */
  actionLoading?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectCard({
  project,
  onPress,
  onSwipeAction,
  disabled = false,
  actionLoading = false,
}: ProjectCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const hasSwipeAction =
    project.status === "ACTIVE" || project.status === "ARCHIVED";

  /**
   * ---------------------------------------------------------------------------
   * Reset Card Position
   * ---------------------------------------------------------------------------
   */

  const resetPosition = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,

      useNativeDriver: true,

      tension: 80,

      friction: 12,
    }).start();
  }, [translateX]);

  /**
   * ---------------------------------------------------------------------------
   * Complete Swipe Action
   * ---------------------------------------------------------------------------
   */

  const completeSwipeAction = useCallback(() => {
    if (disabled || actionLoading || !onSwipeAction || !hasSwipeAction) {
      resetPosition();

      return;
    }

    /**
     * Keep the card visually displaced for a moment so the user gets clear
     * feedback that their gesture was accepted.
     */
    Animated.timing(translateX, {
      toValue: -MAX_SWIPE_DISTANCE,

      duration: 140,

      useNativeDriver: true,
    }).start(() => {
      onSwipeAction(project);

      /**
       * Reset immediately after notifying the parent.
       *
       * The parent is responsible for refreshing/removing/updating the card.
       */
      translateX.setValue(0);
    });
  }, [
    actionLoading,
    disabled,
    hasSwipeAction,
    onSwipeAction,
    project,
    resetPosition,
    translateX,
  ]);

  /**
   * ---------------------------------------------------------------------------
   * Pan Responder
   * ---------------------------------------------------------------------------
   */

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gestureState) => {
        /**
         * Only claim horizontal gestures.
         *
         * This prevents the card from interfering with the ScrollView's
         * vertical scrolling.
         */
        const horizontalMovement =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy);

        const meaningfulMovement = Math.abs(gestureState.dx) > 8;

        return (
          !disabled &&
          !actionLoading &&
          hasSwipeAction &&
          horizontalMovement &&
          meaningfulMovement
        );
      },

      onPanResponderMove: (_event, gestureState) => {
        /**
         * Only allow left swiping.
         *
         * Rightward movement is ignored.
         */
        const nextX =
          gestureState.dx < 0
            ? Math.max(gestureState.dx, -MAX_SWIPE_DISTANCE)
            : 0;

        translateX.setValue(nextX);
      },

      onPanResponderRelease: (_event, gestureState) => {
        if (gestureState.dx <= -SWIPE_THRESHOLD) {
          completeSwipeAction();

          return;
        }

        resetPosition();
      },

      onPanResponderTerminate: () => {
        resetPosition();
      },
    }),
  ).current;

  /**
   * ---------------------------------------------------------------------------
   * Press Handler
   * ---------------------------------------------------------------------------
   */

  const handlePress = useCallback(() => {
    if (disabled || actionLoading) {
      return;
    }

    onPress?.(project);
  }, [actionLoading, disabled, onPress, project]);

  /**
   * ---------------------------------------------------------------------------
   * Derived UI
   * ---------------------------------------------------------------------------
   */

  const isArchived = project.status === "ARCHIVED";

  const isDeleted = project.status === "DELETED";

  const swipeActionLabel = isArchived ? "Restore" : "Archive";

  const swipeActionIcon = isArchived ? "arrow-undo-outline" : "archive-outline";

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <View style={styles.wrapper}>
      {/* -------------------------------------------------------------------
       * Swipe Action Background
       * ------------------------------------------------------------------- */}

      {!isDeleted ? (
        <View
          pointerEvents="none"
          style={[
            styles.swipeBackground,

            isArchived ? styles.restoreBackground : styles.archiveBackground,
          ]}
        >
          <View style={styles.swipeActionContent}>
            <View
              style={[
                styles.swipeIconContainer,

                isArchived
                  ? styles.restoreIconContainer
                  : styles.archiveIconContainer,
              ]}
            >
              <Ionicons
                name={swipeActionIcon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={colors.text.inverse}
              />
            </View>

            <ThemedText type="smallBold" themeColor="inverse">
              {swipeActionLabel}
            </ThemedText>
          </View>
        </View>
      ) : null}

      {/* -------------------------------------------------------------------
       * Animated Card
       * ------------------------------------------------------------------- */}

      <Animated.View
        style={[
          styles.animatedCard,

          {
            transform: [
              {
                translateX,
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isArchived
              ? `Open archived project ${project.name}`
              : `Open project ${project.name}`
          }
          accessibilityHint={
            isArchived
              ? "Swipe left to restore this project."
              : "Swipe left to archive this project."
          }
          accessibilityState={{
            disabled: disabled || actionLoading,
          }}
          disabled={disabled || actionLoading}
          onPress={handlePress}
          style={({ pressed }) => [
            styles.card,

            isArchived && styles.archivedCard,

            pressed && !disabled && !actionLoading && styles.cardPressed,

            (disabled || actionLoading) && styles.cardDisabled,
          ]}
        >
          <View style={styles.content}>
            {/* -------------------------------------------------------------
             * Top Accent
             * ------------------------------------------------------------- */}

            <View
              style={[styles.topAccent, isArchived && styles.archivedTopAccent]}
            />

            {/* -------------------------------------------------------------
             * Header
             * ------------------------------------------------------------- */}

            <View style={styles.header}>
              <View style={styles.titleSection}>
                <View style={styles.titleRow}>
                  <View
                    style={[
                      styles.statusDot,

                      isArchived
                        ? styles.archivedStatusDot
                        : styles.activeStatusDot,
                    ]}
                  />

                  <ThemedText
                    type="title"
                    numberOfLines={1}
                    style={[styles.title, isArchived && styles.archivedTitle]}
                  >
                    {project.name}
                  </ThemedText>
                </View>

                <View style={styles.statusRow}>
                  <ThemedText
                    type="smallBold"
                    themeColor={getStatusThemeColor(project.status)}
                    style={styles.status}
                  >
                    {PROJECT_STATUS_LABELS[project.status]}
                  </ThemedText>

                  {isArchived ? (
                    <View style={styles.archivedBadge}>
                      <Ionicons
                        name="archive-outline"
                        size={12}
                        color={colors.text.secondary}
                      />

                      <ThemedText type="small" themeColor="secondary">
                        Archived
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={styles.headerAction}>
                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={
                    isArchived ? colors.text.tertiary : colors.text.secondary
                  }
                />
              </View>
            </View>

            {/* -------------------------------------------------------------
             * Description
             * ------------------------------------------------------------- */}

            {project.description ? (
              <ThemedText
                type="small"
                themeColor="secondary"
                numberOfLines={2}
                style={[
                  styles.description,

                  isArchived && styles.archivedDescription,
                ]}
              >
                {project.description}
              </ThemedText>
            ) : (
              <ThemedText
                type="small"
                themeColor="muted"
                numberOfLines={1}
                style={styles.emptyDescription}
              >
                No description
              </ThemedText>
            )}

            {/* -------------------------------------------------------------
             * Footer Divider
             * ------------------------------------------------------------- */}

            <View
              style={[styles.divider, isArchived && styles.archivedDivider]}
            />

            {/* -------------------------------------------------------------
             * Footer
             * ------------------------------------------------------------- */}

            <View style={styles.footer}>
              <View style={styles.metaGroup}>
                <View style={styles.metaItem}>
                  <View
                    style={[
                      styles.metaIconContainer,

                      isArchived && styles.archivedMetaIconContainer,
                    ]}
                  >
                    <Ionicons
                      name={getVisibilityIcon(project.visibility)}
                      size={14}
                      color={colors.text.secondary}
                    />
                  </View>

                  <View>
                    <ThemedText
                      type="small"
                      themeColor="muted"
                      style={styles.metaLabel}
                    >
                      Visibility
                    </ThemedText>

                    <ThemedText
                      type="small"
                      themeColor="secondary"
                      style={styles.metaText}
                    >
                      {PROJECT_VISIBILITY_LABELS[project.visibility]}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.metaItem}>
                  <View
                    style={[
                      styles.metaIconContainer,

                      isArchived && styles.archivedMetaIconContainer,
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={colors.text.secondary}
                    />
                  </View>

                  <View>
                    <ThemedText
                      type="small"
                      themeColor="muted"
                      style={styles.metaLabel}
                    >
                      Updated
                    </ThemedText>

                    <ThemedText
                      type="small"
                      themeColor="secondary"
                      style={styles.metaText}
                    >
                      {formatProjectDate(project.updatedAt)}
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* -----------------------------------------------------------
               * Swipe Hint
               * ----------------------------------------------------------- */}

              {!disabled && !actionLoading && !isDeleted ? (
                <View style={styles.swipeHint}>
                  <Ionicons
                    name="arrow-back-outline"
                    size={14}
                    color={colors.text.tertiary}
                  />

                  <ThemedText type="small" themeColor="tertiary">
                    Swipe
                  </ThemedText>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Date Formatting
 * -----------------------------------------------------------------------------
 */

function formatProjectDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * -----------------------------------------------------------------------------
 * Status Color
 * -----------------------------------------------------------------------------
 */

function getStatusThemeColor(
  status: Project["status"],
): "primary" | "secondary" | "tertiary" | "inverse" | "muted" | "accent" {
  switch (status) {
    case "ACTIVE":
      return "accent";

    case "ARCHIVED":
      return "secondary";

    case "DELETED":
      return "secondary";

    default:
      return "secondary";
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
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,

    position: "relative",
  },

  animatedCard: {
    width: "100%",
  },

  swipeBackground: {
    alignItems: "center",

    borderRadius: 18,

    bottom: 0,

    flexDirection: "row",

    justifyContent: "flex-end",

    left: 0,

    overflow: "hidden",

    position: "absolute",

    right: 0,

    top: 0,
  },

  archiveBackground: {
    backgroundColor: colors.brand.accent,
  },

  restoreBackground: {
    backgroundColor: colors.status.success,
  },

  swipeActionContent: {
    alignItems: "center",

    flexDirection: "row",

    gap: spacing.xs,

    paddingHorizontal: spacing.lg,
  },

  swipeIconContainer: {
    alignItems: "center",

    borderRadius: 999,

    height: 34,

    justifyContent: "center",

    width: 34,
  },

  archiveIconContainer: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  restoreIconContainer: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  card: {
    backgroundColor: colors.background.surface,

    borderColor: colors.border.light,

    borderRadius: 18,

    borderWidth: 1,

    overflow: "hidden",

    position: "relative",
  },

  archivedCard: {
    backgroundColor: colors.background.secondary,
  },

  cardPressed: {
    opacity: 0.92,

    transform: [
      {
        scale: 0.995,
      },
    ],
  },

  cardDisabled: {
    opacity: 0.5,
  },

  content: {
    padding: spacing.lg,
  },

  topAccent: {
    backgroundColor: colors.brand.accent,

    borderRadius: 999,

    height: 3,

    left: spacing.lg,

    position: "absolute",

    top: 0,

    width: 42,
  },

  archivedTopAccent: {
    backgroundColor: colors.text.tertiary,

    opacity: 0.65,
  },

  header: {
    alignItems: "center",

    flexDirection: "row",

    justifyContent: "space-between",

    paddingTop: spacing.xs,
  },

  titleSection: {
    flex: 1,

    minWidth: 0,

    paddingRight: spacing.md,
  },

  titleRow: {
    alignItems: "center",

    flexDirection: "row",

    gap: spacing.sm,

    minWidth: 0,
  },

  title: {
    flex: 1,

    minWidth: 0,
  },

  archivedTitle: {
    opacity: 0.8,
  },

  statusDot: {
    borderRadius: 999,

    height: 8,

    width: 8,
  },

  activeStatusDot: {
    backgroundColor: colors.brand.accent,
  },

  archivedStatusDot: {
    backgroundColor: colors.text.tertiary,
  },

  statusRow: {
    alignItems: "center",

    flexDirection: "row",

    flexWrap: "wrap",

    gap: spacing.sm,

    marginTop: spacing.xs,
  },

  status: {
    textTransform: "uppercase",
  },

  archivedBadge: {
    alignItems: "center",

    backgroundColor: colors.background.primary,

    borderColor: colors.border.light,

    borderRadius: 999,

    borderWidth: 1,

    flexDirection: "row",

    gap: 4,

    paddingHorizontal: spacing.sm,

    paddingVertical: 3,
  },

  headerAction: {
    alignItems: "center",

    backgroundColor: colors.background.primary,

    borderColor: colors.border.light,

    borderRadius: 999,

    borderWidth: 1,

    height: 36,

    justifyContent: "center",

    width: 36,
  },

  description: {
    marginTop: spacing.md,

    maxWidth: 760,
  },

  archivedDescription: {
    opacity: 0.75,
  },

  emptyDescription: {
    fontStyle: "italic",

    marginTop: spacing.md,
  },

  divider: {
    backgroundColor: colors.border.light,

    height: StyleSheet.hairlineWidth,

    marginTop: spacing.lg,
  },

  archivedDivider: {
    opacity: 0.7,
  },

  footer: {
    alignItems: "center",

    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: spacing.md,
  },

  metaGroup: {
    alignItems: "center",

    flexDirection: "row",

    flexWrap: "wrap",

    gap: spacing.lg,
  },

  metaItem: {
    alignItems: "center",

    flexDirection: "row",

    gap: spacing.sm,
  },

  metaIconContainer: {
    alignItems: "center",

    backgroundColor: colors.background.primary,

    borderColor: colors.border.light,

    borderRadius: 8,

    borderWidth: 1,

    height: 30,

    justifyContent: "center",

    width: 30,
  },

  archivedMetaIconContainer: {
    opacity: 0.7,
  },

  metaLabel: {
    fontSize: typography.caption.fontSize,

    lineHeight: typography.caption.lineHeight,
  },

  metaText: {
    fontSize: typography.caption.fontSize,

    lineHeight: typography.caption.lineHeight,

    marginTop: 1,
  },

  swipeHint: {
    alignItems: "center",

    flexDirection: "row",

    gap: 3,

    opacity: 0.8,
  },
});

export default ProjectCard;
