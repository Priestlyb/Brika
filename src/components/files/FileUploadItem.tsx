/**
 * -----------------------------------------------------------------------------
 * File: src/components/files/FileUploadItem.tsx
 * -----------------------------------------------------------------------------
 * Brika File Upload Item
 *
 * Responsibilities:
 *
 * - Display an individual file in an upload/list context.
 * - Display file name and size.
 * - Display the current file status.
 * - Display upload progress when available.
 * - Provide optional retry and remove actions.
 *
 * This component does NOT:
 *
 * - Upload files.
 * - Delete files through the API.
 * - Retry conversions through the API.
 * - Manage file-list state.
 * -----------------------------------------------------------------------------
 */

import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import type { FileMetadata } from "@/types/file.types";

import { FileStatusBadge } from "./FileStatusBadge";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface FileUploadItemProps {
  file: FileMetadata;

  /**
   * Optional upload percentage.
   *
   * This is separate from the backend file status because the current
   * backend status only represents the processing lifecycle.
   */
  progress?: number;

  error?: string | null;

  onRetry?: (file: FileMetadata) => void | Promise<void>;

  onRemove?: (file: FileMetadata) => void | Promise<void>;

  retrying?: boolean;

  removing?: boolean;

  disabled?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

function formatFileSize(size: number): string {
  if (!Number.isFinite(size) || size < 0) {
    return "Unknown size";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return fileName.slice(lastDotIndex + 1).toUpperCase();
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

export function FileUploadItem({
  file,
  progress,
  error = null,
  onRetry,
  onRemove,
  retrying = false,
  removing = false,
  disabled = false,
}: FileUploadItemProps) {
  const extension = getFileExtension(file.originalName);

  const isFailed = file.status === "FAILED";
  const isReady = file.status === "READY";
  const isProcessing = file.status === "PROCESSING";

  const isBusy = retrying || removing;
  const actionsDisabled = disabled || isBusy;

  const normalizedProgress =
    typeof progress === "number" ? clampProgress(progress) : null;

  const shouldShowProgress =
    !isReady && !isFailed && normalizedProgress !== null;

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <View style={styles.header}>
        <View style={styles.fileIcon}>
          <Text style={styles.fileIconText}>{extension || "FILE"}</Text>
        </View>

        <View style={styles.fileDetails}>
          <Text
            numberOfLines={1}
            ellipsizeMode="middle"
            style={styles.fileName}
          >
            {file.originalName}
          </Text>

          <View style={styles.metadata}>
            <Text style={styles.metadataText}>{formatFileSize(file.size)}</Text>

            <Text style={styles.separator}>•</Text>

            <Text style={styles.metadataText}>{extension || "File"}</Text>
          </View>
        </View>

        <FileStatusBadge status={file.status} compact />
      </View>

      {!isReady && !isFailed ? (
        <View style={styles.progressSection}>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
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
            {normalizedProgress !== null ? (
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${normalizedProgress}%`,
                  },
                ]}
              />
            ) : (
              <View style={styles.indeterminateFill} />
            )}
          </View>

          {normalizedProgress !== null ? (
            <Text style={styles.progressText}>
              {Math.round(normalizedProgress)}%
            </Text>
          ) : (
            <Text style={styles.processingText}>
              {isProcessing ? "Processing..." : "Uploading..."}
            </Text>
          )}
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isFailed && !error ? (
        <Text style={styles.errorText}>
          File processing failed. You can retry the conversion.
        </Text>
      ) : null}

      {onRetry || onRemove ? (
        <View style={styles.actions}>
          {isFailed && onRetry ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Retry ${file.originalName}`}
              accessibilityState={{
                disabled: actionsDisabled,
                busy: retrying,
              }}
              disabled={actionsDisabled}
              onPress={() => {
                void onRetry(file);
              }}
              style={({ pressed }) => [
                styles.actionButton,
                styles.retryButton,
                pressed && !actionsDisabled && styles.actionPressed,
              ]}
            >
              <Text style={styles.retryText}>
                {retrying ? "Retrying..." : "Retry"}
              </Text>
            </Pressable>
          ) : null}

          {onRemove ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${file.originalName}`}
              accessibilityState={{
                disabled: actionsDisabled,
                busy: removing,
              }}
              disabled={actionsDisabled}
              onPress={() => {
                void onRemove(file);
              }}
              style={({ pressed }) => [
                styles.actionButton,
                styles.removeButton,
                pressed && !actionsDisabled && styles.actionPressed,
              ]}
            >
              <Text style={styles.removeText}>
                {removing ? "Removing..." : "Remove"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
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

  containerDisabled: {
    opacity: 0.6,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  fileIcon: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
    backgroundColor: colors.background.secondary,
  },

  fileIconText: {
    maxWidth: 38,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "700",
    textAlign: "center",
    color: colors.text.secondary,
  },

  fileDetails: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  fileName: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.text.primary,
  },

  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  metadataText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
  },

  separator: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.tertiary,
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

  indeterminateFill: {
    width: "45%",
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.status.warning,
  },

  progressText: {
    minWidth: 36,
    textAlign: "right",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  processingText: {
    minWidth: 72,
    textAlign: "right",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: colors.text.secondary,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },

  actionButton: {
    minHeight: 34,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: radius.sm,
  },

  retryButton: {
    borderColor: colors.status.warning,
  },

  removeButton: {
    borderColor: colors.status.error,
  },

  actionPressed: {
    opacity: 0.7,
  },

  retryText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: colors.status.warning,
  },

  removeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: colors.status.error,
  },

  errorText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.status.error,
  },
});
