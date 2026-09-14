/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/TransferOwnershipModal.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Transfer Project Ownership Modal
 *
 * Responsibilities:
 *
 * - Confirm that the user wants to transfer project ownership.
 * - Display the member who will become the new project owner.
 * - Explain the consequence of transferring ownership.
 * - Prevent dismissal while the transfer is being submitted.
 * - Delegate the actual transfer action to the parent screen.
 *
 * This component does NOT:
 *
 * - Call the API directly.
 * - Manage project membership state.
 * - Perform the ownership transfer itself.
 * - Perform navigation.
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

import type { ProjectMember } from "@/types/project.types";

interface TransferOwnershipModalProps {
  visible: boolean;
  member: ProjectMember | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TransferOwnershipModal({
  visible,
  member,
  isSubmitting,
  onClose,
  onConfirm,
}: TransferOwnershipModalProps) {
  const memberName = member
    ? getMemberDisplayName(member)
    : "this project member";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* -----------------------------------------------------------------
           * Header
           * ----------------------------------------------------------------- */}
          <View style={styles.modalHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="swap-horizontal-outline"
                size={26}
                color={colors.brand.accent}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close transfer ownership confirmation"
              hitSlop={8}
              disabled={isSubmitting}
              onPress={onClose}
              style={[
                styles.closeButton,
                isSubmitting && styles.disabledButton,
              ]}
            >
              <Ionicons name="close" size={22} color={colors.text.primary} />
            </Pressable>
          </View>

          {/* -----------------------------------------------------------------
           * Content
           * ----------------------------------------------------------------- */}
          <View style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              Transfer ownership?
            </ThemedText>

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.description}
            >
              You are about to make{" "}
              <ThemedText type="smallBold">{memberName}</ThemedText> the owner
              of this project.
            </ThemedText>

            {/* ---------------------------------------------------------------
             * Warning
             * --------------------------------------------------------------- */}
            <View style={styles.warningBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.brand.accent}
              />

              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.warningText}
              >
                You will no longer be the project owner after this transfer.
                Your project permissions may change.
              </ThemedText>
            </View>
          </View>

          {/* -----------------------------------------------------------------
           * Actions
           * ----------------------------------------------------------------- */}
          <View style={styles.modalActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel transfer ownership"
              disabled={isSubmitting}
              onPress={onClose}
              style={[
                styles.cancelButton,
                isSubmitting && styles.disabledButton,
              ]}
            >
              <ThemedText type="smallBold">Cancel</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Confirm transfer ownership"
              disabled={isSubmitting || !member}
              onPress={onConfirm}
              style={[
                styles.confirmButton,
                (isSubmitting || !member) && styles.disabledButton,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Ionicons
                  name="swap-horizontal-outline"
                  size={18}
                  color={colors.text.inverse}
                />
              )}

              <ThemedText type="smallBold" themeColor="inverse">
                {isSubmitting ? "Transferring..." : "Transfer ownership"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * ---------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------------
 */

function getMemberDisplayName(member: ProjectMember): string {
  const user = member.user;

  const fullName = [user?.firstName, user?.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (user?.email?.trim()) {
    return user.email.trim();
  }

  return "Project member";
}

/**
 * ---------------------------------------------------------------------------
 * Styles
 * ---------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modalCard: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: colors.background.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand.accentLight,
  },

  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
  },

  content: {
    marginTop: spacing.md,
  },

  title: {
    marginBottom: spacing.sm,
  },

  description: {
    lineHeight: 21,
  },

  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brand.accentLight,
    borderWidth: 1,
    borderColor: colors.border.light,
  },

  warningText: {
    flex: 1,
    lineHeight: 20,
  },

  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  cancelButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brand.accent,
  },

  disabledButton: {
    opacity: 0.55,
  },
});
