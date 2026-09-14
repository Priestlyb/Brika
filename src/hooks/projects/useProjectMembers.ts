/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/projects/useProjectMembers.ts
 * -----------------------------------------------------------------------------
 * Brika Project Members Hook
 *
 * Responsibilities:
 *
 * - Fetch project members.
 * - Expose loading state.
 * - Expose refreshing state.
 * - Expose API errors.
 * - Support refetching.
 * - Support pull-to-refresh.
 *
 * The hook intentionally delegates HTTP communication to the project service.
 * -----------------------------------------------------------------------------
 */

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import projectService from "@/services/projects/project.service";

import type {
    ProjectMember,
    ProjectsPagination,
} from "@/types/project.types";

/**
 * -----------------------------------------------------------------------------
 * Hook Result
 * -----------------------------------------------------------------------------
 */

interface UseProjectMembersResult {
    members: ProjectMember[];

    pagination: ProjectsPagination | null;

    isLoading: boolean;

    isRefreshing: boolean;

    error: Error | null;

    refetch: () => Promise<void>;

    refresh: () => Promise<void>;
}

/**
 * -----------------------------------------------------------------------------
 * Hook
 * -----------------------------------------------------------------------------
 */

export function useProjectMembers(
    projectId?: string,
): UseProjectMembersResult {
    const [members, setMembers] =
        useState<ProjectMember[]>([]);

    const [pagination, setPagination] =
        useState<ProjectsPagination | null>(null);

    const [isLoading, setIsLoading] =
        useState(Boolean(projectId));

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [error, setError] =
        useState<Error | null>(null);

    /**
     * -------------------------------------------------------------------------
     * Fetch Members
     * -------------------------------------------------------------------------
     */

    const fetchMembers = useCallback(
        async (refresh = false) => {
            /**
             * -----------------------------------------------------------------
             * Validate Project ID
             * -----------------------------------------------------------------
             */

            if (!projectId) {
                setMembers([]);

                setPagination(null);

                setIsLoading(false);

                setIsRefreshing(false);

                setError(null);

                return;
            }

            try {
                /**
                 * -------------------------------------------------------------
                 * Loading State
                 * -------------------------------------------------------------
                 */

                if (refresh) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                setError(null);

                /**
                 * -------------------------------------------------------------
                 * Fetch Members
                 * -------------------------------------------------------------
                 *
                 * The project service returns the backend pagination object:
                 *
                 * {
                 *     data: [...members],
                 *     page: 1,
                 *     limit: 20,
                 *     total: 2,
                 *     totalPages: 1
                 * }
                 * -------------------------------------------------------------
                 */

                const response =
                    await projectService.getProjectMembers(
                        projectId,
                    );

                /**
                 * -------------------------------------------------------------
                 * Members
                 * -------------------------------------------------------------
                 *
                 * `data` contains the actual project member records.
                 *
                 * Do not use `response.members` here because the backend
                 * pagination contract uses `data`.
                 * -------------------------------------------------------------
                 */

                setMembers(
                    Array.isArray(response?.data)
                        ? response.data
                        : [],
                );

                /**
                 * -------------------------------------------------------------
                 * Pagination
                 * -------------------------------------------------------------
                 *
                 * The backend returns pagination fields directly on the
                 * response rather than inside a `pagination` object.
                 * -------------------------------------------------------------
                 */

                setPagination({
                    page:
                        response?.page ?? 1,

                    limit:
                        response?.limit ?? 0,

                    total:
                        response?.total ?? 0,

                    totalPages:
                        response?.totalPages ?? 0,
                });
            } catch (err) {
                /**
                 * -------------------------------------------------------------
                 * Error State
                 * -------------------------------------------------------------
                 */

                setMembers([]);

                setPagination(null);

                setError(
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to load project members.",
                        ),
                );
            } finally {
                /**
                 * -------------------------------------------------------------
                 * Loading Cleanup
                 * -------------------------------------------------------------
                 */

                setIsLoading(false);

                setIsRefreshing(false);
            }
        },
        [projectId],
    );

    /**
     * -----------------------------------------------------------------------------
     * Refetch
     * -----------------------------------------------------------------------------
     *
     * Performs a normal member fetch.
     */

    const refetch = useCallback(
        async () => {
            await fetchMembers(false);
        },
        [fetchMembers],
    );

    /**
     * -----------------------------------------------------------------------------
     * Refresh
     * -----------------------------------------------------------------------------
     *
     * Performs a refresh fetch, allowing the UI to display its refreshing state.
     */

    const refresh = useCallback(
        async () => {
            await fetchMembers(true);
        },
        [fetchMembers],
    );

    /**
     * -----------------------------------------------------------------------------
     * Initial Fetch
     * -----------------------------------------------------------------------------
     */

    useEffect(() => {
        void fetchMembers();
    }, [fetchMembers]);

    /**
     * -----------------------------------------------------------------------------
     * Result
     * -----------------------------------------------------------------------------
     */

    return {
        members,

        pagination,

        isLoading,

        isRefreshing,

        error,

        refetch,

        refresh,
    };
}

export default useProjectMembers;