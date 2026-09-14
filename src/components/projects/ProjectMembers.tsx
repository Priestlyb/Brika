/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectMembers.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project members section.
 *
 * Responsibilities:
 *
 * - Display project members.
 * - Display loading and empty states.
 * - Display the project member count.
 * - Provide an optional "Add member" action.
 * - Delegate individual member rendering to ProjectMemberRow.
 *
 * This component does NOT:
 *
 * - Fetch members.
 * - Perform API requests.
 * - Mutate member data directly.
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
    ProjectMember,
} from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import { ThemedText } from "@/components/themed-text";

import { ProjectMemberRow } from "./ProjectMemberRow";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectMembersProps {
    /**
     * Members belonging to the project.
     */
    members: ProjectMember[];

    /**
     * Whether members are currently loading.
     */
    loading?: boolean;

    /**
     * Optional loading error.
     */
    error?: string | null;

    /**
     * Whether the current user can manage members.
     *
     * @default false
     */
    canManage?: boolean;

    /**
     * Called when the user wants to add/invite a member.
     */
    onAddMember?: () => void;

    /**
     * Called when an individual member is selected.
     */
    onMemberPress?: (
        member: ProjectMember,
    ) => void;

    /**
     * Called when a member should be removed.
     */
    onRemoveMember?: (
        member: ProjectMember,
    ) => void;

    /**
     * Disable member actions.
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

export function ProjectMembers({
    members,
    loading = false,
    error = null,
    canManage = false,
    onAddMember,
    onMemberPress,
    onRemoveMember,
    disabled = false,
    style,
}: ProjectMembersProps) {
    const memberCount =
        members.length;

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
                        Members
                    </ThemedText>

                    <ThemedText
                        type="small"
                        themeColor="secondary"
                    >
                        {memberCount === 1
                            ? "1 member"
                            : `${memberCount} members`}
                    </ThemedText>
                </View>

                {canManage &&
                onAddMember ? (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Add project member"
                        accessibilityHint="Invite a member to this project."
                        accessibilityState={{
                            disabled:
                                disabled,
                        }}
                        disabled={
                            disabled
                        }
                        onPress={
                            onAddMember
                        }
                        style={({ pressed }) => [
                            styles.addButton,

                            pressed &&
                                !disabled &&
                                styles.pressed,

                            disabled &&
                                styles.disabled,
                        ]}
                    >
                        <Ionicons
                            name="add"
                            size={18}
                            color={
                                colors
                                    .text
                                    .inverse
                            }
                        />

                        <ThemedText
                            type="smallBold"
                            themeColor="inverse"
                        >
                            Add
                        </ThemedText>
                    </Pressable>
                ) : null}
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
                            size={20}
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
                            Unable to load members
                        </ThemedText>

                        <ThemedText
                            type="small"
                            themeColor="secondary"
                        >
                            {error}
                        </ThemedText>
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
                        Loading members...
                    </ThemedText>
                </View>
            ) : null}

            {/* -----------------------------------------------------------------
             * Empty State
             * ----------------------------------------------------------------- */}

            {!loading &&
            !error &&
            memberCount === 0 ? (
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
                            name="people-outline"
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
                        No project members
                    </ThemedText>

                    <ThemedText
                        type="small"
                        themeColor="secondary"
                        style={
                            styles.emptyDescription
                        }
                    >
                        Add members to collaborate on this project.
                    </ThemedText>

                    {canManage &&
                    onAddMember ? (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Add the first project member"
                            accessibilityState={{
                                disabled:
                                    disabled,
                            }}
                            disabled={
                                disabled
                            }
                            onPress={
                                onAddMember
                            }
                            style={({ pressed }) => [
                                styles.emptyAction,

                                pressed &&
                                    !disabled &&
                                    styles.pressed,

                                disabled &&
                                    styles.disabled,
                            ]}
                        >
                            <Ionicons
                                name="person-add-outline"
                                size={17}
                                color={
                                    colors
                                        .text
                                        .inverse
                                }
                            />

                            <ThemedText
                                type="smallBold"
                                themeColor="inverse"
                            >
                                Add member
                            </ThemedText>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}

            {/* -----------------------------------------------------------------
             * Member List
             * ----------------------------------------------------------------- */}

            {!loading &&
            !error &&
            memberCount > 0 ? (
                <View
                    style={
                        styles.memberList
                    }
                >
                    {members.map(
                        (
                            member,
                            index,
                        ) => (
                            <React.Fragment
                                key={
                                    member.id
                                }
                            >
                                <ProjectMemberRow
                                    member={
                                        member
                                    }
                                    canManage={
                                        canManage
                                    }
                                    disabled={
                                        disabled
                                    }
                                    onPress={
                                        onMemberPress
                                            ? () =>
                                                  onMemberPress(
                                                      member,
                                                  )
                                            : undefined
                                    }
                                    onRemove={
                                        onRemoveMember
                                            ? () =>
                                                  onRemoveMember(
                                                      member,
                                                  )
                                            : undefined
                                    }
                                />

                                {index <
                                memberCount -
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

    addButton: {
        alignItems: "center",

        backgroundColor:
            colors.brand.accent,

        borderRadius:
            radius.md,

        flexDirection: "row",

        gap: spacing.xs,

        justifyContent:
            "center",

        minHeight: 40,

        paddingHorizontal:
            spacing.md,
    },

    memberList: {
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
            spacing.xl +
            40 +
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

        textAlign: "center",
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

        maxWidth: 300,

        textAlign: "center",
    },

    emptyAction: {
        alignItems: "center",

        backgroundColor:
            colors.brand.accent,

        borderRadius:
            radius.md,

        flexDirection: "row",

        gap: spacing.xs,

        justifyContent:
            "center",

        marginTop:
            spacing.lg,

        minHeight: 44,

        paddingHorizontal:
            spacing.lg,
    },

    messageContainer: {
        alignItems: "center",

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

    pressed: {
        opacity: 0.75,
    },

    disabled: {
        opacity: 0.5,
    },
});

export default ProjectMembers;