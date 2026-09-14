/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/RemoveMemberModal.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Remove project member confirmation modal.
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

export interface RemoveMemberModalProps {
  visible: boolean;

  member: ProjectMember | null;

  isSubmitting?: boolean;

  onClose: () => void;

  onConfirm: () => void;
}

function getMemberName(member: ProjectMember | null): string {
  if (!member) {
    return "this member";
  }

  const firstName = member.user?.firstName?.trim() ?? "";

  const lastName = member.user?.lastName?.trim() ?? "";

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  if (member.user?.email?.trim()) {
    return member.user.email.trim();
  }

  return "this member";
}

function getMemberEmail(member: ProjectMember | null): string | null {
  if (!member) {
    return null;
  }

  const email = member.user?.email?.trim();

  return email || null;
}

export function RemoveMemberModal({
  visible,
  member,
  isSubmitting = false,
  onClose,
  onConfirm,
}: RemoveMemberModalProps) {
  const memberName = getMemberName(member);

  const memberEmail = getMemberEmail(member);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          disabled={isSubmitting}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.warningIcon}>
              <Ionicons
                name="person-remove-outline"
                size={24}
                color={colors.status.error}
              />
            </View>

            <View style={styles.headerText}>
              <ThemedText type="title" style={styles.title}>
                Remove member?
              </ThemedText>

              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.subtitle}
              >
                This action will remove the member from this project.
              </ThemedText>
            </View>
          </View>

          {member ? (
            <View style={styles.memberCard}>
              <View style={styles.memberAvatar}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.brand.accent}
                />
              </View>

              <View style={styles.memberInfo}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {memberName}
                </ThemedText>

                {memberEmail ? (
                  <ThemedText
                    type="small"
                    themeColor="secondary"
                    numberOfLines={1}
                    style={styles.memberEmail}
                  >
                    {memberEmail}
                  </ThemedText>
                ) : null}
              </View>
            </View>
          ) : null}

          <View style={styles.warning}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.status.error}
            />

            <ThemedText
              type="small"
              themeColor="secondary"
              style={styles.warningText}
            >
              The member will lose access to this project's files, models,
              comments, and activity.
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel removing member"
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
              accessibilityLabel={`Remove ${memberName} from project`}
              accessibilityState={{
                disabled: isSubmitting,
                busy: isSubmitting,
              }}
              disabled={isSubmitting}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && !isSubmitting && styles.buttonPressed,
                isSubmitting && styles.removeButtonDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.text.inverse}
                />
              )}

              <ThemedText type="smallBold" themeColor="inverse">
                {isSubmitting ? "Removing..." : "Remove"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default RemoveMemberModal;

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
  },

  title: {
    marginBottom: spacing.xs,
  },

  subtitle: {
    lineHeight: 20,
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
  },

  memberAvatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
  },

  memberInfo: {
    flex: 1,
    minWidth: 0,
  },

  memberEmail: {
    marginTop: 2,
  },

  warning: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
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

  removeButton: {
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

  removeButtonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
