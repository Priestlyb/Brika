/**
 * -----------------------------------------------------------------------------
 * File: src/components/welcome/WelcomeHero.tsx
 * -----------------------------------------------------------------------------
 *
 * Brika Welcome Hero
 *
 * Responsibilities:
 *
 * - Display the Brika brand mark.
 * - Introduce the AI-powered 3D workspace.
 * - Present the primary welcome headline and supporting copy.
 * - Display the live 3D workspace preview.
 * - Provide lightweight technical metadata beneath the preview.
 *
 * Layout:
 *
 * - Uses the full width supplied by the parent screen.
 * - Keeps typography readable without unnecessarily narrowing the section.
 * - Allows the 3D scene to stretch edge-to-edge within the parent's content area.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import { StyleSheet, View } from "react-native";

import { BrikaLogo, BrikaText } from "@/components/ui/index";

import { colors, spacing, typography } from "@/constants/theme/index";

import { BuildingScene } from "./BuildingScene";

export function WelcomeHero() {
  return (
    <View style={styles.container}>
      {/* --------------------------------------------------------------------- */}
      {/* Brand                                                                  */}
      {/* --------------------------------------------------------------------- */}

      <BrikaLogo style={styles.logo} />

      {/* --------------------------------------------------------------------- */}
      {/* Hero Copy                                                              */}
      {/* --------------------------------------------------------------------- */}

      <View style={styles.heroCopy}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowDot} />

          <BrikaText
            variant="bodySmall"
            color={colors.text.secondary}
            style={styles.eyebrowText}
          >
            AI-POWERED 3D WORKSPACE
          </BrikaText>
        </View>

        <BrikaText variant="h1" style={styles.title}>
          Build something{"\n"}
          remarkable.
        </BrikaText>

        <BrikaText
          variant="body"
          color={colors.text.secondary}
          style={styles.description}
        >
          Turn architectural ideas into powerful 3D experiences with Brika.
          Create, transform, visualize, and collaborate in one workspace.
        </BrikaText>
      </View>

      {/* --------------------------------------------------------------------- */}
      {/* 3D Workspace                                                           */}
      {/* --------------------------------------------------------------------- */}

      <View style={styles.sceneWrapper}>
        <BuildingScene />
      </View>

      {/* --------------------------------------------------------------------- */}
      {/* Scene Metadata                                                         */}
      {/* --------------------------------------------------------------------- */}

      <View style={styles.sceneCaption}>
        <View style={styles.captionLeft}>
          <View style={styles.statusDot} />

          <BrikaText
            variant="bodySmall"
            color={colors.text.secondary}
            style={styles.captionText}
          >
            LIVE 3D PREVIEW
          </BrikaText>
        </View>

        <BrikaText
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.captionText}
        >
          BRK / 001
        </BrikaText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ------------------------------------------------------------------------- */
  /* Container                                                                  */
  /* ------------------------------------------------------------------------- */

  container: {
    width: "100%",
    alignItems: "stretch",
  },

  /* ------------------------------------------------------------------------- */
  /* Logo                                                                       */
  /* ------------------------------------------------------------------------- */

  logo: {
    width: 140,
    height: 48,
    alignSelf: "center",
  },

  /* ------------------------------------------------------------------------- */
  /* Hero Copy                                                                  */
  /* ------------------------------------------------------------------------- */

  heroCopy: {
    width: "100%",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },

  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
    backgroundColor: colors.brand.accent,
  },

  eyebrowText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 36,
    lineHeight: 42,
    textAlign: "center",
    letterSpacing: -1,
  },

  description: {
    width: "100%",
    maxWidth: 520,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    lineHeight: 22,
    textAlign: "center",
  },

  /* ------------------------------------------------------------------------- */
  /* 3D Scene                                                                  */
  /* ------------------------------------------------------------------------- */

  sceneWrapper: {
    width: "100%",
    marginTop: spacing.xl,
    alignSelf: "stretch",
  },

  /* ------------------------------------------------------------------------- */
  /* Scene Caption                                                              */
  /* ------------------------------------------------------------------------- */

  sceneCaption: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },

  captionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 6,
    height: 6,
    marginRight: spacing.xs,
    borderRadius: 3,
    backgroundColor: colors.brand.accent,
  },

  captionText: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
});
