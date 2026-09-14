/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectList.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Renders the user's projects as a performant React Native list.
 *
 * Responsibilities:
 *
 * - Render project cards.
 * - Render loading state.
 * - Render empty state.
 * - Render an optional error state.
 * - Support pull-to-refresh.
 * - Notify the parent when a project is selected.
 *
 * This component does NOT:
 *
 * - Fetch projects.
 * - Perform API requests.
 * - Navigate directly.
 * - Own project data fetching state.
 *
 * Data fetching belongs in:
 *
 *     hooks/projects/useProjects.ts
 * -----------------------------------------------------------------------------
 */

import React, {
    useCallback,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";

import type {
    ListRenderItem,
} from "react-native";

import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";

import type {
    Project,
} from "@/types/project.types";

import { ProjectCard } from "./ProjectCard";
import { ProjectEmptyState } from "./ProjectEmptyState";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectListProps {
    /**
     * Projects to display.
     */
    projects: Project[];

    /**
     * Loading state for the initial project request.
     */
    loading?: boolean;

    /**
     * Refreshing state for pull-to-refresh.
     */
    refreshing?: boolean;

    /**
     * Error message returned by the project request.
     */
    error?: string | null;

    /**
     * Called when the user selects a project.
     */
    onProjectPress?: (
        project: Project,
    ) => void;

    /**
     * Called when the user pulls the list down.
     */
    onRefresh?: () => void;

    /**
     * Optional retry handler for an error state.
     */
    onRetry?: () => void;

    /**
     * Optional list header.
     */
    ListHeaderComponent?: React.ReactElement | null;

    /**
     * Optional footer.
     */
    ListFooterComponent?: React.ReactElement | null;

    /**
     * Prevent project interaction.
     */
    disabled?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectList({
    projects,
    loading = false,
    refreshing = false,
    error = null,
    onProjectPress,
    onRefresh,
    onRetry,
    ListHeaderComponent,
    ListFooterComponent,
    disabled = false,
}: ProjectListProps) {
    /**
     * -------------------------------------------------------------------------
     * Render Project
     * -------------------------------------------------------------------------
     */

    const renderProject =
        useCallback<ListRenderItem<Project>>(
            ({ item }) => (
                <ProjectCard
                    project={item}
                    onPress={
                        onProjectPress
                    }
                    disabled={disabled}
                />
            ),
            [
                onProjectPress,
                disabled,
            ],
        );

    /**
     * -------------------------------------------------------------------------
     * Key Extractor
     * -------------------------------------------------------------------------
     */

    const keyExtractor =
        useCallback(
            (item: Project) =>
                item.id,
            [],
        );

    /**
     * -------------------------------------------------------------------------
     * Loading
     * -------------------------------------------------------------------------
     *
     * Only show the full loading state when there are no existing projects.
     *
     * This prevents the existing list from disappearing during a refresh.
     */

    if (
        loading &&
        projects.length === 0
    ) {
        return (
            <View
                style={
                    styles.loadingContainer
                }
            >
                <ActivityIndicator
                    size="small"
                    color={
                        colors.brand.accent
                    }
                />
            </View>
        );
    }

    /**
     * -------------------------------------------------------------------------
     * Error
     * -------------------------------------------------------------------------
     */

    if (
        error &&
        projects.length === 0
    ) {
        return (
            <ProjectEmptyState
                title="Unable to load projects"
                message={error}
                actionLabel={
                    onRetry
                        ? "Try Again"
                        : undefined
                }
                onAction={onRetry}
            />
        );
    }

    /**
     * -------------------------------------------------------------------------
     * Empty
     * -------------------------------------------------------------------------
     */

    if (
        !loading &&
        !error &&
        projects.length === 0
    ) {
        return (
            <ProjectEmptyState
                title="No projects yet"
                message="Create your first project to start organizing your architectural work."
            />
        );
    }

    /**
     * -------------------------------------------------------------------------
     * List
     * -------------------------------------------------------------------------
     */

    return (
        <FlatList
            data={projects}
            keyExtractor={
                keyExtractor
            }
            renderItem={
                renderProject
            }
            contentContainerStyle={
                styles.contentContainer
            }
            showsVerticalScrollIndicator={
                false
            }
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={
                            onRefresh
                        }
                        tintColor={
                            colors.brand
                                .accent
                        }
                        colors={[
                            colors.brand
                                .accent,
                        ]}
                    />
                ) : undefined
            }
            ListHeaderComponent={
                ListHeaderComponent
            }
            ListFooterComponent={
                ListFooterComponent
            }
            ItemSeparatorComponent={
                ProjectSeparator
            }
            removeClippedSubviews={
                true
            }
            initialNumToRender={
                8
            }
            maxToRenderPerBatch={
                10
            }
            windowSize={7}
        />
    );
}

/**
 * -----------------------------------------------------------------------------
 * Project Separator
 * -----------------------------------------------------------------------------
 *
 * ProjectCard already provides a bottom margin, so the separator is intentionally
 * kept minimal. It provides a stable list structure without introducing another
 * visual divider.
 * -----------------------------------------------------------------------------
 */

function ProjectSeparator() {
    return (
        <View
            style={
                styles.separator
            }
        />
    );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal:
            spacing.lg,

        paddingTop:
            spacing.sm,

        paddingBottom:
            spacing.xxxl,

        flexGrow: 1,
    },

    loadingContainer: {
        alignItems: "center",

        justifyContent:
            "center",

        minHeight: 240,

        padding:
            spacing.xxl,
    },

    separator: {
        height: 0,
    },
});

export default ProjectList;