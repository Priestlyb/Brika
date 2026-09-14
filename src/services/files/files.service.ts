/**
 * -----------------------------------------------------------------------------
 * File: src/services/files/files.service.ts
 * -----------------------------------------------------------------------------
 * Brika File Service
 *
 * Responsibilities:
 *
 * - Upload project files.
 * - Retrieve project files.
 * - Retrieve paginated project files.
 * - Retrieve a single file.
 * - Generate a signed download URL.
 * - Retry failed file conversions.
 * - Delete project files.
 *
 * This service does NOT:
 *
 * - Manage React state.
 * - Handle UI concerns.
 * - Manage file-list caching.
 * - Implement file picker logic.
 * -----------------------------------------------------------------------------
 */

import { apiClient } from "@/services/api/client";

import type {
    DeleteFileResult,
    DownloadFileResult,
    FileMetadata,
    GetFileResult,
    GetProjectFilesPaginatedResult,
    GetProjectFilesResult,
    RetryFileResult,
    UploadFileInput,
    UploadFileResult,
} from "@/types/file.types";

/**
 * -----------------------------------------------------------------------------
 * API Response Envelope
 * -----------------------------------------------------------------------------
 *
 * The backend wraps successful responses in:
 *
 * {
 *     success: true,
 *     data: ...
 * }
 *
 * The service layer unwraps that envelope so hooks/components can work with
 * domain-specific data instead of HTTP response details.
 * -----------------------------------------------------------------------------
 */

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

/**
 * -----------------------------------------------------------------------------
 * Project Files Response
 * -----------------------------------------------------------------------------
 *
 * The backend GET /projects/:projectId/files endpoint returns:
 *
 * {
 *     success: true,
 *     data: {
 *         files: [...]
 *     }
 * }
 *
 * This is different from the paginated endpoint only in that pagination
 * metadata is absent.
 * -----------------------------------------------------------------------------
 */

interface ProjectFilesResponse {
    files: FileMetadata[];
}

/**
 * -----------------------------------------------------------------------------
 * Files Service
 * -----------------------------------------------------------------------------
 */

class FilesService {
    /**
     * -------------------------------------------------------------------------
     * Upload File
     * -------------------------------------------------------------------------
     *
     * POST /files/upload
     *
     * Uses multipart/form-data.
     *
     * Content-Type is intentionally NOT supplied here.
     * The API client allows fetch to set the correct multipart boundary.
     * -------------------------------------------------------------------------
     */

    async uploadFile(
        input: UploadFileInput,
    ): Promise<UploadFileResult> {
        const formData = new FormData();

        formData.append(
            "projectId",
            input.projectId,
        );

        formData.append(
            "file",
            input.file,
        );

        const response =
            await apiClient<
                ApiResponse<FileMetadata>
            >(
                "/files/upload",
                {
                    method: "POST",
                    body: formData,
                },
            );

        console.log(
            "[FilesService] Upload response:",
            response,
        );

        return {
            file: response.data,
        };
    }

    /**
     * -------------------------------------------------------------------------
     * Get Project Files
     * -------------------------------------------------------------------------
     *
     * GET /projects/:projectId/files
     *
     * Backend response:
     *
     * {
     *     success: true,
     *     data: {
     *         files: [...]
     *     }
     * }
     *
     * Frontend service response:
     *
     * {
     *     files: FileMetadata[]
     * }
     *
     * This endpoint is also used by useFiles polling while files are being
     * processed.
     * -------------------------------------------------------------------------
     */

    async getProjectFiles(
        projectId: string,
    ): Promise<GetProjectFilesResult> {
        const response =
            await apiClient<
                ApiResponse<ProjectFilesResponse>
            >(
                `/projects/${encodeURIComponent(projectId)}/files`,
                {
                    method: "GET",
                },
            );

        console.log(
            "[FilesService] Get project files response:",
            {
                projectId,
                response,
                data: response.data,
            },
        );

        const files =
            Array.isArray(
                response.data?.files,
            )
                ? response.data.files
                : [];

        console.log(
            "[FilesService] Current file statuses:",
            files.map(
                (file) => ({
                    id: file.id,
                    originalName:
                        file.originalName,
                    status: file.status,
                    updatedAt:
                        file.updatedAt,
                }),
            ),
        );

        return {
            files,
        };
    }

    /**
     * -------------------------------------------------------------------------
     * Get Project Files - Paginated
     * -------------------------------------------------------------------------
     *
     * GET /projects/:projectId/files?page=&limit=
     *
     * Backend response:
     *
     * {
     *     success: true,
     *     data: {
     *         files: [...],
     *         pagination: {...}
     *     }
     * }
     * -------------------------------------------------------------------------
     */

