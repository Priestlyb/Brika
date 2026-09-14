/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/InviteMemberModal.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Invite project member modal.
 *
 * Responsibilities:
 *
 * - Collect the email address of the person to invite.
 * - Allow the inviter to select EDITOR or VIEWER.
 * - Display the account-not-found state.
 * - Provide an optional action for opening the sign-up flow.
 * - Handle cancel/close interactions.
 * - Display the submitting/loading state.
 *
 * This component is presentation-only.
 * It does not perform API requests.
 * -----------------------------------------------------------------------------
 */

import React, { useMemo } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import RoleOption from "@/components/projects/members/RoleOption";
import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type InviteMemberRole = "EDITOR" | "VIEWER";

export interface InviteMemberModalProps {
  visible: boolean;

  email: string;

  role: InviteMemberRole;

  isSubmitting?: boolean;

  /**
   * True when the backend determined that no account exists for the
   * supplied email address.
   */
  accountNotFound?: boolean;

  onEmailChange: (email: string) => void;

  onRoleChange: (role: InviteMemberRole) => void;

  onClose: () => void;

  onSubmit: () => void;

  /**
   * Optional action shown when the supplied email does not belong to
   * an existing Brika account.
   */
  onOpenSignUp?: () => void;

  /**
   * Optional externally controlled validation state.
   *
   * When omitted, the component performs basic email validation locally.
   */
  isEmailValid?: boolean;

  /**
   * Optional message displayed below the email input.
   */
  emailError?: string | null;
}

/**
 * -----------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------
 */

const ROLE_OPTIONS: Array<{
  role: InviteMemberRole;
  description: string;
}> = [
  {
    role: "EDITOR",
    description: "Can edit project files and collaborate on project content.",
  },
  {
    role: "VIEWER",
    description: "Can view project files and activity without making changes.",
  },
];

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

function isValidEmail(value: string): boolean {
  const email = value.trim();

  if (!email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function InviteMemberModal({
  visible,
  email,
  role,
  isSubmitting = false,
  accountNotFound = false,
  onEmailChange,
  onRoleChange,
  onClose,
  onSubmit,
  onOpenSignUp,
  isEmailValid,
  emailError,
}: InviteMemberModalProps) {
  const normalizedEmail = email.trim();

  const emailIsValid = useMemo(() => {
    return isEmailValid ?? isValidEmail(normalizedEmail);
  }, [isEmailValid, normalizedEmail]);

  const canSubmit = emailIsValid && !accountNotFound && !isSubmitting;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalContainer}>
          {/* -----------------------------------------------------------------
           * Header
           * ----------------------------------------------------------------- */}

          <View style={styles.header}>
            <View style={styles.headerText}>
              <ThemedText type="title" style={styles.title}>
                Add member
              </ThemedText>

              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.subtitle}
              >
                Invite someone to collaborate on this project.
              </ThemedText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close add member dialog"
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

          {/* -----------------------------------------------------------------
           * Content
           * ----------------------------------------------------------------- */}

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Email */}
            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.label}>
                Email address
              </ThemedText>

              <TextInput
                value={email}
                onChangeText={onEmailChange}
                editable={!isSubmitting}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                placeholder="Enter email address"
                placeholderTextColor={colors.text.tertiary}
                style={[
                  styles.input,
                  emailError && styles.inputError,
                  accountNotFound && styles.inputError,
                ]}
              />

              {emailError ? (
                <ThemedText type="small" style={styles.errorText}>
                  {emailError}
                </ThemedText>
              ) : null}

              {/* -------------------------------------------------------------
               * Account not found
               * ------------------------------------------------------------- */}

              {accountNotFound ? (
                <View style={styles.accountNotFound}>
                  <View style={styles.accountNotFoundIcon}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={colors.brand.accent}
                    />
                  </View>

                  <View style={styles.accountNotFoundContent}>
                    <ThemedText
                      type="smallBold"
                      style={styles.accountNotFoundTitle}
                    >
                      No Brika account found
                    </ThemedText>

                    <ThemedText
                      type="small"
                      themeColor="secondary"
                      style={styles.accountNotFoundText}
                    >
                      This email address is not associated with a Brika account
                      yet.
                    </ThemedText>

                    {onOpenSignUp ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Open Brika sign up"
                        disabled={isSubmitting}
                        onPress={onOpenSignUp}
                        style={styles.signUpButton}
                      >
                        <ThemedText type="smallBold" style={styles.signUpText}>
                          Create an account
                        </ThemedText>

                        <Ionicons
                          name="arrow-forward"
                          size={15}
                          color={colors.brand.accent}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>

            {/* Role */}
            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.label}>
                Role
              </ThemedText>

              <View style={styles.roleOptions}>
                {ROLE_OPTIONS.map((option) => (
                  <RoleOption
                    key={option.role}
                    role={option.role}
                    description={option.description}
                    selected={role === option.role}
                    disabled={isSubmitting}
                    onPress={(selectedRole) => {
                      onRoleChange(selectedRole as InviteMemberRole);
                    }}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* -----------------------------------------------------------------
           * Actions
           * ----------------------------------------------------------------- */}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel adding member"
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
              accessibilityLabel="Add project member"
              accessibilityState={{
                disabled: !canSubmit,
                busy: isSubmitting,
              }}
              disabled={!canSubmit}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
                pressed && canSubmit && styles.buttonPressed,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Ionicons
                  name="person-add-outline"
                  size={18}
                  color={colors.text.inverse}
                />
              )}

              <ThemedText type="smallBold" themeColor="inverse">
                {isSubmitting ? "Adding..." : "Add member"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default InviteMemberModal;

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
    maxHeight: "90%",
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
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

  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  section: {
    marginBottom: spacing.lg,
  },

  label: {
    marginBottom: spacing.sm,
  },

  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    fontSize: 15,
  },

  inputError: {
    borderColor: colors.status.error,
  },

  errorText: {
    marginTop: spacing.xs,
    color: colors.status.error,
  },

  accountNotFound: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
  },

  accountNotFoundIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.background.primary,
  },

  accountNotFoundContent: {
    flex: 1,
    minWidth: 0,
  },

  accountNotFoundTitle: {
    marginBottom: 2,
  },

  accountNotFoundText: {
    lineHeight: 18,
  },

  signUpButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },

  signUpText: {
    color: colors.brand.accent,
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

  submitButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brand.accent,
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
