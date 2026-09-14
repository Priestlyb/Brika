/**
 * =============================================================================
 * File: src/hooks/files/useFiles.ts
 * =============================================================================
 * Brika Files Hook
 *
 * Responsibilities:
 *
 * - Load files belonging to a project.
 * - Track loading state.
 * - Track refresh state.
 * - Track errors.
 * - Expose the current file list.
 * - Provide a manual refresh function.
 * - Automatically monitor files while they are being processed.
 *
 * This hook is intentionally focused on file collection/query behavior.
 *
 * It does NOT:
 *
 * - Upload files.
 * - Delete files.
 * - Retry file processing.
 * - Generate download URLs.
 * - Manage file picker logic.
 *
 * Those mutations remain in their respective hooks/services.
 *
 * Processing lifecycle:
 *
 *     UPLOADING
 *         ↓
 *     PROCESSING
 *         ↓
 *       READY
 *
 * If processing fails:
 *
 *     PROCESSING
 *         ↓
 *       FAILED
 *
 * While one or more files are UPLOADING or PROCESSING, this hook periodically
 * refreshes the project file list so the UI reflects backend processing state.
 * =============================================================================
 */

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    filesService,
} from "@/services/files/files.service";

import type {
    FileMetadata,
} from "@/types/file.types";

/* =============================================================================
 * Constants
 * =============================================================================
 */

/**
 * Interval used to check processing file status.
 *
 * Five seconds is frequent enough to provide responsive status updates without
 * continuously polling the API.
 */
const FILE_PROCESSING_POLL_INTERVAL_MS =
    60_000;

/* =============================================================================
 * Types
 * =============================================================================
 */

