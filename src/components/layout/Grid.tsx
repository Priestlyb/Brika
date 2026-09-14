/**
 * -----------------------------------------------------------------------------
 * File: src/components/layout/Grid/Grid.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Responsive CSS Grid layout primitive.
 *
 * Grid provides a controlled two-dimensional layout system for:
 *
 * - Project cards
 * - Dashboard sections
 * - Model galleries
 * - Settings panels
 * - Data layouts
 * - Responsive application content
 *
 * -----------------------------------------------------------------------------
 */

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

import "./Grid.css";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export type GridGap =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
  | "huge"
  | "massive"
  | "section";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Grid content.
   */
  children: ReactNode;

  /**
   * Number of columns.
   *
   * @default 1
   */
  columns?: GridColumns;

  /**
   * Gap between grid items.
   *
   * @default lg
   */
  gap?: GridGap;

  /**
   * Automatically fit columns based on available width.
   *
   * When true, the `columns` prop is ignored.
   *
   * @default false
   */
  responsive?: boolean;

  /**
   * Minimum width for each responsive grid item.
   *
   * @default 280px
   */
  minItemWidth?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function Grid({
  children,
  columns = 1,
  gap = "lg",
  responsive = false,
  minItemWidth = "280px",
  className,
  style,
  ...props
}: GridProps) {
  const responsiveStyle: CSSProperties | undefined = responsive
    ? ({
        ...style,
        "--brika-grid-min-width": minItemWidth,
      } as CSSProperties)
    : style;

  return (
    <div
      className={cn(
        "brika-grid",
        responsive
          ? "brika-grid--responsive"
          : `brika-grid--columns-${columns}`,
        `brika-grid--gap-${gap}`,
        className,
      )}
      style={responsiveStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default Grid;
