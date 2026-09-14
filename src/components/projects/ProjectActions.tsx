/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectActions.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project-level action controls.
 *
 * Responsibilities:
 *
 * - Display available actions for a project.
 * - Show archive or restore depending on project status.
 * - Expose action callbacks to the parent screen.
 * - Provide accessible labels and disabled states.
 *
 * This component does NOT:
 *
 * - Perform API requests.
 * - Navigate.
 * - Mutate project state directly.
 * - Manage confirmation dialogs.
 *
 * The parent screen is responsible for deciding what happens when an action
 * is selected.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
    Pressable,
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    PROJECT_STATUS_LABELS,
} from "@/constants/project.constants";

import type {
    Project,
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

export interface ProjectActionsProps {
    /**
     * Project whose actions are being displayed.
     */
    project: Project;

    /**
     * Edit project.
     */
    onEdit?: () => void;

    /**
     * Archive project.
     */
    onArchive?: () => void;

    /**
     * Restore project.
     */
    onRestore?: () => void;

    /**
     * Open project members.
     */
    onMembers?: () => void;

    /**
     * Open project activity.
     */
    onActivity?: () => void;

    /**
     * Delete project.
     *
     * This is intentionally optional because deletion may not be exposed
     * in every project context.
     */
    onDelete?: () => void;

    /**
     * Disable all actions.
     */
    disabled?: boolean;

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

export function ProjectActions({
    project,
    onEdit,
    onArchive,
    onRestore,
    onMembers,
    onActivity,
    onDelete,
    disabled = false,
    style,
}: ProjectActionsProps) {
    const isArchived =
        project.status === "ARCHIVED";

    const isDeleted =
        project.status === "DELETED";

    /**
     * Deleted projects should not expose normal mutation actions.
     *
     * Members/activity can still be displayed when supplied by the parent.
     */
    const canEdit =
        !isDeleted && Boolean(onEdit);

    const canArchive =
        !isDeleted &&
        !isArchived &&
        Boolean(onArchive);

    const canRestore =
        !isDeleted &&
        isArchived &&
        Boolean(onRestore);

    return (
        <View
            style={[
                styles.container,
                style,
            ]}
        >
            {/* -----------------------------------------------------------------
             * Section Header
             * ----------------------------------------------------------------- */}

            <View
                style={
                    styles.header
                }
            >
                <ThemedText
                    type="title"
                >
                    Project actions
                </ThemedText>

                <ThemedText
                    type="small"
                    themeColor="secondary"
                >
                    Manage this project and its workspace.
                </ThemedText>
            </View>

            {/* -----------------------------------------------------------------
             * Primary Actions
             * ----------------------------------------------------------------- */}

            <View
                style={
                    styles.actionGroup
                }
            >
                {canEdit ? (
                    <ActionButton
                        icon="create-outline"
                        label="Edit project"
                        description="Update the project details."
                        onPress={
                            onEdit
                        }
                        disabled={
                            disabled
                        }
                    />
                ) : null}

                {canArchive ? (
                    <ActionButton
                        icon="archive-outline"
                        label="Archive project"
                        description="Move the project out of the active workspace."
                        onPress={
                            onArchive
                        }
                        disabled={
                            disabled
                        }
                    />
                ) : null}

                {canRestore ? (
                    <ActionButton
                        icon="arrow-undo-outline"
                        label="Restore project"
                        description="Return this project to the active workspace."
                        onPress={
                            onRestore
                        }
                        disabled={
                            disabled
                        }
                    />
                ) : null}

                {onMembers ? (
                    <ActionButton
                        icon="people-outline"
                        label="Project members"
                        description="View and manage project members."
                        onPress={
                            onMembers
                        }
                        disabled={
                            disabled
                        }
                    />
                ) : null}

                {onActivity ? (
                    <ActionButton
                        icon="pulse-outline"
                        label="Project activity"
                        description="View recent activity for this project."
                        onPress={
                            onActivity
                        }
                        disabled={
                            disabled
                        }
                    />
                ) : null}
            </View>

            {/* -----------------------------------------------------------------
             * Current Status
             * ----------------------------------------------------------------- */}

            <View
                style={
                    styles.statusContainer
                }
            >
                <View
                    style={
                        styles.statusIcon
                    }
                >
                    <Ionicons
                        name={
                            getStatusIcon(
                                project.status,
                            )
                        }
                        size={18}
                        color={
                            getStatusColor(
                                project.status,
                            )
                        }
                    />
                </View>

                <View
                    style={
                        styles.statusContent
                    }
                >
                    <ThemedText
                        type="smallBold"
                    >
                        Project status
                    </ThemedText>

                    <ThemedText
                        type="small"
                        themeColor="secondary"
                    >
                        {
                            PROJECT_STATUS_LABELS[
                                project.status
                            ]
                        }
                    </ThemedText>
                </View>
            </View>

            {/* -----------------------------------------------------------------
             * Destructive Actions
             * ----------------------------------------------------------------- */}

            {onDelete &&
            !isDeleted ? (
                <View
                    style={
                        styles.dangerSection
                    }
                >
                    <View
                        style={
                            styles.dangerDivider
                        }
                    />

                    <ThemedText
                        type="smallBold"
                        style={
                            styles.dangerTitle
                        }
                    >
                        Danger zone
                    </ThemedText>

                    <ThemedText
                        type="small"
                        themeColor="secondary"
                        style={
                            styles.dangerDescription
                        }
                    >
                        Deleting a project is a destructive action and may remove
                        associated project data.
                    </ThemedText>

                    <ActionButton
                        icon="trash-outline"
                        label="Delete project"
                        description="Permanently remove this project."
                        onPress={
                            onDelete
                        }
                        disabled={
                            disabled
                        }
                        destructive
                    />
                </View>
            ) : null}
        </View>
    );
}

/**
 * -----------------------------------------------------------------------------
 * Action Button
 * -----------------------------------------------------------------------------
 */

interface ActionButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
    onPress?: () => void;
    disabled?: boolean;
    destructive?: boolean;
}

function ActionButton({
    icon,
    label,
    description,
    onPress,
    disabled = false,
    destructive = false,
}: ActionButtonProps) {
    if (!onPress) {
        return null;
    }

    const iconColor = destructive
        ? colors.status.error
        : colors.brand.accent;

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={
                description
            }
            accessibilityState={{
                disabled,
            }}
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.actionButton,

                destructive &&
                    styles.destructiveButton,

                pressed &&
                    !disabled &&
                    styles.actionButtonPressed,

                disabled &&
                    styles.disabled,
            ]}
        >
            <View
                style={[
                    styles.actionIcon,
                    destructive &&
                        styles.destructiveIcon,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={19}
                    color={
                        iconColor
                    }
                />
            </View>

            <View
                style={
                    styles.actionContent
                }
            >
                <ThemedText
                    type="smallBold"
                    style={
                        destructive
                            ? styles.destructiveLabel
                            : undefined
                    }
                >
                    {label}
                </ThemedText>

                <ThemedText
                    type="small"
                    themeColor="secondary"
                    numberOfLines={2}
                >
                    {description}
                </ThemedText>
            </View>

            <Ionicons
                name="chevron-forward"
                size={18}
                color={
                    destructive
                        ? colors.status.error
                        : colors.text.tertiary
                }
            />
        </Pressable>
    );
}

