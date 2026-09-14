/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/projects/useProjectActivity.ts
 * -----------------------------------------------------------------------------
 * Brika Project Activity Hook
 *
 * Handles loading project activity and pagination state.
 * -----------------------------------------------------------------------------
 */

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import projectService from "@/services/projects/project.service";

import type {
    ProjectActivity,
    ProjectsPagination,
} from "@/types/project.types";

interface UseProjectActivityResult {
    activities: ProjectActivity[];

    pagination: ProjectsPagination | null;

    isLoading: boolean;

    isRefreshing: boolean;

    error: Error | null;

    refetch: () => Promise<void>;

    refresh: () => Promise<void>;
}

export function useProjectActivity(
    projectId?: string,
    options?: {
        page?: number;
        limit?: number;
    },
): UseProjectActivityResult {
    const [activities, setActivities] =
        useState<ProjectActivity[]>([]);

    const [pagination, setPagination] =
        useState<ProjectsPagination | null>(null);

    const [isLoading, setIsLoading] =
        useState(Boolean(projectId));

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [error, setError] =
        useState<Error | null>(null);

    const page = options?.page;

    const limit = options?.limit;

    const fetchActivity = useCallback(
        async (refresh = false) => {
            if (!projectId) {
                setActivities([]);
                setPagination(null);
                setIsLoading(false);
                return;
            }

            try {
                if (refresh) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                setError(null);

                const response =
                    await projectService.getProjectActivity(
                        projectId,
                        {
                            page,
                            limit,
                        },
                    );

                setActivities(response.data);

                setPagination({
                    page: response.page,
                    limit: response.limit,
                    total: response.total,
                    totalPages: response.totalPages,
                });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to load project activity.",
                        ),
                );
            } finally {
                setIsLoading(false);

                setIsRefreshing(false);
            }
        },
        [projectId, page, limit],
    );

    const refetch = useCallback(
        async () => {
            await fetchActivity(false);
        },
        [fetchActivity],
    );

    const refresh = useCallback(
        async () => {
            await fetchActivity(true);
        },
        [fetchActivity],
    );

    useEffect(() => {
        void fetchActivity();
    }, [fetchActivity]);

    return {
        activities,
        pagination,
        isLoading,
        isRefreshing,
        error,
        refetch,
        refresh,
    };
}

export default useProjectActivity;