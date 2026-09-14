/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/projects/useProjects.ts
 * -----------------------------------------------------------------------------
 * Brika Projects Hook
 *
 * Handles fetching and managing the authenticated user's project list.
 *
 * Responsibilities:
 *
 * - Fetch the authenticated user's projects.
 * - Store the project list.
 * - Store pagination information.
 * - Handle initial loading state.
 * - Handle refresh state.
 * - Handle project archive/restore mutations.
 * - Refresh the project list after successful mutations.
 * - Handle API errors.
 * - Guarantee that `projects` is always an array.
 *
 * This hook does NOT:
 *
 * - Render UI.
 * - Perform navigation.
 * - Contain project presentation logic.
 * - Manage project form state.
 * - Directly implement API requests.
 * -----------------------------------------------------------------------------
 */

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import projectService from "@/services/projects/project.service";

import type {
    GetProjectsParams,
    Project,
    ProjectsPagination,
} from "@/types/project.types";

/**
 * -----------------------------------------------------------------------------
 * API Response Shape
 * -----------------------------------------------------------------------------
 *
 * The backend currently returns projects in this shape:
 *
 * {
 *     data: Project[],
 *     page: number,
 *     limit: number,
 *     total: number,
 *     totalPages: number
 * }
 *
 * This is intentionally normalized inside the hook so consuming components
 * do not need to know the exact API response structure.
 * -----------------------------------------------------------------------------
 */

