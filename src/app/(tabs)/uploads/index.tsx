/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/uploads/index.tsx
 * -----------------------------------------------------------------------------
 * Brika Uploads Screen
 *
 * Project selection screen.
 *
 * Responsibilities:
 *
 * - Display the user's active projects.
 * - Provide a clean workspace-oriented project browser.
 * - Navigate directly to the selected project's files workspace.
 * - Handle loading, empty, error, and refresh states.
 * - Provide lightweight entrance and interaction animations.
 *
 * This screen does NOT:
 *
 * - Display archived projects.
 * - Create projects.
 * - Archive or restore projects.
 * - Perform project API requests directly.
 * - Contain project business logic.
 * -----------------------------------------------------------------------------
 */

import React, { useCallback, useMemo } from "react";

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ProjectEmptyState } from "@/components/projects/ProjectEmptyState";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";

import { useProjects } from "@/hooks/projects/useProjects";

import { styles } from "./uploads.styles";

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export default function ProjectsScreen() {
  const { width } = useWindowDimensions();

  const { projects, isLoading, error, refetch } = useProjects();

  /**
   * ---------------------------------------------------------------------------
   * Responsive Layout
   * ---------------------------------------------------------------------------
   */

  const isWideScreen = width >= 760;

  /**
   * ---------------------------------------------------------------------------
   * Active Projects
   * ---------------------------------------------------------------------------
   *
   * Archived projects are intentionally excluded.
   * ---------------------------------------------------------------------------
   */

  const activeProjects = useMemo(
    () => projects.filter((project) => project.status === "ACTIVE"),
    [projects],
  );

  /**
   * ---------------------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------------------
   */

  const handleProjectPress = useCallback((projectId: string) => {
    router.push({
      pathname: "/(tabs)/projects/[projectId]/files",
      params: {
        projectId,
      },
    });
  }, []);

  /**
   * ---------------------------------------------------------------------------
   * Loading
   * ---------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(350)}
          style={styles.loadingState}
        >
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.loadingIcon}
          >
            <Ionicons
              name="folder-open-outline"
              size={24}
              color={colors.brand.accent}
            />
          </Animated.View>

          <Animated.View entering={FadeIn.delay(100).duration(350)}>
            <ActivityIndicator
              size="small"
              color={colors.brand.accent}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150).duration(400)}>
            <ThemedText type="small" themeColor="secondary">
              Loading your projects...
            </ThemedText>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Full Error
   * ---------------------------------------------------------------------------
   */

  if (error && projects.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(350)}
          style={styles.errorState}
        >
          <Animated.View
            entering={FadeInDown.duration(450)}
            style={styles.errorIcon}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={28}
              color={colors.status.error}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(80).duration(400)}>
            <ThemedText type="title" style={styles.errorTitle}>
              Projects unavailable
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(140).duration(400)}>
            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.errorDescription}
            >
              We couldn't load your projects right now. Check your connection
              and try again.
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <RetryButton onPress={refetch} />
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Main Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            tintColor={colors.brand.accent}
          />
        }
      >
        {/* -----------------------------------------------------------------
         * Header
         * ----------------------------------------------------------------- */}

        <Animated.View
          entering={FadeInDown.duration(450)}
          style={styles.header}
        >
          <Animated.View
            entering={FadeIn.delay(100).duration(400)}
            style={styles.headerIcon}
          >
            <Ionicons
              name="folder-open-outline"
              size={22}
              color={colors.brand.accent}
            />
          </Animated.View>

          <View style={styles.headerCopy}>
            <Animated.View entering={FadeInUp.delay(80).duration(400)}>
              <ThemedText type="title" style={styles.title}>
                Projects
              </ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(140).duration(400)}>
              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.subtitle}
              >
                Select a project to view and manage its files.
              </ThemedText>
            </Animated.View>
          </View>
        </Animated.View>

        {/* -----------------------------------------------------------------
         * Content Error
         * ----------------------------------------------------------------- */}

        {error ? (
          <Animated.View
            entering={FadeInDown.duration(350)}
            style={styles.inlineError}
          >
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
         * Section Header
         * ----------------------------------------------------------------- */}

        <Animated.View
          entering={FadeInDown.delay(120).duration(450)}
          style={styles.sectionHeader}
        >
          <View>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              Your projects
            </ThemedText>

            <ThemedText
              type="small"
              themeColor="tertiary"
              style={styles.sectionSubtitle}
            >
              Active workspaces
            </ThemedText>
          </View>

          {activeProjects.length > 0 ? (
            <Animated.View
              entering={FadeIn.delay(200).duration(350)}
              style={styles.countBadge}
            >
              <ThemedText type="smallBold" themeColor="secondary">
                {activeProjects.length}
              </ThemedText>
            </Animated.View>
          ) : null}
        </Animated.View>

        {/* -----------------------------------------------------------------
         * Project Grid
         * ----------------------------------------------------------------- */}

        {activeProjects.length > 0 ? (
          <View
            style={[
              styles.projectGrid,
              isWideScreen && styles.projectGridWide,
            ]}
          >
            {activeProjects.map((project, index) => (
              <ProjectTile
                key={project.id}
                name={project.name}
                index={index}
                onPress={() => handleProjectPress(project.id)}
                wide={isWideScreen}
              />
            ))}
          </View>
        ) : (
          /* ---------------------------------------------------------------
           * Empty State
           * --------------------------------------------------------------- */

          <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.emptyState}
          >
            <Animated.View
              entering={FadeInDown.duration(500)}
              style={styles.emptyVisual}
            >
              <Animated.View
                entering={FadeIn.delay(100).duration(450)}
                style={styles.emptyFolder}
              >
                <Ionicons
                  name="folder-outline"
                  size={34}
                  color={colors.brand.accent}
                />
              </Animated.View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(100).duration(450)}>
              <ThemedText type="title" style={styles.emptyTitle}>
                No active projects
              </ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(160).duration(450)}>
              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.emptyDescription}
              >
                There aren't any active projects available for your account
                yet.
              </ThemedText>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(220).duration(450)}
              style={styles.emptyAction}
            >
              <ProjectEmptyState />
            </Animated.View>
          </Animated.View>
        )}

        {/* -----------------------------------------------------------------
         * Footer Hint
         * ----------------------------------------------------------------- */}

        {activeProjects.length > 0 ? (
          <Animated.View
            entering={FadeInUp.delay(300).duration(450)}
            style={styles.footerHint}
          >
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.text.muted}
            />

            <ThemedText
              type="small"
              themeColor="tertiary"
              style={styles.footerText}
            >
              Select a project to open its file workspace.
            </ThemedText>
          </Animated.View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Retry Button
 * -----------------------------------------------------------------------------
 */

interface RetryButtonProps {
  onPress: () => void;
}

function RetryButton({ onPress }: RetryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reload projects"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Ionicons
          name="refresh-outline"
          size={18}
          color={colors.text.inverse}
        />

        <ThemedText type="smallBold" themeColor="inverse">
          Reload projects
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Project Tile
 * -----------------------------------------------------------------------------
 */

interface ProjectTileProps {
  name: string;
  onPress: () => void;
  wide: boolean;
  index: number;
}

function ProjectTile({
  name,
  onPress,
  wide,
  index,
}: ProjectTileProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.975, {
      damping: 14,
      stiffness: 280,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 14,
      stiffness: 280,
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(180 + index * 70).duration(450)}
      style={[
        styles.projectTileWrapper,
        wide && styles.projectTileWrapperWide,
        animatedStyle,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${name}`}
        accessibilityHint="Open this project's files workspace."
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.projectTile,
          pressed && styles.projectTilePressed,
        ]}
      >
        {/* Top Row */}

        <View style={styles.tileTopRow}>
          <View style={styles.folderIcon}>
            <Ionicons
              name="folder"
              size={22}
              color={colors.brand.accent}
            />
          </View>

          <View style={styles.openIcon}>
            <Ionicons
              name="arrow-forward-outline"
              size={18}
              color={colors.text.secondary}
            />
          </View>
        </View>

        {/* Project Name */}

        <View style={styles.tileBody}>
          <ThemedText
            type="smallBold"
            numberOfLines={2}
            style={styles.projectName}
          >
            {name}
          </ThemedText>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />

            <ThemedText type="small" themeColor="tertiary">
              Active
            </ThemedText>
          </View>
        </View>

        {/* Bottom Action */}

        <View style={styles.tileFooter}>
          <ThemedText type="small" themeColor="secondary">
            Open files
          </ThemedText>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.text.muted}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}