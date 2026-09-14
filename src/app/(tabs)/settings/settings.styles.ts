/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/settings/settings.styles.ts
 * -----------------------------------------------------------------------------
 * Brika Settings Screen Styles
 *
 * Centralized styles for the Settings screen and its reusable components.
 * -----------------------------------------------------------------------------
 */

import { StyleSheet } from "react-native";

import { colors, spacing } from "@/constants/theme";

export const styles = StyleSheet.create({
    /**
     * ---------------------------------------------------------------------------
     * Screen
     * ---------------------------------------------------------------------------
     */

    screen: {
        flex: 1,
    },

    content: {
        paddingBottom: spacing.xxl,
    },

    container: {
        width: "100%",
        maxWidth: 1080,
        alignSelf: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },

    /**
     * ---------------------------------------------------------------------------
     * Header
     * ---------------------------------------------------------------------------
     */

    header: {
        marginBottom: spacing.xl,
    },

    title: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: "700",
        letterSpacing: -0.6,
    },

    subtitle: {
        marginTop: spacing.xs,
        fontSize: 15,
        lineHeight: 22,
    },

    /**
     * ---------------------------------------------------------------------------
     * Sections
     * ---------------------------------------------------------------------------
     */

    section: {
        marginBottom: spacing.lg,
    },

    sectionTitle: {
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.xs,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        color: colors.text.tertiary,
    },

    sectionCard: {
        overflow: "hidden",
        borderWidth: 1,
        borderRadius: 12,
    },

    /**
     * ---------------------------------------------------------------------------
     * Settings Item
     * ---------------------------------------------------------------------------
     */

    settingsItem: {
        minHeight: 76,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.md,
    },

    settingsItemHovered: {
        backgroundColor: colors.background.secondary,
    },

    settingsItemPressed: {
        opacity: 0.72,
    },

    settingsIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        flexShrink: 0,
    },

    settingsItemContent: {
        flex: 1,
        minWidth: 0,
    },

    settingsItemTitle: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: "600",
    },

    settingsItemDescription: {
        marginTop: 2,
        fontSize: 13,
        lineHeight: 19,
    },

    /**
     * ---------------------------------------------------------------------------
     * Divider
     * ---------------------------------------------------------------------------
     */

    divider: {
        height: 1,
        marginLeft: 68,
    },

    /**
     * ---------------------------------------------------------------------------
     * Preferences
     * ---------------------------------------------------------------------------
     */

    preferenceItem: {
        minHeight: 76,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.md,
    },

    preferenceContent: {
        flex: 1,
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },

    preferenceText: {
        flex: 1,
        minWidth: 0,
    },

    preferenceTitle: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: "600",
    },

    preferenceDescription: {
        marginTop: 2,
        fontSize: 13,
        lineHeight: 19,
    },

    /**
     * ---------------------------------------------------------------------------
     * Footer
     * ---------------------------------------------------------------------------
     */

    footer: {
        alignItems: "center",
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },

    footerBrand: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "700",
        letterSpacing: 2,
    },

    footerText: {
        marginTop: spacing.xs,
        fontSize: 12,
        lineHeight: 18,
    },
});