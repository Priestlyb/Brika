/**

* ---
* File: src/hooks/projects/useProject.ts
* ---
* Brika Single Project Hook
*
* Handles fetching and mutating a single project.
*
* Responsibilities:
*
* * Fetch a single project.
* * Create a project.
* * Update a project.
* * Delete a project.
* * Archive a project.
* * Restore a project.
* * Store the current project.
* * Store loading state.
* * Store mutation state.
* * Store normalized errors.
*
* This hook does NOT:
*
* * Render UI.
* * Perform navigation.
* * Manage project form state.
* ---

*/

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import projectService from "@/services/projects/project.service";

import type {
    CreateProjectInput,
    Project,
    UpdateProjectInput,
} from "@/types/project.types";

/**

* ---
* Hook Result
* ---

*/

interface UseProjectResult {
    /**
    * Currently-loaded project.
    */
    project: Project | null;


    /**
     * Whether the project is being loaded.
     */
    isLoading: boolean;

    /**
     * Whether a project mutation is currently running.
     */
    isMutating: boolean;

    /**
     * Most recent project error.
     */
    error: Error | null;

    /**
     * Reload the current project.
     */
    refetch: () => Promise<void>;

    /**
     * Create a new project.
     *
     * Always resolves with the created Project.
     */
    create: (
        data: CreateProjectInput,
    ) => Promise<Project>;

    /**
     * Update the current project.
     *
     * Always resolves with the updated Project.
     */
    update: (
        data: UpdateProjectInput,
    ) => Promise<Project>;

    /**
     * Delete the current project.
     *
     * Always resolves with the backend success message.
     */
    remove: () => Promise<string>;

    /**
     * Archive the current project.
     *
     * Always resolves with the archived Project.
     */
    archive: () => Promise<Project>;

    /**
     * Restore the current project.
     *
     * Always resolves with the restored Project.
     */
    restore: () => Promise<Project>;

}

/**

* ---
* Hook
* ---

*/

