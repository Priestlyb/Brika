/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/projects.styles.ts
 * -----------------------------------------------------------------------------
 * Brika Projects Styles
 *
 * Presentation styles for the Projects screen.
 *
 * -----------------------------------------------------------------------------
 */

import { StyleSheet } from "react-native";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

export const styles = StyleSheet.create({
    /**
     * ---------------------------------------------------------------------------
     * Screen
     * ---------------------------------------------------------------------------
     */

    container: {
        backgroundColor: colors.background.primary,

        flex: 1,
    },

    scrollContent: {
        gap: spacing.lg,

        paddingBottom: spacing.xxl,

        paddingHorizontal: spacing.lg,

        paddingTop: spacing.lg,
    },

    /**
     * ---------------------------------------------------------------------------
     * Header
     * ---------------------------------------------------------------------------
     */

    header: {
        alignItems: "center",

        flexDirection: "row",

        gap: spacing.md,

        justifyContent: "space-between",
    },

    headerContent: {
        flex: 1,

        gap: spacing.xs,

        minWidth: 0,
    },

    subtitle: {
        maxWidth: 500,
    },

    createButton: {
        alignItems: "center",

        backgroundColor: colors.brand.accent,

        borderRadius: radius.md,

        flexDirection: "row",

        gap: spacing.xs,

        justifyContent: "center",

        minHeight: 44,

        paddingHorizontal: spacing.md,
    },

    /**
     * ---------------------------------------------------------------------------
     * Project Filters
     * ---------------------------------------------------------------------------
     */

    filterContainer: {
        backgroundColor: colors.background.secondary,

        borderColor: colors.border.light,

        borderRadius: radius.lg,

        borderWidth: 1,

        flexDirection: "row",

        gap: spacing.xs,

        padding: spacing.xs,
    },

    filterButtonWrapper: {
        flex: 1,
    },

    filterButton: {
        alignItems: "center",

        borderRadius: radius.md,

        flex: 1,

        flexDirection: "row",

        gap: spacing.xs,

        justifyContent: "center",

        minHeight: 42,

        paddingHorizontal: spacing.sm,
    },

    filterButtonActive: {
        backgroundColor: colors.background.primary,

        borderColor: colors.border.light,

        borderWidth: 1,
    },

    filterCount: {
        alignItems: "center",

        borderRadius: radius.pill,

        minWidth: 24,

        paddingHorizontal: spacing.xs,

        paddingVertical: 2,
    },

    filterCountActive: {
        backgroundColor: colors.background.secondary,
    },

    /**
     * ---------------------------------------------------------------------------
     * Section Header
     * ---------------------------------------------------------------------------
     */

    sectionHeader: {
        alignItems: "center",

        flexDirection: "row",

        justifyContent: "space-between",
    },

    sectionTitleContainer: {
        alignItems: "center",

        flexDirection: "row",

        gap: spacing.sm,

        minWidth: 0,
    },

    mutationIndicator: {
        alignItems: "center",

        flexDirection: "row",

        gap: spacing.xs,
    },

    /**
     * ---------------------------------------------------------------------------
     * Project List
     * ---------------------------------------------------------------------------
     */

    projectList: {
        gap: spacing.md,
    },

    /**
     * ---------------------------------------------------------------------------
     * Inline Error
     * ---------------------------------------------------------------------------
     */

    inlineError: {
        alignItems: "center",

        backgroundColor:
            colors.status.errorBackground,

        borderColor: colors.status.error,

        borderRadius: radius.md,

        borderWidth: 1,

        flexDirection: "row",

        gap: spacing.sm,

        paddingHorizontal: spacing.md,

        paddingVertical: spacing.sm,
    },

    inlineErrorText: {
        flex: 1,
    },

    /**
     * ---------------------------------------------------------------------------
     * Filtered Empty State
     * ---------------------------------------------------------------------------
     */

    filteredEmptyState: {
        alignItems: "center",

        paddingHorizontal: spacing.lg,

        paddingVertical: spacing.xl,

        width: "100%",
    },

    filteredEmptyIcon: {
        alignItems: "center",

        backgroundColor:
            colors.background.secondary,

        borderColor: colors.border.light,

        borderRadius: radius.pill,

        borderWidth: 1,

        height: 64,

        justifyContent: "center",

        marginBottom: spacing.md,

        width: 64,
    },

    filteredEmptyTitle: {
        marginBottom: spacing.xs,

        textAlign: "center",
    },

    filteredEmptyDescription: {
        maxWidth: 420,

        textAlign: "center",
    },

    /**
     * ---------------------------------------------------------------------------
     * Loading
     * ---------------------------------------------------------------------------
     */

    loadingContainer: {
        alignItems: "center",

        flex: 1,

        gap: spacing.md,

        justifyContent: "center",

        paddingHorizontal: spacing.lg,
    },

    loadingText: {
        textAlign: "center",
    },

    /**
     * ---------------------------------------------------------------------------
     * Error State
     * ---------------------------------------------------------------------------
     */

    errorContainer: {
        alignItems: "center",

        flex: 1,

        justifyContent: "center",

        paddingHorizontal: spacing.xl,
    },

    errorIcon: {
        alignItems: "center",

        backgroundColor:
            colors.status.errorBackground,

        borderRadius: radius.pill,

        height: 56,

        justifyContent: "center",

        marginBottom: spacing.lg,

        width: 56,
    },

    errorTitle: {
        marginBottom: spacing.xs,

        textAlign: "center",
    },

    errorDescription: {
        maxWidth: 420,

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

        minHeight: 46,

        paddingHorizontal: spacing.lg,
    },
});