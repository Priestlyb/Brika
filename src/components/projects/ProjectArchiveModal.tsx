/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectArchiveModal.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Confirmation modal for archiving or restoring a project.
 *
 * Responsibilities:
 *
 * - Explain the archive/restore action.
 * - Display the affected project name.
 * - Require explicit confirmation.
 * - Expose confirm/cancel callbacks.
 * - Display a loading state while the parent performs the mutation.
 *
 * This component does NOT:
 *
 * - Perform API requests.
 * - Mutate project state directly.
 * - Navigate.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { Project } from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import { typography } from "@/constants/theme/typography";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectArchiveModalProps {
  /**
   * Project being archived/restored.
   *
   * If null, the modal is hidden.
   */
  project: Project | null;

  /**
   * Whether the modal is visible.
   */
  visible: boolean;

  /**
   * Whether the action is currently being processed.
   */
  loading?: boolean;

  /**
   * Called when the user confirms the action.
   */
  onConfirm: () => void | Promise<void>;

  /**
   * Called when the user cancels/closes the modal.
   */
  onCancel: () => void;

  /**
   * Explicit action.
   *
   * If omitted, the component derives it from project.status:
   *
   * ACTIVE   -> archive
   * ARCHIVED -> restore
   */
  action?: "archive" | "restore";
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectArchiveModal({
  project,
  visible,
  loading = false,
  onConfirm,
  onCancel,
  action,
}: ProjectArchiveModalProps) {
  /**
   * -------------------------------------------------------------------------
   * Resolve Action
   * -------------------------------------------------------------------------
   */

  const resolvedAction =
    action ?? (project?.status === "ARCHIVED" ? "restore" : "archive");

  const isRestore = resolvedAction === "restore";

  /**
   * -------------------------------------------------------------------------
   * Nothing to display without a project.
   * -------------------------------------------------------------------------
   */

  if (!project) {
    return null;
  }

  /**
   * -------------------------------------------------------------------------
   * Content
   * -------------------------------------------------------------------------
   */

  const title = isRestore ? "Restore project?" : "Archive project?";

  const description = isRestore
    ? `Restore "${project.name}" to your active projects?`
    : `Archive "${project.name}"?`;

  const supportingText = isRestore
    ? "The project will become active again and can be accessed normally."
    : "The project will be removed from your active projects. Its data will remain available and can be restored later.";

  const confirmLabel = isRestore ? "Restore project" : "Archive project";

  const icon = isRestore ? "arrow-undo-outline" : "archive-outline";

  const accentColor = isRestore ? colors.status.success : colors.brand.accent;

  const iconBackground = isRestore
    ? colors.status.successBackground
    : colors.brand.accentLight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={loading ? undefined : onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* -----------------------------------------------------------------
           * Icon
           * ----------------------------------------------------------------- */}

          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconBackground,
              },
            ]}
          >
            <Ionicons name={icon} size={28} color={accentColor} />
          </View>

          {/* -----------------------------------------------------------------
           * Heading
           * ----------------------------------------------------------------- */}

          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>

          {/* -----------------------------------------------------------------
           * Main Description
           * ----------------------------------------------------------------- */}

          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.description}
          >
            {description}
          </ThemedText>

          {/* -----------------------------------------------------------------
           * Supporting Information
           * ----------------------------------------------------------------- */}

          <View style={styles.infoBox}>
            <Ionicons
              name={
                isRestore
                  ? "information-circle-outline"
                  : "shield-checkmark-outline"
              }
              size={17}
              color={colors.text.secondary}
            />

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.infoText}
            >
              {supportingText}
            </ThemedText>
          </View>

          {/* -----------------------------------------------------------------
           * Actions
           * ----------------------------------------------------------------- */}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityState={{
                disabled: loading,
              }}
              disabled={loading}
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,

                pressed && !loading && styles.buttonPressed,

                loading && styles.disabled,
              ]}
            >
              <ThemedText type="smallBold">Cancel</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              accessibilityState={{
                disabled: loading,
                busy: loading,
              }}
              disabled={loading}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirmButton,

                {
                  backgroundColor: accentColor,
                },

                pressed && !loading && styles.buttonPressed,

                loading && styles.disabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <>
                  <Ionicons
                    name={isRestore ? "arrow-undo-outline" : "archive-outline"}
                    size={17}
                    color={colors.text.inverse}
                  />

                  <ThemedText type="smallBold" themeColor="inverse">
                    {confirmLabel}
                  </ThemedText>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",

    backgroundColor: "rgba(0, 0, 0, 0.55)",

    flex: 1,

    justifyContent: "center",

    padding: spacing.lg,
  },

  modal: {
    backgroundColor: colors.background.surface,

    borderRadius: radius.xl,

    maxWidth: 520,

    padding: spacing.xl,

    width: "100%",
  },

  iconContainer: {
    alignItems: "center",

    borderRadius: radius.md,

    height: 52,

    justifyContent: "center",

    marginBottom: spacing.lg,

    width: 52,
  },

  title: {
    marginBottom: spacing.sm,
  },

  description: {
    lineHeight: typography.bodySmall.lineHeight,

    marginBottom: spacing.lg,
  },

  infoBox: {
    alignItems: "flex-start",

    backgroundColor: colors.background.secondary,

    borderRadius: radius.md,

    flexDirection: "row",

    gap: spacing.sm,

    marginBottom: spacing.xl,

    padding: spacing.md,
  },

  infoText: {
    flex: 1,
  },

  actions: {
    flexDirection: "row",

    gap: spacing.sm,
  },

  cancelButton: {
    alignItems: "center",

    borderColor: colors.border.medium,

    borderRadius: radius.md,

    borderWidth: 1,

    flex: 1,

    justifyContent: "center",

    minHeight: 48,

    paddingHorizontal: spacing.md,
  },

  confirmButton: {
    alignItems: "center",

    borderRadius: radius.md,

    flex: 1,

    flexDirection: "row",

    gap: spacing.xs,

    justifyContent: "center",

    minHeight: 48,

    paddingHorizontal: spacing.md,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default ProjectArchiveModal;
