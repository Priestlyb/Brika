/**
 * -----------------------------------------------------------------------------
 * File: src/components/welcome/BuildingScene.tsx
 * -----------------------------------------------------------------------------
 * Brika 3D Workspace / Wireframe Scene
 *
 * A lightweight architectural 3D visual for the Brika welcome screen.
 *
 * The visual represents:
 *
 * - A digital 3D workspace
 * - Abstract architectural geometry
 * - Technical wireframe overlays
 * - A subtle architectural grid
 * - Brika's charcoal / ivory / gold visual language
 * - Minimal product metadata
 *
 * It intentionally avoids a literal building/construction visual.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useRef } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Canvas, useFrame, useThree } from "@react-three/fiber/native";

import * as THREE from "three";

import { colors } from "@/constants/theme/colors";

/* =============================================================================
 * Theme Colors
 * =============================================================================
 *
 * The 3D welcome visual deliberately uses the main Brika brand palette rather
 * than the darker `colors.viewer` palette.
 *
 * The actual 3D model viewer can remain dark, while this welcome visual stays
 * integrated with the light marketing/auth experience.
 * =============================================================================
 */

const COLORS = {
  background: colors.background.primary,

  surface: colors.background.secondary,

  surfaceLight: colors.background.surface,

  surfaceDark: colors.border.medium,

  darkSurface: colors.brand.primary,

  wire: colors.border.medium,

  wireLight: colors.border.light,

  grid: colors.border.light,

  accent: colors.brand.accent,

  accentDark: colors.brand.accentDark,

  accentLight: colors.brand.accentLight,

  text: colors.text.secondary,

  textMuted: colors.text.tertiary,
};

/* =============================================================================
 * Main 3D Model
 * =============================================================================
 */

