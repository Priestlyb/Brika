/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/files/useFile.ts
 * -----------------------------------------------------------------------------
 * Brika File Hook
 *
 * Responsibilities:
 *
 * - Load a single project file.
 * - Track loading state.
 * - Track refresh state.
 * - Track request errors.
 * - Refresh the file metadata/status.
 *
 * This hook does NOT:
 *
 * - Upload files.
 * - Delete files.
 * - Retry failed conversions.
 * - Generate download URLs.
 * - Implement API requests directly.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from "react";

import { filesService } from "@/services/files/files.service";
import type { FileMetadata } from "@/types/file.types";

export interface UseFileResult {
    file: FileMetadata | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useFile(fileId?: string): UseFileResult {
    const [file, setFile] = useState<FileMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadFile = useCallback(
        async (refreshing = false) => {
            if (!fileId) {
                setFile(null);
                setError(null);
                setIsLoading(false);
                setIsRefreshing(false);
                return;
            }

            if (refreshing) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            setError(null);

            try {
                const result = await filesService.getFile(fileId);

                setFile(result.file);
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to load file.";

                setError(message);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [fileId],
    );

    useEffect(() => {
        void loadFile();
    }, [loadFile]);

    const refresh = useCallback(async () => {
        await loadFile(true);
    }, [loadFile]);

    return {
        file,
        isLoading,
        isRefreshing,
        error,
        refresh,
    };
}