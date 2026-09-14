/**
 * -----------------------------------------------------------------------------
 * File: src/components/files/FileUploadProgress.tsx
 * -----------------------------------------------------------------------------
 * Brika File Upload Progress
 *
 * Responsibilities:
 *
 * - Display the current file name.
 * - Display upload/processing status.
 * - Display a progress indicator when progress is available.
 * - Display an optional error message.
 * - Display a completed state.
 *
 * This component does NOT:
 *
 * - Upload files.
 * - Poll the API.
 * - Manage upload state.
 * - Retry conversions.
 * -----------------------------------------------------------------------------
 */

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import type { FileStatus } from "@/types/file.types";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface FileUploadProgressProps {
  fileName: string;
  status?: FileStatus;
  progress?: number;
  error?: string | null;
  showStatus?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

function getStatusLabel(status: FileStatus): string {
  switch (status) {
    case "UPLOADING":
      return "Uploading";

    case "PROCESSING":
      return "Processing";

    case "READY":
      return "Ready";

    case "FAILED":
      return "Failed";

    default:
      return "Uploading";
  }
}

function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, progress));
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function FileUploadProgress({
  fileName,
  status = "UPLOADING",
  progress,
  error = null,
  showStatus = true,
}: FileUploadProgressProps) {
  const normalizedProgress =
    typeof progress === "number" ? clampProgress(progress) : null;

  const isProcessing = status === "PROCESSING";
  const isReady = status === "READY";
  const isFailed = status === "FAILED";

  const shouldShowProgress =
    !isFailed && !isReady && normalizedProgress !== null;

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={`File ${fileName}`}
      accessibilityValue={
        normalizedProgress !== null
          ? {
              min: 0,
              max: 100,
              now: normalizedProgress,
            }
          : undefined
      }
    >
      <View style={styles.header}>
        <View style={styles.fileInfo}>
          <View style={styles.fileIcon}>
            <Text style={styles.fileIconText}>↗</Text>
          </View>

          <View style={styles.nameContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={styles.fileName}
            >
              {fileName}
            </Text>

            {showStatus && (
              <Text
                style={[
                  styles.status,
                  isFailed && styles.statusFailed,
                  isReady && styles.statusReady,
                ]}
              >
                {getStatusLabel(status)}
              </Text>
            )}
          </View>
        </View>

        {isProcessing && (
          <ActivityIndicator size="small" color={colors.status.warning} />
        )}

        {isReady && (
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
        )}

        {isFailed && (
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>!</Text>
          </View>
        )}
      </View>

      {shouldShowProgress && (
        <View style={styles.progressSection}>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{
              min: 0,
              max: 100,
              now: normalizedProgress,
            }}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${normalizedProgress}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {Math.round(normalizedProgress)}%
          </Text>
        </View>
      )}

      {isProcessing && normalizedProgress === null && (
        <View style={styles.indeterminateTrack}>
          <View style={styles.indeterminateFill} />
        </View>
      )}

      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
    gap: spacing.sm,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  fileInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.secondary,
  },

  fileIconText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },

  nameContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  fileName: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.text.primary,
  },

  status: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
  },

  statusReady: {
    color: colors.status.success,
  },

  statusFailed: {
    color: colors.status.error,
  },

  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  progressTrack: {
    flex: 1,
    height: 6,
    overflow: "hidden",
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
  },

  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.status.success,
  },

  progressText: {
    minWidth: 36,
    textAlign: "right",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  indeterminateTrack: {
    height: 6,
    overflow: "hidden",
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
  },

  indeterminateFill: {
    width: "45%",
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.status.warning,
  },

  successIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.status.successBackground,
  },

  successIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.status.success,
  },

  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.status.errorBackground,
  },

  errorIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.status.error,
  },

  errorMessage: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.status.error,
  },
});
