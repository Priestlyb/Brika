/**
 * -----------------------------------------------------------------------------
 * File: src/components/welcome/PricingCard.tsx
 * -----------------------------------------------------------------------------
 *
 * Brika Pricing Card
 *
 * Responsibilities:
 *
 * - Display an individual pricing plan.
 * - Show the current billing price.
 * - Display plan features and generation allowance.
 * - Indicate the selected plan.
 * - Highlight the popular plan.
 * - Animate the selected card's gold perimeter.
 * - Adapt spacing for horizontal desktop layouts.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useRef } from "react";

import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { BrikaText } from "@/components/ui/index";

import { colors, spacing } from "@/constants/theme/index";

import {
  formatNaira,
  type BillingPeriod,
  type PricingPlan,
} from "@/constants/pricing/pricing.constants";

type Props = {
  plan: PricingPlan;
  billingPeriod: BillingPeriod;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
};

const BORDER_RADIUS = 22;
const BORDER_WIDTH = 1.5;

export function PricingCard({
  plan,
  billingPeriod,
  selected,
  onSelect,
  compact = false,
}: Props) {
  const price =
    billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  /**
   * ---------------------------------------------------------------------------
   * Animated perimeter
   * ---------------------------------------------------------------------------
   *
   * The gradient continuously rotates around the selected card.
   *
   * Native driver is used so the animation remains smooth without causing
   * React renders on every animation frame.
   */

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selected) {
      rotation.stopAnimation();

      Animated.timing(rotation, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      return;
    }

    rotation.setValue(0);

    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [rotation, selected]);

  const animatedRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.wrapper}>
      {/* ------------------------------------------------------------------- */}
      {/* Animated Selected Border                                            */}
      {/* ------------------------------------------------------------------- */}

      {selected && (
        <View
          pointerEvents="none"
          style={[
            styles.animatedBorder,
            compact && styles.animatedBorderCompact,
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ rotate: animatedRotation }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(201, 162, 39, 0)",
                "rgba(201, 162, 39, 0.15)",
                colors.brand.accent,
                colors.brand.accentDark,
                "rgba(201, 162, 39, 0.15)",
                "rgba(201, 162, 39, 0)",
              ]}
              locations={[0, 0.34, 0.46, 0.52, 0.66, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />
          </Animated.View>
        </View>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Card                                                                  */}
      {/* ------------------------------------------------------------------- */}

      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        onPress={onSelect}
        style={({ pressed }) => [
          styles.card,
          compact && styles.compactCard,
          plan.popular && styles.popularCard,
          selected && styles.selectedCard,
          pressed && styles.pressedCard,
        ]}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Selection Indicator                                               */}
        {/* ----------------------------------------------------------------- */}

        <View
          style={[
            styles.radio,
            compact && styles.compactRadio,
            selected && styles.radioSelected,
          ]}
        >
          {selected && <View style={styles.radioInner} />}
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Popular Badge                                                      */}
        {/* ----------------------------------------------------------------- */}

        {plan.popular && (
          <View style={styles.popularBadge}>
            <BrikaText
              variant="bodySmall"
              color={colors.background.primary}
              style={styles.popularText}
            >
              MOST POPULAR
            </BrikaText>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Header                                                             */}
        {/* ----------------------------------------------------------------- */}

        <View style={styles.header}>
          <BrikaText variant="h3" style={styles.name}>
            {plan.name}
          </BrikaText>

          <View style={styles.priceRow}>
            <BrikaText variant="h2" style={styles.price}>
              {formatNaira(price)}
            </BrikaText>

            {plan.name !== "Free" && (
              <BrikaText
                variant="bodySmall"
                color={colors.text.secondary}
                style={styles.period}
              >
                {billingPeriod === "monthly" ? "/mo" : "/yr"}
              </BrikaText>
            )}
          </View>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Description                                                        */}
        {/* ----------------------------------------------------------------- */}

        <BrikaText
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.description}
        >
          {plan.description}
        </BrikaText>

        {/* ----------------------------------------------------------------- */}
        {/* Generation Highlight                                               */}
        {/* ----------------------------------------------------------------- */}

        <View style={styles.generation}>
          <View style={styles.generationDot} />

          <BrikaText
            variant="bodySmall"
            color={colors.text.primary}
            style={styles.generationText}
          >
            {plan.generations}
          </BrikaText>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Features                                                           */}
        {/* ----------------------------------------------------------------- */}

        <View style={styles.features}>
          {plan.features.slice(0, 4).map((feature) => (
            <View key={feature} style={styles.feature}>
              <BrikaText
                variant="bodySmall"
                color={colors.brand.accent}
                style={styles.check}
              >
                ✓
              </BrikaText>

              <BrikaText
                variant="bodySmall"
                color={colors.text.secondary}
                style={styles.featureText}
              >
                {feature}
              </BrikaText>
            </View>
          ))}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ------------------------------------------------------------------------- */
  /* Wrapper                                                                   */
  /* ------------------------------------------------------------------------- */

  wrapper: {
    position: "relative",
    width: "100%",
  },

  /* ------------------------------------------------------------------------- */
  /* Animated Border                                                           */
  /* ------------------------------------------------------------------------- */

  animatedBorder: {
    position: "absolute",

    top: -BORDER_WIDTH,
    right: -BORDER_WIDTH,
    bottom: -BORDER_WIDTH,
    left: -BORDER_WIDTH,

    overflow: "hidden",

    borderRadius: BORDER_RADIUS + 1,

    backgroundColor: colors.brand.accent,
  },

  animatedBorderCompact: {
    borderRadius: BORDER_RADIUS + 1,
  },

  gradient: {
    position: "absolute",

    /*
     * Oversizing the gradient gives the rotating layer enough room to move
     * without revealing empty corners during rotation.
     */
    top: -40,
    right: -40,
    bottom: -40,
    left: -40,
  },

  /* ------------------------------------------------------------------------- */
  /* Card                                                                      */
  /* ------------------------------------------------------------------------- */

  card: {
    position: "relative",

    width: "100%",

    padding: spacing.lg,

    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: BORDER_RADIUS,

    backgroundColor: colors.background.surface,
  },

  compactCard: {
    minHeight: 330,
  },

  /*
   * When selected, the animated layer provides the gold perimeter.
   *
   * We keep the card itself almost neutral so the moving highlight remains
   * subtle instead of creating a heavy double border.
   */
  selectedCard: {
    borderColor: colors.brand.accent,
    borderWidth: 1,
  },

  popularCard: {
    borderColor: colors.brand.accent,
  },

  pressedCard: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  /* ------------------------------------------------------------------------- */
  /* Radio                                                                     */
  /* ------------------------------------------------------------------------- */

  radio: {
    position: "absolute",

    top: spacing.lg,
    right: spacing.lg,

    width: 22,
    height: 22,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1.5,
    borderColor: colors.border.light,
    borderRadius: 11,
  },

  compactRadio: {
    top: spacing.md,
    right: spacing.md,
  },

  radioSelected: {
    borderColor: colors.brand.accent,
  },

  radioInner: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: colors.brand.accent,
  },

  /* ------------------------------------------------------------------------- */
  /* Popular Badge                                                             */
  /* ------------------------------------------------------------------------- */

  popularBadge: {
    alignSelf: "flex-start",

    marginBottom: spacing.md,

    paddingHorizontal: spacing.sm,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor: colors.brand.accent,
  },

  popularText: {
    fontSize: 8,
    lineHeight: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  /* ------------------------------------------------------------------------- */
  /* Header                                                                    */
  /* ------------------------------------------------------------------------- */

  header: {
    paddingRight: 34,
  },

  name: {
    fontSize: 19,
    lineHeight: 25,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",

    marginTop: spacing.xs,
  },

  price: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },

  period: {
    marginLeft: spacing.xs,
  },

  /* ------------------------------------------------------------------------- */
  /* Description                                                               */
  /* ------------------------------------------------------------------------- */

  description: {
    marginTop: spacing.sm,
    lineHeight: 19,
  },

  /* ------------------------------------------------------------------------- */
  /* Generation                                                                */
  /* ------------------------------------------------------------------------- */

  generation: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: spacing.md,

    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,

    borderRadius: 10,

    backgroundColor: colors.background.primary,
  },

  generationDot: {
    width: 7,
    height: 7,

    marginRight: spacing.sm,

    borderRadius: 4,

    backgroundColor: colors.brand.accent,
  },

  generationText: {
    fontWeight: "600",
  },

  /* ------------------------------------------------------------------------- */
  /* Features                                                                  */
  /* ------------------------------------------------------------------------- */

  features: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },

  feature: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  check: {
    width: 18,
    fontWeight: "800",
  },

  featureText: {
    flex: 1,
    lineHeight: 18,
  },
});
