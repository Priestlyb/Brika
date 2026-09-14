/**
 * -----------------------------------------------------------------------------
 * File: src/types/file.types.ts
 * -----------------------------------------------------------------------------
 * Brika File Types
 *
 * Shared frontend types for:
 *
 * - Project files
 * - File uploads
 * - File status
 * - File downloads
 * - File retry operations
 * - File list pagination
 * -----------------------------------------------------------------------------
 */

export type FileStatus =
    | "UPLOADING"
    | "PROCESSING"
    | "READY"
    | "FAILED";

export interface FileMetadata {
    id: string;
    projectId: string;
    uploadedById: string;

    originalName: string;
    storageKey: string;
    mimeType: string;
    size: number;
    extension: string;

    status: FileStatus;

    createdAt: string;
    updatedAt: string;
}

export interface UploadFileInput {
    projectId: string;
    file: File;
}

export interface UploadFileResult {
    file: FileMetadata;
}

export interface GetFileResult {
    file: FileMetadata;
}

export interface GetProjectFilesResult {
    files: FileMetadata[];
}

export interface FileListPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetProjectFilesPaginatedResult {
    files: FileMetadata[];
    pagination: FileListPagination;
}

export interface DeleteFileResult {
    message: string;
    fileId: string;
}

export interface DownloadFileResult {
    fileId: string;
    fileName: string;
    downloadUrl: string;
    expiresAt: string;
}

export interface RetryFileResult {
    file: FileMetadata;
    job: QueueJobResult;
}

export interface QueueJobResult {
    jobId: string;
    queueName: string;
}