function WorkspaceModel() {
  const modelRef = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    if (!modelRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;

    /*
     * Very subtle rotation.
     *
     * The movement is intentionally slow so the visual feels like a premium
     * product interface rather than a game or animated illustration.
     */
    modelRef.current.rotation.y = Math.sin(time * 0.3) * 0.14;

    /*
     * Small vertical floating motion.
     */
    modelRef.current.position.y = Math.sin(time * 0.7) * 0.035;
  });

  return (
    <group ref={modelRef}>
      {/* -----------------------------------------------------------------------
       * Main architectural mass
       * --------------------------------------------------------------------- */}

      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.6, 2.4]} />

        <meshStandardMaterial
          color={COLORS.surface}
          roughness={0.82}
          metalness={0.04}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Upper architectural mass
       * --------------------------------------------------------------------- */}

      <mesh position={[-0.35, 1.95, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.7, 1.8]} />

        <meshStandardMaterial
          color={COLORS.surfaceLight}
          roughness={0.78}
          metalness={0.03}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Offset volume
       * --------------------------------------------------------------------- */}

      <mesh position={[1.05, 2.45, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.45, 1.1]} />

        <meshStandardMaterial
          color={COLORS.surfaceDark}
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Front opening
       *
       * Charcoal is used here to create contrast and connect the model to
       * Brika's primary brand color.
       * --------------------------------------------------------------------- */}

      <mesh position={[0.25, 0.85, 1.215]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.95, 0.04]} />

        <meshStandardMaterial
          color={COLORS.darkSurface}
          roughness={0.25}
          metalness={0.22}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Front horizontal technical guides
       * --------------------------------------------------------------------- */}

      <mesh position={[0, 0.35, 1.235]}>
        <boxGeometry args={[3.05, 0.02, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      <mesh position={[0, 0.95, 1.235]}>
        <boxGeometry args={[3.05, 0.02, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      <mesh position={[0, 1.55, 1.235]}>
        <boxGeometry args={[3.05, 0.02, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      <mesh position={[0, 2.25, 1.235]}>
        <boxGeometry args={[2.25, 0.02, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Front vertical technical guides
       * --------------------------------------------------------------------- */}

      <mesh position={[-1.2, 1.25, 1.25]}>
        <boxGeometry args={[0.02, 2.45, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      <mesh position={[-0.6, 1.25, 1.25]}>
        <boxGeometry args={[0.02, 2.45, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      <mesh position={[0, 1.25, 1.25]}>
        <boxGeometry args={[0.02, 2.45, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      <mesh position={[0.6, 1.25, 1.25]}>
        <boxGeometry args={[0.02, 2.45, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      <mesh position={[1.2, 1.25, 1.25]}>
        <boxGeometry args={[0.02, 2.45, 0.02]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.55} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Roof slab
       * --------------------------------------------------------------------- */}

      <mesh position={[0, 2.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.35, 0.1, 2.7]} />

        <meshStandardMaterial
          color={COLORS.surfaceDark}
          roughness={0.7}
          metalness={0.08}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Roof frame
       * --------------------------------------------------------------------- */}

      <mesh position={[0, 3.04, 0]}>
        <boxGeometry args={[2.4, 0.03, 1.8]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.5} />
      </mesh>

      {/* Left roof spine */}

      <mesh position={[-1.1, 3.04, 0]}>
        <boxGeometry args={[0.03, 0.03, 1.8]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.5} />
      </mesh>

      {/* Center roof spine */}

      <mesh position={[0, 3.04, 0]}>
        <boxGeometry args={[0.03, 0.03, 1.8]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.5} />
      </mesh>

      {/* Right roof spine */}

      <mesh position={[1.1, 3.04, 0]}>
        <boxGeometry args={[0.03, 0.03, 1.8]} />

        <meshBasicMaterial color={COLORS.wire} transparent opacity={0.5} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Floating geometric block
       * --------------------------------------------------------------------- */}

      <mesh
        position={[-1.8, 2.25, 0.25]}
        rotation={[0.25, 0.4, 0.15]}
        castShadow
      >
        <boxGeometry args={[0.42, 0.42, 0.42]} />

        <meshStandardMaterial
          color={COLORS.surfaceLight}
          roughness={0.6}
          metalness={0.12}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Floating gold geometric accent
       *
       * A faint emissive term is used instead of raising material brightness,
       * so the sphere reads as a lit accent rather than a flat paint chip.
       * --------------------------------------------------------------------- */}

      <mesh position={[1.8, 2.9, 0.35]}>
        <sphereGeometry args={[0.055, 16, 16]} />

        <meshStandardMaterial
          color={COLORS.accent}
          emissive={COLORS.accentDark}
          emissiveIntensity={0.35}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Small gold architectural marker
       * --------------------------------------------------------------------- */}

      <mesh position={[1.5, 1.7, 1.32]}>
        <boxGeometry args={[0.03, 0.42, 0.03]} />

        <meshStandardMaterial
          color={COLORS.accent}
          emissive={COLORS.accentDark}
          emissiveIntensity={0.2}
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Small champagne floating plane
       * --------------------------------------------------------------------- */}

      <mesh position={[-1.55, 1.65, 0.85]} rotation={[0.1, -0.25, 0.08]}>
        <boxGeometry args={[0.22, 0.22, 0.03]} />

        <meshBasicMaterial
          color={COLORS.accentLight}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

/* =============================================================================
 * Technical Guides
 * =============================================================================
 */

function TechnicalGuides() {
  return (
    <group>
      {/* -----------------------------------------------------------------------
       * Main horizontal measurement guide
       * --------------------------------------------------------------------- */}

      <mesh position={[0, 0, 3]}>
        <boxGeometry args={[5.2, 0.01, 0.01]} />

        <meshBasicMaterial color={COLORS.grid} transparent opacity={0.6} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Left vertical guide
       * --------------------------------------------------------------------- */}

      <mesh position={[-2.6, 1.45, 0]}>
        <boxGeometry args={[0.01, 2.9, 0.01]} />

        <meshBasicMaterial color={COLORS.grid} transparent opacity={0.6} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Right vertical guide
       * --------------------------------------------------------------------- */}

      <mesh position={[2.6, 1.45, 0]}>
        <boxGeometry args={[0.01, 2.9, 0.01]} />

        <meshBasicMaterial color={COLORS.grid} transparent opacity={0.6} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Gold horizontal guide
       * --------------------------------------------------------------------- */}

      <mesh position={[-2, 2.65, 1]}>
        <boxGeometry args={[1.2, 0.01, 0.01]} />

        <meshBasicMaterial color={COLORS.accent} transparent opacity={0.85} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Gold vertical guide
       * --------------------------------------------------------------------- */}

      <mesh position={[-2.6, 2.2, 1]}>
        <boxGeometry args={[0.01, 0.9, 0.01]} />

        <meshBasicMaterial color={COLORS.accent} transparent opacity={0.85} />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Small measurement ticks
       * --------------------------------------------------------------------- */}

      <mesh position={[-2.6, 2.65, 1]}>
        <boxGeometry args={[0.08, 0.01, 0.01]} />

        <meshBasicMaterial color={COLORS.accent} transparent opacity={0.85} />
      </mesh>

      <mesh position={[-2.6, 1.75, 1]}>
        <boxGeometry args={[0.08, 0.01, 0.01]} />

        <meshBasicMaterial color={COLORS.accent} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

/* =============================================================================
 * Ground
 * =============================================================================
 */

function Ground() {
  const verticalLineX = [-5, -3, -1, 1, 3, 5];
  const horizontalLineZ = [-5, -3, -1, 1, 3, 5];

  return (
    <group>
      {/* -----------------------------------------------------------------------
       * Ground surface
       *
       * receiveShadow lets the workspace model cast a soft contact shadow,
       * which is what actually grounds the geometry rather than the grid
       * lines alone.
       * --------------------------------------------------------------------- */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.12, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />

        <meshStandardMaterial
          color={COLORS.background}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* -----------------------------------------------------------------------
       * Vertical grid lines
       * --------------------------------------------------------------------- */}

      {verticalLineX.map((x) => (
        <mesh
          key={`grid-v-${x}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, -0.1, 0]}
        >
          <planeGeometry args={[0.006, 10]} />

          <meshBasicMaterial color={COLORS.grid} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* -----------------------------------------------------------------------
       * Horizontal grid lines
       * --------------------------------------------------------------------- */}

      {horizontalLineZ.map((z) => (
        <mesh
          key={`grid-h-${z}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.095, z]}
        >
          <planeGeometry args={[10, 0.006]} />

          <meshBasicMaterial color={COLORS.grid} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* =============================================================================
 * Camera Rig
 * =============================================================================
 *
 * The workspace model's visual center sits above the world origin (the roof
 * and floating gold accents pull the mass up to roughly y = 1.45), so a
 * camera that looks at (0, 0, 0) by default frames the house high and
 * off-center, with the ground eating the bottom of the card. This retargets the
 * camera to the model's actual center so the whole composition — house,
 * roof accents, and surrounding grid — sits centered with even padding.
 * =============================================================================
 */

const MODEL_CENTER: [number, number, number] = [0, 1.45, 0];

function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(...MODEL_CENTER);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

/* =============================================================================
 * Scene
 * =============================================================================
 */

function Scene() {
  return (
    <>
      <CameraRig />

      {/* -----------------------------------------------------------------------
       * Atmospheric depth
       *
       * A very light fog matched to the background separates the model from
       * the grid plane at distance, instead of everything sitting flush at
       * the same visual depth.
       * --------------------------------------------------------------------- */}

      <fog attach="fog" args={[COLORS.background, 9, 20]} />

      {/* -----------------------------------------------------------------------
       * Soft color-graded ambient (sky / ground split)
       *
       * Replaces a flat ambientLight with a hemisphereLight so shadowed
       * faces pick up a cool tint from "sky" and a warm tint from "ground"
       * instead of a uniform grey fill.
       * --------------------------------------------------------------------- */}

      <hemisphereLight
        color={COLORS.surfaceLight}
        groundColor={COLORS.darkSurface}
        intensity={0.9}
      />

      {/* -----------------------------------------------------------------------
       * Main architectural light (key, shadow-casting)
       * --------------------------------------------------------------------- */}

      <directionalLight
        position={[5, 8, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
      />

      {/* -----------------------------------------------------------------------
       * Secondary fill light
       * --------------------------------------------------------------------- */}

      <directionalLight position={[-5, 4, -4]} intensity={0.7} />

      {/* -----------------------------------------------------------------------
       * Rim light near the gold accents
       *
       * Warm, low-intensity, positioned to catch the accent geometry so the
       * gold reads as lit metal rather than flat-colored plastic.
       * --------------------------------------------------------------------- */}

      <pointLight
        position={[1.6, 2.6, 1.4]}
        intensity={0.5}
        distance={5}
        color={COLORS.accent}
      />

      {/* -----------------------------------------------------------------------
       * Subtle highlight
       * --------------------------------------------------------------------- */}

      <pointLight position={[0, 4, 3]} intensity={0.45} distance={10} />

      <Ground />

      <TechnicalGuides />

      <WorkspaceModel />
    </>
  );
}

/* =============================================================================
 * Public Component
 * =============================================================================
 */

export function BuildingScene() {
  return (
    <View style={styles.container}>
      {/* -----------------------------------------------------------------------
       * 3D Scene
       *
       * The scene wrapper carries its own padding so the model always sits
       * inset from the rounded card edge, independent of camera math.
       * shadows + ACES filmic tone mapping give the render actual contrast
       * and contact grounding instead of the flat, evenly-lit default.
       * --------------------------------------------------------------------- */}

      <View style={styles.sceneFrame}>
        <Canvas
          shadows
          camera={{
            position: [5.6, 4.5, 7.4],
            fov: 34,
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <Scene />
        </Canvas>
      </View>

      {/* -----------------------------------------------------------------------
       * Top-left metadata
       * --------------------------------------------------------------------- */}

      <View pointerEvents="none" style={styles.topLeft}>
        <View style={styles.statusDot} />

        <Text style={styles.topLabel}>3D Workspace</Text>
      </View>

      {/* -----------------------------------------------------------------------
       * Top-right coordinates
       * --------------------------------------------------------------------- */}

      <View pointerEvents="none" style={styles.topRight}>
        <Text style={styles.coordinate}>X 12.42</Text>

        <Text style={styles.coordinate}>Y 08.31</Text>

        <Text style={styles.coordinate}>Z 04.10</Text>
      </View>

      {/* -----------------------------------------------------------------------
       * Bottom-left metadata
       * --------------------------------------------------------------------- */}

      <View pointerEvents="none" style={styles.bottomLeft}>
        <View style={styles.accentLine} />

        <View>
          <Text style={styles.modelLabel}>BRK / 001</Text>

          <Text style={styles.modelSubLabel}>Generative model</Text>
        </View>
      </View>

      {/* -----------------------------------------------------------------------
       * Bottom-right status
       * --------------------------------------------------------------------- */}

      <View pointerEvents="none" style={styles.bottomRight}>
        <View style={styles.statusLine} />

        <Text style={styles.statusText}>Ready</Text>
      </View>

      {/* -----------------------------------------------------------------------
       * Corner markers
       * --------------------------------------------------------------------- */}

      <View
        pointerEvents="none"
        style={[styles.corner, styles.cornerTopLeft]}
      />

      <View
        pointerEvents="none"
        style={[styles.corner, styles.cornerTopRight]}
      />

      <View
        pointerEvents="none"
        style={[styles.corner, styles.cornerBottomLeft]}
      />

      <View
        pointerEvents="none"
        style={[styles.corner, styles.cornerBottomRight]}
      />
    </View>
  );
}

/* =============================================================================
 * Styles
 * =============================================================================
 */

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 350,

    overflow: "hidden",

    position: "relative",

    borderRadius: 28,

    backgroundColor: COLORS.background,
  },

  /* ---------------------------------------------------------------------------
   * Scene frame
   *
   * Padding here — not on the container — is what keeps the model inset
   * from the card edge; the Canvas fills whatever box it's given.
   * ------------------------------------------------------------------------- */

  sceneFrame: {
    flex: 1,

    padding: 22,
  },

  /* ---------------------------------------------------------------------------
   * Top-left
   * ------------------------------------------------------------------------- */

  topLeft: {
    position: "absolute",

    top: 20,
    left: 22,

    flexDirection: "row",

    alignItems: "center",
  },

  statusDot: {
    width: 6,
    height: 6,

    marginRight: 8,

    borderRadius: 3,

    backgroundColor: COLORS.accent,
  },

  topLabel: {
    fontSize: 10,

    fontWeight: "600",

    letterSpacing: 0.3,

    color: COLORS.text,
  },

  /* ---------------------------------------------------------------------------
   * Top-right
   * ------------------------------------------------------------------------- */

  topRight: {
    position: "absolute",

    top: 18,
    right: 22,

    alignItems: "flex-end",
  },

  coordinate: {
    fontSize: 8,

    lineHeight: 13,

    fontWeight: "500",

    letterSpacing: 0.4,

    fontVariant: ["tabular-nums"],

    color: COLORS.textMuted,
  },

  /* ---------------------------------------------------------------------------
   * Bottom-left
   * ------------------------------------------------------------------------- */

  bottomLeft: {
    position: "absolute",

    left: 22,
    bottom: 20,

    flexDirection: "row",

    alignItems: "center",
  },

  accentLine: {
    width: 24,
    height: 1,

    marginRight: 9,

    backgroundColor: COLORS.accent,
  },

  modelLabel: {
    fontSize: 10,

    fontWeight: "600",

    letterSpacing: 0.3,

    color: COLORS.text,
  },

  modelSubLabel: {
    marginTop: 2,

    fontSize: 8,

    fontWeight: "500",

    letterSpacing: 0.3,

    color: COLORS.textMuted,
  },

  /* ---------------------------------------------------------------------------
   * Bottom-right
   * ------------------------------------------------------------------------- */

  bottomRight: {
    position: "absolute",

    right: 22,
    bottom: 21,

    flexDirection: "row",

    alignItems: "center",
  },

  statusLine: {
    width: 16,
    height: 1,

    marginRight: 7,

    backgroundColor: COLORS.accent,
  },

  statusText: {
    fontSize: 8,

    fontWeight: "600",

    letterSpacing: 0.3,

    color: COLORS.textMuted,
  },

  /* ---------------------------------------------------------------------------
   * Corner markers
   * ------------------------------------------------------------------------- */

  corner: {
    position: "absolute",

    width: 12,
    height: 12,
  },

  cornerTopLeft: {
    top: 16,
    left: 16,

    borderTopWidth: 1,
    borderLeftWidth: 1,

    borderColor: COLORS.wireLight,
  },

  cornerTopRight: {
    top: 16,
    right: 16,

    borderTopWidth: 1,
    borderRightWidth: 1,

    borderColor: COLORS.wireLight,
  },

  cornerBottomLeft: {
    bottom: 16,
    left: 16,

    borderBottomWidth: 1,
    borderLeftWidth: 1,

    borderColor: COLORS.wireLight,
  },

  cornerBottomRight: {
    right: 16,
    bottom: 16,

    borderRightWidth: 1,
    borderBottomWidth: 1,

    borderColor: COLORS.wireLight,
  },
});
