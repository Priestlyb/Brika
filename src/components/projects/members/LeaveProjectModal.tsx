/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/LeaveProjectModal.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Leave project confirmation modal.
 *
 * Responsibilities:
 *
 * - Explain what happens when the current user leaves the project.
 * - Provide Cancel and Leave Project actions.
 * - Display the leaving/loading state.
 * - Prevent accidental dismissal while the operation is running.
 *
 * This component is presentation-only.
 * It does not perform API requests.
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

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

export interface LeaveProjectModalProps {
  visible: boolean;

  isSubmitting?: boolean;

  /**
   * Optional project name displayed in the confirmation message.
   */
  projectName?: string | null;

  onClose: () => void;

  onConfirm: () => void;
}

export function LeaveProjectModal({
  visible,
  isSubmitting = false,
  projectName,
  onClose,
  onConfirm,
}: LeaveProjectModalProps) {
  const hasProjectName =
    typeof projectName === "string" && projectName.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* -------------------------------------------------------------------
         * Backdrop
         * ------------------------------------------------------------------- */}

        <Pressable
          style={styles.backdrop}
          disabled={isSubmitting}
          onPress={onClose}
        />

        {/* -------------------------------------------------------------------
         * Modal
         * ------------------------------------------------------------------- */}

        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.warningIcon}>
              <Ionicons
                name="exit-outline"
                size={25}
                color={colors.status.error}
              />
            </View>

            <View style={styles.headerText}>
              <ThemedText type="title" style={styles.title}>
                Leave project?
              </ThemedText>

              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.subtitle}
              >
                {hasProjectName
                  ? `You will leave ${projectName}.`
                  : "You will no longer be a member of this project."}
              </ThemedText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close leave project dialog"
              accessibilityState={{
                disabled: isSubmitting,
              }}
              disabled={isSubmitting}
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={colors.text.secondary} />
            </Pressable>
          </View>

          {/* Warning */}
          <View style={styles.warning}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={colors.status.error}
            />

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.warningText}
            >
              You will lose access to this project's files, models, comments,
              and activity. You may need to be invited again to regain access.
            </ThemedText>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel leaving project"
              accessibilityState={{
                disabled: isSubmitting,
              }}
              disabled={isSubmitting}
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && !isSubmitting && styles.buttonPressed,
              ]}
            >
              <ThemedText type="smallBold" themeColor="secondary">
                Cancel
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Leave project"
              accessibilityState={{
                disabled: isSubmitting,
                busy: isSubmitting,
              }}
              disabled={isSubmitting}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.leaveButton,
                isSubmitting && styles.leaveButtonDisabled,
                pressed && !isSubmitting && styles.buttonPressed,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Ionicons
                  name="exit-outline"
                  size={18}
                  color={colors.text.inverse}
                />
              )}

              <ThemedText type="smallBold" themeColor="inverse">
                {isSubmitting ? "Leaving..." : "Leave project"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default LeaveProjectModal;

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modalContainer: {
    width: "100%",
    maxWidth: 520,
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor: colors.background.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  warningIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.status.errorBackground,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.sm,
  },

  title: {
    marginBottom: spacing.xs,
  },

  subtitle: {
    lineHeight: 20,
  },

  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },

  warning: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
  },

  warningText: {
    flex: 1,
    marginLeft: spacing.sm,
    lineHeight: 19,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
  },

  cancelButton: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
  },

  leaveButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.status.error,
  },

  leaveButtonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
