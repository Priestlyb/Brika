/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/files/useFileUpload.ts
 * -----------------------------------------------------------------------------
 * Brika File Upload Hook
 *
 * Responsibilities:
 *
 * - Upload a project file through filesService.
 * - Track upload/loading state.
 * - Track upload errors.
 * - Expose the uploaded file.
 * - Provide a reset method for clearing mutation state.
 *
 * This hook does NOT:
 *
 * - Implement HTTP requests directly.
 * - Validate file types independently of the file service.
 * - Manage the project file list.
 * - Handle file processing/conversion.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useState } from "react";

import { filesService } from "@/services/files/files.service";
import type {
    FileMetadata,
    UploadFileInput,
} from "@/types/file.types";

export interface UseFileUploadResult {
    file: FileMetadata | null;
    isUploading: boolean;
    error: string | null;
    upload: (input: UploadFileInput) => Promise<FileMetadata | null>;
    reset: () => void;
}

export function useFileUpload(): UseFileUploadResult {
    const [file, setFile] = useState<FileMetadata | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = useCallback(
        async (input: UploadFileInput): Promise<FileMetadata | null> => {
            setIsUploading(true);
            setError(null);

            try {
                const result = await filesService.uploadFile(input);

                setFile(result.file);

                return result.file;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to upload file.";

                setError(message);

                return null;
            } finally {
                setIsUploading(false);
            }
        },
        [],
    );

    const reset = useCallback(() => {
        setFile(null);
        setIsUploading(false);
        setError(null);
    }, []);

    return {
        file,
        isUploading,
        error,
        upload,
        reset,
    };
}