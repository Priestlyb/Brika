/**
 * -----------------------------------------------------------------------------
 * File: src/services/generation/generation.service.ts
 * -----------------------------------------------------------------------------
 * Brika — Frontend Generation Service
 *
 * Responsibilities:
 *
 * - Start 3D generation for a READY PlanFile.
 * - Retrieve generation status.
 * - Keep generation API communication centralized.
 *
 * Architecture:
 *
 * Project Files Screen
 *       ↓
 * useGeneration / useGenerationStatus
 *       ↓
 * generationService
 *       ↓
 * Brika Generation API
 *       ↓
 * Backend GenerationService
 *       ↓
 * BullMQ → Generation Worker
 * -----------------------------------------------------------------------------
 */

import { apiClient } from "@/services/api/client";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type GenerationStatus =
    | "QUEUED"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";

export interface GenerationOptions {
    wallHeight?: number;
    wallThickness?: number;
    doorHeight?: number;
    doorWidth?: number;
    generateRoof?: boolean;
    generateDoorOpenings?: boolean;
    generateInterior?: boolean;
    preserveLayers?: boolean;
    optimizeMesh?: boolean;
}

export interface StartGenerationInput {
    projectId: string;
    planFileId: string;
    options?: GenerationOptions;
}

export interface StartGenerationResult {
    /**
     * Frontend-facing generation identifier.
     *
     * Backend currently calls this value `jobId`.
     */
    generationId: string;

    status: GenerationStatus;

    projectId: string;

    planFileId: string;

    /**
     * Backend returns whether the job was actually queued.
     *
     * This is optional for backwards compatibility with older responses.
     */
    queued?: boolean;
}

export interface GenerationStatistics {
    meshCount?: number;
    vertexCount?: number;
    triangleCount?: number;
    entityCount?: number;
    wallCount?: number;
    roomCount?: number;
    doorCount?: number;
    outputSize?: number;
}

export interface GenerationStatusResult {
    /**
     * Frontend-facing generation identifier.
     *
     * Backend may return this as either `jobId` or `generationId`.
     */
    generationId: string;

    status: GenerationStatus;

    projectId?: string;

    planFileId?: string;

    /**
     * Backend versions may expose either `progress` or `percentage`.
     *
     * Keep both so the frontend remains compatible while the backend
     * generation contract is being finalized.
     */
    progress?: number;

    percentage?: number;

    stage?: string;

    message?: string;

    modelId?: string;

    versionId?: string;

    storageKey?: string;

    thumbnailKey?: string;

    statistics?: GenerationStatistics;

    error?: string;

    startedAt?: string;

    completedAt?: string;

    createdAt?: string;
}

/**
 * -----------------------------------------------------------------------------
 * API Response Types
 * -----------------------------------------------------------------------------
 */

interface ApiResponse<T> {
    success?: boolean;

    message?: string;

    data?: T;
}

interface GenerationPayload {
    /**
     * Current backend identifier.
     */
    jobId?: string;

    /**
     * Legacy/frontend-compatible identifier.
     */
    generationId?: string;

    status?: GenerationStatus | string;

    projectId?: string;

    planFileId?: string;

    progress?: number;

    percentage?: number;

    stage?: string;

    message?: string;

    modelId?: string;

    versionId?: string;

    storageKey?: string;

    thumbnailKey?: string;

    statistics?: GenerationStatistics;

    error?: string;

    startedAt?: string;

    completedAt?: string;

    createdAt?: string;

