/**
 * -----------------------------------------------------------------------------
 * File: src/styles/index.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * React Native dashboard styles.
 *
 * -----------------------------------------------------------------------------
 */

import { StyleSheet } from "react-native";

import type { LightTheme } from "@/constants/theme/themes/light";
import type { DarkTheme } from "@/constants/theme/themes/dark";

/**
 * -----------------------------------------------------------------------------
 * Theme Type
 * -----------------------------------------------------------------------------
 */

type BrikaTheme = LightTheme | DarkTheme;

/**
 * -----------------------------------------------------------------------------
 * Dashboard Styles
 * -----------------------------------------------------------------------------
 */

export function createStyles(theme: BrikaTheme) {
    return StyleSheet.create({
        /**
         * -------------------------------------------------------------------------
         * Safe Area
         * -------------------------------------------------------------------------
         */

        safeArea: {
            flex: 1,
            backgroundColor: theme.background.primary,
        },

        scrollView: {
            flex: 1,
        },

        scrollContent: {
            flexGrow: 1,
            paddingBottom: 48,
        },

        dashboard: {
            width: "100%",
            maxWidth: 1180,
            alignSelf: "center",
            paddingHorizontal: 24,
            paddingTop: 24,
        },

        /**
         * -------------------------------------------------------------------------
         * Header
         * -------------------------------------------------------------------------
         */

        header: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 34,
        },

        headerContent: {
            flex: 1,
            paddingRight: 20,
        },

        brandRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
        },

        logo: {
            width: 100,
            height: 75,
        },

        brandMark: {
            width: 28,
            height: 28,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
        },

        brandMarkInner: {
            width: 10,
            height: 10,
            borderRadius: 2,
        },

        brand: {
            marginLeft: 10,
            fontSize: 15,
            fontWeight: "700",
            letterSpacing: 2.1,
        },

        greeting: {
            marginBottom: 5,
            fontSize: 14,
            lineHeight: 20,
            fontWeight: "500",
        },

        headingContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
        },

        heading: {
            fontSize: 25,
            lineHeight: 37,
            fontWeight: "700",
            letterSpacing: -0.8,
        },

        profileButton: {
            width: 42,
            height: 42,
            borderWidth: 1,
            borderRadius: 21,
            alignItems: "center",
            justifyContent: "center",
        },

        profileText: {
            fontSize: 12,
            lineHeight: 16,
            fontWeight: "700",
            letterSpacing: 0.3,
        },

        /**
         * -------------------------------------------------------------------------
         * Sections
         * -------------------------------------------------------------------------
         */

        section: {
            width: "100%",
            marginBottom: 30,
        },

        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
        },

        sectionTitle: {
            fontSize: 17,
            lineHeight: 23,
            fontWeight: "700",
            letterSpacing: -0.15,
            marginBottom: 12,
        },

        viewAll: {
            fontSize: 13,
            lineHeight: 18,
            fontWeight: "600",
        },

        /**
         * -------------------------------------------------------------------------
         * Stats
         * -------------------------------------------------------------------------
         */

        statsGrid: {
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
        },

        statCard: {
            flexGrow: 1,
            flexBasis: 180,
            minWidth: 160,
            minHeight: 128,
            borderWidth: 1,
            borderRadius: 15,
            padding: 16,
            justifyContent: "space-between",
        },

        statIcon: {
            width: 38,
            height: 38,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
        },

        statText: {
            marginTop: 18,
        },

        statValue: {
            fontSize: 26,
            lineHeight: 30,
            fontWeight: "700",
            letterSpacing: -0.6,
        },

        statLabel: {
            marginTop: 2,
            fontSize: 13,
            lineHeight: 18,
            fontWeight: "500",
        },

        actionsGrid: {
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
        },

        actionCard: {
            flexBasis: 220,
            flexGrow: 1,
            minWidth: 200,
            minHeight: 132,
            borderWidth: 1,
            borderRadius: 15,
            padding: 17,
        },

        actionIcon: {
            width: 39,
            height: 39,
            marginBottom: 17,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
        },

        actionTitle: {
            marginBottom: 4,
            fontSize: 15,
            lineHeight: 21,
            fontWeight: "700",
            letterSpacing: -0.1,
        },

        actionDescription: {
            fontSize: 12.5,
            lineHeight: 18,
            fontWeight: "500",
        },

        /**
         * -------------------------------------------------------------------------
         * Projects
         * -------------------------------------------------------------------------
         */

        projectList: {
            width: "100%",
            borderWidth: 1,
            borderRadius: 15,
            overflow: "hidden",
        },

        projectRow: {
            minHeight: 76,
            paddingVertical: 12,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 11,
        },

        projectIcon: {
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
        },

        projectInfo: {
            flex: 1,
            minWidth: 0,
        },

        projectName: {
            marginBottom: 3,
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "700",
        },

        projectMeta: {
            fontSize: 11.5,
            lineHeight: 17,
            fontWeight: "500",
        },

        projectStatus: {
            marginLeft: 6,
            marginRight: 2,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
        },

        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            flexShrink: 0,
        },

        statusText: {
            fontSize: 11.5,
            lineHeight: 17,
            fontWeight: "600",
        },

        /**
         * -------------------------------------------------------------------------
         * Generation Activity
         * -------------------------------------------------------------------------
         */

        activityCard: {
            width: "100%",
            borderWidth: 1,
            borderRadius: 15,
            padding: 17,
        },

        activityHeader: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
        },

        activityIcon: {
            width: 43,
            height: 43,
            marginRight: 12,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
        },

        activityContent: {
            flex: 1,
            minWidth: 0,
        },

        activityTitle: {
            marginBottom: 3,
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "700",
        },

        activitySubtitle: {
            fontSize: 12,
            lineHeight: 17,
            fontWeight: "500",
        },

        progressText: {
            marginLeft: 12,
            fontSize: 13,
            lineHeight: 18,
            fontWeight: "700",
        },

        progressTrack: {
            width: "100%",
            height: 6,
            marginTop: 18,
            borderRadius: 3,
            overflow: "hidden",
        },

        progressFill: {
            height: "100%",
            borderRadius: 3,
        },

        activityFooter: {
            marginTop: 9,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        activityFooterText: {
            flex: 1,
            fontSize: 11,
            lineHeight: 16,
            fontWeight: "500",
        },

        /**
         * -------------------------------------------------------------------------
         * Storage
         * -------------------------------------------------------------------------
         */

        storageCard: {
            width: "100%",
            borderWidth: 1,
            borderRadius: 15,
            padding: 17,
        },

        storageHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        storageInfo: {
            flex: 1,
            minWidth: 0,
        },

        storageTitle: {
            marginBottom: 4,
            fontSize: 15,
            lineHeight: 20,
            fontWeight: "700",
        },

        storageSubtitle: {
            fontSize: 12,
            lineHeight: 17,
            fontWeight: "500",
        },

        storageIcon: {
            width: 40,
            height: 40,
            marginLeft: 16,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
        },
    });
}

/**
 * -----------------------------------------------------------------------------
 * Shared Style Type
 * -----------------------------------------------------------------------------
 */

export type DashboardStyles = ReturnType<typeof createStyles>;