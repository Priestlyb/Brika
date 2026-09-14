import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

export interface ProjectMembersHeaderProps {
  memberCount: number;
  canManageMembers?: boolean;
  onBack: () => void;
  onAddMember?: () => void;
}

export function ProjectMembersHeader({
  memberCount,
  canManageMembers = true,
  onBack,
  onAddMember,
}: ProjectMembersHeaderProps) {
  const memberLabel = memberCount === 1 ? "1 member" : `${memberCount} members`;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </Pressable>

        <View style={styles.headerText}>
          <ThemedText type="title" numberOfLines={1}>
            Members
          </ThemedText>

          <ThemedText type="small" themeColor="secondary">
            {memberLabel}
          </ThemedText>
        </View>

        {canManageMembers && onAddMember ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add project member"
            hitSlop={8}
            onPress={onAddMember}
            style={styles.addButton}
          >
            <Ionicons
              name="person-add-outline"
              size={20}
              color={colors.text.inverse}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default ProjectMembersHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
    backgroundColor: colors.brand.accent,
  },
});
