/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/[projectId]/files.tsx
 * -----------------------------------------------------------------------------
 * Brika Project Files
 *
 * Responsibilities:
 *
 * - Display files belonging to the current project.
 * - Provide a dedicated architectural file upload workspace.
 * - Upload files through the centralized file upload hook.
 * - Display real file processing status.
 * - Allow retrying failed file processing.
 * - Allow deleting project files.
 * - Display supported file formats.
 * - Explain the Brika file-processing pipeline.
 * - Start 3D generation for READY DWG/DXF files.
 * - Poll generation status until completion or failure.
 * - Follow the centralized Brika design system.
 * - Remain responsive across web and mobile.
 *
 * Architecture:
 *
 * Project Files Screen
 *       ↓
 * FilePickerButton
 *       ↓
 * useFileUpload
 *       ↓
 * filesService.uploadFile()
 *       ↓
 * Backend File Upload
 *       ↓
 * Conversion Queue
 *       ↓
 * useFiles
 *       ↓
 * FileList
 *       ↓
 * FileUploadItem / FileStatusBadge
 *
 * READY DWG/DXF
 *       ↓
 * generationService.startGeneration()
 *       ↓
 * Generation Queue
 *       ↓
 * Generation Worker
 *       ↓
 * useGenerationStatus()
 *       ↓
 * QUEUED → PROCESSING → COMPLETED / FAILED
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";

import { BrikaButton, BrikaCard, BrikaText } from "@/components/ui";
import { FileList } from "@/components/files/FileList";
import { FilePickerButton } from "@/components/files/FilePickerButton";

import { SUPPORTED_FILE_EXTENSIONS } from "@/constants/file.constants";
import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

import { useFileUpload } from "@/hooks/files/useFileUpload";
import { useFiles } from "@/hooks/files/useFiles";
import { useGenerationStatus } from "@/hooks/generation/useGenerationStatus";

import { filesService } from "@/services/files/files.service";
import {
  generationService,
  type GenerationStatus,
  type GenerationStatusResult,
  type StartGenerationResult,
} from "@/services/generation/generation.service";

import type { FileMetadata } from "@/types/file.types";

/**
 * -----------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------
 */

const GENERATION_POLL_INTERVAL = 2000;

const DEFAULT_GENERATION_OPTIONS = {
  wallHeight: 3,
  wallThickness: 0.2,
  doorHeight: 2.1,
  doorWidth: 0.9,
  generateRoof: true,
  generateDoorOpenings: true,
  generateInterior: true,
  preserveLayers: true,
  optimizeMesh: true,
};

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

/**
 * Convert a backend file size in bytes into a human-readable value.
 */
function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  const megabytes = kilobytes / 1024;

  if (megabytes < 1024) {
    return `${megabytes.toFixed(1)} MB`;
  }

  const gigabytes = megabytes / 1024;

  return `${gigabytes.toFixed(1)} GB`;
}

/**
 * Convert the supported extension list into display text.
 */
function getSupportedFormatsText(): string {
  return SUPPORTED_FILE_EXTENSIONS.map((extension) =>
    extension.toUpperCase(),
  ).join(", ");
}

/**
 * Determine whether a project file can be sent through the current
 * architectural 3D generation pipeline.
 *
 * Generation currently supports DWG and DXF only.
 */
function isGenerationSupportedFile(file: FileMetadata): boolean {
  if (file.status !== "READY") {
    return false;
  }

  const extension =
    file.originalName?.split(".").pop()?.toLowerCase().trim() ?? "";

  return extension === "dwg" || extension === "dxf";
}

/**
 * Return a user-friendly generation status label.
 */
function getGenerationStatusLabel(status?: GenerationStatus): string {
  switch (status) {
    case "QUEUED":
      return "Queued";

    case "PROCESSING":
      return "Generating";

    case "COMPLETED":
      return "Ready";

    case "FAILED":
      return "Failed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "Preparing";
  }
}

/**
 * Return a suitable icon for a generation status.
 */
function getGenerationStatusIcon(
  status?: GenerationStatus,
): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "QUEUED":
      return "time-outline";

    case "PROCESSING":
      return "sync-outline";

    case "COMPLETED":
      return "checkmark-circle-outline";

    case "FAILED":
      return "alert-circle-outline";

    case "CANCELLED":
      return "close-circle-outline";

    default:
      return "sparkles-outline";
  }
}

/**
 * Normalize a percentage value returned by the backend.
 */
