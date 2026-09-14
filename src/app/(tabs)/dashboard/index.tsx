/**
 * -----------------------------------------------------------------------------
 * File: src/app/index.tsx
 * -----------------------------------------------------------------------------
 * Brika Dashboard
 *
 * Main application dashboard.
 *
 * Responsibilities:
 *
 * - Display the Brika workspace dashboard.
 * - Provide project overview information.
 * - Display recent projects.
 * - Display generation activity.
 * - Provide quick actions.
 * - Respond to the active Brika theme.
 * - Provide restrained, premium UI motion.
 *
 * -----------------------------------------------------------------------------
 */

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FlipText from "@/components/ui/FlipText";
import { useBrikaTheme } from "@/hooks/use-brika-theme";
import { createStyles, DashboardStyles } from "@/styles";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

type IconName = keyof typeof Ionicons.glyphMap;

interface Project {
  id: string;
  name: string;
  type: string;
  updated: string;
  status: "Ready" | "Processing" | "Draft";
}

interface DashboardColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  white: string;
  success: string;
  warning: string;
  iconBackground: string;
}

/**
 * -----------------------------------------------------------------------------
 * Demo Data
 * -----------------------------------------------------------------------------
 */

const projects: Project[] = [
  {
    id: "1",
    name: "Lekki Residence",
    type: "Residential",
    updated: "Updated 12 min ago",
    status: "Ready",
  },
  {
    id: "2",
    name: "Abuja Office Tower",
    type: "Commercial",
    updated: "Updated 1 hour ago",
    status: "Processing",
  },
  {
    id: "3",
    name: "Victoria Island Villa",
    type: "Residential",
    updated: "Updated yesterday",
    status: "Draft",
  },
];

/**
 * -----------------------------------------------------------------------------
 * Premium Motion Helpers
 * -----------------------------------------------------------------------------
 *
 * Brika uses restrained motion inspired by premium native interfaces:
 *
 * - Small vertical movement.
 * - Soft opacity transitions.
 * - Gentle spring settling.
 * - Staggered content reveals.
 * - No excessive bouncing.
 *
 * The purpose is to make the dashboard feel responsive and polished without
 * making the interface feel "animated".
 * -----------------------------------------------------------------------------
 */

function useEntranceAnimation(delay = 0, distance = 12) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 150,
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
 * Progress Animation
 * -----------------------------------------------------------------------------
 */

function useProgressAnimation(target: number, delay = 0, duration = 900) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.timing(progress, {
        toValue: target,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, duration, progress, target]);

  return progress;
}

/**
 * -----------------------------------------------------------------------------
 * Dashboard Screen
 * -----------------------------------------------------------------------------
 */