interface ProjectsApiResponse {
    data: Project[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * -----------------------------------------------------------------------------
 * Hook Result
 * -----------------------------------------------------------------------------
 */

interface UseProjectsResult {
    /**
     * The authenticated user's projects.
     *
     * This is always an array.
     */
    projects: Project[];

    /**
     * Pagination information returned by the API.
     */
    pagination: ProjectsPagination | null;

    /**
     * Whether the initial project request is loading.
     */
    isLoading: boolean;

    /**
     * Whether a refresh request is currently running.
     */
    isRefreshing: boolean;

    /**
     * Whether an archive or restore mutation is currently running.
     */
    isMutating: boolean;

    /**
     * Most recent request error.
     */
    error: Error | null;

    /**
     * Re-fetch projects.
     */
    refetch: () => Promise<void>;

    /**
     * Refresh projects.
     */
    refresh: () => Promise<void>;

    /**
     * Archive a project and refresh the project list.
     */
    archiveProject: (
        projectId: string,
    ) => Promise<void>;

    /**
     * Restore a project and refresh the project list.
     */
    restoreProject: (
        projectId: string,
    ) => Promise<void>;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function useProjects(
    params?: GetProjectsParams,
): UseProjectsResult {
    /**
     * -------------------------------------------------------------------------
     * Project State
     * -------------------------------------------------------------------------
     *
     * Always initialize projects as an empty array.
     *
     * Consuming components can safely use:
     *
     *     projects.length
     *     projects.map(...)
     *     projects.filter(...)
     * -------------------------------------------------------------------------
     */

    const [projects, setProjects] =
        useState<Project[]>([]);

    /**
     * -------------------------------------------------------------------------
     * Pagination State
     * -------------------------------------------------------------------------
     */

    const [pagination, setPagination] =
        useState<ProjectsPagination | null>(
            null,
        );

    /**
     * -------------------------------------------------------------------------
     * Loading State
     * -------------------------------------------------------------------------
     */

    const [isLoading, setIsLoading] =
        useState(true);

    /**
     * -------------------------------------------------------------------------
     * Refreshing State
     * -------------------------------------------------------------------------
     */

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    /**
     * -------------------------------------------------------------------------
     * Mutation State
     * -------------------------------------------------------------------------
     *
     * Used by archive/restore operations.
     *
     * This is intentionally kept at the hook level so the UI can disable
     * relevant controls while a mutation is running.
     * -------------------------------------------------------------------------
     */

    const [isMutating, setIsMutating] =
        useState(false);

    /**
     * -------------------------------------------------------------------------
     * Error State
     * -------------------------------------------------------------------------
     */

    const [error, setError] =
        useState<Error | null>(null);

    /**
     * -------------------------------------------------------------------------
     * Fetch Projects
     * -------------------------------------------------------------------------
     */

    const fetchProjects = useCallback(
        async (
            refresh = false,
        ): Promise<void> => {
            try {
                /**
                 * -------------------------------------------------------------
                 * Request State
                 * -------------------------------------------------------------
                 */

                if (refresh) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                /**
                 * -------------------------------------------------------------
                 * Clear Previous Error
                 * -------------------------------------------------------------
                 */

                setError(null);

                /**
                 * -------------------------------------------------------------
                 * API Request
                 * -------------------------------------------------------------
                 */

                const response =
                    await projectService.getProjects(
                        params,
                    );

                /**
                 * -------------------------------------------------------------
                 * Development Diagnostic
                 * -------------------------------------------------------------
                 */

                if (__DEV__) {
                    console.log(
                        "📦 useProjects API Response:",
                        response,
                    );
                }

                /**
                 * -------------------------------------------------------------
                 * Normalize API Response
                 * -------------------------------------------------------------
                 */

                const apiResponse =
                    response as unknown as Partial<ProjectsApiResponse>;

                /**
                 * -------------------------------------------------------------
                 * Project Data
                 * -------------------------------------------------------------
                 */

                const nextProjects =
                    Array.isArray(apiResponse.data)
                        ? apiResponse.data
                        : [];

                /**
                 * -------------------------------------------------------------
                 * Pagination
                 * -------------------------------------------------------------
                 */

                const hasPagination =
                    typeof apiResponse.page === "number" &&
                    typeof apiResponse.limit === "number" &&
                    typeof apiResponse.total === "number" &&
                    typeof apiResponse.totalPages === "number";

                const nextPagination:
                    ProjectsPagination | null =
                    hasPagination
                        ? {
                            page: apiResponse.page!,
                            limit: apiResponse.limit!,
                            total: apiResponse.total!,
                            totalPages:
                                apiResponse.totalPages!,
                        }
                        : null;

                /**
                 * -------------------------------------------------------------
                 * Update State
                 * -------------------------------------------------------------
                 */

                setProjects(nextProjects);

                setPagination(
                    nextPagination,
                );

                /**
                 * -------------------------------------------------------------
                 * Development Diagnostics
                 * -------------------------------------------------------------
                 */

                if (
                    !Array.isArray(
                        apiResponse.data,
                    )
                ) {
                    console.warn(
                        "useProjects: Expected response.data to be an array.",
                        response,
                    );
                }

                if (
                    !hasPagination &&
                    apiResponse.data !== undefined
                ) {
                    console.warn(
                        "useProjects: API response is missing valid pagination fields.",
                        response,
                    );
                }
            } catch (err) {
                /**
                 * -------------------------------------------------------------
                 * Normalize Error
                 * -------------------------------------------------------------
                 */

                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to load projects.",
                        );

                /**
                 * -------------------------------------------------------------
                 * Store Error
                 * -------------------------------------------------------------
                 */

                setError(
                    normalizedError,
                );

                /**
                 * -------------------------------------------------------------
                 * Safe Error State
                 * -------------------------------------------------------------
                 *
                 * Keep the project state predictable after a failed request.
                 * -------------------------------------------------------------
                 */

                setProjects([]);

                setPagination(null);
            } finally {
                /**
                 * -------------------------------------------------------------
                 * Reset Request State
                 * -------------------------------------------------------------
                 */

                setIsLoading(false);

                setIsRefreshing(false);
            }
        },
        [params],
    );

    /**
     * -----------------------------------------------------------------------------
     * Refetch
     * -----------------------------------------------------------------------------
     *
     * Performs a normal project fetch.
     * -----------------------------------------------------------------------------
     */

    const refetch = useCallback(
        async (): Promise<void> => {
            await fetchProjects(false);
        },
        [fetchProjects],
    );

    /**
     * -----------------------------------------------------------------------------
     * Refresh
     * -----------------------------------------------------------------------------
     *
     * Performs a refresh request.
     * -----------------------------------------------------------------------------
     */

    const refresh = useCallback(
        async (): Promise<void> => {
            await fetchProjects(true);
        },
        [fetchProjects],
    );

    /**
     * -----------------------------------------------------------------------------
     * Archive Project
     * -----------------------------------------------------------------------------
     *
     * Delegates the mutation to the project service.
     *
     * The hook then refreshes the project list so the archived project is
     * removed from the active list and becomes available through the archived
     * filter/list.
     * -----------------------------------------------------------------------------
     */

    const archiveProject = useCallback(
        async (
            projectId: string,
        ): Promise<void> => {
            if (!projectId) {
                throw new Error(
                    "Project ID is required.",
                );
            }

            try {
                /**
                 * -------------------------------------------------------------
                 * Mutation State
                 * -------------------------------------------------------------
                 */

                setIsMutating(true);

                /**
                 * -------------------------------------------------------------
                 * Clear Previous Error
                 * -------------------------------------------------------------
                 */

                setError(null);

                /**
                 * -------------------------------------------------------------
                 * Archive Request
                 * -------------------------------------------------------------
                 */

                await projectService.archiveProject(
                    projectId,
                );

                /**
                 * -------------------------------------------------------------
                 * Refresh Project List
                 * -------------------------------------------------------------
                 *
                 * Use a refresh rather than a normal loading request so the
                 * existing project list remains visible while the updated
                 * list is fetched.
                 * -------------------------------------------------------------
                 */

                await fetchProjects(true);
            } catch (err) {
                /**
                 * -------------------------------------------------------------
                 * Normalize Error
                 * -------------------------------------------------------------
                 */

                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to archive project.",
                        );

                /**
                 * -------------------------------------------------------------
                 * Store Error
                 * -------------------------------------------------------------
                 */

                setError(
                    normalizedError,
                );

                throw normalizedError;
            } finally {
                /**
                 * -------------------------------------------------------------
                 * Reset Mutation State
                 * -------------------------------------------------------------
                 */

                setIsMutating(false);
            }
        },
        [fetchProjects],
    );

    /**
     * -----------------------------------------------------------------------------
     * Restore Project
     * -----------------------------------------------------------------------------
     *
     * Delegates the mutation to the project service.
     *
     * The hook then refreshes the project list so the restored project reflects
     * its new ACTIVE status.
     * -----------------------------------------------------------------------------
     */

    const restoreProject = useCallback(
        async (
            projectId: string,
        ): Promise<void> => {
            if (!projectId) {
                throw new Error(
                    "Project ID is required.",
                );
            }

            try {
                /**
                 * -------------------------------------------------------------
                 * Mutation State
                 * -------------------------------------------------------------
                 */

                setIsMutating(true);

                /**
                 * -------------------------------------------------------------
                 * Clear Previous Error
                 * -------------------------------------------------------------
                 */

                setError(null);

                /**
                 * -------------------------------------------------------------
                 * Restore Request
                 * -------------------------------------------------------------
                 */

                await projectService.restoreProject(
                    projectId,
                );

                /**
                 * -------------------------------------------------------------
                 * Refresh Project List
                 * -------------------------------------------------------------
                 */

                await fetchProjects(true);
            } catch (err) {
                /**
                 * -------------------------------------------------------------
                 * Normalize Error
                 * -------------------------------------------------------------
                 */

                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to restore project.",
                        );

                /**
                 * -------------------------------------------------------------
                 * Store Error
                 * -------------------------------------------------------------
                 */

                setError(
                    normalizedError,
                );

                throw normalizedError;
            } finally {
                /**
                 * -------------------------------------------------------------
                 * Reset Mutation State
                 * -------------------------------------------------------------
                 */

                setIsMutating(false);
            }
        },
        [fetchProjects],
    );

    /**
     * -----------------------------------------------------------------------------
     * Initial Fetch
     * -----------------------------------------------------------------------------
     *
     * Fetch projects whenever the hook's request parameters change.
     * -----------------------------------------------------------------------------
     */

    useEffect(() => {
        void fetchProjects();
    }, [fetchProjects]);

    /**
     * -----------------------------------------------------------------------------
     * Return
     * -----------------------------------------------------------------------------
     */

    return {
        projects,
        pagination,
        isLoading,
        isRefreshing,
        isMutating,
        error,
        refetch,
        refresh,
        archiveProject,
        restoreProject,
    };
}

/**
 * -----------------------------------------------------------------------------
 * Default Export
 * -----------------------------------------------------------------------------
 */

export default useProjects;