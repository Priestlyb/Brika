/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/uploads/uploads.styles.ts
 * -----------------------------------------------------------------------------
 * Brika Uploads Styles
 *
 * Presentation styles for the Uploads screen.
 *
 * This file contains NO business logic.
 * -----------------------------------------------------------------------------
 */

import { StyleSheet } from "react-native";

import { colors } from "@/constants/theme/colors";

import { radius } from "@/constants/theme/radius";

import { spacing } from "@/constants/theme/spacing";

export const styles = StyleSheet.create({
  /**
   * ---------------------------------------------------------------------------
   * Container
   * ---------------------------------------------------------------------------
   */

  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  /**
   * ---------------------------------------------------------------------------
   * Header
   * ---------------------------------------------------------------------------
   */

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  headerIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 46,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },

  headerCopy: {
    flex: 1,
    gap: spacing.xs,
  },

  title: {
    letterSpacing: -0.6,
  },

  subtitle: {
    maxWidth: 600,
    lineHeight: 20,
  },

  /**
   * ---------------------------------------------------------------------------
   * Inline Error
   * ---------------------------------------------------------------------------
   */

  inlineError: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.status.error,
    borderRadius: radius.md,
    backgroundColor: colors.status.errorBackground,
  },

  inlineErrorText: {
    flex: 1,
  },

  /**
   * ---------------------------------------------------------------------------
   * Section
   * ---------------------------------------------------------------------------
   */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  sectionTitle: {
    marginBottom: spacing.xs,
  },

  sectionSubtitle: {
    lineHeight: 18,
  },

  countBadge: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 30,
    height: 30,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
  },

  /**
   * ---------------------------------------------------------------------------
   * Project Grid
   * ---------------------------------------------------------------------------
   */

  projectGrid: {
    gap: spacing.md,
  },

  projectGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  /**
   * ---------------------------------------------------------------------------
   * Project Tile Wrapper
   * ---------------------------------------------------------------------------
   *
   * The wrapper owns the animated scale transformation.
   * The actual Pressable owns the visual card styles.
   * ---------------------------------------------------------------------------
   */

  projectTileWrapper: {
    width: "100%",
  },

  projectTileWrapperWide: {
    width: "48.5%",
  },

  /**
   * ---------------------------------------------------------------------------
   * Project Tile
   * ---------------------------------------------------------------------------
   */

  projectTile: {
    width: "100%",
    minHeight: 174,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.secondary,
  },

  projectTilePressed: {
    opacity: 0.78,
  },

  tileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  folderIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.brand.accentLight,
  },

  openIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.background.primary,
  },

  tileBody: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: spacing.md,
  },

  projectName: {
    maxWidth: "92%",
    lineHeight: 21,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.status.success,
  },

  tileFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },

  /**
   * ---------------------------------------------------------------------------
   * Empty State
   * ---------------------------------------------------------------------------
   */

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 430,
    paddingHorizontal: spacing.lg,
  },

  emptyVisual: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  emptyFolder: {
    alignItems: "center",
    justifyContent: "center",
    width: 76,
    height: 76,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },

  emptyTitle: {
    marginBottom: spacing.xs,
    textAlign: "center",
  },

  emptyDescription: {
    maxWidth: 400,
    lineHeight: 20,
    textAlign: "center",
  },

  emptyAction: {
    marginTop: spacing.lg,
  },

  /**
   * ---------------------------------------------------------------------------
   * Footer
   * ---------------------------------------------------------------------------
   */

  footerHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.xl,
  },

  footerText: {
    textAlign: "center",
  },

  /**
   * ---------------------------------------------------------------------------
   * Loading
   * ---------------------------------------------------------------------------
   */

  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },

  loadingIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 54,
    height: 54,
    marginBottom: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },

  /**
   * ---------------------------------------------------------------------------
   * Error
   * ---------------------------------------------------------------------------
   */

  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  errorIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.status.errorBackground,
  },

  errorTitle: {
    marginBottom: spacing.xs,
    textAlign: "center",
  },

  errorDescription: {
    maxWidth: 420,
    lineHeight: 20,
    textAlign: "center",
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 46,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.brand.accent,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});