    async getProjectFilesPaginated(
        projectId: string,
        page = 1,
        limit = 20,
    ): Promise<GetProjectFilesPaginatedResult> {
        const safePage = Math.max(
            1,
            Math.floor(page),
        );

        const safeLimit = Math.min(
            100,
            Math.max(
                1,
                Math.floor(limit),
            ),
        );

        const params =
            new URLSearchParams({
                page: String(safePage),
                limit: String(safeLimit),
            });

        const response =
            await apiClient<
                ApiResponse<GetProjectFilesPaginatedResult>
            >(
                `/projects/${encodeURIComponent(projectId)}/files?${params.toString()}`,
                {
                    method: "GET",
                },
            );

        console.log(
            "[FilesService] Get paginated project files response:",
            response,
        );

        const files =
            Array.isArray(
                response.data?.files,
            )
                ? response.data.files
                : [];

        console.log(
            "[FilesService] Paginated file statuses:",
            files.map(
                (file) => ({
                    id: file.id,
                    originalName:
                        file.originalName,
                    status: file.status,
                    updatedAt:
                        file.updatedAt,
                }),
            ),
        );

        return {
            files,
            pagination:
                response.data?.pagination ?? {
                    total: 0,
                    page: safePage,
                    limit: safeLimit,
                    totalPages: 0,
                },
        };
    }

    /**
     * -------------------------------------------------------------------------
     * Get File
     * -------------------------------------------------------------------------
     *
     * GET /files/:id
     * -------------------------------------------------------------------------
     */

    async getFile(
        fileId: string,
    ): Promise<GetFileResult> {
        console.log(
            "[FilesService] Get file request:",
            fileId,
        );

        const response =
            await apiClient<
                ApiResponse<FileMetadata>
            >(
                `/files/${encodeURIComponent(fileId)}`,
                {
                    method: "GET",
                },
            );

        console.log(
            "[FilesService] Get file response:",
            response,
        );

        console.log(
            "[FilesService] Get file data:",
            response.data,
        );

        console.log(
            "[FilesService] Get file status:",
            {
                fileId:
                    response.data?.id,
                originalName:
                    response.data?.originalName,
                status:
                    response.data?.status,
                projectId:
                    response.data?.projectId,
                updatedAt:
                    response.data?.updatedAt,
            },
        );

        return {
            file: response.data,
        };
    }

    /**
     * -------------------------------------------------------------------------
     * Get Download URL
     * -------------------------------------------------------------------------
     *
     * GET /files/:id/download
     * -------------------------------------------------------------------------
     */

    async getDownloadUrl(
        fileId: string,
    ): Promise<DownloadFileResult> {
        const response =
            await apiClient<
                ApiResponse<DownloadFileResult>
            >(
                `/files/${encodeURIComponent(fileId)}/download`,
                {
                    method: "GET",
                },
            );

        console.log(
            "[FilesService] Download URL response:",
            {
                fileId,
                fileName:
                    response.data?.fileName,
                expiresAt:
                    response.data?.expiresAt,
            },
        );

        return response.data;
    }

    /**
     * -------------------------------------------------------------------------
     * Retry File Conversion
     * -------------------------------------------------------------------------
     *
     * POST /files/:id/retry
     * -------------------------------------------------------------------------
     */

    async retryFile(
        fileId: string,
    ): Promise<RetryFileResult> {
        const response =
            await apiClient<
                ApiResponse<RetryFileResult>
            >(
                `/files/${encodeURIComponent(fileId)}/retry`,
                {
                    method: "POST",
                },
            );

        console.log(
            "[FilesService] Retry file response:",
            response,
        );

        return response.data;
    }

    /**
     * -------------------------------------------------------------------------
     * Delete File
     * -------------------------------------------------------------------------
     *
     * DELETE /files/:id
     * -------------------------------------------------------------------------
     */

    async deleteFile(
        fileId: string,
    ): Promise<DeleteFileResult> {
        const response =
            await apiClient<
                ApiResponse<DeleteFileResult>
            >(
                `/files/${encodeURIComponent(fileId)}`,
                {
                    method: "DELETE",
                },
            );

        console.log(
            "[FilesService] Delete file response:",
            response,
        );

        return response.data;
    }
}

/**
 * -----------------------------------------------------------------------------
 * Service Instance
 * -----------------------------------------------------------------------------
 */

export const filesService =
    new FilesService();