export default function HomeScreen() {
  const theme = useBrikaTheme();
  const styles = createStyles(theme);

  /**
   * ---------------------------------------------------------------------------
   * Section Motion
   * ---------------------------------------------------------------------------
   */

  const headerMotion = useEntranceAnimation(80, 10);
  const overviewMotion = useEntranceAnimation(180, 12);
  const actionsMotion = useEntranceAnimation(280, 12);
  const projectsMotion = useEntranceAnimation(380, 12);
  const activityMotion = useEntranceAnimation(480, 12);
  const storageMotion = useEntranceAnimation(580, 12);

  /**
   * ---------------------------------------------------------------------------
   * Progress Motion
   * ---------------------------------------------------------------------------
   */

  const generationProgress = useProgressAnimation(68, 700, 1100);
  const storageProgress = useProgressAnimation(48, 800, 1000);

  const colors: DashboardColors = {
    background: theme.background.primary,
    surface: theme.background.surface,
    surfaceElevated: theme.background.surface,
    border: theme.border.light,
    text: theme.text.primary,
    textSecondary: theme.text.secondary,
    textMuted: theme.text.muted,
    accent: theme.brand.accent,
    accentSoft: theme.brand.accentLight,
    white: theme.text.inverse,
    success: theme.status.success,
    warning: theme.status.warning,
    iconBackground: theme.background.secondary,
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={styles.dashboard}>
          {/* -----------------------------------------------------------------
              Header
              ----------------------------------------------------------------- */}

          <Animated.View style={[styles.header, headerMotion]}>
            <View style={styles.headerContent}>
              <View style={styles.brandRow}>
                <Image
                  source={require("@/assets/images/Brika_logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel="Brika"
                />
              </View>

              <ThemedText
                text="Good afternoon"
                style={[
                  styles.greeting,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              />

              <FlipText
                style={styles.headingContainer}
                textStyle={[
                  styles.heading,
                  {
                    color: colors.text,
                  },
                ]}
                duration={700}
                stagger={35}
                loopDelay={2200}
                delay={150}
                loop
              >
                Let's build something great.
              </FlipText>
            </View>

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.profileButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <ThemedText
                text="PB"
                style={[
                  styles.profileText,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </Pressable>
          </Animated.View>

          {/* -----------------------------------------------------------------
              Overview
              ----------------------------------------------------------------- */}

          <Animated.View style={[styles.section, overviewMotion]}>
            <ThemedText
              text="Overview"
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            />

            <View style={styles.statsGrid}>
              <StatCard
                icon="folder-outline"
                label="Projects"
                value="12"
                colors={colors}
                styles={styles}
                delay={180}
              />

              <StatCard
                icon="cube-outline"
                label="3D Models"
                value="28"
                colors={colors}
                styles={styles}
                delay={230}
              />

              <StatCard
                icon="time-outline"
                label="Processing"
                value="2"
                colors={colors}
                styles={styles}
                delay={280}
              />

              <StatCard
                icon="cloud-outline"
                label="Storage"
                value="4.8 GB"
                colors={colors}
                styles={styles}
                delay={330}
              />
            </View>
          </Animated.View>

          {/* -----------------------------------------------------------------
              Quick Actions
              ----------------------------------------------------------------- */}

          <Animated.View style={[styles.section, actionsMotion]}>
            <ThemedText
              text="Quick actions"
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            />

            <View style={styles.actionsGrid}>
              <ActionCard
                icon="add"
                title="New project"
                description="Start a new workspace"
                primary
                colors={colors}
                styles={styles}
              />

              <ActionCard
                icon="cloud-upload-outline"
                title="Upload drawing"
                description="Import DWG or DXF"
                colors={colors}
                styles={styles}
              />

              <ActionCard
                icon="cube-outline"
                title="Generate 3D"
                description="Create a model"
                colors={colors}
                styles={styles}
              />
            </View>
          </Animated.View>

          {/* -----------------------------------------------------------------
              Recent Projects
              ----------------------------------------------------------------- */}

          <Animated.View style={[styles.section, projectsMotion]}>
            <View style={styles.sectionHeader}>
              <ThemedText
                text="Recent projects"
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              />

              <Pressable accessibilityRole="button" hitSlop={8}>
                <ThemedText
                  text="View all"
                  style={[
                    styles.viewAll,
                    {
                      color: colors.accent,
                    },
                  ]}
                />
              </Pressable>
            </View>

            <View
              style={[
                styles.projectList,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {projects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isLast={index === projects.length - 1}
                  colors={colors}
                  styles={styles}
                  delay={420 + index * 70}
                />
              ))}
            </View>
          </Animated.View>

          {/* -----------------------------------------------------------------
              Generation Activity
              ----------------------------------------------------------------- */}

          <Animated.View style={[styles.section, activityMotion]}>
            <ThemedText
              text="Generation activity"
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            />

            <View
              style={[
                styles.activityCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.activityHeader}>
                <View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor: colors.accentSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={21}
                    color={colors.accent}
                  />
                </View>

                <View style={styles.activityContent}>
                  <ThemedText
                    text="Abuja Office Tower"
                    style={[
                      styles.activityTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  />

                  <ThemedText
                    text="Generating 3D model"
                    style={[
                      styles.activitySubtitle,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  />
                </View>

                <ThemedText
                  text="68%"
                  style={[
                    styles.progressText,
                    {
                      color: colors.accent,
                    },
                  ]}
                />
              </View>

              <View
                style={[
                  styles.progressTrack,
                  {
                    backgroundColor: colors.iconBackground,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.accent,
                      width: generationProgress.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>

              <View style={styles.activityFooter}>
                <ThemedText
                  text="Walls and rooms detected"
                  style={[
                    styles.activityFooterText,
                    {
                      color: colors.textMuted,
                    },
                  ]}
                />

                <ThemedText
                  text="~2 min remaining"
                  style={[
                    styles.activityFooterText,
                    {
                      color: colors.textMuted,
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>

          {/* -----------------------------------------------------------------
              Storage
              ----------------------------------------------------------------- */}

          <Animated.View style={[styles.section, storageMotion]}>
            <View
              style={[
                styles.storageCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.storageHeader}>
                <View style={styles.storageInfo}>
                  <ThemedText
                    text="Storage"
                    style={[
                      styles.storageTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  />

                  <ThemedText
                    text="4.8 GB of 10 GB used"
                    style={[
                      styles.storageSubtitle,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  />
                </View>

                <View
                  style={[
                    styles.storageIcon,
                    {
                      backgroundColor: colors.accentSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name="cloud-outline"
                    size={20}
                    color={colors.accent}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.progressTrack,
                  {
                    backgroundColor: colors.iconBackground,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.accent,
                      width: storageProgress.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Stat Card
 * -----------------------------------------------------------------------------
 */

interface StatCardProps {
  icon: IconName;
  label: string;
  value: string;
  colors: DashboardColors;
  styles: DashboardStyles;
  delay?: number;
}

function StatCard({
  icon,
  label,
  value,
  colors,
  styles,
  delay = 0,
}: StatCardProps) {
  const motion = useEntranceAnimation(delay, 8);

  return (
    <Animated.View
      style={[
        styles.statCard,
        motion,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: colors.iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={19} color={colors.accent} />
      </View>

      <View style={styles.statText}>
        <ThemedText
          text={value}
          style={[
            styles.statValue,
            {
              color: colors.text,
            },
          ]}
        />

        <ThemedText
          text={label}
          style={[
            styles.statLabel,
            {
              color: colors.textSecondary,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Action Card
 * -----------------------------------------------------------------------------
 */

interface ActionCardProps {
  icon: IconName;
  title: string;
  description: string;
  primary?: boolean;
  colors: DashboardColors;
  styles: DashboardStyles;
}

function ActionCard({
  icon,
  title,
  description,
  primary = false,
  colors,
  styles,
}: ActionCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.975,
      damping: 18,
      stiffness: 300,
      mass: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      damping: 14,
      stiffness: 260,
      mass: 0.5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
    >
      <Pressable
        accessibilityRole="button"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.actionCard,
          {
            backgroundColor: primary ? colors.accent : colors.surface,
            borderColor: primary ? colors.accent : colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.actionIcon,
            {
              backgroundColor: primary
                ? colors.accentSoft
                : colors.iconBackground,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={primary ? colors.white : colors.accent}
          />
        </View>

        <ThemedText
          text={title}
          style={[
            styles.actionTitle,
            {
              color: primary ? colors.white : colors.text,
            },
          ]}
        />

        <ThemedText
          text={description}
          style={[
            styles.actionDescription,
            {
              color: primary ? colors.white : colors.textSecondary,
              opacity: primary ? 0.72 : 1,
            },
          ]}
        />
      </Pressable>
    </Animated.View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Project Row
 * -----------------------------------------------------------------------------
 */

interface ProjectRowProps {
  project: Project;
  isLast: boolean;
  colors: DashboardColors;
  styles: DashboardStyles;
  delay?: number;
}

function ProjectRow({
  project,
  isLast,
  colors,
  styles,
  delay = 0,
}: ProjectRowProps) {
  const motion = useEntranceAnimation(delay, 7);

  const statusColor =
    project.status === "Ready"
      ? colors.success
      : project.status === "Processing"
        ? colors.warning
        : colors.textMuted;

  return (
    <Animated.View style={motion}>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.projectRow,
          !isLast && {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          {
            opacity: pressed ? 0.72 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.projectIcon,
            {
              backgroundColor: colors.iconBackground,
            },
          ]}
        >
          <Ionicons name="business-outline" size={20} color={colors.accent} />
        </View>

        <View style={styles.projectInfo}>
          <ThemedText
            text={project.name}
            style={[
              styles.projectName,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          />

          <ThemedText
            text={`${project.type} · ${project.updated}`}
            style={[
              styles.projectMeta,
              {
                color: colors.textMuted,
              },
            ]}
            numberOfLines={1}
          />
        </View>

        <View style={styles.projectStatus}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: statusColor,
              },
            ]}
          />

          <ThemedText
            text={project.status}
            style={[
              styles.statusText,
              {
                color: statusColor,
              },
            ]}
          />
        </View>

        <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Text Adapter
 * -----------------------------------------------------------------------------
 */

interface ThemedTextProps {
  text: string;
  style?: any;
  numberOfLines?: number;
}

function ThemedText({ text, style, numberOfLines }: ThemedTextProps) {
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
}