/**
 * -----------------------------------------------------------------------------
 * Status Icon
 * -----------------------------------------------------------------------------
 */

function getStatusIcon(
    status: Project["status"],
): keyof typeof Ionicons.glyphMap {
    switch (status) {
        case "ACTIVE":
            return "checkmark-circle-outline";

        case "ARCHIVED":
            return "archive-outline";

        case "DELETED":
            return "trash-outline";

        default:
            return "help-circle-outline";
    }
}

/**
 * -----------------------------------------------------------------------------
 * Status Color
 * -----------------------------------------------------------------------------
 */

function getStatusColor(
    status: Project["status"],
): string {
    switch (status) {
        case "ACTIVE":
            return colors.status.success;

        case "ARCHIVED":
            return colors.text.secondary;

        case "DELETED":
            return colors.status.error;

        default:
            return colors.text.secondary;
    }
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
    container: {
        gap: spacing.lg,

        paddingHorizontal:
            spacing.lg,

        paddingVertical:
            spacing.xl,
    },

    header: {
        gap: spacing.xs,
    },

    actionGroup: {
        gap: spacing.sm,
    },

    actionButton: {
        alignItems: "center",

        backgroundColor:
            colors.background
                .surface,

        borderColor:
            colors.border.light,

        borderRadius:
            radius.md,

        borderWidth: 1,

        flexDirection: "row",

        minHeight: 68,

        paddingHorizontal:
            spacing.md,

        paddingVertical:
            spacing.md,
    },

    actionButtonPressed: {
        opacity: 0.7,
    },

    actionIcon: {
        alignItems: "center",

        backgroundColor:
            colors.brand
                .accentLight,

        borderRadius:
            radius.sm,

        height: 38,

        justifyContent:
            "center",

        width: 38,
    },

    actionContent: {
        flex: 1,

        gap: 2,

        marginHorizontal:
            spacing.md,
    },

    statusContainer: {
        alignItems: "center",

        backgroundColor:
            colors.background
                .secondary,

        borderColor:
            colors.border.light,

        borderRadius:
            radius.md,

        borderWidth: 1,

        flexDirection: "row",

        padding:
            spacing.md,
    },

    statusIcon: {
        alignItems: "center",

        height: 36,

        justifyContent:
            "center",

        width: 36,
    },

    statusContent: {
        flex: 1,

        gap: 2,
    },

    dangerSection: {
        gap: spacing.sm,
    },

    dangerDivider: {
        backgroundColor:
            colors.border.light,

        height: 1,

        marginBottom:
            spacing.sm,
    },

    dangerTitle: {
        color:
            colors.status.error,
    },

    dangerDescription: {
        marginBottom:
            spacing.xs,
    },

    destructiveButton: {
        borderColor:
            colors.status.error,

        backgroundColor:
            colors.status
                .errorBackground,
    },

    destructiveIcon: {
        backgroundColor:
            colors.background
                .surface,
    },

    destructiveLabel: {
        color:
            colors.status.error,
    },

    disabled: {
        opacity: 0.5,
    },
});

export default ProjectActions;