function normalizePercentage(status?: GenerationStatusResult | null): number {
  if (!status) {
    return 0;
  }

  const value =
    typeof status.percentage === "number"
      ? status.percentage
      : typeof status.progress === "number"
        ? status.progress
        : 0;

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

/**
 * -----------------------------------------------------------------------------
 * Supported Format Card
 * -----------------------------------------------------------------------------
 */

function FormatCard({
  icon,
  format,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  format: string;
  description: string;
}) {
  return (
    <View style={styles.formatCard}>
      <View style={styles.formatIcon}>
        <Ionicons name={icon} size={20} color={colors.brand.accentDark} />
      </View>

      <View style={styles.formatContent}>
        <BrikaText variant="body" style={styles.formatTitle}>
          {format}
        </BrikaText>

        <BrikaText variant="bodySmall" color={colors.text.secondary}>
          {description}
        </BrikaText>
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Upload Drop Zone
 * -----------------------------------------------------------------------------
 */

function UploadDropZone({
  onFileSelected,
  loading,
}: {
  onFileSelected: (file: File) => void;
  loading?: boolean;
}) {
  return (
    <View style={styles.dropZone}>
      <View style={styles.uploadIconContainer}>
        <Ionicons
          name="cloud-upload-outline"
          size={32}
          color={colors.brand.accentDark}
        />
      </View>

      <BrikaText variant="h3" style={styles.dropZoneTitle}>
        Upload your plans
      </BrikaText>

      <BrikaText
        variant="body"
        color={colors.text.secondary}
        style={styles.dropZoneDescription}
      >
        {Platform.OS === "web"
          ? "Choose architectural files from your device to add them to this project."
          : "Choose architectural files from your device to get started."}
      </BrikaText>

      <FilePickerButton
        onFileSelected={onFileSelected}
        loading={loading}
        label="Choose Files"
        disabled={loading}
      />

      <BrikaText
        variant="bodySmall"
        color={colors.text.tertiary}
        style={styles.supportedText}
      >
        Supported formats: {getSupportedFormatsText()}
      </BrikaText>

      <BrikaText
        variant="bodySmall"
        color={colors.text.muted}
        style={styles.maxFileText}
      >
        Maximum file size: 500 MB
      </BrikaText>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Upload Error
 * -----------------------------------------------------------------------------
 */

function UploadErrorCard({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <View style={styles.errorCard}>
      <View style={styles.errorIcon}>
        <Ionicons
          name="alert-circle-outline"
          size={20}
          color={colors.status.error}
        />
      </View>

      <View style={styles.errorContent}>
        <BrikaText variant="body" style={styles.errorTitle}>
          Upload failed
        </BrikaText>

        <BrikaText
          variant="bodySmall"
          color={colors.status.error}
          style={styles.errorMessage}
        >
          {message}
        </BrikaText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss upload error"
        onPress={onDismiss}
        style={({ pressed }) => [
          styles.dismissButton,
          pressed && styles.dismissButtonPressed,
        ]}
      >
        <Ionicons name="close" size={18} color={colors.text.tertiary} />
      </Pressable>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * File Summary
 * -----------------------------------------------------------------------------
 */

function FileSummary({
  files,
  isRefreshing,
  onRefresh,
}: {
  files: FileMetadata[];
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}) {
  const totalSize = files.reduce(
    (total, file) => total + (Number.isFinite(file.size) ? file.size : 0),
    0,
  );

  const processingCount = files.filter(
    (file) => file.status === "UPLOADING" || file.status === "PROCESSING",
  ).length;

  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryInformation}>
        <BrikaText variant="h3" style={styles.sectionTitle}>
          Project files
        </BrikaText>

        <BrikaText
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.sectionDescription}
        >
          {files.length === 0
            ? "Files uploaded to this project will appear here."
            : `${files.length} ${
                files.length === 1 ? "file" : "files"
              }${totalSize > 0 ? ` • ${formatFileSize(totalSize)}` : ""}${
                processingCount > 0 ? ` • ${processingCount} processing` : ""
              }`}
        </BrikaText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Refresh project files"
        accessibilityState={{ busy: isRefreshing }}
        disabled={isRefreshing}
        onPress={onRefresh}
        style={({ pressed }) => [
          styles.refreshButton,
          pressed && !isRefreshing && styles.refreshButtonPressed,
          isRefreshing && styles.refreshButtonDisabled,
        ]}
      >
        <Ionicons
          name="refresh-outline"
          size={17}
          color={colors.brand.accentDark}
        />

        <BrikaText variant="bodySmall" style={styles.refreshText}>
          {isRefreshing ? "Refreshing" : "Refresh"}
        </BrikaText>
      </Pressable>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Generation Progress Card
 * -----------------------------------------------------------------------------
 */

function GenerationProgressCard({
  file,
  status,
  isStarting,
  onDismiss,
}: {
  file: FileMetadata;
  status: GenerationStatusResult | null;
  isStarting: boolean;
  onDismiss: () => void;
}) {
  const generationStatus = status?.status;
  const percentage = normalizePercentage(status);

  const isCompleted = generationStatus === "COMPLETED";
  const isFailed = generationStatus === "FAILED";
  const isCancelled = generationStatus === "CANCELLED";

  const statusLabel = isStarting
    ? "Starting"
    : getGenerationStatusLabel(generationStatus);

  const icon = isStarting
    ? "sparkles-outline"
    : getGenerationStatusIcon(generationStatus);

  return (
    <View
      style={[
        styles.generationCard,
        isCompleted && styles.generationCardCompleted,
        (isFailed || isCancelled) && styles.generationCardFailed,
      ]}
    >
      <View style={styles.generationHeader}>
        <View style={styles.generationHeaderLeft}>
          <View
            style={[
              styles.generationIcon,
              isCompleted && styles.generationIconCompleted,
              (isFailed || isCancelled) && styles.generationIconFailed,
            ]}
          >
            <Ionicons
              name={icon}
              size={20}
              color={
                isCompleted
                  ? colors.status.success
                  : isFailed || isCancelled
                    ? colors.status.error
                    : colors.brand.accentDark
              }
            />
          </View>

          <View style={styles.generationHeaderText}>
            <BrikaText variant="body" style={styles.generationTitle}>
              {isCompleted
                ? "3D model ready"
                : isFailed
                  ? "3D generation failed"
                  : isCancelled
                    ? "Generation cancelled"
                    : "Generating 3D model"}
            </BrikaText>

            <BrikaText
              variant="bodySmall"
              color={colors.text.secondary}
              style={styles.generationFilename}
              numberOfLines={1}
            >
              {file.originalName}
            </BrikaText>
          </View>
        </View>

        {isCompleted || isFailed || isCancelled ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss generation status"
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.dismissButtonPressed,
            ]}
          >
            <Ionicons name="close" size={18} color={colors.text.tertiary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.generationStatusRow}>
        <BrikaText
          variant="bodySmall"
          color={
            isFailed || isCancelled
              ? colors.status.error
              : isCompleted
                ? colors.status.success
                : colors.text.secondary
          }
          style={styles.generationStatusText}
        >
          {statusLabel}
        </BrikaText>

        {!isStarting && !isFailed && !isCancelled ? (
          <BrikaText
            variant="bodySmall"
            color={colors.text.secondary}
            style={styles.generationPercentage}
          >
            {Math.round(percentage)}%
          </BrikaText>
        ) : null}
      </View>

      {!isFailed && !isCancelled ? (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${isCompleted ? 100 : Math.max(percentage, 3)}%`,
              },
            ]}
          />
        </View>
      ) : null}

      {status?.stage ? (
        <BrikaText
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.generationStage}
        >
          {status.stage}
        </BrikaText>
      ) : null}

      {status?.message ? (
        <BrikaText
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.generationMessage}
        >
          {status.message}
        </BrikaText>
      ) : null}

      {isFailed && status?.error ? (
        <View style={styles.generationError}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={colors.status.error}
          />

          <BrikaText
            variant="bodySmall"
            color={colors.status.error}
            style={styles.generationErrorText}
          >
            {status.error}
          </BrikaText>
        </View>
      ) : null}

      {isCompleted ? (
        <View style={styles.generationSuccess}>
          <Ionicons
            name="checkmark-circle"
            size={17}
            color={colors.status.success}
          />

          <BrikaText
            variant="bodySmall"
            color={colors.status.success}
            style={styles.generationSuccessText}
          >
            Your architectural model has been generated successfully.
          </BrikaText>
        </View>
      ) : null}
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Generate 3D Card
 * -----------------------------------------------------------------------------
 */

function GenerationCard({
  files,
  activeGenerationFileId,
  activeGenerationId,
  isStarting,
  onGenerate,
}: {
  files: FileMetadata[];
  activeGenerationFileId: string | null;
  activeGenerationId: string | null;
  isStarting: boolean;
  onGenerate: (file: FileMetadata) => Promise<void>;
}) {
  const readyFiles = React.useMemo(
    () => files.filter(isGenerationSupportedFile),
    [files],
  );

  if (readyFiles.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.generationSectionHeader}>
        <View style={styles.generationSectionIcon}>
          <Ionicons
            name="sparkles-outline"
            size={19}
            color={colors.brand.accentDark}
          />
        </View>

        <View style={styles.generationSectionText}>
          <BrikaText variant="h3" style={styles.sectionTitle}>
            Ready for 3D
          </BrikaText>

          <BrikaText
            variant="bodySmall"
            color={colors.text.secondary}
            style={styles.sectionDescription}
          >
            These processed DWG and DXF files can be turned into interactive
            Brika models.
          </BrikaText>
        </View>
      </View>

      <BrikaCard style={styles.generationListCard}>
        {readyFiles.map((file, index) => {
          const isActiveFile = activeGenerationFileId === file.id;
          const isActiveGeneration = isActiveFile && !!activeGenerationId;

          return (
            <View
              key={file.id}
              style={[
                styles.generationFileRow,
                index > 0 && styles.generationFileRowBorder,
              ]}
            >
              <View style={styles.generationFileIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={21}
                  color={colors.brand.accentDark}
                />
              </View>

              <View style={styles.generationFileInformation}>
                <BrikaText
                  variant="body"
                  style={styles.generationFileName}
                  numberOfLines={1}
                >
                  {file.originalName}
                </BrikaText>

                <View style={styles.generationFileMeta}>
                  <BrikaText variant="bodySmall" color={colors.text.secondary}>
                    {file.originalName?.split(".").pop()?.toUpperCase() ??
                      "CAD"}
                  </BrikaText>

                  {Number.isFinite(file.size) ? (
                    <>
                      <BrikaText variant="bodySmall" color={colors.text.muted}>
                        •
                      </BrikaText>

                      <BrikaText
                        variant="bodySmall"
                        color={colors.text.secondary}
                      >
                        {formatFileSize(file.size)}
                      </BrikaText>
                    </>
                  ) : null}

                  <View style={styles.readyBadge}>
                    <View style={styles.readyDot} />

                    <BrikaText
                      variant="bodySmall"
                      color={colors.status.success}
                      style={styles.readyBadgeText}
                    >
                      Ready
                    </BrikaText>
                  </View>
                </View>
              </View>

              <View style={styles.generationFileAction}>
                <BrikaButton
                  title={
                    isActiveGeneration
                      ? "Generating..."
                      : isStarting && isActiveFile
                        ? "Starting..."
                        : "Generate 3D"
                  }
                  onPress={() => {
                    void onGenerate(file);
                  }}
                  disabled={isStarting || isActiveGeneration}
                />
              </View>
            </View>
          );
        })}
      </BrikaCard>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Screen
 * -----------------------------------------------------------------------------
 */

export default function ProjectFilesScreen() {
  const { projectId } = useLocalSearchParams<{
    projectId: string;
  }>();

  const { files, isLoading, isRefreshing, error, refresh } =
    useFiles(projectId);

  const {
    isUploading,
    error: uploadError,
    upload,
    reset: resetUpload,
  } = useFileUpload();

  const [retryingFileId, setRetryingFileId] = React.useState<string | null>(
    null,
  );

  const [removingFileId, setRemovingFileId] = React.useState<string | null>(
    null,
  );

  /**
   * Generation state.
   *
   * A single active generation is intentionally tracked at the screen level
   * for now. This prevents accidentally starting multiple expensive generation
   * jobs from the same workspace.
   */
  const [activeGenerationId, setActiveGenerationId] = React.useState<
    string | null
  >(null);

  const [activeGenerationFileId, setActiveGenerationFileId] = React.useState<
    string | null
  >(null);

  const [isStartingGeneration, setIsStartingGeneration] = React.useState(false);

  const [generationError, setGenerationError] = React.useState<string | null>(
    null,
  );

  /**
   * Generation status polling.
   */
  const {
    status: generationStatus,
    isLoading: isGenerationStatusLoading,
    isPolling: isGenerationPolling,
    error: generationStatusError,
    refresh: refreshGenerationStatus,
    reset: resetGenerationStatus,
  } = useGenerationStatus(activeGenerationId, {
    enabled: !!activeGenerationId,
    pollInterval: GENERATION_POLL_INTERVAL,
    immediate: true,
  });

  /**
   * ---------------------------------------------------------------------------
   * File Selection / Upload
   * ---------------------------------------------------------------------------
   */

  const handleFileSelected = React.useCallback(
    async (file: File) => {
      if (!projectId) {
        return;
      }

      resetUpload();

      await upload({
        projectId,
        file,
      });

      await refresh();
    },
    [projectId, resetUpload, upload, refresh],
  );

  /**
   * ---------------------------------------------------------------------------
   * Retry
   * ---------------------------------------------------------------------------
   */

  const handleRetry = React.useCallback(
    async (file: FileMetadata) => {
      if (retryingFileId) {
        return;
      }

      try {
        setRetryingFileId(file.id);

        await filesService.retryFile(file.id);

        await refresh();
      } catch (retryError) {
        const message =
          retryError instanceof Error
            ? retryError.message
            : "The file could not be retried.";

        Alert.alert("Retry failed", message);
      } finally {
        setRetryingFileId(null);
      }
    },
    [refresh, retryingFileId],
  );

  /**
   * ---------------------------------------------------------------------------
   * Delete
   * ---------------------------------------------------------------------------
   */

  const handleDelete = React.useCallback(
    async (file: FileMetadata) => {
      if (removingFileId) {
        return;
      }

      const performDelete = async () => {
        try {
          setRemovingFileId(file.id);

          await filesService.deleteFile(file.id);

          await refresh();
        } catch (deleteError) {
          const message =
            deleteError instanceof Error
              ? deleteError.message
              : "The file could not be deleted.";

          Alert.alert("Delete failed", message);
        } finally {
          setRemovingFileId(null);
        }
      };

      if (Platform.OS === "web") {
        const confirmed = window.confirm(
          `Delete "${file.originalName}"? This action cannot be undone.`,
        );

        if (confirmed) {
          await performDelete();
        }

        return;
      }

      Alert.alert(
        "Delete file?",
        `Are you sure you want to delete "${file.originalName}"? This action cannot be undone.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: performDelete,
          },
        ],
      );
    },
    [refresh, removingFileId],
  );

  /**
   * ---------------------------------------------------------------------------
   * Start 3D Generation
   * ---------------------------------------------------------------------------
   */

  const handleGenerate = React.useCallback(
    async (file: FileMetadata) => {
      if (!projectId || isStartingGeneration || activeGenerationId) {
        return;
      }

      if (!isGenerationSupportedFile(file)) {
        Alert.alert(
          "File not ready",
          "Only READY DWG and DXF files can currently be converted into a 3D model.",
        );

        return;
      }

      try {
        setGenerationError(null);
        setIsStartingGeneration(true);

        /**
         * Clear any previous generation status before starting a new job.
         */
        resetGenerationStatus();

        const result: StartGenerationResult =
          await generationService.startGeneration({
            projectId,
            planFileId: file.id,
            options: DEFAULT_GENERATION_OPTIONS,
          });

        /**
         * The backend returns 202 + generationId.
         *
         * Do not navigate here. The generation worker still has to:
         *
         * source file → parse → detect → geometry → mesh → roof → GLB
         * → R2 → Model3D → Version → thumbnail
         */
        setActiveGenerationFileId(file.id);
        setActiveGenerationId(result.generationId);
      } catch (generationStartError) {
        const message =
          generationStartError instanceof Error
            ? generationStartError.message
            : "The 3D generation job could not be started.";

        setGenerationError(message);

        Alert.alert("Generation failed to start", message);
      } finally {
        setIsStartingGeneration(false);
      }
    },
    [
      projectId,
      isStartingGeneration,
      activeGenerationId,
      resetGenerationStatus,
    ],
  );

  /**
   * ---------------------------------------------------------------------------
   * Generation Completion / Failure
   * ---------------------------------------------------------------------------
   */

  React.useEffect(() => {
    if (!generationStatus) {
      return;
    }

    if (generationStatus.status === "COMPLETED") {
      /**
       * Refresh the project files so the UI reflects any backend changes.
       */
      void refresh();
      return;
    }

    if (generationStatus.status === "FAILED") {
      setGenerationError(
        generationStatus.error ??
          generationStatus.message ??
          "The 3D generation job failed.",
      );

      return;
    }

    if (generationStatus.status === "CANCELLED") {
      setGenerationError(
        generationStatus.message ?? "The 3D generation job was cancelled.",
      );
    }
  }, [generationStatus, refresh]);

  /**
   * ---------------------------------------------------------------------------
   * Generation Status Errors
   * ---------------------------------------------------------------------------
   */

  React.useEffect(() => {
    if (generationStatusError) {
      setGenerationError(generationStatusError);
    }
  }, [generationStatusError]);

  /**
   * ---------------------------------------------------------------------------
   * Dismiss Generation Result
   * ---------------------------------------------------------------------------
   */

  const handleDismissGeneration = React.useCallback(() => {
    setActiveGenerationId(null);
    setActiveGenerationFileId(null);
    setGenerationError(null);
    resetGenerationStatus();
  }, [resetGenerationStatus]);

  /**
   * ---------------------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------------------
   */

  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  /**
   * ---------------------------------------------------------------------------
   * Invalid Project ID
   * ---------------------------------------------------------------------------
   */

  if (!projectId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.invalidContainer}>
          <View style={styles.invalidIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color={colors.status.error}
            />
          </View>

          <BrikaText variant="h3" style={styles.invalidTitle}>
            Project not found
          </BrikaText>

          <BrikaText
            variant="body"
            color={colors.text.secondary}
            style={styles.invalidMessage}
          >
            A valid project is required to view project files.
          </BrikaText>

          <BrikaButton title="Go Back" onPress={handleBack} />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background.primary,
        },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* -----------------------------------------------------------------
           * Header
           * -----------------------------------------------------------------
           */}

          <View style={styles.header}>
            <View style={styles.headerText}>
              <View style={styles.breadcrumbRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back to project"
                  onPress={handleBack}
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                  ]}
                >
                  <Ionicons
                    name="arrow-back"
                    size={17}
                    color={colors.text.secondary}
                  />

                  <BrikaText variant="bodySmall" color={colors.text.secondary}>
                    Project
                  </BrikaText>
                </Pressable>

                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={colors.text.muted}
                />

                <BrikaText variant="bodySmall" color={colors.text.tertiary}>
                  Files
                </BrikaText>
              </View>

              <BrikaText variant="h1" style={styles.title}>
                Files
              </BrikaText>

              <BrikaText
                variant="body"
                color={colors.text.secondary}
                style={styles.subtitle}
              >
                Upload architectural plans and turn them into interactive Brika
                models.
              </BrikaText>
            </View>

            <View style={styles.headerAction}>
              <FilePickerButton
                onFileSelected={handleFileSelected}
                loading={isUploading}
                label="Upload Files"
                disabled={isUploading}
              />
            </View>
          </View>

          {/* -----------------------------------------------------------------
           * Upload Error
           * -----------------------------------------------------------------
           */}

          {uploadError ? (
            <UploadErrorCard message={uploadError} onDismiss={resetUpload} />
          ) : null}

          {/* -----------------------------------------------------------------
           * Generation Error
           * -----------------------------------------------------------------
           */}

          {generationError &&
          generationStatus?.status !== "FAILED" &&
          generationStatus?.status !== "CANCELLED" ? (
            <UploadErrorCard
              message={generationError}
              onDismiss={() => setGenerationError(null)}
            />
          ) : null}

          {/* -----------------------------------------------------------------
           * Upload Area
           * -----------------------------------------------------------------
           */}

          <UploadDropZone
            onFileSelected={handleFileSelected}
            loading={isUploading}
          />

          {/* -----------------------------------------------------------------
           * Project Files
           * -----------------------------------------------------------------
           */}

          <View style={styles.section}>
            <FileSummary
              files={files}
              isRefreshing={isRefreshing}
              onRefresh={refresh}
            />

            <BrikaCard style={styles.filesCard}>
              <FileList
                files={files}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                error={error}
                onRefresh={refresh}
                onRetry={handleRetry}
                onRemove={handleDelete}
                retryingFileId={retryingFileId}
                removingFileId={removingFileId}
              />
            </BrikaCard>
          </View>

          {/* -----------------------------------------------------------------
           * 3D Generation
           * -----------------------------------------------------------------
           */}

          <GenerationCard
            files={files}
            activeGenerationFileId={activeGenerationFileId}
            activeGenerationId={activeGenerationId}
            isStarting={isStartingGeneration}
            onGenerate={handleGenerate}
          />

          {/* -----------------------------------------------------------------
           * Generation Status
           * -----------------------------------------------------------------
           */}

          {activeGenerationFileId
            ? (() => {
                const activeFile =
                  files.find((file) => file.id === activeGenerationFileId) ??
                  null;

                if (!activeFile) {
                  return null;
                }

                return (
                  <View style={styles.section}>
                    <GenerationProgressCard
                      file={activeFile}
                      status={generationStatus}
                      isStarting={
                        isStartingGeneration || isGenerationStatusLoading
                      }
                      onDismiss={handleDismissGeneration}
                    />

                    {generationStatus?.status === "FAILED" &&
                    generationError ? (
                      <BrikaText
                        variant="bodySmall"
                        color={colors.status.error}
                        style={styles.generationBottomError}
                      >
                        {generationError}
                      </BrikaText>
                    ) : null}

                    {generationStatus?.status === "COMPLETED" ? (
                      <View style={styles.completedActions}>
                        <BrikaButton
                          title="Refresh Files"
                          onPress={() => {
                            void refreshGenerationStatus();
                            void refresh();
                          }}
                        />
                      </View>
                    ) : null}

                    {isGenerationPolling &&
                    generationStatus?.status !== "COMPLETED" &&
                    generationStatus?.status !== "FAILED" &&
                    generationStatus?.status !== "CANCELLED" ? (
                      <BrikaText
                        variant="bodySmall"
                        color={colors.text.muted}
                        style={styles.pollingText}
                      >
                        Updating generation status automatically…
                      </BrikaText>
                    ) : null}
                  </View>
                );
              })()
            : null}

          {/* -----------------------------------------------------------------
           * Supported Formats
           * -----------------------------------------------------------------
           */}

          <View style={styles.section}>
            <BrikaText variant="h3" style={styles.sectionTitle}>
              Supported files
            </BrikaText>

            <BrikaText
              variant="bodySmall"
              color={colors.text.secondary}
              style={styles.sectionDescription}
            >
              Brika supports common architectural drawing and 3D model formats.
            </BrikaText>

            <View style={styles.formatsGrid}>
              <FormatCard
                icon="cube-outline"
                format="DWG"
                description="AutoCAD drawing files"
              />

              <FormatCard
                icon="layers-outline"
                format="DXF"
                description="Drawing exchange files"
              />

              <FormatCard
                icon="cube-outline"
                format="STEP"
                description="3D CAD exchange files"
              />

              <FormatCard
                icon="cube-outline"
                format="STL"
                description="3D model files"
              />

              <FormatCard
                icon="document-outline"
                format="PDF"
                description="Architectural plan documents"
              />
            </View>
          </View>

          {/* -----------------------------------------------------------------
           * Processing Information
           * -----------------------------------------------------------------
           */}

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={colors.brand.accentDark}
              />
            </View>

            <View style={styles.infoContent}>
              <BrikaText variant="body" style={styles.infoTitle}>
                What happens after upload?
              </BrikaText>

              <BrikaText
                variant="bodySmall"
                color={colors.text.secondary}
                style={styles.infoDescription}
              >
                Brika validates your file, stores the original securely,
                processes the architectural geometry, and prepares it for
                interactive 3D visualization.
              </BrikaText>
            </View>
          </View>

          {/* -----------------------------------------------------------------
           * Processing Pipeline
           * -----------------------------------------------------------------
           */}

          <View style={styles.pipelineCard}>
            <PipelineStep
              icon="cloud-upload-outline"
              title="Upload"
              description="Your original file is securely stored."
              isLast={false}
            />

            <PipelineStep
              icon="checkmark-circle-outline"
              title="Validate"
              description="Brika checks the file format and integrity."
              isLast={false}
            />

            <PipelineStep
              icon="sync-outline"
              title="Process"
              description="Architectural geometry is converted."
              isLast={false}
            />

            <PipelineStep
              icon="cube-outline"
              title="Visualize"
              description="Your interactive Brika model is prepared."
              isLast
            />
          </View>

          {/* -----------------------------------------------------------------
           * Footer
           * -----------------------------------------------------------------
           */}

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={colors.text.muted}
            />

            <BrikaText variant="bodySmall" color={colors.text.muted}>
              Files are securely processed within your Brika workspace.
            </BrikaText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Pipeline Step
 * -----------------------------------------------------------------------------
 */

function PipelineStep({
  icon,
  title,
  description,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <View style={styles.pipelineStep}>
      <View style={styles.pipelineIconColumn}>
        <View style={styles.pipelineIcon}>
          <Ionicons name={icon} size={17} color={colors.brand.accentDark} />
        </View>

        {!isLast ? <View style={styles.pipelineLine} /> : null}
      </View>

      <View style={styles.pipelineContent}>
        <BrikaText variant="body" style={styles.pipelineTitle}>
          {title}
        </BrikaText>

        <BrikaText variant="bodySmall" color={colors.text.secondary}>
          {description}
        </BrikaText>
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  /**
   * ---------------------------------------------------------------------------
   * Screen
   * ---------------------------------------------------------------------------
   */

  safeArea: {
    flex: 1,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingBottom: spacing.xl,
  },

  container: {
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  /**
   * ---------------------------------------------------------------------------
   * Header
   * ---------------------------------------------------------------------------
   */

  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xs,
  },

  backButtonPressed: {
    opacity: 0.6,
  },

  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.6,
  },

  subtitle: {
    maxWidth: 640,
    marginTop: spacing.xs,
    fontSize: 15,
    lineHeight: 22,
  },

  headerAction: {
    flexShrink: 0,
  },

  /**
   * ---------------------------------------------------------------------------
   * Upload Error
   * ---------------------------------------------------------------------------
   */

  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.status.error,
    borderRadius: radius.md,
    backgroundColor: colors.status.errorBackground,
  },

  errorIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surface,
  },

  errorContent: {
    flex: 1,
    minWidth: 0,
  },

  errorTitle: {
    fontWeight: "600",
  },

  errorMessage: {
    marginTop: spacing.xs,
    lineHeight: 19,
  },

  dismissButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: radius.sm,
  },

  dismissButtonPressed: {
    backgroundColor: colors.background.surface,
  },

  /**
   * ---------------------------------------------------------------------------
   * Upload Drop Zone
   * ---------------------------------------------------------------------------
   */

  dropZone: {
    width: "100%",
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border.medium,
    borderRadius: radius.lg,
    backgroundColor: colors.background.surface,
  },

  uploadIconContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.accentLight,
  },

  dropZoneTitle: {
    textAlign: "center",
  },

  dropZoneDescription: {
    maxWidth: 520,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: "center",
    lineHeight: 21,
  },

  supportedText: {
    marginTop: spacing.md,
    textAlign: "center",
  },

  maxFileText: {
    marginTop: spacing.xs,
    textAlign: "center",
  },

  /**
   * ---------------------------------------------------------------------------
   * Sections
   * ---------------------------------------------------------------------------
   */

  section: {
    marginTop: spacing.xl,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  summaryInformation: {
    flex: 1,
    minWidth: 0,
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },

  sectionDescription: {
    marginTop: 3,
    lineHeight: 19,
  },

  /**
   * ---------------------------------------------------------------------------
   * Refresh
   * ---------------------------------------------------------------------------
   */

  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },

  refreshButtonPressed: {
    opacity: 0.6,
  },

  refreshButtonDisabled: {
    opacity: 0.5,
  },

  refreshText: {
    color: colors.brand.accentDark,
    fontWeight: "600",
  },

  /**
   * ---------------------------------------------------------------------------
   * Files Card
   * ---------------------------------------------------------------------------
   */

  filesCard: {
    overflow: "hidden",
    padding: 0,
    borderWidth: 1,
    borderColor: colors.border.light,
  },

  /**
   * ---------------------------------------------------------------------------
   * 3D Generation Section
   * ---------------------------------------------------------------------------
   */

  generationSectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  generationSectionIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.brand.accentLight,
  },

  generationSectionText: {
    flex: 1,
    minWidth: 0,
  },

  generationListCard: {
    overflow: "hidden",
    padding: 0,
    borderWidth: 1,
    borderColor: colors.border.light,
  },

  generationFileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  generationFileRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },

  generationFileIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.background.secondary,
  },

  generationFileInformation: {
    flex: 1,
    minWidth: 0,
  },

  generationFileName: {
    fontWeight: "600",
  },

  generationFileMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },

  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.status.successBackground,
  },

  readyDot: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.status.success,
  },

  readyBadgeText: {
    fontWeight: "600",
  },

  generationFileAction: {
    flexShrink: 0,
  },

  /**
   * ---------------------------------------------------------------------------
   * Generation Progress
   * ---------------------------------------------------------------------------
   */

  generationCard: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  generationCardCompleted: {
    borderColor: colors.status.success,
    backgroundColor: colors.status.successBackground,
  },

  generationCardFailed: {
    borderColor: colors.status.error,
    backgroundColor: colors.status.errorBackground,
  },

  generationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  generationHeaderLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  generationIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.brand.accentLight,
  },

  generationIconCompleted: {
    backgroundColor: colors.background.surface,
  },

  generationIconFailed: {
    backgroundColor: colors.background.surface,
  },

  generationHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  generationTitle: {
    fontWeight: "600",
  },

  generationFilename: {
    marginTop: 2,
  },

  generationStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  generationStatusText: {
    fontWeight: "600",
  },

  generationPercentage: {
    fontVariant: ["tabular-nums"],
  },

  progressTrack: {
    width: "100%",
    height: 6,
    overflow: "hidden",
    marginTop: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
  },

  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.brand.accentDark,
  },

  generationStage: {
    marginTop: spacing.sm,
  },

  generationMessage: {
    marginTop: spacing.xs,
    lineHeight: 19,
  },

  generationError: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    marginTop: spacing.md,
  },

  generationErrorText: {
    flex: 1,
    lineHeight: 19,
  },

  generationSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
  },

  generationSuccessText: {
    flex: 1,
    lineHeight: 19,
    fontWeight: "600",
  },

  generationBottomError: {
    marginTop: spacing.sm,
    lineHeight: 19,
  },

  completedActions: {
    alignItems: "flex-start",
    marginTop: spacing.md,
  },

  pollingText: {
    marginTop: spacing.sm,
    textAlign: "center",
  },

  /**
   * ---------------------------------------------------------------------------
   * Supported Formats
   * ---------------------------------------------------------------------------
   */

  formatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md,
  },

  formatCard: {
    flex: 1,
    minWidth: 220,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  formatIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.background.secondary,
  },

  formatContent: {
    flex: 1,
    minWidth: 0,
  },

  formatTitle: {
    marginBottom: 2,
    fontWeight: "600",
  },

  /**
   * ---------------------------------------------------------------------------
   * Information Card
   * ---------------------------------------------------------------------------
   */

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
  },

  infoIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surface,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
  },

  infoTitle: {
    fontWeight: "600",
  },

  infoDescription: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  /**
   * ---------------------------------------------------------------------------
   * Processing Pipeline
   * ---------------------------------------------------------------------------
   */

  pipelineCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  pipelineStep: {
    flexDirection: "row",
    minHeight: 64,
  },

  pipelineIconColumn: {
    width: 38,
    alignItems: "center",
  },

  pipelineIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.brand.accentLight,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.accentLight,
  },

  pipelineLine: {
    width: 1,
    flex: 1,
    marginVertical: 4,
    backgroundColor: colors.border.light,
  },

  pipelineContent: {
    flex: 1,
    minWidth: 0,
    paddingLeft: spacing.md,
    paddingBottom: spacing.md,
  },

  pipelineTitle: {
    fontWeight: "600",
  },

  /**
   * ---------------------------------------------------------------------------
   * Footer
   * ---------------------------------------------------------------------------
   */

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  /**
   * ---------------------------------------------------------------------------
   * Invalid Project
   * ---------------------------------------------------------------------------
   */

  invalidContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  invalidIcon: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.status.errorBackground,
  },

  invalidTitle: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  invalidMessage: {
    maxWidth: 420,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
});
