/**
 * -----------------------------------------------------------------------------
 * File: src/lib/cn.ts
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Utility for composing conditional CSS class names.
 *
 * This helper provides a consistent way for Brika components to combine:
 *
 * - Base classes
 * - Conditional classes
 * - Optional className props
 * - Arrays of class names
 * - Nested conditional values
 *
 * -----------------------------------------------------------------------------
 */

import { clsx } from "clsx";

/**
 * Class-name input accepted by the cn utility.
 */
export type ClassValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | ClassValue[];

/**
 * Compose one or more class names into a single className string.
 *
 * @example
 * cn("button", "button-primary");
 *
 * @example
 * cn(
 *     "button",
 *     isActive && "button-active",
 *     disabled && "button-disabled",
 * );
 *
 * @example
 * cn(
 *     "card",
 *     [
 *         "card-bordered",
 *         isSelected && "card-selected",
 *     ],
 * );
 */
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}

export default cn;