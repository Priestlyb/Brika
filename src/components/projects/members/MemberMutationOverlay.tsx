/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/MemberMutationOverlay.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Member mutation loading overlay.
 *
 * Responsibilities:
 *
 * - Display a blocking loading state while a member mutation is running.
 * - Prevent accidental interaction with the underlying screen.
 * - Display a contextual mutation message.
 * - Keep mutation feedback presentation separate from the members route.
 *
 * This component does not perform API requests or contain business logic.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

export type MemberMutationType =
  | "invite"
  | "update-role"
  | "remove"
  | "leave"
  | "transfer";

export interface MemberMutationOverlayProps {
  visible: boolean;

  /**
   * Optional explicit message.
   *
   * When omitted, a message is generated from mutationType.
   */
  message?: string;

  /**
   * Used to generate a sensible default message when message is not supplied.
   */
  mutationType?: MemberMutationType;
}

const DEFAULT_MESSAGES: Record<MemberMutationType, string> = {
  invite: "Adding member...",
  "update-role": "Updating member role...",
  remove: "Removing member...",
  leave: "Leaving project...",
  transfer: "Transferring ownership...",
};

const DEFAULT_ICONS: Record<
  MemberMutationType,
  keyof typeof Ionicons.glyphMap
> = {
  invite: "person-add-outline",
  "update-role": "shield-checkmark-outline",
  remove: "person-remove-outline",
  leave: "exit-outline",
  transfer: "swap-horizontal-outline",
};

export function MemberMutationOverlay({
  visible,
  message,
  mutationType = "invite",
}: MemberMutationOverlayProps) {
  if (!visible) {
    return null;
  }

  const displayMessage = message ?? DEFAULT_MESSAGES[mutationType];

  const iconName = DEFAULT_ICONS[mutationType];

  return (
    <View
      pointerEvents="auto"
      style={styles.overlay}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <View style={styles.backdrop} />

      <View
        accessible
        accessibilityRole="alert"
        accessibilityLabel={displayMessage}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={22} color={colors.brand.accent} />
        </View>

        <ActivityIndicator
          size="small"
          color={colors.brand.accent}
          style={styles.spinner}
        />

        <ThemedText type="smallBold" style={styles.message} numberOfLines={2}>
          {displayMessage}
        </ThemedText>
      </View>
    </View>
  );
}

export default MemberMutationOverlay;

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  card: {
    minWidth: 220,
    maxWidth: 340,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.primary,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  iconContainer: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
  },

  spinner: {
    marginRight: spacing.sm,
  },

  message: {
    flex: 1,
    minWidth: 0,
  },
});
