/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectEmptyState.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Empty and error state for the Projects feature.
 *
 * Responsibilities:
 *
 * - Communicate that no projects are available.
 * - Communicate project-loading errors.
 * - Provide an optional action such as "Create Project" or "Try Again".
 *
 * This component does NOT:
 *
 * - Fetch projects.
 * - Create projects.
 * - Navigate directly.
 * - Manage project state.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
    Pressable,
    StyleSheet,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectEmptyStateProps {
    /**
     * Main state title.
     */
    title?: string;

    /**
     * Supporting explanation.
     */
    message?: string;

    /**
     * Optional action label.
     */
    actionLabel?: string;

    /**
     * Called when the action button is pressed.
     */
    onAction?: () => void;

    /**
     * Icon displayed above the title.
     */
    icon?: keyof typeof Ionicons.glyphMap;

    /**
     * Prevent interaction with the action.
     */
    disabled?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectEmptyState({
    title = "No projects yet",
    message = "Create your first project to start organizing your architectural work.",
    actionLabel,
    onAction,
    icon = "folder-open-outline",
    disabled = false,
}: ProjectEmptyStateProps) {
    /**
     * Only render an action when both an action label and callback exist.
     *
     * This prevents an interactive-looking button from being rendered without
     * any behavior attached to it.
     */

    const showAction =
        Boolean(
            actionLabel &&
            onAction,
        );

    return (
        <View
            style={
                styles.container
            }
        >
            {/* -----------------------------------------------------------------
             * Icon
             * ----------------------------------------------------------------- */}

            <View
                style={
                    styles.iconContainer
                }
            >
                <Ionicons
                    name={icon}
                    size={32}
                    color={
                        colors.brand.accent
                    }
                />
            </View>

            {/* -----------------------------------------------------------------
             * Title
             * ----------------------------------------------------------------- */}

            <ThemedText
                type="title"
                style={styles.title}
            >
                {title}
            </ThemedText>

            {/* -----------------------------------------------------------------
             * Message
             * ----------------------------------------------------------------- */}

            <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.message}
            >
                {message}
            </ThemedText>

            {/* -----------------------------------------------------------------
             * Action
             * ----------------------------------------------------------------- */}

            {showAction && (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                        actionLabel
                    }
                    accessibilityState={{
                        disabled,
                    }}
                    disabled={
                        disabled
                    }
                    onPress={
                        onAction
                    }
                    style={({
                        pressed,
                    }) => [
                        styles.action,

                        pressed &&
                            !disabled &&
                            styles.actionPressed,

                        disabled &&
                            styles.actionDisabled,
                    ]}
                >
                    <ThemedText
                        type="button"
                        themeColor="inverse"
                        style={
                            styles.actionText
                        }
                    >
                        {actionLabel}
                    </ThemedText>
                </Pressable>
            )}
        </View>
    );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
    container: {
        alignItems: "center",

        flex: 1,

        justifyContent:
            "center",

        paddingHorizontal:
            spacing.xxl,

        paddingVertical:
            spacing.huge,
    },

    iconContainer: {
        alignItems: "center",

        backgroundColor:
            colors.brand.accentLight,

        borderRadius: 999,

        height: 72,

        justifyContent:
            "center",

        marginBottom:
            spacing.lg,

        width: 72,
    },

    title: {
        textAlign: "center",
    },

    message: {
        maxWidth: 340,

        marginTop:
            spacing.sm,

        textAlign: "center",
    },

    action: {
        alignItems: "center",

        backgroundColor:
            colors.brand.accent,

        borderRadius: 8,

        justifyContent:
            "center",

        marginTop:
            spacing.xl,

        minHeight: 44,

        paddingHorizontal:
            spacing.xl,
    },

    actionPressed: {
        opacity: 0.85,
    },

    actionDisabled: {
        opacity: 0.5,
    },

    actionText: {
        fontWeight: "600",
    },
});

export default ProjectEmptyState;