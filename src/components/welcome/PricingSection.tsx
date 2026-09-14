/**
 * -----------------------------------------------------------------------------
 * File: src/components/welcome/PricingSection.tsx
 * -----------------------------------------------------------------------------
 *
 * Brika Pricing Section
 *
 * Responsibilities:
 *
 * - Present the workspace pricing options.
 * - Allow users to switch between monthly and yearly billing.
 * - Allow users to select a pricing plan.
 * - Stack pricing cards vertically on mobile.
 * - Display pricing cards horizontally on larger screens.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { StyleSheet, useWindowDimensions, View } from "react-native";

import { BrikaText } from "@/components/ui/index";

import { colors, spacing } from "@/constants/theme/index";

import {
  PRICING_PLANS,
  type BillingPeriod,
} from "@/constants/pricing/pricing.constants";

import { BillingToggle } from "./BillingToggle";
import { PricingCard } from "./PricingCard";

type Props = {
  selectedPlanId: string;
  billingPeriod: BillingPeriod;
  onSelectPlan: (planId: string) => void;
  onChangeBilling: (period: BillingPeriod) => void;
};

const DESKTOP_BREAKPOINT = 900;

export function PricingSection({
  selectedPlanId,
  billingPeriod,
  onSelectPlan,
  onChangeBilling,
}: Props) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= DESKTOP_BREAKPOINT;

  return (
    <View style={styles.container}>
      {/* --------------------------------------------------------------------- */}
      {/* Section Heading                                                       */}
      {/* --------------------------------------------------------------------- */}

      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <BrikaText variant="h2" style={styles.title}>
            Choose your workspace.
          </BrikaText>

          <BrikaText
            variant="body"
            color={colors.text.secondary}
            style={styles.description}
          >
            Start with the tools you need today. Upgrade as your projects grow.
          </BrikaText>
        </View>

        <BillingToggle value={billingPeriod} onChange={onChangeBilling} />
      </View>

      {/* --------------------------------------------------------------------- */}
      {/* Pricing Plans                                                         */}
      {/* --------------------------------------------------------------------- */}

      <View
        style={[
          styles.plans,
          isDesktop ? styles.plansDesktop : styles.plansMobile,
        ]}
      >
        {PRICING_PLANS.map((plan) => (
          <View
            key={plan.id}
            style={isDesktop ? styles.desktopCardWrapper : undefined}
          >
            <PricingCard
              plan={plan}
              billingPeriod={billingPeriod}
              selected={selectedPlanId === plan.id}
              onSelect={() => onSelectPlan(plan.id)}
              compact={isDesktop}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ------------------------------------------------------------------------- */
  /* Section                                                                   */
  /* ------------------------------------------------------------------------- */

  container: {
    width: "100%",
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xxl,
  },

  /* ------------------------------------------------------------------------- */
  /* Heading                                                                   */
  /* ------------------------------------------------------------------------- */

  heading: {
    width: "100%",
    marginVertical: spacing.xxl,
  },

  headingCopy: {
    width: "100%",
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 23,
    lineHeight: 29,
  },

  description: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  /* ------------------------------------------------------------------------- */
  /* Plans                                                                     */
  /* ------------------------------------------------------------------------- */

  plans: {
    width: "100%",
  },

  plansMobile: {
    flexDirection: "column",
    gap: spacing.md,
  },

  plansDesktop: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.md,
  },

  desktopCardWrapper: {
    flex: 1,
    minWidth: 0,
  },
});
