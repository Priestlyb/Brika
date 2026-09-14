/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectStatusBadge.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Reusable visual indicator for a project's current status.
 *
 * Responsibilities:
 *
 * - Display the project's status.
 * - Resolve the appropriate semantic color.
 * - Display a consistent status label.
 *
 * This component does NOT:
 *
 * - Fetch project data.
 * - Modify project state.
 * - Perform API requests.
 * - Navigate.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    PROJECT_STATUS_LABELS,
} from "@/constants/project.constants";

import type {
    ProjectStatus,
} from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectStatusBadgeProps {
    /**
     * Current project status.
     */
    status: ProjectStatus;

    /**
     * Display a status icon.
     *
     * @default true
     */
    showIcon?: boolean;

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

export function ProjectStatusBadge({
    status,
    showIcon = true,
    style,
}: ProjectStatusBadgeProps) {
    const visual =
        getStatusVisual(status);

    return (
        <View
            accessibilityRole="text"
            accessibilityLabel={`Project status: ${visual.label}`}
            style={[
                styles.container,
                {
                    backgroundColor:
                        visual.backgroundColor,
                },
                style,
            ]}
        >
            {showIcon ? (
                <Ionicons
                    name={visual.icon}
                    size={14}
                    color={
                        visual.color
                    }
                />
            ) : null}

            <ThemedText
                type="smallBold"
                style={[
                    styles.label,
                    {
                        color:
                            visual.color,
                    },
                ]}
            >
                {visual.label}
            </ThemedText>
        </View>
    );
}

/**
 * -----------------------------------------------------------------------------
 * Visual Configuration
 * -----------------------------------------------------------------------------
 */

interface StatusVisual {
    label: string;
    color: string;
    backgroundColor: string;
    icon: keyof typeof Ionicons.glyphMap;
}

/**
 * -----------------------------------------------------------------------------
 * Status Visual Resolver
 * -----------------------------------------------------------------------------
 */

function getStatusVisual(
    status: ProjectStatus,
): StatusVisual {
    switch (status) {
        case "ACTIVE":
            return {
                label:
                    PROJECT_STATUS_LABELS[
                        status
                    ],

                color:
                    colors.status
                        .success,

                backgroundColor:
                    colors.status
                        .successBackground,

                icon:
                    "checkmark-circle-outline",
            };

        case "ARCHIVED":
            return {
                label:
                    PROJECT_STATUS_LABELS[
                        status
                    ],

                color:
                    colors.text
                        .secondary,

                backgroundColor:
                    colors.background
                        .secondary,

                icon:
                    "archive-outline",
            };

        case "DELETED":
            return {
                label:
                    PROJECT_STATUS_LABELS[
                        status
                    ],

                color:
                    colors.status
                        .error,

                backgroundColor:
                    colors.status
                        .errorBackground,

                icon:
                    "trash-outline",
            };

        default:
            return {
                label:
                    String(status),

                color:
                    colors.text
                        .secondary,

                backgroundColor:
                    colors.background
                        .secondary,

                icon:
                    "help-circle-outline",
            };
    }
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
    container: {
        alignItems: "center",

        alignSelf: "flex-start",

        borderRadius:
            radius.pill,

        flexDirection: "row",

        gap: spacing.xs,

        paddingHorizontal:
            spacing.sm,

        paddingVertical:
            spacing.xs,
    },

    label: {
        fontWeight: "600",
    },
});

export default ProjectStatusBadge;