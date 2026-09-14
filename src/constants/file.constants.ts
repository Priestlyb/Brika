/**
 * -----------------------------------------------------------------------------
 * File: src/constants/file.constants.ts
 * -----------------------------------------------------------------------------
 * Brika File Constants
 *
 * Centralized constants for the frontend file module.
 *
 * Responsibilities:
 *
 * - Define supported file extensions.
 * - Define supported MIME types.
 * - Define file size limits.
 * - Define file status values.
 * - Define upload configuration.
 * - Provide reusable file validation helpers.
 * -----------------------------------------------------------------------------
 */

export const SUPPORTED_FILE_EXTENSIONS = [
    "dwg",
    "dxf",
    "step",
    "stp",
    "stl",
    "pdf",
] as const;

export type SupportedFileExtension =
    (typeof SUPPORTED_FILE_EXTENSIONS)[number];

export const SUPPORTED_MIME_TYPES = [
    // DWG
    "application/acad",
    "application/x-acad",
    "application/autocad",
    "application/dwg",

    // DXF
    "application/dxf",
    "application/x-dxf",

    // STEP / STP
    "application/step",
    "application/step-file",
    "application/x-step",
    "model/step",
    "model/step+zip",

    // STL
    "application/sla",
    "application/vnd.ms-pki.stl",
    "model/stl",
    "application/x-stl",

    // PDF
    "application/pdf",

    // Generic binary uploads
    "application/octet-stream",
] as const;

export type SupportedMimeType =
    (typeof SUPPORTED_MIME_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

export const MAX_FILE_SIZE_MB = 500;

export const FILE_STATUS = {
    UPLOADING: "UPLOADING",
    PROCESSING: "PROCESSING",
    READY: "READY",
    FAILED: "FAILED",
} as const;

export type FileStatus =
    (typeof FILE_STATUS)[keyof typeof FILE_STATUS];

export const FILE_UPLOAD_FIELD = "file";

export const FILE_CONVERSION_JOB = "file-conversion";

export const FILE_STORAGE_PREFIX = "projects";

export const ORIGINAL_FILE_STORAGE_FOLDER = "original";

export const PROCESSED_FILE_STORAGE_FOLDER = "processed";

export const getFileExtension = (
    fileName: string,
): string => {
    const normalizedFileName = fileName.trim().toLowerCase();

    const lastDotIndex = normalizedFileName.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return normalizedFileName.slice(lastDotIndex + 1);
};

export const isSupportedFileExtension = (
    fileName: string,
): fileName is string => {
    const extension = getFileExtension(fileName);

    return (
        extension.length > 0 &&
        (SUPPORTED_FILE_EXTENSIONS as readonly string[]).includes(
            extension,
        )
    );
};

export const isSupportedMimeType = (
    mimeType: string,
): mimeType is SupportedMimeType => {
    return (
        SUPPORTED_MIME_TYPES as readonly string[]
    ).includes(mimeType.toLowerCase());
};

export const isFileSizeValid = (
    size: number,
): boolean => {
    return (
        Number.isFinite(size) &&
        size > 0 &&
        size <= MAX_FILE_SIZE_BYTES
    );
};

export const getFileSizeInMB = (
    size: number,
): number => {
    return size / (1024 * 1024);
};