export function useProject(
    projectId?: string,
): UseProjectResult {
    /**
    * -------------------------------------------------------------------------
    * Project State
    * -------------------------------------------------------------------------
    */


    const [project, setProject] =
        useState<Project | null>(null);

    /**
     * -------------------------------------------------------------------------
     * Loading State
     * -------------------------------------------------------------------------
     */

    const [isLoading, setIsLoading] =
        useState(Boolean(projectId));

    /**
     * -------------------------------------------------------------------------
     * Mutation State
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
     * Refetch
     * -------------------------------------------------------------------------
     *
     * Fetches the current project from the backend.
     *
     * The project service unwraps the API response envelope and returns the
     * Project directly.
     */

    const refetch = useCallback(
        async (): Promise<void> => {
            /**
             * No project ID means this hook is being used for a mutation-only
             * operation such as project creation.
             */
            if (!projectId) {
                setProject(null);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                /**
                 * `getProject()` returns Project directly.
                 *
                 * It does NOT return:
                 *
                 * {
                 *     project: Project
                 * }
                 */
                const response =
                    await projectService.getProject(
                        projectId,
                    );

                /**
                 * Store the returned Project.
                 */
                setProject(response);
            } catch (err) {
                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to load project.",
                        );

                setError(normalizedError);
            } finally {
                setIsLoading(false);
            }
        },
        [projectId],
    );

    /**
     * -------------------------------------------------------------------------
     * Create
     * -------------------------------------------------------------------------
     */

    const create = useCallback(
        async (
            data: CreateProjectInput,
        ): Promise<Project> => {
            try {
                setIsMutating(true);
                setError(null);

                /**
                 * `createProject()` returns the created Project directly.
                 */
                const response =
                    await projectService.createProject(
                        data,
                    );

                /**
                 * Store the newly-created project locally.
                 */
                setProject(response);

                /**
                 * Return the actual Project to the caller.
                 *
                 * This allows create.tsx to safely use:
                 *
                 *     project.id
                 *     project.name
                 */
                return response;
            } catch (err) {
                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to create project.",
                        );

                setError(normalizedError);

                throw normalizedError;
            } finally {
                setIsMutating(false);
            }
        },
        [],
    );

    /**
     * -------------------------------------------------------------------------
     * Update
     * -------------------------------------------------------------------------
     *
     * PATCH /projects/:projectId
     *
     * Updates the current project.
     */

    const update = useCallback(
        async (
            data: UpdateProjectInput,
        ): Promise<Project> => {
            /**
             * A project ID is required when updating a project.
             */
            if (!projectId) {
                const normalizedError =
                    new Error(
                        "Project ID is required.",
                    );

                setError(normalizedError);

                throw normalizedError;
            }

            try {
                setIsMutating(true);
                setError(null);

                /**
                 * `updateProject()` returns the updated Project directly.
                 */
                const response =
                    await projectService.updateProject(
                        projectId,
                        data,
                    );

                /**
                 * Update local project state.
                 */
                setProject(response);

                return response;
            } catch (err) {
                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to update project.",
                        );

                setError(normalizedError);

                throw normalizedError;
            } finally {
                setIsMutating(false);
            }
        },
        [projectId],
    );

    /**
     * -------------------------------------------------------------------------
     * Delete
     * -------------------------------------------------------------------------
     *
     * DELETE /projects/:projectId
     *
     * Deletes the current project.
     *
     * The project service returns the backend response message rather than a
     * project payload.
     */

    const remove = useCallback(
        async (): Promise<string> => {
            /**
             * A project ID is required when deleting a project.
             */
            if (!projectId) {
                const normalizedError =
                    new Error(
                        "Project ID is required.",
                    );

                setError(normalizedError);

                throw normalizedError;
            }

            try {
                setIsMutating(true);
                setError(null);

                /**
                 * `deleteProject()` returns the backend success message.
                 */
                const response =
                    await projectService.deleteProject(
                        projectId,
                    );

                /**
                 * The project no longer exists on the backend.
                 *
                 * Clear the local project state so consumers cannot continue
                 * displaying the deleted project as if it were still active.
                 */
                setProject(null);

                return response;
            } catch (err) {
                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to delete project.",
                        );

                setError(normalizedError);

                throw normalizedError;
            } finally {
                setIsMutating(false);
            }
        },
        [projectId],
    );

    /**
     * -------------------------------------------------------------------------
     * Archive
     * -------------------------------------------------------------------------
     */

    const archive = useCallback(
        async (): Promise<Project> => {
            /**
             * A project ID is required when archiving a project.
             */
            if (!projectId) {
                const normalizedError =
                    new Error(
                        "Project ID is required.",
                    );

                setError(normalizedError);

                throw normalizedError;
            }

            try {
                setIsMutating(true);
                setError(null);

                /**
                 * `archiveProject()` returns the archived Project directly.
                 */
                const response =
                    await projectService.archiveProject(
                        projectId,
                    );

                /**
                 * Update local project state.
                 */
                setProject(response);

                return response;
            } catch (err) {
                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to archive project.",
                        );

                setError(normalizedError);

                throw normalizedError;
            } finally {
                setIsMutating(false);
            }
        },
        [projectId],
    );

    /**
     * -------------------------------------------------------------------------
     * Restore
     * -------------------------------------------------------------------------
     */

    const restore = useCallback(
        async (): Promise<Project> => {
            /**
             * A project ID is required when restoring a project.
             */
            if (!projectId) {
                const normalizedError =
                    new Error(
                        "Project ID is required.",
                    );

                setError(normalizedError);

                throw normalizedError;
            }

            try {
                setIsMutating(true);
                setError(null);

                /**
                 * `restoreProject()` returns the restored Project directly.
                 */
                const response =
                    await projectService.restoreProject(
                        projectId,
                    );

                /**
                 * Update local project state.
                 */
                setProject(response);

                return response;
            } catch (err) {
                const normalizedError =
                    err instanceof Error
                        ? err
                        : new Error(
                            "Failed to restore project.",
                        );

                setError(normalizedError);

                throw normalizedError;
            } finally {
                setIsMutating(false);
            }
        },
        [projectId],
    );

    /**
     * -------------------------------------------------------------------------
     * Initial Project Fetch
     * -------------------------------------------------------------------------
     *
     * Fetch the project when:
     *
     * - The hook mounts.
     * - The project ID changes.
     */

    useEffect(() => {
        void refetch();
    }, [refetch]);

    /**
     * -------------------------------------------------------------------------
     * Return
     * -------------------------------------------------------------------------
     */

    return {
        project,
        isLoading,
        isMutating,
        error,
        refetch,
        create,
        update,
        remove,
        archive,
        restore,
    };

}

export default useProject;
