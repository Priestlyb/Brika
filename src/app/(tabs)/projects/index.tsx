/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/index.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Main Projects screen.
 *
 * Responsibilities:
 *
 * - Display the user's projects.
 * - Handle project loading state.
 * - Display the empty-project state.
 * - Navigate to project creation.
 * - Navigate to an individual project.
 * - Filter active and archived projects.
 * - Handle project archive/restore mutations through useProjects.
 * - Refresh the project list after archive/restore.
 * - Provide restrained, premium UI motion.
 *
 * This screen does NOT:
 *
 * - Perform project API requests directly.
 * - Contain project business logic.
 * - Mutate projects directly through the service layer.
 * - Render project details inline.
 * - Own ProjectCard gesture animations.
 *
 * -----------------------------------------------------------------------------
 */

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectEmptyState } from "@/components/projects/ProjectEmptyState";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import { useProjects } from "@/hooks/projects/useProjects";
import type { Project } from "@/types/project.types";

import { styles } from "./projects.styles";

/**
 * -----------------------------------------------------------------------------
 * Project Filter
 * -----------------------------------------------------------------------------
 */

type ProjectFilter = "active" | "archived";

/**
 * -----------------------------------------------------------------------------
 * Premium Motion Helpers
 * -----------------------------------------------------------------------------
 *
 * Motion principles:
 *
 * - Small translations only.
 * - Soft opacity transitions.
 * - Gentle springs.
 * - Short, deliberate stagger.
 * - No excessive bounce.
 *
 * The screen should feel calm and responsive rather than animated.
 * -----------------------------------------------------------------------------
 */

function useEntranceAnimation(delay = 0, distance = 10) {
  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          stiffness: 160,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, distance, opacity, translateY]);

  return {
    opacity,
    transform: [{ translateY }],
  };
}

/**
 * -----------------------------------------------------------------------------
 * Press Scale Hook
 * -----------------------------------------------------------------------------
 */

