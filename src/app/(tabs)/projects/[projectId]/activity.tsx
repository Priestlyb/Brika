/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/[projectId]/activity.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project activity screen.
 *
 * Responsibilities:
 *
 * - Display recent activity for the current project.
 * - Load activity through the project activity hook.
 * - Provide loading, refreshing, error, and empty states.
 * - Support activity item selection when activity actions are connected.
 * - Provide navigation back to the project.
 *
 * This screen does NOT:
 *
 * - Perform API requests directly.
 * - Mutate project data.
 * - Implement activity business logic.
 *
 * Data fetching is handled by `useProjectActivity`.
 * -----------------------------------------------------------------------------
 */

import React, { useCallback } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
  type ListRenderItem,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import type { ProjectActivity } from "@/types/project.types";

import useProjectActivity from "@/hooks/projects/useProjectActivity";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import { ThemedText } from "@/components/themed-text";

import { ProjectActivityItem } from "@/components/projects/ProjectActivityItem";

/**
 * -----------------------------------------------------------------------------
 * Screen
 * -----------------------------------------------------------------------------
 */

export default function ProjectActivityScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    projectId: string | string[];
  }>();

  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  /**
   * ---------------------------------------------------------------------------
   * Activity Data
   * ---------------------------------------------------------------------------
   *
   * Activity loading is delegated to the project activity hook.
   *
   * The hook is responsible for:
   *
   * - Calling projectService.getProjectActivity()
   * - Managing loading state
   * - Managing refresh state
   * - Managing errors
   * - Managing pagination
   */

  const {
    activities,
    pagination,
    isLoading,
    isRefreshing,
    error,
    refetch,
    refresh,
  } = useProjectActivity(projectId, {
    page: 1,
    limit: 20,
  });

  /**
   * ---------------------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------------------
   */

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * ---------------------------------------------------------------------------
   * Activity Selection
   * ---------------------------------------------------------------------------
   */

  const handleActivityPress = useCallback((_activity: ProjectActivity) => {
    /**
     * Activity selection is intentionally left without navigation
     * until the activity detail route/business behavior exists.
     *
     * Keeping this callback here allows the list item to become
     * interactive without coupling this screen to an invented route.
     */
  }, []);

  /**
   * ---------------------------------------------------------------------------
   * Retry
   * ---------------------------------------------------------------------------
   */

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  /**
   * ---------------------------------------------------------------------------
   * Refresh
   * ---------------------------------------------------------------------------
   */

  const handleRefresh = useCallback(() => {
    void refresh();
  }, [refresh]);

  /**
   * ---------------------------------------------------------------------------
   * Render Activity
   * ---------------------------------------------------------------------------
   */

  const renderActivity = useCallback<ListRenderItem<ProjectActivity>>(
    ({ item }) => (
      <ProjectActivityItem
        activity={item}
        onPress={() => handleActivityPress(item)}
      />
    ),
    [handleActivityPress],
  );

  /**
   * ---------------------------------------------------------------------------
   * Activity Key
   * ---------------------------------------------------------------------------
   */

  const keyExtractor = useCallback(
    (item: ProjectActivity, index: number) =>
      getActivityId(item) ?? `activity-${index}`,
    [],
  );

  /**
   * ---------------------------------------------------------------------------
   * Empty State
   * ---------------------------------------------------------------------------
   */

  const emptyComponent = (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="pulse-outline" size={30} color={colors.brand.accent} />
      </View>

      <ThemedText type="title" style={styles.emptyTitle}>
        No activity yet
      </ThemedText>

      <ThemedText
        type="small"
        themeColor="secondary"
        style={styles.emptyDescription}
      >
        Project activity will appear here as members create, update, archive,
        restore, upload, and collaborate on this project.
      </ThemedText>
    </View>
  );

  /**
   * ---------------------------------------------------------------------------
   * Loading State
   * ---------------------------------------------------------------------------
   */

  const loadingComponent = (
    <View style={styles.loadingState}>
      <ActivityIndicator size="small" color={colors.brand.accent} />

      <ThemedText
        type="small"
        themeColor="secondary"
        style={styles.loadingText}
      >
        Loading activity...
      </ThemedText>
    </View>
  );

  /**
   * ---------------------------------------------------------------------------
   * Error State
   * ---------------------------------------------------------------------------
   */

  const errorComponent = (
    <View style={styles.errorState}>
      <View style={styles.errorIcon}>
        <Ionicons
          name="alert-circle-outline"
          size={30}
          color={colors.status.error}
        />
      </View>

      <ThemedText type="title" style={styles.errorTitle}>
        Unable to load activity
      </ThemedText>

      <ThemedText
        type="small"
        themeColor="secondary"
        style={styles.errorDescription}
      >
        {error?.message ||
          "Something went wrong while loading this project's activity."}
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retry loading activity"
        onPress={handleRetry}
        style={styles.retryButton}
      >
        <Ionicons
          name="refresh-outline"
          size={18}
          color={colors.text.inverse}
        />

        <ThemedText type="small" style={styles.retryButtonText}>
          Try again
        </ThemedText>
      </Pressable>
    </View>
  );

  /**
   * ---------------------------------------------------------------------------
   * Invalid Project ID
   * ---------------------------------------------------------------------------
   *
   * The route should normally always provide projectId.
   */

  if (!projectId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={8}
                onPress={handleBack}
                style={styles.backButton}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={colors.text.primary}
                />
              </Pressable>

              <View style={styles.headerText}>
                <ThemedText type="title" numberOfLines={1}>
                  Activity
                </ThemedText>

                <ThemedText type="small" themeColor="secondary">
                  Project unavailable
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.centerState}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={colors.status.error}
              />
            </View>

            <ThemedText type="title" style={styles.errorTitle}>
              Project not found
            </ThemedText>

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.errorDescription}
            >
              A valid project could not be identified for this activity screen.
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Activity Count
   * ---------------------------------------------------------------------------
   */

  const activityCount = pagination?.total ?? activities.length;

  const activityCountLabel =
    activityCount === 1 ? "1 activity" : `${activityCount} activities`;

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* -----------------------------------------------------------------
         * Header
         * ----------------------------------------------------------------- */}

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={handleBack}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={colors.text.primary}
              />
            </Pressable>

            <View style={styles.headerText}>
              <ThemedText type="title" numberOfLines={1}>
                Activity
              </ThemedText>

              <ThemedText type="small" themeColor="secondary">
                {activityCountLabel}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* -----------------------------------------------------------------
         * Initial Loading
         * ----------------------------------------------------------------- */}

        {isLoading && activities.length === 0 ? (
          loadingComponent
        ) : error && activities.length === 0 ? (
          errorComponent
        ) : (
          <FlatList
            data={activities}
            keyExtractor={keyExtractor}
            renderItem={renderActivity}
            contentContainerStyle={
              activities.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
            ItemSeparatorComponent={ActivitySeparator}
            ListEmptyComponent={emptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.brand.accent}
              />
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Activity Separator
 * -----------------------------------------------------------------------------
 */

function ActivitySeparator() {
  return <View style={styles.separator} />;
}

/**
 * -----------------------------------------------------------------------------
 * Activity ID
 * -----------------------------------------------------------------------------
 *
 * Supports the canonical type while remaining tolerant of backend responses
 * that expose the activity identifier under a slightly different property.
 * -----------------------------------------------------------------------------
 */

function getActivityId(activity: ProjectActivity): string | null {
  const value = activity as ProjectActivity & {
    id?: string | null;
    activityId?: string | null;
  };

  if (typeof value.id === "string" && value.id.trim()) {
    return value.id.trim();
  }

  if (typeof value.activityId === "string" && value.activityId.trim()) {
    return value.activityId.trim();
  }

  return null;
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background.primary,

    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    backgroundColor: colors.background.primary,

    borderBottomColor: colors.border.light,

    borderBottomWidth: 1,

    paddingHorizontal: spacing.lg,

    paddingVertical: spacing.md,
  },

  headerTop: {
    alignItems: "center",

    flexDirection: "row",

    minHeight: 44,
  },

  backButton: {
    alignItems: "center",

    borderRadius: radius.pill,

    height: 40,

    justifyContent: "center",

    marginRight: spacing.sm,

    width: 40,
  },

  headerText: {
    flex: 1,

    gap: 2,

    minWidth: 0,
  },

  listContent: {
    paddingVertical: spacing.sm,
  },

  emptyListContent: {
    flexGrow: 1,

    justifyContent: "center",

    padding: spacing.xl,
  },

  separator: {
    backgroundColor: colors.border.light,

    height: 1,

    marginLeft: spacing.lg + 40 + spacing.md,
  },

  emptyState: {
    alignItems: "center",

    justifyContent: "center",

    maxWidth: 480,

    paddingHorizontal: spacing.lg,

    width: "100%",
  },

  emptyIcon: {
    alignItems: "center",

    backgroundColor: colors.brand.accentLight,

    borderRadius: radius.pill,

    height: 64,

    justifyContent: "center",

    marginBottom: spacing.lg,

    width: 64,
  },

  emptyTitle: {
    marginBottom: spacing.xs,

    textAlign: "center",
  },

  emptyDescription: {
    lineHeight: 22,

    maxWidth: 440,

    textAlign: "center",
  },

  loadingState: {
    alignItems: "center",

    flex: 1,

    justifyContent: "center",

    padding: spacing.xl,
  },

  loadingText: {
    marginTop: spacing.md,

    textAlign: "center",
  },

  centerState: {
    alignItems: "center",

    flex: 1,

    justifyContent: "center",

    padding: spacing.xl,
  },

  errorState: {
    alignItems: "center",

    flex: 1,

    justifyContent: "center",

    maxWidth: 480,

    padding: spacing.xl,

    width: "100%",

    alignSelf: "center",
  },

  errorIcon: {
    alignItems: "center",

    backgroundColor: colors.status.errorBackground,

    borderRadius: radius.pill,

    height: 64,

    justifyContent: "center",

    marginBottom: spacing.lg,

    width: 64,
  },

  errorTitle: {
    marginBottom: spacing.xs,

    textAlign: "center",
  },

  errorDescription: {
    lineHeight: 22,

    maxWidth: 440,

    textAlign: "center",
  },

  retryButton: {
    alignItems: "center",

    backgroundColor: colors.brand.accent,

    borderRadius: radius.md,

    flexDirection: "row",

    gap: spacing.xs,

    justifyContent: "center",

    marginTop: spacing.lg,

    minHeight: 44,

    paddingHorizontal: spacing.lg,
  },

  retryButtonText: {
    color: colors.text.inverse,
  },
});