export interface UseFilesResult {
    files: FileMetadata[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

/* =============================================================================
 * Helpers
 * =============================================================================
 */

/**
 * Convert an unknown error into a user-facing message.
 */
const getErrorMessage = (
    error: unknown,
): string => {
    if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "Unable to load project files.";
};

/**
 * Determine whether a file still requires backend processing.
 *
 * UPLOADING:
 * - The upload is still being completed or the backend has not yet moved the
 *   file into processing.
 *
 * PROCESSING:
 * - The backend conversion/generation pipeline is working on the file.
 *
 * READY and FAILED are terminal states for the current processing lifecycle.
 */
const hasProcessingFiles = (
    fileList: FileMetadata[],
): boolean => {
    return fileList.some(
        (file) =>
            file.status === "UPLOADING" ||
            file.status === "PROCESSING",
    );
};

/* =============================================================================
 * Hook
 * =============================================================================
 */

/**
 * Load and manage the files belonging to a project.
 */
export const useFiles = (
    projectId: string | undefined,
): UseFilesResult => {
    const [files, setFiles] = useState<
        FileMetadata[]
    >([]);

    const [isLoading, setIsLoading] =
        useState<boolean>(true);

    const [isRefreshing, setIsRefreshing] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    /**
     * Track whether the hook is still mounted.
     *
     * This protects against state updates from asynchronous requests after
     * unmounting.
     */
    const isMountedRef =
        useRef<boolean>(true);

    /**
     * Track whether a background poll request is currently running.
     *
     * This prevents overlapping requests if a previous request takes longer
     * than the polling interval.
     */
    const isPollingRequestRef =
        useRef<boolean>(false);

    /**
     * Track the current polling timer.
     */
    const pollingTimeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );

    /**
     * Track the latest project ID.
     *
     * This helps prevent an asynchronous response for an old project from
     * being applied after navigation to another project.
     */
    const projectIdRef =
        useRef<string | undefined>(
            projectId,
        );

    useEffect(() => {
        isMountedRef.current = true;
        projectIdRef.current = projectId;

        return () => {
            isMountedRef.current = false;

            if (
                pollingTimeoutRef.current !==
                null
            ) {
                clearTimeout(
                    pollingTimeoutRef.current,
                );

                pollingTimeoutRef.current = null;
            }

            isPollingRequestRef.current =
                false;
        };
    }, [projectId]);

    /**
     * -------------------------------------------------------------------------
     * Load Files
     * -------------------------------------------------------------------------
     *
     * Performs the actual project file query.
     *
     * `refreshing = false`
     *     Initial/normal load.
     *
     * `refreshing = true`
     *     User-requested manual refresh.
     *
     * Background polling does NOT use this function because background polling
     * should not cause the visible refresh indicator to flash every five
     * seconds.
     */
    const loadFiles = useCallback(
        async (
            refreshing = false,
        ): Promise<FileMetadata[] | null> => {
            if (!projectId) {
                if (
                    isMountedRef.current
                ) {
                    setFiles([]);
                    setError(null);
                    setIsLoading(false);
                    setIsRefreshing(false);
                }

                return [];
            }

            if (refreshing) {
                if (
                    isMountedRef.current
                ) {
                    setIsRefreshing(true);
                }
            } else if (
                isMountedRef.current
            ) {
                setIsLoading(true);
            }

            if (
                isMountedRef.current
            ) {
                setError(null);
            }

            try {
                const result =
                    await filesService.getProjectFiles(
                        projectId,
                    );

                /**
                 * Ignore a response if the hook has been unmounted.
                 */
                if (
                    !isMountedRef.current
                ) {
                    return null;
                }

                /**
                 * Ignore a response belonging to an older project after
                 * navigation has changed the project ID.
                 */
                if (
                    projectIdRef.current !==
                    projectId
                ) {
                    return null;
                }

                const nextFiles =
                    Array.isArray(
                        result.files,
                    )
                        ? result.files
                        : [];

                setFiles(nextFiles);

                return nextFiles;
            } catch (error) {
                /**
                 * Do not overwrite state after unmounting or project changes.
                 */
                if (
                    !isMountedRef.current ||
                    projectIdRef.current !==
                    projectId
                ) {
                    return null;
                }

                setError(
                    getErrorMessage(error),
                );

                return null;
            } finally {
                if (
                    isMountedRef.current &&
                    projectIdRef.current ===
                    projectId
                ) {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            }
        },
        [projectId],
    );

    /**
     * -------------------------------------------------------------------------
     * Initial Load
     * -------------------------------------------------------------------------
     *
     * Load files when the project ID changes.
     */
    useEffect(() => {
        void loadFiles();
    }, [loadFiles]);

    /**
     * -------------------------------------------------------------------------
     * Background Processing Polling
     * -------------------------------------------------------------------------
     *
     * Once the project contains an UPLOADING or PROCESSING file, periodically
     * query the backend until all files reach a terminal state.
     *
     * We intentionally use recursive setTimeout instead of setInterval.
     *
     * This guarantees that another request is not started until the previous
     * request has finished.
     */
    useEffect(() => {
        /**
         * Do not start polling without a project.
         */
        if (!projectId) {
            return;
        }

        /**
         * Do not start polling until the current file list is known.
         */
        if (isLoading) {
            return;
        }

        /**
         * If there are no files being processed, there is nothing to monitor.
         */
        if (
            !hasProcessingFiles(files)
        ) {
            return;
        }

        let cancelled = false;

        const scheduleNextPoll =
            () => {
                if (cancelled) {
                    return;
                }

                if (
                    pollingTimeoutRef.current !==
                    null
                ) {
                    clearTimeout(
                        pollingTimeoutRef.current,
                    );
                }

                pollingTimeoutRef.current =
                    setTimeout(
                        async () => {
                            if (
                                cancelled ||
                                !isMountedRef.current
                            ) {
                                return;
                            }

                            /**
                             * Avoid overlapping background requests.
                             */
                            if (
                                isPollingRequestRef.current
                            ) {
                                scheduleNextPoll();
                                return;
                            }

                            isPollingRequestRef.current =
                                true;

                            try {
                                const result =
                                    await filesService.getProjectFiles(
                                        projectId,
                                    );

                                if (
                                    cancelled ||
                                    !isMountedRef.current ||
                                    projectIdRef.current !==
                                    projectId
                                ) {
                                    return;
                                }

                                const nextFiles =
                                    Array.isArray(
                                        result.files,
                                    )
                                        ? result.files
                                        : [];

                                setFiles(
                                    nextFiles,
                                );

                                /**
                                 * A successful background request clears a
                                 * previous transient loading error.
                                 */
                                setError(null);

                                /**
                                 * Continue polling only if at least one file
                                 * still requires processing.
                                 */
                                if (
                                    hasProcessingFiles(
                                        nextFiles,
                                    )
                                ) {
                                    scheduleNextPoll();
                                }
                            } catch (error) {
                                /**
                                 * Background polling errors should not destroy
                                 * the current file list.
                                 *
                                 * We retain the existing files and try again
                                 * on the next polling cycle.
                                 */
                                if (
                                    !cancelled &&
                                    isMountedRef.current &&
                                    projectIdRef.current ===
                                    projectId
                                ) {
                                    /**
                                     * Only expose the error if there is not
                                     * already a more useful error displayed.
                                     */
                                    setError(
                                        getErrorMessage(
                                            error,
                                        ),
                                    );

                                    scheduleNextPoll();
                                }
                            } finally {
                                isPollingRequestRef.current =
                                    false;
                            }
                        },
                        FILE_PROCESSING_POLL_INTERVAL_MS,
                    );
            };

        scheduleNextPoll();

        return () => {
            cancelled = true;

            if (
                pollingTimeoutRef.current !==
                null
            ) {
                clearTimeout(
                    pollingTimeoutRef.current,
                );

                pollingTimeoutRef.current = null;
            }
        };
    }, [
        projectId,
        files,
        isLoading,
    ]);

    /**
     * -------------------------------------------------------------------------
     * Manual Refresh
     * -------------------------------------------------------------------------
     */
    const refresh =
        useCallback(
            async (): Promise<void> => {
                await loadFiles(true);
            },
            [loadFiles],
        );

    return {
        files,
        isLoading,
        isRefreshing,
        error,
        refresh,
    };
};