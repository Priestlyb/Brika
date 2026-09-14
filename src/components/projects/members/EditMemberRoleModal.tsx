/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/EditMemberRoleModal.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Edit project member role modal.
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

import RoleOption from "@/components/projects/members/RoleOption";
import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import type {
  ProjectMember,
} from "@/types/project.types";

export type EditableMemberRole =
  | "EDITOR"
  | "VIEWER";

export interface EditMemberRoleModalProps {
  visible: boolean;

  member: ProjectMember | null;

  role: EditableMemberRole;

  isSubmitting?: boolean;

  onRoleChange: (
    role: EditableMemberRole,
  ) => void;

  onClose: () => void;

  onSave: () => void;

  canSave?: boolean;
}

const ROLE_OPTIONS: Array<{
  role: EditableMemberRole;
  description: string;
}> = [
  {
    role: "EDITOR",
    description:
      "Can edit project files and collaborate on project content.",
  },
  {
    role: "VIEWER",
    description:
      "Can view project files and activity without making changes.",
  },
];

function getMemberName(
  member: ProjectMember | null,
): string {
  if (!member) {
    return "Project member";
  }

  const firstName =
    member.user?.firstName?.trim() ?? "";

  const lastName =
    member.user?.lastName?.trim() ?? "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  if (member.user?.email?.trim()) {
    return member.user.email.trim();
  }

  return "Project member";
}

function getMemberEmail(
  member: ProjectMember | null,
): string | null {
  if (!member) {
    return null;
  }

  const email =
    member.user?.email?.trim();

  return email || null;
}

export function EditMemberRoleModal({
  visible,
  member,
  role,
  isSubmitting = false,
  onRoleChange,
  onClose,
  onSave,
  canSave = true,
}: EditMemberRoleModalProps) {
  const memberName =
    getMemberName(member);

  const memberEmail =
    getMemberEmail(member);

  const saveDisabled =
    !member ||
    !canSave ||
    isSubmitting;

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
            <View style={styles.headerIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={colors.brand.accent}
              />
            </View>

            <View style={styles.headerText}>
              <ThemedText
                type="title"
                style={styles.title}
              >
                Change role
              </ThemedText>

              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.subtitle}
              >
                Choose what this member can do in
                the project.
              </ThemedText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close change role dialog"
              accessibilityState={{
                disabled: isSubmitting,
              }}
              disabled={isSubmitting}
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={22}
                color={colors.text.secondary}
              />
            </Pressable>
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
                <ThemedText
                  type="smallBold"
                  numberOfLines={1}
                >
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

          <View style={styles.content}>
            <ThemedText
              type="smallBold"
              style={styles.roleLabel}
            >
              Project role
            </ThemedText>

            <View style={styles.roleOptions}>
              {ROLE_OPTIONS.map(
                (option) => (
                  <RoleOption
                    key={option.role}
                    role={option.role}
                    description={
                      option.description
                    }
                    selected={
                      role === option.role
                    }
                    disabled={isSubmitting}
                    onPress={
                      onRoleChange
                    }
                  />
                ),
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel changing member role"
              accessibilityState={{
                disabled: isSubmitting,
              }}
              disabled={isSubmitting}
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed &&
                  !isSubmitting &&
                  styles.buttonPressed,
              ]}
            >
              <ThemedText
                type="smallBold"
                themeColor="secondary"
              >
                Cancel
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save member role"
              accessibilityState={{
                disabled: saveDisabled,
                busy: isSubmitting,
              }}
              disabled={saveDisabled}
              onPress={onSave}
              style={({ pressed }) => [
                styles.saveButton,
                saveDisabled &&
                  styles.saveButtonDisabled,
                pressed &&
                  !saveDisabled &&
                  styles.buttonPressed,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={
                    colors.text.inverse
                  }
                />
              ) : (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={
                    colors.text.inverse
                  }
                />
              )}

              <ThemedText
                type="smallBold"
                themeColor="inverse"
              >
                {isSubmitting
                  ? "Saving..."
                  : "Save role"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default EditMemberRoleModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(0, 0, 0, 0.45)",
  },

  modalContainer: {
    width: "100%",
    maxWidth: 520,
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor:
      colors.background.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      colors.border.light,
  },

  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    borderRadius: radius.md,
    backgroundColor:
      colors.background.secondary,
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

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor:
      colors.border.light,
    borderRadius: radius.md,
    backgroundColor:
      colors.background.secondary,
  },

  memberAvatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    borderRadius: radius.md,
    backgroundColor:
      colors.background.primary,
  },

  memberInfo: {
    flex: 1,
    minWidth: 0,
  },

  memberEmail: {
    marginTop: 2,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  roleLabel: {
    marginBottom: spacing.sm,
  },

  roleOptions: {
    gap: spacing.sm,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      colors.border.light,
  },

  cancelButton: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor:
      colors.border.light,
    borderRadius: radius.md,
    backgroundColor:
      colors.background.primary,
  },

  saveButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor:
      colors.brand.accent,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});