    /**
     * Backend returns this when generation is started.
     */
    queued?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

/**
 * Check whether a value is a valid frontend generation status.
 */
function isGenerationStatus(
    value: unknown,
): value is GenerationStatus {
    return (
        value === "QUEUED" ||
        value === "PROCESSING" ||
        value === "COMPLETED" ||
        value === "FAILED" ||
        value === "CANCELLED"
    );
}

/**
 * Normalize the backend generation status.
 */
function normalizeGenerationStatus(
    value: unknown,
): GenerationStatus {
    if (isGenerationStatus(value)) {
        return value;
    }

    throw new Error(
        `Invalid generation status returned by the server: ${String(value)}`,
    );
}

/**
 * -----------------------------------------------------------------------------
 * Generation ID Normalization
 * -----------------------------------------------------------------------------
 *
 * Backend currently returns:
 *
 * {
 *     jobId: "generation-..."
 * }
 *
 * Older/frontend-compatible responses may return:
 *
 * {
 *     generationId: "generation-..."
 * }
 *
 * The frontend consistently exposes the value as `generationId`.
 * -----------------------------------------------------------------------------
 */

function normalizeGenerationId(
    payload: GenerationPayload,
    fallbackGenerationId?: string,
): string {
    const generationId =
        payload.jobId ??
        payload.generationId ??
        fallbackGenerationId;

    if (!generationId?.trim()) {
        throw new Error(
            "The server did not return a generation ID.",
        );
    }

    return generationId;
}

/**
 * -----------------------------------------------------------------------------
 * Start Generation Response Normalization
 * -----------------------------------------------------------------------------
 */

function normalizeStartGenerationResponse(
    payload: GenerationPayload,
): StartGenerationResult {
    /**
     * Resolve backend `jobId` into frontend `generationId`.
     */
    const generationId =
        normalizeGenerationId(payload);

    if (!payload.projectId) {
        throw new Error(
            "The server did not return the generation project ID.",
        );
    }

    if (!payload.planFileId) {
        throw new Error(
            "The server did not return the generation PlanFile ID.",
        );
    }

    return {
        generationId,

        status: normalizeGenerationStatus(
            payload.status ?? "QUEUED",
        ),

        projectId: payload.projectId,

        planFileId: payload.planFileId,

        queued: payload.queued,
    };
}

/**
 * -----------------------------------------------------------------------------
 * Generation Status Response Normalization
 * -----------------------------------------------------------------------------
 */

function normalizeGenerationStatusResponse(
    payload: GenerationPayload,
    fallbackGenerationId?: string,
): GenerationStatusResult {
    /**
     * Resolve backend `jobId` into frontend `generationId`.
     *
     * The fallback is the ID used in the GET request. This makes polling
     * resilient if the backend status response does not repeat the ID.
     */
    const generationId =
        normalizeGenerationId(
            payload,
            fallbackGenerationId,
        );

    if (!payload.status) {
        throw new Error(
            "The server did not return a generation status.",
        );
    }

    return {
        generationId,

        status: normalizeGenerationStatus(
            payload.status,
        ),

        projectId: payload.projectId,

        planFileId: payload.planFileId,

        progress: payload.progress,

        percentage: payload.percentage,

        stage: payload.stage,

        message: payload.message,

        modelId: payload.modelId,

        versionId: payload.versionId,

        storageKey: payload.storageKey,

        thumbnailKey: payload.thumbnailKey,

        statistics: payload.statistics,

        error: payload.error,

        startedAt: payload.startedAt,

        completedAt: payload.completedAt,

        createdAt: payload.createdAt,
    };
}

/**
 * -----------------------------------------------------------------------------
 * Error Handling
 * -----------------------------------------------------------------------------
 */

function getApiErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

/**
 * -----------------------------------------------------------------------------
 * Start Generation
 * -----------------------------------------------------------------------------
 *
 * Backend:
 *
 * POST /api/v1/generation
 *
 * Request:
 *
 * {
 *   projectId,
 *   planFileId,
 *   options
 * }
 *
 * Backend response:
 *
 * {
 *   success: true,
 *   message: "...",
 *   data: {
 *     jobId: "generation-...",
 *     projectId: "...",
 *     planFileId: "...",
 *     status: "PROCESSING",
 *     progress: 0,
 *     queued: false
 *   }
 * }
 *
 * IMPORTANT:
 *
 * The frontend does NOT send:
 *
 * - userId
 * - inputPath
 * - filePath
 * - storageKey
 * - originalFilename
 *
 * Those values are resolved by the backend.
 * -----------------------------------------------------------------------------
 */

async function startGeneration(
    input: StartGenerationInput,
): Promise<StartGenerationResult> {
    if (!input.projectId?.trim()) {
        throw new Error(
            "A project ID is required.",
        );
    }

    if (!input.planFileId?.trim()) {
        throw new Error(
            "A PlanFile ID is required.",
        );
    }

    try {
        const response =
            await apiClient<
                ApiResponse<GenerationPayload>
            >(
                "/generation",
                {
                    method: "POST",

                    body: JSON.stringify({
                        projectId: input.projectId,

                        planFileId: input.planFileId,

                        ...(input.options
                            ? {
                                options: input.options,
                            }
                            : {}),
                    }),
                },
            );

        const payload = response?.data;

        if (!payload) {
            throw new Error(
                response?.message ??
                "The generation job could not be started.",
            );
        }

        return normalizeStartGenerationResponse(
            payload,
        );
    } catch (error) {
        throw new Error(
            getApiErrorMessage(
                error,
                "The 3D generation job could not be started.",
            ),
        );
    }
}

/**
 * -----------------------------------------------------------------------------
 * Get Generation Status
 * -----------------------------------------------------------------------------
 *
 * Backend:
 *
 * GET /api/v1/generation/:jobId
 *
 * The frontend continues to call the value `generationId`.
 * -----------------------------------------------------------------------------
 */

async function getGenerationStatus(
    generationId: string,
): Promise<GenerationStatusResult> {
    if (!generationId?.trim()) {
        throw new Error(
            "A generation ID is required.",
        );
    }

    try {
        const response =
            await apiClient<
                ApiResponse<GenerationPayload>
            >(
                `/generation/${encodeURIComponent(
                    generationId,
                )}`,
                {
                    method: "GET",
                },
            );

        const payload = response?.data;

        if (!payload) {
            throw new Error(
                response?.message ??
                "Generation status could not be retrieved.",
            );
        }

        return normalizeGenerationStatusResponse(
            payload,
            generationId,
        );
    } catch (error) {
        throw new Error(
            getApiErrorMessage(
                error,
                "Generation status could not be retrieved.",
            ),
        );
    }
}

/**
 * -----------------------------------------------------------------------------
 * Service
 * -----------------------------------------------------------------------------
 */

export const generationService = {
    startGeneration,

    getGenerationStatus,
};

export default generationService;