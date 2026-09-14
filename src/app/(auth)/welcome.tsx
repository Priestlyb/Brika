/**
 * -----------------------------------------------------------------------------
 * File: src/app/(auth)/welcome.tsx
 * -----------------------------------------------------------------------------
 * Brika welcome experience.
 *
 * Responsibilities:
 *
 * - Introduce Brika.
 * - Present the architectural 3D experience.
 * - Allow users to select a subscription plan.
 * - Allow users to select monthly/yearly billing.
 * - Navigate to authentication.
 * - Animate the welcome experience on initial presentation.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { colors, spacing } from "@/constants/theme/index";

import {
  DEFAULT_PLAN_ID,
  PRICING_PLANS,
  type BillingPeriod,
} from "@/constants/pricing/pricing.constants";

import { WelcomeHero } from "@/components/welcome/WelcomeHero";
import { PricingSection } from "@/components/welcome/PricingSection";
import { WelcomeActions } from "@/components/welcome/WelcomeActions";

/**
 * -----------------------------------------------------------------------------
 * Animation Configuration
 * -----------------------------------------------------------------------------
 */

const MOTION = {
  heroDelay: 80,
  pricingDelay: 260,
  actionsDelay: 440,

  duration: 650,

  translateY: 24,
};

/**
 * -----------------------------------------------------------------------------
 * Screen
 * -----------------------------------------------------------------------------
 */

export default function WelcomeScreen() {
  const router = useRouter();

  const [selectedPlanId, setSelectedPlanId] = useState(DEFAULT_PLAN_ID);

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  /**
   * ---------------------------------------------------------------------------
   * Selected plan
   * ---------------------------------------------------------------------------
   */

  const selectedPlan = useMemo(
    () =>
      PRICING_PLANS.find((plan) => plan.id === selectedPlanId) ??
      PRICING_PLANS[0],
    [selectedPlanId],
  );

  /**
   * ---------------------------------------------------------------------------
   * Entrance animation values
   * ---------------------------------------------------------------------------
   */

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(MOTION.translateY)).current;

  const pricingOpacity = useRef(new Animated.Value(0)).current;
  const pricingTranslateY = useRef(
    new Animated.Value(MOTION.translateY),
  ).current;

  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslateY = useRef(
    new Animated.Value(MOTION.translateY),
  ).current;

  /**
   * ---------------------------------------------------------------------------
   * Entrance animation
   * ---------------------------------------------------------------------------
   *
   * The page reveals itself in three stages:
   *
   * 1. Hero
   * 2. Pricing
   * 3. Actions
   *
   * The stagger is deliberately restrained so the experience feels like a
   * premium product interface rather than a promotional landing page.
   */

  useEffect(() => {
    const createEntranceAnimation = (
      opacity: Animated.Value,
      translateY: Animated.Value,
      delay: number,
    ) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: MOTION.duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 0,
          duration: MOTION.duration,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

    const animation = Animated.parallel([
      createEntranceAnimation(heroOpacity, heroTranslateY, MOTION.heroDelay),

      createEntranceAnimation(
        pricingOpacity,
        pricingTranslateY,
        MOTION.pricingDelay,
      ),

      createEntranceAnimation(
        actionsOpacity,
        actionsTranslateY,
        MOTION.actionsDelay,
      ),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    actionsOpacity,
    actionsTranslateY,
    heroOpacity,
    heroTranslateY,
    pricingOpacity,
    pricingTranslateY,
  ]);

  /**
   * ----------------------------------------------------------------------------
   * Navigation
   * ----------------------------------------------------------------------------
   */

  const handleSignIn = () => {
    router.push("/(auth)/login");
  };

  const handleCreateAccount = () => {
    router.push({
      pathname: "/(auth)/register",
      params: {
        plan: selectedPlan.id,
        billing: billingPeriod,
      },
    });
  };

  /**
   * ----------------------------------------------------------------------------
   * Render
   * ----------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={styles.content}>
          {/* ---------------------------------------------------------------- */}
          {/* Hero                                                             */}
          {/* ---------------------------------------------------------------- */}

          <Animated.View
            style={[
              styles.animatedSection,
              {
                opacity: heroOpacity,
                transform: [
                  {
                    translateY: heroTranslateY,
                  },
                ],
              },
            ]}
          >
            <WelcomeHero />
          </Animated.View>

          {/* ---------------------------------------------------------------- */}
          {/* Pricing                                                          */}
          {/* ---------------------------------------------------------------- */}

          <Animated.View
            style={[
              styles.animatedSection,
              {
                opacity: pricingOpacity,
                transform: [
                  {
                    translateY: pricingTranslateY,
                  },
                ],
              },
            ]}
          >
            <PricingSection
              selectedPlanId={selectedPlan.id}
              billingPeriod={billingPeriod}
              onSelectPlan={setSelectedPlanId}
              onChangeBilling={setBillingPeriod}
            />
          </Animated.View>

          {/* ---------------------------------------------------------------- */}
          {/* Actions                                                          */}
          {/* ---------------------------------------------------------------- */}

          <Animated.View
            style={[
              styles.animatedSection,
              {
                opacity: actionsOpacity,
                transform: [
                  {
                    translateY: actionsTranslateY,
                  },
                ],
              },
            ]}
          >
            <WelcomeActions
              selectedPlanName={selectedPlan.name}
              onCreateAccount={handleCreateAccount}
              onSignIn={handleSignIn}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  scrollContent: {
    flexGrow: 1,

    /*
     * Keep only a small outer gutter.
     *
     * The previous spacing.md + maxWidth: 600 combination made the entire
     * welcome experience feel like a narrow centered column.
     */
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  content: {
    width: "100%",
    alignSelf: "stretch",
  },

  /**
   * Animated sections
   *
   * This wrapper intentionally has no layout styling. It only controls
   * opacity and vertical movement so the existing component dimensions and
   * responsive layouts remain untouched.
   */
  animatedSection: {
    width: "100%",
  },
});
