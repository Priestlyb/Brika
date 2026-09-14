/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/settings/profile/profile.styles.ts
 * -----------------------------------------------------------------------------
 * Brika Profile Screen
 *
 * Centralized styles for the Profile screen.
 *
 * Responsibilities:
 *
 * - Keep presentation styles outside the route component.
 * - Reuse Brika design-system tokens.
 * - Provide responsive web/mobile layouts.
 * - Maintain the Brika architectural visual language.
 * - Avoid inline style definitions in the screen.
 * -----------------------------------------------------------------------------
 */

import { Platform, StyleSheet } from "react-native";

import {
    colors,
    fontFamily,
    spacing,
    typography,
} from "@/constants/theme";

/**
 * -----------------------------------------------------------------------------
 * Profile Styles
 * -----------------------------------------------------------------------------
 */

export const styles = StyleSheet.create({
    /**
     * ---------------------------------------------------------------------------
     * Screen
     * ---------------------------------------------------------------------------
     */

    screen: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },

    content: {
        flexGrow: 1,
        paddingBottom: spacing.massive,
    },

    container: {
        width: "100%",
        maxWidth: 1120,
        alignSelf: "center",
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },

    /**
     * ---------------------------------------------------------------------------
     * Navigation
     * ---------------------------------------------------------------------------
     */

    backButton: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        minHeight: 40,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.xl,
    },

    backButtonText: {
        ...typography.bodySmallMedium,
        color: colors.text.secondary,
    },

    /**
     * ---------------------------------------------------------------------------
     * Header
     * ---------------------------------------------------------------------------
     */

    header: {
        marginBottom: spacing.xxxl,
    },

    eyebrow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },

    eyebrowDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.brand.accent,
    },

    eyebrowText: {
        ...typography.captionMedium,
        color: colors.brand.accentDark,
        letterSpacing: 1.2,
        textTransform: "uppercase",
    },

    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },

    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        maxWidth: 680,
    },

    /**
     * ---------------------------------------------------------------------------
     * Hero Profile Card
     * ---------------------------------------------------------------------------
     */

    hero: {
        position: "relative",
        overflow: "hidden",
        backgroundColor: colors.background.dark,
        borderRadius: 20,
        padding: spacing.xxxl,
        marginBottom: spacing.xxxl,
        borderWidth: 1,
        borderColor: colors.border.dark,
    },

    heroAccent: {
        position: "absolute",
        top: -80,
        right: -60,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: colors.brand.accent,
        opacity: 0.08,
    },

    heroContent: {
        position: "relative",
        zIndex: 1,
    },

    identityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xl,
    },

    /**
     * ---------------------------------------------------------------------------
     * Avatar
     * ---------------------------------------------------------------------------
     */

    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background.darkSurface,
        borderWidth: 1,
        borderColor: colors.border.dark,
    },

    avatarImage: {
        width: "100%",
        height: "100%",
    },

    avatarInitials: {
        ...typography.h2,
        color: colors.brand.accent,
    },

    avatarStatus: {
        position: "absolute",
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colors.status.success,
        borderWidth: 3,
        borderColor: colors.background.dark,
        bottom: 0,
        left: 66,
    },

    /**
     * ---------------------------------------------------------------------------
     * Identity
     * ---------------------------------------------------------------------------
     */

    identity: {
        flex: 1,
        minWidth: 0,
    },

    identityName: {
        ...typography.h2,
        color: colors.text.inverse,
        marginBottom: spacing.xs,
    },

    identityEmail: {
        ...typography.bodySmall,
        color: colors.text.muted,
        marginBottom: spacing.md,
    },

    roleBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 999,
        backgroundColor: "rgba(201, 162, 39, 0.14)",
        borderWidth: 1,
        borderColor: "rgba(201, 162, 39, 0.28)",
    },

    roleBadgeText: {
        ...typography.captionMedium,
        color: colors.brand.accent,
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },

    /**
     * ---------------------------------------------------------------------------
     * Verification
     * ---------------------------------------------------------------------------
     */

    verification: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: spacing.md,
        marginTop: spacing.xl,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.border.dark,
    },

    verificationVerified: {
        color: colors.status.success,
    },

    verificationUnverified: {
        color: colors.status.warning,
    },

    verificationContent: {
        flex: 1,
        minWidth: 0,
    },

    verificationTitle: {
        ...typography.bodySmallMedium,
        color: colors.text.inverse,
        marginBottom: 2,
    },

    verificationDescription: {
        ...typography.caption,
        color: colors.text.muted,
    },

    /**
     * ---------------------------------------------------------------------------
     * Main Content
     * ---------------------------------------------------------------------------
     */

    mainContent: {
        width: "100%",
    },

    mainContentWeb: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: spacing.xl,
    },

    mainContentMobile: {
        flexDirection: "column",
    },

    /**
     * ---------------------------------------------------------------------------
     * Information Cards
     * ---------------------------------------------------------------------------
     */

    informationCard: {
        flex: 1,
        minWidth: 0,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 16,
        padding: spacing.xl,
    },

    personalInformationCard: {
        flex: 2,
    },

    accountColumn: {
        flex: 1,
        minWidth: 0,
        gap: spacing.xl,
    },

    accountCard: {
        width: "100%",
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 16,
        padding: spacing.xl,
    },

    /**
     * ---------------------------------------------------------------------------
     * Card Header
     * ---------------------------------------------------------------------------
     */

    cardHeader: {
        marginBottom: spacing.xl,
    },

    cardTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },

    cardDescription: {
        ...typography.bodySmall,
        color: colors.text.secondary,
    },

    /**
     * ---------------------------------------------------------------------------
     * Form
     * ---------------------------------------------------------------------------
     */

    form: {
        width: "100%",
        gap: spacing.lg,
    },

    field: {
        width: "100%",
    },

    fieldLabel: {
        ...typography.captionMedium,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    fieldContainer: {
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background.primary,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
    },

    fieldContainerEditable: {
        borderColor: colors.border.medium,
    },

    fieldContainerReadonly: {
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.light,
    },

    fieldInput: {
        flex: 1,
        minWidth: 0,
        ...typography.body,
        color: colors.text.primary,
        paddingVertical: Platform.OS === "web" ? 14 : 12,
    },

    fieldInputReadonly: {
        color: colors.text.secondary,
    },

    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.status.errorBackground,
    },

    errorText: {
        flex: 1,
        color: colors.status.error,
        fontSize: 13,
        lineHeight: 19,
    },

    /**
     * ---------------------------------------------------------------------------
     * Save Button
     * ---------------------------------------------------------------------------
     */

    saveContainer: {
        alignItems: "flex-end",
        marginTop: spacing.sm,
    },

    saveButton: {
        minHeight: 48,
        minWidth: 140,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
        borderWidth: 1,
    },

    saveButtonEnabled: {
        backgroundColor: colors.brand.accent,
        borderColor: colors.brand.accent,
    },

    saveButtonDisabled: {
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.light,
    },

    saveButtonText: {
        ...typography.button,
    },

    saveButtonTextEnabled: {
        color: colors.brand.primary,
    },

    saveButtonTextDisabled: {
        color: colors.text.muted,
    },

    /**
     * ---------------------------------------------------------------------------
     * Account Information
     * ---------------------------------------------------------------------------
     */

    accountHeader: {
        marginBottom: spacing.lg,
    },

    informationRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: spacing.md,
        paddingVertical: spacing.md,
    },

    informationIcon: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: colors.background.secondary,
    },

    informationContent: {
        flex: 1,
        minWidth: 0,
    },

    informationLabel: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginBottom: 2,
    },

    informationValue: {
        ...typography.bodySmallMedium,
        color: colors.text.primary,
    },

    informationDivider: {
        height: 1,
        backgroundColor: colors.border.light,
    },

    /**
     * ---------------------------------------------------------------------------
     * Security Card
     * ---------------------------------------------------------------------------
     */

    securityCard: {
        backgroundColor: colors.background.dark,
        borderWidth: 1,
        borderColor: colors.border.dark,
        borderRadius: 16,
        padding: spacing.xl,
    },

    securityHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: spacing.md,
    },

    securityIcon: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: colors.background.darkSurface,
    },

    securityContent: {
        flex: 1,
        minWidth: 0,
    },

    securityTitle: {
        ...typography.title,
        color: colors.text.inverse,
        marginBottom: spacing.xs,
    },

    securityDescription: {
        ...typography.bodySmall,
        color: colors.text.muted,
        marginBottom: spacing.lg,
    },

    securityAction: {
        alignSelf: "flex-start",
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border.dark,
        backgroundColor: colors.background.darkSurface,
    },

    securityActionText: {
        ...typography.bodySmallMedium,
        color: colors.brand.accent,
    },

    /**
     * ---------------------------------------------------------------------------
     * Loading / Empty States
     * ---------------------------------------------------------------------------
     */

    centeredState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
    },

    stateIcon: {
        marginBottom: spacing.lg,
    },

    stateTitle: {
        ...typography.h3,
        color: colors.text.primary,
        textAlign: "center",
        marginBottom: spacing.sm,
    },

    stateDescription: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        textAlign: "center",
        maxWidth: 420,
    },

    loadingText: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        marginTop: spacing.md,
    },

    /**
     * ---------------------------------------------------------------------------
     * Footer
     * ---------------------------------------------------------------------------
     */

    footer: {
        alignItems: "center",
        marginTop: spacing.xxxl,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },

    footerBrand: {
        ...typography.captionMedium,
        color: colors.text.primary,
        letterSpacing: 1.5,
        marginBottom: spacing.xs,
    },

    footerText: {
        ...typography.caption,
        color: colors.text.tertiary,
        textAlign: "center",
    },

    /**
     * ---------------------------------------------------------------------------
     * Interaction States
     * ---------------------------------------------------------------------------
     *
     * These are kept here so the screen does not need inline style objects.
     */

    interactivePressed: {
        opacity: 0.72,
    },

    interactiveHovered: {
        opacity: 0.88,
    },

    saveButtonPressed: {
        opacity: 0.86,
    },

    saveButtonHovered: {
        opacity: 0.94,
    },
});