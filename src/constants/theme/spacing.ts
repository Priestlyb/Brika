/**

* ---
* File: src/theme/spacing.ts
* ---
* Brika Design System
*
* Central spacing scale for the Brika application.
*
* The spacing system provides a consistent rhythm across:
*
* * Layouts
* * Components
* * Forms
* * Cards
* * Panels
* * Navigation
* * 3D viewer controls
* * Page sections
*
* React Native dimensions are represented as numbers rather than CSS strings.
* ---

*/

/**

* ---
* Brika Spacing Scale
* ---
*
* Values represent React Native logical pixels.
  */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 48,
    section: 64,
} as const;

/**

* Complete Brika spacing-system type.
  */
export type Spacing = typeof spacing;

/**

* Available spacing token names.
  */
export type SpacingToken = keyof Spacing;
