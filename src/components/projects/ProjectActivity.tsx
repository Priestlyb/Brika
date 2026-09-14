/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectActivity.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project activity section.
 *
 * Responsibilities:
 *
 * - Display recent project activity.
 * - Display loading, error, and empty states.
 * - Display the activity count.
 * - Delegate individual activity rendering to ProjectActivityItem.
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

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type {
    ProjectActivity as ProjectActivityType,
} from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import { ThemedText } from "@/components/themed-text";

import { ProjectActivityItem } from "./ProjectActivityItem";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectActivityProps {
    /**
     * Project activity entries.
     */
    activities: ProjectActivityType[];

    /**
     * Whether activity is currently loading.
     */
    loading?: boolean;

    /**
     * Optional loading error.
     */
    error?: string | null;

    /**
     * Optional retry callback.
     */
    onRetry?: () => void;

    /**
     * Optional callback when an activity item is selected.
     */
    onActivityPress?: (
        activity: ProjectActivityType,
    ) => void;

    /**
     * Maximum number of activities to display.
     *
     * If omitted, all supplied activities are displayed.
     */
    limit?: number;

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

export function ProjectActivity({
    activities,
    loading = false,
    error = null,
    onRetry,
    onActivityPress,
    limit,
    style,
}: ProjectActivityProps) {
    const visibleActivities =
        typeof limit === "number"
            ? activities.slice(
                  0,
                  Math.max(
                      0,
                      limit,
                  ),
              )
            : activities;

    const activityCount =
        activities.length;

    return (
        <View
            style={[
                styles.container,
                style,
            ]}
        >
            {/* -----------------------------------------------------------------
             * Header
             * ----------------------------------------------------------------- */}

            <View
                style={
                    styles.header
                }
            >
                <View
                    style={
                        styles.headingContent
                    }
                >
                    <ThemedText
                        type="title"
                    >
                        Activity
                    </ThemedText>

                    <ThemedText
                        type="small"
                        themeColor="secondary"
                    >
                        {activityCount === 1
                            ? "1 activity"
                            : `${activityCount} activities`}
                    </ThemedText>
                </View>

                <Ionicons
                    name="pulse-outline"
                    size={22}
                    color={
                        colors.text
                            .secondary
                    }
                />
            </View>

            {/* -----------------------------------------------------------------
             * Error State
             * ----------------------------------------------------------------- */}

            {error ? (
                <View
                    style={
                        styles.messageContainer
                    }
                >
                    <View
                        style={
                            styles.messageIcon
                        }
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={22}
                            color={
                                colors
                                    .status
                                    .error
                            }
                        />
                    </View>

                    <View
                        style={
                            styles.messageContent
                        }
                    >
                        <ThemedText
                            type="smallBold"
                        >
                            Unable to load activity
                        </ThemedText>

                        <ThemedText
                            type="small"
                            themeColor="secondary"
                        >
                            {error}
                        </ThemedText>

                        {onRetry ? (
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Retry loading project activity"
                                onPress={
                                    onRetry
                                }
                                style={({ pressed }) => [
                                    styles.retryButton,

                                    pressed &&
                                        styles.pressed,
                                ]}
                            >
                                <ThemedText
                                    type="smallBold"
                                    style={
                                        styles.retryLabel
                                    }
                                >
                                    Try again
                                </ThemedText>
                            </Pressable>
                        ) : null}
                    </View>
                </View>
            ) : null}

            {/* -----------------------------------------------------------------
             * Loading State
             * ----------------------------------------------------------------- */}

            {loading ? (
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="small"
                        color={
                            colors.brand
                                .accent
                        }
                    />

                    <ThemedText
                        type="small"
                        themeColor="secondary"
                    >
                        Loading activity...
                    </ThemedText>
                </View>
            ) : null}

            {/* -----------------------------------------------------------------
             * Empty State
             * ----------------------------------------------------------------- */}

            {!loading &&
            !error &&
            activityCount === 0 ? (
                <View
                    style={
                        styles.emptyContainer
                    }
                >
                    <View
                        style={
                            styles.emptyIcon
                        }
                    >
                        <Ionicons
                            name="time-outline"
                            size={24}
                            color={
                                colors
                                    .text
                                    .tertiary
                            }
                        />
                    </View>

                    <ThemedText
                        type="smallBold"
                    >
                        No activity yet
                    </ThemedText>

                    <ThemedText
                        type="small"
                        themeColor="secondary"
                        style={
                            styles.emptyDescription
                        }
                    >
                        Project activity will appear here as changes are made.
                    </ThemedText>
                </View>
            ) : null}

            {/* -----------------------------------------------------------------
             * Activity List
             * ----------------------------------------------------------------- */}

            {!loading &&
            !error &&
            visibleActivities.length >
                0 ? (
                <View
                    style={
                        styles.activityList
                    }
                >
                    {visibleActivities.map(
                        (
                            activity,
                            index,
                        ) => (
                            <React.Fragment
                                key={
                                    getActivityKey(
                                        activity,
                                        index,
                                    )
                                }
                            >
                                <ProjectActivityItem
                                    activity={
                                        activity
                                    }
                                    onPress={
                                        onActivityPress
                                            ? () =>
                                                  onActivityPress(
                                                      activity,
                                                  )
                                            : undefined
                                    }
                                />

                                {index <
                                visibleActivities.length -
                                    1 ? (
                                    <View
                                        style={
                                            styles.divider
                                        }
                                    />
                                ) : null}
                            </React.Fragment>
                        ),
                    )}
                </View>
            ) : null}
        </View>
    );
}

/**
 * -----------------------------------------------------------------------------
 * Activity Key
 * -----------------------------------------------------------------------------
 *
 * Activity APIs commonly expose an id. The fallback keeps rendering resilient
 * if an older response does not include one.
 * -----------------------------------------------------------------------------
 */

function getActivityKey(
    activity: ProjectActivityType,
    index: number,
): string {
    const activityWithId =
        activity as ProjectActivityType & {
            id?: string | number;
        };

    return activityWithId.id
        ? String(
              activityWithId.id,
          )
        : `activity-${index}`;
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
    container: {
        gap: spacing.lg,
    },

    header: {
        alignItems: "center",

        flexDirection: "row",

        justifyContent:
            "space-between",
    },

    headingContent: {
        gap: spacing.xs,
    },

    activityList: {
        backgroundColor:
            colors.background
                .surface,

        borderColor:
            colors.border.light,

        borderRadius:
            radius.md,

        borderWidth: 1,

        overflow: "hidden",
    },

    divider: {
        backgroundColor:
            colors.border.light,

        height: 1,

        marginLeft:
            spacing.md,
    },

    loadingContainer: {
        alignItems: "center",

        backgroundColor:
            colors.background
                .secondary,

        borderRadius:
            radius.md,

        flexDirection: "row",

        gap: spacing.sm,

        justifyContent:
            "center",

        minHeight: 80,

        padding:
            spacing.lg,
    },

    emptyContainer: {
        alignItems: "center",

        backgroundColor:
            colors.background
                .secondary,

        borderRadius:
            radius.md,

        justifyContent:
            "center",

        minHeight: 180,

        padding:
            spacing.xl,
    },

    emptyIcon: {
        alignItems: "center",

        backgroundColor:
            colors.background
                .surface,

        borderRadius:
            radius.pill,

        height: 52,

        justifyContent:
            "center",

        marginBottom:
            spacing.md,

        width: 52,
    },

    emptyDescription: {
        marginTop:
            spacing.xs,

        maxWidth: 320,

        textAlign: "center",
    },

    messageContainer: {
        alignItems: "flex-start",

        backgroundColor:
            colors.status
                .errorBackground,

        borderRadius:
            radius.md,

        flexDirection: "row",

        gap: spacing.md,

        padding:
            spacing.md,
    },

    messageIcon: {
        alignItems: "center",

        justifyContent:
            "center",
    },

    messageContent: {
        flex: 1,

        gap: spacing.xs,
    },

    retryButton: {
        alignSelf:
            "flex-start",

        marginTop:
            spacing.xs,

        paddingVertical:
            spacing.xs,
    },

    retryLabel: {
        color:
            colors.brand
                .accentDark,

        textDecorationLine:
            "underline",
    },

    pressed: {
        opacity: 0.7,
    },
});

export default ProjectActivity;