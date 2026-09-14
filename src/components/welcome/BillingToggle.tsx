/**
 * -----------------------------------------------------------------------------
 * File: src/components/welcome/BillingToggle.tsx
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { BrikaText } from "@/components/ui/index";

import { colors, spacing } from "@/constants/theme/index";

import type { BillingPeriod } from "@/constants/pricing/pricing.constants";

type Props = {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
};

export function BillingToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange("monthly")}
        style={[styles.option, value === "monthly" && styles.selectedOption]}
      >
        <BrikaText
          variant="bodySmall"
          color={
            value === "monthly" ? colors.text.primary : colors.text.secondary
          }
          style={styles.optionText}
        >
          Monthly
        </BrikaText>
      </Pressable>

      <Pressable
        onPress={() => onChange("yearly")}
        style={[styles.option, value === "yearly" && styles.selectedOption]}
      >
        <BrikaText
          variant="bodySmall"
          color={
            value === "yearly" ? colors.text.primary : colors.text.secondary
          }
          style={styles.optionText}
        >
          Yearly
        </BrikaText>

        <View style={styles.saveBadge}>
          <BrikaText
            variant="bodySmall"
            color={colors.text.primary}
            style={styles.saveText}
          >
            SAVE
          </BrikaText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
  },

  option: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedOption: {
    backgroundColor: colors.background.primary,
  },

  optionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  saveBadge: {
    marginLeft: spacing.xs,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.brand.accent,
  },

  saveText: {
    fontSize: 7,
    lineHeight: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