function usePressScale(pressedScale = 0.975) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      damping: 18,
      stiffness: 320,
      mass: 0.45,
      useNativeDriver: true,
    }).start();
  }, [pressedScale, scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      damping: 16,
      stiffness: 280,
      mass: 0.45,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {
    scale,
    handlePressIn,
    handlePressOut,
  };
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export default function ProjectsScreen() {
  const {
    projects,
    isLoading,
    isMutating,
    error,
    refetch,
    archiveProject,
    restoreProject,
  } = useProjects();

  /**
   * ---------------------------------------------------------------------------
   * Filter State
   * ---------------------------------------------------------------------------
   */

  const [filter, setFilter] = useState<ProjectFilter>("active");

  /**
   * ---------------------------------------------------------------------------
   * Screen Entrance Motion
   * ---------------------------------------------------------------------------
   */

  const headerMotion = useEntranceAnimation(60, 8);
  const filterMotion = useEntranceAnimation(130, 8);
  const sectionMotion = useEntranceAnimation(200, 8);
  const errorMotion = useEntranceAnimation(0, 6);
  const emptyMotion = useEntranceAnimation(80, 8);

  /**
   * ---------------------------------------------------------------------------
   * Filter Button Motion
   * ---------------------------------------------------------------------------
   */

  const activeFilterScale = usePressScale(0.985);
  const archivedFilterScale = usePressScale(0.985);
  const createButtonScale = usePressScale(0.975);
  const retryButtonScale = usePressScale(0.975);

  /**
   * ---------------------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------------------
   */

  const handleCreateProject = useCallback(() => {
    router.push("/(tabs)/projects/create");
  }, []);

  const handleProjectPress = useCallback((projectId: string) => {
    router.push(`/projects/${projectId}`);
  }, []);

  /**
   * ---------------------------------------------------------------------------
   * Archive / Restore
   * ---------------------------------------------------------------------------
   *
   * ProjectCard owns the gesture interaction.
   *
   * This screen decides which mutation should be performed based on the
   * project's current status.
   *
   * The actual API request remains inside useProjects/projectService.
   * ---------------------------------------------------------------------------
   */

  const handleProjectSwipeAction = useCallback(
    async (project: Project): Promise<void> => {
      try {
        if (project.status === "ACTIVE") {
          await archiveProject(project.id);
          return;
        }

        if (project.status === "ARCHIVED") {
          await restoreProject(project.id);
        }
      } catch (mutationError) {
        /**
         * The hook already stores the normalized error.
         *
         * We intentionally do not throw again here because this is a UI
         * event handler and there is no additional consumer that needs the
         * rejected promise.
         */
        if (__DEV__) {
          console.error(
            "ProjectsScreen: Project mutation failed.",
            mutationError,
          );
        }
      }
    },
    [archiveProject, restoreProject],
  );

  /**
   * ---------------------------------------------------------------------------
   * Filtered Projects
   * ---------------------------------------------------------------------------
   */

  const filteredProjects = React.useMemo(() => {
    if (filter === "archived") {
      return projects.filter((project) => project.status === "ARCHIVED");
    }

    return projects.filter((project) => project.status === "ACTIVE");
  }, [filter, projects]);

  /**
   * ---------------------------------------------------------------------------
   * Project Counts
   * ---------------------------------------------------------------------------
   */

  const activeProjectCount = React.useMemo(
    () => projects.filter((project) => project.status === "ACTIVE").length,
    [projects],
  );

  const archivedProjectCount = React.useMemo(
    () => projects.filter((project) => project.status === "ARCHIVED").length,
    [projects],
  );

  /**
   * ---------------------------------------------------------------------------
   * Filtered Empty State
   * ---------------------------------------------------------------------------
   */

  const hasFilteredProjects = filteredProjects.length > 0;

  /**
   * ---------------------------------------------------------------------------
   * Initial Loading State
   * ---------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand.accent} />

          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.loadingText}
          >
            Loading projects...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Error State
   * ---------------------------------------------------------------------------
   */

  if (error && projects.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.errorContainer, errorMotion]}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color={colors.status.error}
            />
          </View>

          <ThemedText type="title" style={styles.errorTitle}>
            Unable to load projects
          </ThemedText>

          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.errorDescription}
          >
            Something went wrong while loading your projects. Please try again.
          </ThemedText>

          <Animated.View
            style={{
              transform: [
                {
                  scale: retryButtonScale.scale,
                },
              ],
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Try again"
              onPress={refetch}
              onPressIn={retryButtonScale.handlePressIn}
              onPressOut={retryButtonScale.handlePressOut}
              style={styles.retryButton}
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
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* -----------------------------------------------------------------
         * Header
         * ----------------------------------------------------------------- */}

        <Animated.View style={[styles.header, headerMotion]}>
          <View style={styles.headerContent}>
            <ThemedText type="title">Projects</ThemedText>

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.subtitle}
            >
              Manage your projects and workspaces.
            </ThemedText>
          </View>

          <Animated.View
            style={{
              transform: [
                {
                  scale: createButtonScale.scale,
                },
              ],
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create project"
              accessibilityHint="Create a new project."
              onPress={handleCreateProject}
              onPressIn={createButtonScale.handlePressIn}
              onPressOut={createButtonScale.handlePressOut}
              hitSlop={6}
              style={styles.createButton}
            >
              <Ionicons name="add" size={20} color={colors.text.inverse} />

              <ThemedText type="smallBold" themeColor="inverse">
                Create
              </ThemedText>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* -----------------------------------------------------------------
         * Project Filters
         * ----------------------------------------------------------------- */}

        <Animated.View
          style={[styles.filterContainer, filterMotion]}
          accessibilityRole="tablist"
        >
          <Animated.View
            style={[
              styles.filterButtonWrapper,
              {
                transform: [
                  {
                    scale: activeFilterScale.scale,
                  },
                ],
              },
            ]}
          >
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{
                selected: filter === "active",
              }}
              accessibilityLabel={`Active projects, ${activeProjectCount}`}
              onPress={() => setFilter("active")}
              onPressIn={activeFilterScale.handlePressIn}
              onPressOut={activeFilterScale.handlePressOut}
              style={[
                styles.filterButton,
                filter === "active" && styles.filterButtonActive,
              ]}
            >
              <Ionicons
                name="layers-outline"
                size={17}
                color={
                  filter === "active"
                    ? colors.brand.accent
                    : colors.text.secondary
                }
              />

              <ThemedText
                type="smallBold"
                themeColor={filter === "active" ? "primary" : "secondary"}
              >
                Active
              </ThemedText>

              <View
                style={[
                  styles.filterCount,
                  filter === "active" && styles.filterCountActive,
                ]}
              >
                <ThemedText
                  type="smallBold"
                  themeColor={filter === "active" ? "primary" : "secondary"}
                >
                  {activeProjectCount}
                </ThemedText>
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View
            style={[
              styles.filterButtonWrapper,
              {
                transform: [
                  {
                    scale: archivedFilterScale.scale,
                  },
                ],
              },
            ]}
          >
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{
                selected: filter === "archived",
              }}
              accessibilityLabel={`Archived projects, ${archivedProjectCount}`}
              onPress={() => setFilter("archived")}
              onPressIn={archivedFilterScale.handlePressIn}
              onPressOut={archivedFilterScale.handlePressOut}
              style={[
                styles.filterButton,
                filter === "archived" && styles.filterButtonActive,
              ]}
            >
              <Ionicons
                name="archive-outline"
                size={17}
                color={
                  filter === "archived"
                    ? colors.brand.accent
                    : colors.text.secondary
                }
              />

              <ThemedText
                type="smallBold"
                themeColor={filter === "archived" ? "primary" : "secondary"}
              >
                Archived
              </ThemedText>

              <View
                style={[
                  styles.filterCount,
                  filter === "archived" && styles.filterCountActive,
                ]}
              >
                <ThemedText
                  type="smallBold"
                  themeColor={filter === "archived" ? "primary" : "secondary"}
                >
                  {archivedProjectCount}
                </ThemedText>
              </View>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* -----------------------------------------------------------------
         * Section Header
         * ----------------------------------------------------------------- */}

        <Animated.View style={[styles.sectionHeader, sectionMotion]}>
          <View style={styles.sectionTitleContainer}>
            <ThemedText type="smallBold">
              {filter === "active" ? "Your projects" : "Archived projects"}
            </ThemedText>

            {isMutating ? (
              <View style={styles.mutationIndicator}>
                <ActivityIndicator size="small" color={colors.brand.accent} />

                <ThemedText type="small" themeColor="tertiary">
                  Updating...
                </ThemedText>
              </View>
            ) : null}
          </View>

          <ThemedText type="small" themeColor="tertiary">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </ThemedText>
        </Animated.View>

        {/* -----------------------------------------------------------------
         * Mutation Error
         * ----------------------------------------------------------------- */}

        {error && projects.length > 0 ? (
          <Animated.View style={[styles.inlineError, errorMotion]}>
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color={colors.status.error}
            />

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.inlineErrorText}
            >
              {error.message}
            </ThemedText>
          </Animated.View>
        ) : null}

        {/* -----------------------------------------------------------------
         * Filtered Empty State
         * ----------------------------------------------------------------- */}

        {!hasFilteredProjects ? (
          <Animated.View style={[styles.filteredEmptyState, emptyMotion]}>
            <View style={styles.filteredEmptyIcon}>
              <Ionicons
                name={
                  filter === "archived"
                    ? "archive-outline"
                    : "folder-open-outline"
                }
                size={28}
                color={colors.brand.accent}
              />
            </View>

            <ThemedText type="smallBold" style={styles.filteredEmptyTitle}>
              {filter === "archived"
                ? "No archived projects"
                : "No active projects"}
            </ThemedText>

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.filteredEmptyDescription}
            >
              {filter === "archived"
                ? "Projects you archive will appear here."
                : projects.length > 0
                  ? "Your archived projects are still available in the Archived tab."
                  : "Create your first project to get started."}
            </ThemedText>

            {filter === "active" && projects.length === 0 ? (
              <ProjectEmptyState
                actionLabel="Create project"
                onAction={handleCreateProject}
              />
            ) : null}
          </Animated.View>
        ) : null}

        {/* -----------------------------------------------------------------
         * Project List
         * ----------------------------------------------------------------- */}

        {hasFilteredProjects ? (
          <View style={styles.projectList}>
            {filteredProjects.map((project, index) => (
              <AnimatedProjectCard
                key={`${filter}-${project.id}`}
                project={project}
                index={index}
                onPress={() => handleProjectPress(project.id)}
                onSwipeAction={
                  project.status === "ACTIVE" || project.status === "ARCHIVED"
                    ? handleProjectSwipeAction
                    : undefined
                }
                actionLoading={isMutating}
                disabled={isMutating}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Animated Project Card
 * -----------------------------------------------------------------------------
 *
 * ProjectCard continues to own its swipe/gesture behavior.
 *
 * This wrapper only controls the card's entrance into the screen.
 * -----------------------------------------------------------------------------
 */

interface AnimatedProjectCardProps {
  project: Project;
  index: number;
  onPress: () => void;
  onSwipeAction?: (project: Project) => Promise<void>;
  actionLoading: boolean;
  disabled: boolean;
}

function AnimatedProjectCard({
  project,
  index,
  onPress,
  onSwipeAction,
  actionLoading,
  disabled,
}: AnimatedProjectCardProps) {
  const motion = useEntranceAnimation(240 + index * 70, 10);

  return (
    <Animated.View style={motion}>
      <ProjectCard
        project={project}
        onPress={onPress}
        onSwipeAction={onSwipeAction}
        actionLoading={actionLoading}
        disabled={disabled}
      />
    </Animated.View>
  );
}
