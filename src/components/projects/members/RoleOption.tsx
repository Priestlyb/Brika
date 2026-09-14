import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import type { EditableMemberRole } from "@/components/projects/members/EditMemberRoleModal";

export interface RoleOptionProps {
  role: EditableMemberRole;
  description: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: (role: EditableMemberRole) => void;
}

export function RoleOption({
  role,
  description,
  selected = false,
  disabled = false,
  onPress,
}: RoleOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      disabled={disabled}
      onPress={() => onPress(role)}
      style={({ pressed }) => [
        styles.container,
        selected && styles.containerSelected,
        disabled && styles.containerDisabled,
        pressed && !disabled && styles.containerPressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>

      <View style={styles.content}>
        <ThemedText type="smallBold" style={styles.role}>
          {role}
        </ThemedText>

        <ThemedText
          type="small"
          themeColor="secondary"
          style={styles.description}
        >
          {description}
        </ThemedText>
      </View>

      {selected ? (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={colors.brand.accent}
        />
      ) : null}
    </Pressable>
  );
}

export default RoleOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
  },

  containerSelected: {
    borderColor: colors.brand.accent,
    backgroundColor: colors.background.secondary,
  },

  containerDisabled: {
    opacity: 0.6,
  },

  containerPressed: {
    opacity: 0.75,
  },

  radio: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    marginTop: 1,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: 10,
  },

  radioSelected: {
    borderColor: colors.brand.accent,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.accent,
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  role: {
    marginBottom: spacing.xs,
  },

  description: {
    lineHeight: 19,
  },
});
