/**
 * -----------------------------------------------------------------------------
 * File: src/theme/motion.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Motion and animation tokens for the Brika application.
 *
 * Brika motion is intentionally restrained and functional. Animation should
 * communicate:
 *
 * - State changes
 * - Component transitions
 * - Hierarchy
 * - User feedback
 * - Spatial relationships
 *
 * Motion should never interfere with the user's ability to work efficiently.
 * -----------------------------------------------------------------------------
 */

import type {
    CSSDuration,
    CSSEasing,
} from "./types";

/**
 * -----------------------------------------------------------------------------
 * Duration
 * -----------------------------------------------------------------------------
 *
 * Animation duration scale.
 *
 * instant
 *     Immediate state changes with no perceptible transition.
 *
 * fast
 *     Small interactive changes such as hover, focus, and button states.
 *
 * normal
 *     Standard UI transitions such as dropdowns, tabs, and panels.
 *
 * slow
 *     Larger transitions such as drawers, modals, and significant layout
 *     changes.
 */
export const motionDuration = {
    instant: "0ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
} as const satisfies Record<
    "instant" | "fast" | "normal" | "slow",
    CSSDuration
>;

/**
 * -----------------------------------------------------------------------------
 * Easing
 * -----------------------------------------------------------------------------
 *
 * Standard easing curves used throughout Brika.
 *
 * standard
 *     General-purpose UI movement.
 *
 * emphasized
 *     More pronounced transitions and larger surfaces.
 *
 * decelerated
 *     Elements entering the interface.
 *
 * accelerated
 *     Elements leaving the interface.
 */
export const motionEasing = {
    linear: "linear",

    standard: "cubic-bezier(0.2, 0, 0, 1)",

    emphasized: "cubic-bezier(0.2, 0, 0, 1)",

    decelerated: "cubic-bezier(0, 0, 0.2, 1)",

    accelerated: "cubic-bezier(0.4, 0, 1, 1)",
} as const satisfies Record<
    | "linear"
    | "standard"
    | "emphasized"
    | "decelerated"
    | "accelerated",
    CSSEasing
>;

/**
 * -----------------------------------------------------------------------------
 * Motion Tokens
 * -----------------------------------------------------------------------------
 */
export const motion = {
    duration: motionDuration,
    easing: motionEasing,
} as const;

/**
 * Complete Brika motion-system type.
 */
export type Motion = typeof motion;

/**
 * Available motion duration token names.
 */
export type MotionDuration = keyof typeof motionDuration;

/**
 * Available motion easing token names.
 */
export type MotionEasing = keyof typeof motionEasing;