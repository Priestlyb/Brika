/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/FlipText.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Premium native React Native flip-text animation.
 *
 * Designed for:
 *
 * - Expo
 * - React Native
 * - iOS
 * - Android
 * - React Native Web
 *
 * Animation character:
 *
 * - Subtle 3D flip
 * - Soft vertical entrance
 * - Gentle scale correction
 * - Opacity fade
 * - Character stagger
 * - Natural easing
 * - Optional looping with a breathing pause
 *
 * No CSS or browser-specific animation APIs are required.
 * -----------------------------------------------------------------------------
 */

import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface FlipTextProps {
  /**
   * Text to animate.
   */
  children: string;

  /**
   * Wrapper style.
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Text style.
   */
  textStyle?: TextStyle | TextStyle[];

  /**
   * Duration of each character animation.
   *
   * @default 700
   */
  duration?: number;

  /**
   * Delay before the first character starts.
   *
   * @default 0
   */
  delay?: number;

  /**
   * Whether the animation repeats.
   *
   * @default true
   */
  loop?: boolean;

  /**
   * Whether every character begins simultaneously.
   *
   * @default false
   */
  together?: boolean;

  /**
   * Delay between individual characters.
   *
   * @default 35
   */
  stagger?: number;

  /**
   * Pause after the complete animation before
   * restarting.
   *
   * @default 1800
   */
  loopDelay?: number;
}

/**
 * -----------------------------------------------------------------------------
 * Animated Character
 * -----------------------------------------------------------------------------
 */

interface FlipCharacterProps {
  character: string;
  index: number;
  duration: number;
  delay: number;
  loop: boolean;
  together: boolean;
  stagger: number;
  loopDelay: number;
  textStyle?: TextStyle | TextStyle[];
}

function FlipCharacter({
  character,
  index,
  duration,
  delay,
  loop,
  together,
  stagger,
  loopDelay,
  textStyle,
}: FlipCharacterProps) {
  /**
   * ---------------------------------------------------------------------------
   * Animation values
   * ---------------------------------------------------------------------------
   */

  const rotation = useRef(
    new Animated.Value(-65),
  ).current;

  const opacity = useRef(
    new Animated.Value(0),
  ).current;

  const scale = useRef(
    new Animated.Value(0.96),
  ).current;

  const translateY = useRef(
    new Animated.Value(10),
  ).current;

  /**
   * ---------------------------------------------------------------------------
   * Animation lifecycle
   * ---------------------------------------------------------------------------
   */

  useEffect(() => {
    let animation:
      | Animated.CompositeAnimation
      | null = null;

    let restartTimeout:
      | ReturnType<typeof setTimeout>
      | null = null;

    let startTimeout:
      | ReturnType<typeof setTimeout>
      | null = null;

    const characterDelay =
      delay +
      (together ? 0 : index * stagger);

    const runAnimation = () => {
      /**
       * Reset character to its initial state.
       */
      rotation.setValue(-65);
      opacity.setValue(0);
      scale.setValue(0.96);
      translateY.setValue(10);

      /**
       * Run all character animations together.
       *
       * The animation intentionally uses different easing
       * curves for a more natural result.
       */
      animation = Animated.parallel([
        /**
         * 3D rotation.
         *
         * The rotation is intentionally less than 90 degrees.
         * This keeps the effect sophisticated rather than flashy.
         */
        Animated.timing(rotation, {
          toValue: 0,
          duration,
          easing: Easing.out(
            Easing.cubic,
          ),
          useNativeDriver: true,
        }),

        /**
         * Fade in quickly.
         */
        Animated.timing(opacity, {
          toValue: 1,
          duration: Math.min(
            duration * 0.55,
            420,
          ),
          easing: Easing.out(
            Easing.quad,
          ),
          useNativeDriver: true,
        }),

        /**
         * Very subtle scale correction.
         *
         * A small overshoot prevents the text
         * from feeling completely static.
         */
        Animated.timing(scale, {
          toValue: 1,
          duration,
          easing: Easing.out(
            Easing.back(1.15),
          ),
          useNativeDriver: true,
        }),

        /**
         * Soft vertical entrance.
         */
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: Easing.out(
            Easing.cubic,
          ),
          useNativeDriver: true,
        }),
      ]);

      animation.start(({ finished }) => {
        if (!finished || !loop) {
          return;
        }

        /**
         * Give the completed sentence a moment
         * to breathe before restarting.
         */
        restartTimeout = setTimeout(
          runAnimation,
          loopDelay,
        );
      });
    };

    /**
     * Start this character after its stagger delay.
     */
    startTimeout = setTimeout(
      runAnimation,
      characterDelay,
    );

    return () => {
      if (startTimeout) {
        clearTimeout(startTimeout);
      }

      if (restartTimeout) {
        clearTimeout(restartTimeout);
      }

      animation?.stop();
    };
  }, [
    delay,
    duration,
    index,
    loop,
    together,
    stagger,
    loopDelay,
    rotation,
    opacity,
    scale,
    translateY,
  ]);

  /**
   * ---------------------------------------------------------------------------
   * Preserve spaces
   * ---------------------------------------------------------------------------
   */

  const displayCharacter =
    character === " "
      ? "\u00A0"
      : character;

  return (
    <Animated.View
      style={[
        styles.characterContainer,
        {
          opacity,

          transform: [
            {
              perspective: 900,
            },
            {
              rotateX:
                rotation.interpolate({
                  inputRange: [-65, 0],
                  outputRange: [
                    "-65deg",
                    "0deg",
                  ],
                }),
            },
            {
              translateY,
            },
            {
              scale,
            },
          ],
        },
      ]}
    >
      <ThemedText
        style={[
          styles.character,
          textStyle,
        ]}
      >
        {displayCharacter}
      </ThemedText>
    </Animated.View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * FlipText
 * -----------------------------------------------------------------------------
 */

export function FlipText({
  children,
  style,
  textStyle,
  duration = 700,
  delay = 0,
  loop = true,
  together = false,
  stagger = 35,
  loopDelay = 1800,
}: FlipTextProps) {
  const characters = useMemo(
    () => Array.from(children),
    [children],
  );

  return (
    <View
      style={[
        styles.wrapper,
        style,
      ]}
    >
      {characters.map(
        (character, index) => (
          <FlipCharacter
            key={`${character}-${index}`}
            character={character}
            index={index}
            duration={duration}
            delay={delay}
            loop={loop}
            together={together}
            stagger={stagger}
            loopDelay={loopDelay}
            textStyle={textStyle}
          />
        ),
      )}
    </View>
  );
}

export default FlipText;

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
  },

  characterContainer: {
    transformOrigin: "center",
  },

  character: {
    // Typography is intentionally inherited
    // from the consuming component.
  },
});