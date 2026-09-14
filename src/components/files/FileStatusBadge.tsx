/**
 * -----------------------------------------------------------------------------
 * File: src/components/files/FileStatusBadge.tsx
 * -----------------------------------------------------------------------------
 * Brika File Status Badge
 *
 * Responsibilities:
 *
 * - Display the current file processing status.
 * - Provide a consistent visual treatment for each file status.
 * - Support compact and regular display sizes.
 *
 * This component does NOT:
 *
 * - Change file status.
 * - Perform API requests.
 * - Manage upload state.
 * - Retry failed conversions.
 * -----------------------------------------------------------------------------
 */

import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import type { FileStatus } from "@/types/file.types";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface FileStatusBadgeProps {
  status: FileStatus;
  compact?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Status Configuration
 * -----------------------------------------------------------------------------
 */

interface StatusConfig {
  label: string;
  backgroundColor: string;
  textColor: string;
}

const STATUS_CONFIG: Record<FileStatus, StatusConfig> = {
  UPLOADING: {
    label: "Uploading",
    backgroundColor: colors.status.warningBackground,
    textColor: colors.status.warning,
  },

  PROCESSING: {
    label: "Processing",
    backgroundColor: colors.status.warningBackground,
    textColor: colors.status.warning,
  },

  READY: {
    label: "Ready",
    backgroundColor: colors.status.successBackground,
    textColor: colors.status.success,
  },

  FAILED: {
    label: "Failed",
    backgroundColor: colors.status.errorBackground,
    textColor: colors.status.error,
  },
};

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function FileStatusBadge({
  status,
  compact = false,
}: FileStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`File status: ${config.label}`}
      style={[
        styles.badge,
        compact && styles.badgeCompact,
        {
          backgroundColor: config.backgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          compact && styles.dotCompact,
          {
            backgroundColor: config.textColor,
          },
        ]}
      />

      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          {
            color: config.textColor,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },

  badgeCompact: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },

  dotCompact: {
    width: 5,
    height: 5,
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },

  labelCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
});
