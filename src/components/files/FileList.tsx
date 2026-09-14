/**
 * -----------------------------------------------------------------------------
 * File: src/components/files/FileList.tsx
 * -----------------------------------------------------------------------------
 * Brika File List
 *
 * Responsibilities:
 *
 * - Display a list of project files.
 * - Display loading state.
 * - Display empty state.
 * - Display an error state.
 * - Support pull-to-refresh.
 * - Forward retry and remove actions to the parent.
 *
 * This component does NOT:
 *
 * - Fetch files directly.
 * - Upload files.
 * - Delete files directly.
 * - Retry conversions directly.
 * - Manage API state.
 * -----------------------------------------------------------------------------
 */

import type { ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FileEmptyState } from "@/components/files/FileEmptyState";
import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import type { FileMetadata } from "@/types/file.types";

import { FileUploadItem } from "./FileUploadItem";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface FileListProps {
  files: FileMetadata[];

  isLoading?: boolean;

  isRefreshing?: boolean;

  error?: string | null;

  onRefresh?: () => Promise<void>;

  onRetry?: (file: FileMetadata) => void | Promise<void>;

  onRemove?: (file: FileMetadata) => void | Promise<void>;

  retryingFileId?: string | null;

  removingFileId?: string | null;

  progressByFileId?: Record<string, number | undefined>;

  emptyTitle?: string;

  emptyMessage?: string;

  ListHeaderComponent?: ReactElement | null;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function FileList({
  files,
  isLoading = false,
  isRefreshing = false,
  error = null,
  onRefresh,
  onRetry,
  onRemove,
  retryingFileId = null,
  removingFileId = null,
  progressByFileId = {},
  emptyTitle = "No files yet",
  emptyMessage = "Upload a supported project file to get started.",
  ListHeaderComponent = null,
}: FileListProps) {
  /**
   * ---------------------------------------------------------------------------
   * Loading State
   * ---------------------------------------------------------------------------
   */

  if (isLoading && files.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color={colors.brand.primary} />

        <Text style={styles.loadingText}>Loading files...</Text>
      </View>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Error State
   * ---------------------------------------------------------------------------
   */

  if (error && files.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>!</Text>
        </View>

        <Text style={styles.errorTitle}>Unable to load files</Text>

        <Text style={styles.errorMessage}>{error}</Text>

        {onRefresh ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try loading files again"
            onPress={() => {
              void onRefresh();
            }}
            style={({ pressed }) => [
              styles.retryLoadButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.retryLoadText}>Try again</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Empty State
   * ---------------------------------------------------------------------------
   */

  if (files.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {ListHeaderComponent}

        <View style={styles.emptyContent}>
          <FileEmptyState title={emptyTitle} message={emptyMessage} />
        </View>
      </View>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * File List
   * ---------------------------------------------------------------------------
   */

  return (
    <FlatList<FileMetadata>
      data={files}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FileUploadItem
          file={item}
          progress={progressByFileId[item.id]}
          onRetry={onRetry}
          onRemove={onRemove}
          retrying={retryingFileId === item.id}
          removing={removingFileId === item.id}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        error ? (
          <View style={styles.footerError}>
            <Text style={styles.footerErrorText}>{error}</Text>
          </View>
        ) : null
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshing={isRefreshing}
      onRefresh={
        onRefresh
          ? () => {
              void onRefresh();
            }
          : undefined
      }
    />
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },

  separator: {
    height: spacing.sm,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },

  loadingText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },

  errorIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.status.errorBackground,
  },

  errorIconText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    color: colors.status.error,
  },

  errorTitle: {
    marginTop: spacing.xs,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    textAlign: "center",
    color: colors.text.primary,
  },

  errorMessage: {
    maxWidth: 360,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: colors.text.secondary,
  },

  retryLoadButton: {
    minHeight: 40,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: radius.sm,
    backgroundColor: colors.background.primary,
  },

  retryLoadText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  emptyContainer: {
    flex: 1,
  },

  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },

  footerError: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },

  footerErrorText: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    color: colors.status.error,
  },
});
