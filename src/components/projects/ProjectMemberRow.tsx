/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/ProjectMemberRow.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Reusable row for displaying a single project member.
 *
 * Responsibilities:
 *
 * - Display member avatar or initials.
 * - Display member name and email.
 * - Display member role.
 * - Expose optional member selection.
 * - Expose optional member removal.
 * - Expose optional ownership transfer action.
 *
 * This component does NOT:
 *
 * - Fetch member data.
 * - Perform API requests.
 * - Mutate member data directly.
 * - Navigate.
 * - Decide whether ownership transfer is permitted.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { ProjectMember } from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface ProjectMemberRowProps {
  /**
   * Project member to display.
   */
  member: ProjectMember;

  /**
   * Whether member management controls should be displayed.
   */
  canManage?: boolean;

  /**
   * Called when the member row is selected.
   */
  onPress?: () => void;

  /**
   * Called when the member should be removed.
   */
  onRemove?: () => void;

  /**
   * Called when project ownership should be transferred to this member.
   *
   * The parent component is responsible for:
   *
   * - Permission checks.
   * - Confirmation.
   * - Calling the project service.
   * - Handling loading/errors.
   */
  onTransferOwnership?: () => void;

  /**
   * Disable all interactions.
   */
  disabled?: boolean;

  /**
   * Optional custom container style.
   */
  style?: ViewStyle;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function ProjectMemberRow({
  member,
  canManage = false,
  onPress,
  onRemove,
  onTransferOwnership,
  disabled = false,
  style,
}: ProjectMemberRowProps) {
  const displayName = getMemberName(member);

  const email = getMemberEmail(member);

  const initials = getMemberInitials(member);

  const roleLabel = getMemberRole(member);

  const isOwner = isProjectOwner(member);

  const isInteractive = Boolean(onPress) && !disabled;

  /**
   * Transfer ownership should only be exposed when:
   *
   * - The parent explicitly provides the callback.
   * - The member is not already the owner.
   * - The row is not disabled.
   */
  const canTransferOwnership =
    Boolean(onTransferOwnership) &&
    !isOwner &&
    !disabled;

  return (
    <View style={[styles.container, style, disabled && styles.disabled]}>
      {/* -----------------------------------------------------------------
       * Member Content
       *
       * This is intentionally separated from the action buttons.
       *
       * Do NOT wrap action buttons inside this Pressable.
       * -----------------------------------------------------------------
       */}

      {onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${displayName}, ${roleLabel}`}
          accessibilityHint="Open member details."
          accessibilityState={{
            disabled,
          }}
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => [
            styles.memberContent,
            pressed && isInteractive && styles.pressed,
          ]}
        >
          <MemberContent
            initials={initials}
            displayName={displayName}
            email={email}
            roleLabel={roleLabel}
          />
        </Pressable>
      ) : (
        <View style={styles.memberContent}>
          <MemberContent
            initials={initials}
            displayName={displayName}
            email={email}
            roleLabel={roleLabel}
          />
        </View>
      )}

      {/* -----------------------------------------------------------------
       * Transfer Ownership Action
       *
       * This is a sibling of the member Pressable.
       *
       * The parent owns the actual transfer logic.
       * -----------------------------------------------------------------
       */}

      {canTransferOwnership ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Transfer project ownership to ${displayName}`}
          accessibilityHint="Transfer project ownership to this member."
          accessibilityState={{
            disabled,
          }}
          disabled={disabled}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
          onPress={onTransferOwnership}
          style={({ pressed }) => [
            styles.transferButton,
            pressed && !disabled && styles.transferPressed,
          ]}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={20}
            color={colors.text.secondary}
          />
        </Pressable>
      ) : null}

      {/* -----------------------------------------------------------------
       * Remove Action
       *
       * This is a sibling of the member Pressable.
       *
       * That means tapping this button cannot accidentally trigger the
       * member's onPress callback.
       * -----------------------------------------------------------------
       */}

      {canManage && onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${displayName} from project`}
          accessibilityHint="Remove this member from the project."
          accessibilityState={{
            disabled,
          }}
          disabled={disabled}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
          onPress={onRemove}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && !disabled && styles.removePressed,
          ]}
        >
          <Ionicons
            name="close-outline"
            size={20}
            color={colors.text.secondary}
          />
        </Pressable>
      ) : null}

      {/* -----------------------------------------------------------------
       * Navigation Indicator
       * -----------------------------------------------------------------
       *
       * When member management is enabled, management actions are shown
       * instead of the navigation chevron.
       * -----------------------------------------------------------------
       */}

      {onPress && !canManage && !onTransferOwnership ? (
        <View style={styles.chevronContainer}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.text.tertiary}
          />
        </View>
      ) : null}
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Member Content
 * -----------------------------------------------------------------------------
 *
 * Keeps the visual member information separate from the interactive controls.
 * -----------------------------------------------------------------------------
 */

interface MemberContentProps {
  initials: string;

  displayName: string;

  email: string | null;

  roleLabel: string;
}

function MemberContent({
  initials,
  displayName,
  email,
  roleLabel,
}: MemberContentProps) {
  return (
    <>
      {/* -----------------------------------------------------------------
       * Avatar
       * -----------------------------------------------------------------
       */}

      <View style={styles.avatar}>
        <ThemedText type="smallBold" style={styles.initials}>
          {initials}
        </ThemedText>
      </View>

      {/* -----------------------------------------------------------------
       * Member Information
       * -----------------------------------------------------------------
       */}

      <View style={styles.content}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {displayName}
        </ThemedText>

        {email ? (
          <ThemedText
            type="small"
            themeColor="secondary"
            numberOfLines={1}
          >
            {email}
          </ThemedText>
        ) : null}
      </View>

      {/* -----------------------------------------------------------------
       * Role
       * -----------------------------------------------------------------
       */}

      <View style={styles.roleContainer}>
        <ThemedText
          type="small"
          style={styles.role}
          numberOfLines={1}
        >
          {roleLabel}
        </ThemedText>
      </View>
    </>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Member Name
 * -----------------------------------------------------------------------------
 */

function getMemberName(member: ProjectMember): string {
  const memberWithProfile = member as ProjectMember & {
    user?: {
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      email?: string | null;
    };
  };

  const firstName =
    memberWithProfile.user?.firstName ??
    getStringProperty(member, "firstName");

  const lastName =
    memberWithProfile.user?.lastName ??
    getStringProperty(member, "lastName");

  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  const nestedName = memberWithProfile.user?.name;

  if (nestedName?.trim()) {
    return nestedName.trim();
  }

  const directName = getStringProperty(member, "name");

  if (directName) {
    return directName;
  }

  const email = getMemberEmail(member);

  if (email) {
    return email;
  }

  return "Project member";
}

/**
 * -----------------------------------------------------------------------------
 * Member Email
 * -----------------------------------------------------------------------------
 */

function getMemberEmail(member: ProjectMember): string | null {
  const memberWithProfile = member as ProjectMember & {
    user?: {
      email?: string | null;
    };
  };

  return (
    memberWithProfile.user?.email ??
    getStringProperty(member, "email")
  );
}

/**
 * -----------------------------------------------------------------------------
 * Member Initials
 * -----------------------------------------------------------------------------
 */

function getMemberInitials(member: ProjectMember): string {
  const name = getMemberName(member);

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  if (parts[0]?.length) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "PM";
}

/**
 * -----------------------------------------------------------------------------
 * Member Role
 * -----------------------------------------------------------------------------
 */

function getMemberRole(member: ProjectMember): string {
  const role = getStringProperty(member, "role");

  if (!role) {
    return "Member";
  }

  return formatRole(role);
}

/**
 * -----------------------------------------------------------------------------
 * Project Owner Check
 * -----------------------------------------------------------------------------
 *
 * Ownership transfer should never be presented for the existing owner.
 *
 * The backend/frontend contract represents the owner using the OWNER role.
 * -----------------------------------------------------------------------------
 */

function isProjectOwner(member: ProjectMember): boolean {
  const role = getStringProperty(member, "role");

  return role?.toUpperCase() === "OWNER";
}

/**
 * -----------------------------------------------------------------------------
 * Format Role
 * -----------------------------------------------------------------------------
 */

function formatRole(role: string): string {
  return role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * -----------------------------------------------------------------------------
 * Safe String Property
 * -----------------------------------------------------------------------------
 */

function getStringProperty(
  value: object,
  key: string,
): string | null {
  const property = (value as Record<string, unknown>)[key];

  return typeof property === "string" && property.trim()
    ? property.trim()
    : null;
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    backgroundColor: colors.background.surface,

    flexDirection: "row",

    minHeight: 76,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.md,
  },

  /**
   * Main clickable member area.
   *
   * flex: 1 ensures the action buttons have their own dedicated area.
   */
  memberContent: {
    alignItems: "center",

    flex: 1,

    flexDirection: "row",

    minWidth: 0,
  },

  avatar: {
    alignItems: "center",

    backgroundColor: colors.brand.accentLight,

    borderRadius: radius.pill,

    height: 42,

    justifyContent: "center",

    width: 42,
  },

  initials: {
    color: colors.brand.accentDark,
  },

  content: {
    flex: 1,

    gap: 2,

    marginLeft: spacing.md,

    marginRight: spacing.sm,

    minWidth: 0,
  },

  roleContainer: {
    alignItems: "flex-end",

    maxWidth: 100,

    paddingHorizontal: spacing.xs,
  },

  role: {
    color: colors.text.secondary,

    textTransform: "capitalize",
  },

  /**
   * Dedicated transfer ownership button.
   *
   * This is outside the member Pressable so its touch handling is isolated.
   */
  transferButton: {
    alignItems: "center",

    borderRadius: radius.pill,

    height: 36,

    justifyContent: "center",

    marginLeft: spacing.sm,

    width: 36,
  },

  transferPressed: {
    backgroundColor: colors.brand.accentLight,
  },

  /**
   * Dedicated remove button.
   *
   * This is outside the member Pressable so its touch handling is isolated.
   */
  removeButton: {
    alignItems: "center",

    borderRadius: radius.pill,

    height: 36,

    justifyContent: "center",

    marginLeft: spacing.sm,

    width: 36,
  },

  removePressed: {
    backgroundColor: colors.status.errorBackground,
  },

  chevronContainer: {
    marginLeft: spacing.sm,
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default ProjectMemberRow;