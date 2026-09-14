/**
 * -----------------------------------------------------------------------------
 * File: src/services/projects/project.service.ts
 * ------ProjectStats -----------------------------------------------------------------------
 * Brika Project API Service
 *
 * Handles HTTP communication between the frontend Projects feature and the
 * Brika backend Project API.
 *
 * Responsibilities:
 *
 * - Fetch projects
 * - Fetch project dashboard
 * - Fetch a single project
 * - Create projects
 * - Update projects
 * - Delete projects
 * - Archive projects
 * - Restore projects
 * - Fetch project members
 * - Invite project members
 * - Update project member roles
 * - Remove project members
 * - Transfer project ownership
 * - Leave projects
 * - Fetch project statistics
 * - Fetch project activity
 *
 * This service does NOT contain:
 *
 * - React state
 * - Navigation
 * - UI logic
 * - Form state
 * -----------------------------------------------------------------------------
 */

import { apiClient } from "@/services/api/client";

import type {
    CreateProjectInput,
    GetProjectsParams,
    InviteProjectMemberInput,
    Project,
    ProjectActivityResponse,
    ProjectMember,
    ProjectMembersResponse,
    ProjectResponse,
    ProjectsResponse,
    UpdateProjectInput,
    UpdateProjectMemberRoleInput,
} from "@/types/project.types";

/**
 * -----------------------------------------------------------------------------
 * API Response Envelope
 * -----------------------------------------------------------------------------
 */

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * -----------------------------------------------------------------------------
 * Project Stats
 * -----------------------------------------------------------------------------
 */

export interface ProjectStats {
    projectId: string;
    name: string;
    status: string;
    visibility: string;
    archived: boolean;

    createdAt: string;
    updatedAt: string;

    totalMembers: number;
    totalFiles: number;
    totalModels: number;
    totalVersions: number;
    totalComments: number;

    membersByRole: {
        owners: number;
        admins: number;
        editors: number;
        viewers: number;
    };

    storageUsed: number;
}

/**
 * -----------------------------------------------------------------------------
 * Project Dashboard
 * -----------------------------------------------------------------------------
 */

export interface ProjectDashboard {
    projects: Project[];

    recentProjects?: Project[];

    stats?: {
        totalProjects?: number;

        activeProjects?: number;

        archivedProjects?: number;
    };
}

/**
 * -----------------------------------------------------------------------------
 * Endpoint
 * -----------------------------------------------------------------------------
 */

const PROJECTS_ENDPOINT = "/projects";

/**
 * -----------------------------------------------------------------------------
 * Get Projects
 * -----------------------------------------------------------------------------
 *
 * GET /projects
 * -----------------------------------------------------------------------------
 */

export async function getProjects(
    params?: GetProjectsParams,
): Promise<ProjectsResponse> {
    const query = new URLSearchParams();

    if (params?.page !== undefined) {
        query.set(
            "page",
            String(params.page),
        );
    }

    if (params?.limit !== undefined) {
        query.set(
            "limit",
            String(params.limit),
        );
    }

    if (params?.search) {
        query.set(
            "search",
            params.search,
        );
    }

    if (params?.status) {
        query.set(
            "status",
            params.status,
        );
    }

    if (params?.visibility) {
        query.set(
            "visibility",
            params.visibility,
        );
    }

    if (params?.sortBy) {
        query.set(
            "sortBy",
            params.sortBy,
        );
    }

    if (params?.sortOrder) {
        query.set(
            "sortOrder",
            params.sortOrder,
        );
    }

    const queryString = query.toString();

    const path =
        queryString.length > 0
            ? `${PROJECTS_ENDPOINT}?${queryString}`
            : PROJECTS_ENDPOINT;

    const response =
        await apiClient<
            ApiResponse<ProjectsResponse>
        >(path);

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Get Project Dashboard
 * -----------------------------------------------------------------------------
 *
 * GET /projects/dashboard
 *
 * IMPORTANT:
 *
 * This endpoint must appear before:
 *
 * GET /projects/:projectId
 *
 * on the backend router so "dashboard" is not interpreted as a project ID.
 * -----------------------------------------------------------------------------
 */

export async function getDashboard(): Promise<ProjectDashboard> {
    const response =
        await apiClient<
            ApiResponse<ProjectDashboard>
        >(
            `${PROJECTS_ENDPOINT}/dashboard`,
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Get Single Project
 * -----------------------------------------------------------------------------
 *
 * GET /projects/:projectId
 * -----------------------------------------------------------------------------
 */

export async function getProject(
    projectId: string,
): Promise<ProjectResponse> {
    const response =
        await apiClient<
            ApiResponse<ProjectResponse>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}`,
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Create Project
 * -----------------------------------------------------------------------------
 *
 * POST /projects
 * -----------------------------------------------------------------------------
 */

export async function createProject(
    data: CreateProjectInput,
): Promise<ProjectResponse> {
    const response =
        await apiClient<
            ApiResponse<ProjectResponse>
        >(
            PROJECTS_ENDPOINT,
            {
                method: "POST",

                body: JSON.stringify(data),
            },
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Update Project
 * -----------------------------------------------------------------------------
 *
 * PATCH /projects/:projectId
 * -----------------------------------------------------------------------------
 */

export async function updateProject(
    projectId: string,
    data: UpdateProjectInput,
): Promise<ProjectResponse> {
    const response =
        await apiClient<
            ApiResponse<ProjectResponse>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}`,
            {
                method: "PATCH",

                body: JSON.stringify(data),
            },
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Delete Project
 * -----------------------------------------------------------------------------
 *
 * DELETE /projects/:projectId
 *
 * The backend returns a successful response without a project payload.
 * -----------------------------------------------------------------------------
 */

export async function deleteProject(
    projectId: string,
): Promise<string> {
    const response =
        await apiClient<
            ApiResponse<null>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}`,
            {
                method: "DELETE",
            },
        );

    return response.message;
}

/**
 * -----------------------------------------------------------------------------
 * Archive Project
 * -----------------------------------------------------------------------------
 *
 * POST /projects/:projectId/archive
 *
 * Archives an active project.
 *
 * Expected backend response:
 *
 * {
 *     success: true,
 *     message: "...",
 *     data: {
 *         ...
 *     }
 * }
 *
 * The returned data is the updated project.
 * -----------------------------------------------------------------------------
 */

export async function archiveProject(
    projectId: string,
): Promise<ProjectResponse> {
    const encodedProjectId =
        encodeURIComponent(projectId);

    const endpoint =
        `${PROJECTS_ENDPOINT}/${encodedProjectId}/archive`;

    const response =
        await apiClient<
            ApiResponse<ProjectResponse>
        >(
            endpoint,
            {
                method: "POST",
            },
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Restore Project
 * -----------------------------------------------------------------------------
 *
 * POST /projects/:projectId/restore
 *
 * Restores an archived project.
 *
 * Expected backend response:
 *
 * {
 *     success: true,
 *     message: "...",
 *     data: {
 *         ...
 *     }
 * }
 *
 * The returned data is the restored project.
 * -----------------------------------------------------------------------------
 */

export async function restoreProject(
    projectId: string,
): Promise<ProjectResponse> {
    const encodedProjectId =
        encodeURIComponent(projectId);

    const endpoint =
        `${PROJECTS_ENDPOINT}/${encodedProjectId}/restore`;

    const response =
        await apiClient<
            ApiResponse<ProjectResponse>
        >(
            endpoint,
            {
                method: "POST",
            },
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Project Members
 * -----------------------------------------------------------------------------
 */

/**
 * Get Project Members
 * -----------------------------------------------------------------------------
 *
 * GET /projects/:projectId/members
 * -----------------------------------------------------------------------------
 */

export async function getProjectMembers(
    projectId: string,
): Promise<ProjectMembersResponse> {
    const endpoint =
        `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}/members`;

    console.log(
        "[Brika API] GET project members:",
        endpoint,
    );

    const response =
        await apiClient<
            ApiResponse<ProjectMembersResponse>
        >(endpoint);

    console.log(
        "[Brika API] RAW project members response:",
        JSON.stringify(
            response,
            null,
            2,
        ),
    );

    console.log(
        "[Brika API] project members response.data:",
        JSON.stringify(
            response.data,
            null,
            2,
        ),
    );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Invite Project Member
 * -----------------------------------------------------------------------------
 *
 * POST /projects/:projectId/members
 * -----------------------------------------------------------------------------
 */

export async function inviteMember(
    projectId: string,
    data: InviteProjectMemberInput,
): Promise<ProjectMember> {
    const response =
        await apiClient<
            ApiResponse<ProjectMember>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}/members`,
            {
                method: "POST",

                body: JSON.stringify(data),
            },
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Update Project Member Role
 * -----------------------------------------------------------------------------
 *
 * PATCH /projects/:projectId/members/:memberId
 * -----------------------------------------------------------------------------
 */

export async function updateMemberRole(
    projectId: string,
    memberId: string,
    data: UpdateProjectMemberRoleInput,
): Promise<ProjectMember> {
    const response =
        await apiClient<
            ApiResponse<ProjectMember>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}/members/${encodeURIComponent(memberId)}`,
            {
                method: "PATCH",

                body: JSON.stringify(data),
            },
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Remove Project Member
 * -----------------------------------------------------------------------------
 *
 * DELETE /projects/:projectId/members/:memberId
 * -----------------------------------------------------------------------------
 */

export async function removeMember(
    projectId: string,
    memberId: string,
): Promise<string> {
    const response =
        await apiClient<
            ApiResponse<null>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}/members/${encodeURIComponent(memberId)}`,
            {
                method: "DELETE",
            },
        );

    return response.message;
}

/**
 * -----------------------------------------------------------------------------
 * Transfer Project Ownership
 * -----------------------------------------------------------------------------
 *
 * POST /projects/:projectId/transfer-ownership
 *
 * The backend expects:
 *
 * {
 *     userId: string
 * }
 * -----------------------------------------------------------------------------
 */

export async function transferOwnership(
    projectId: string,
    userId: string,
): Promise<ProjectResponse> {
    const response =
        await apiClient<
            ApiResponse<ProjectResponse>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}/transfer-ownership`,
            {
                method: "POST",

                body: JSON.stringify({
                    userId,
                }),
            },
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Leave Project
 * -----------------------------------------------------------------------------
 *
 * POST /projects/:projectId/leave
 * -----------------------------------------------------------------------------
 */

export async function leaveProject(
    projectId: string,
): Promise<string> {
    const response =
        await apiClient<
            ApiResponse<null>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}/leave`,
            {
                method: "POST",
            },
        );

    return response.message;
}

/**
 * -----------------------------------------------------------------------------
 * Get Project Stats
 * -----------------------------------------------------------------------------
 *
 * GET /projects/:projectId/stats
 * -----------------------------------------------------------------------------
 */

export async function getProjectStats(
    projectId: string,
): Promise<ProjectStats> {
    const response =
        await apiClient<
            ApiResponse<ProjectStats>
        >(
            `${PROJECTS_ENDPOINT}/${encodeURIComponent(projectId)}/stats`,
        );

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Project Activity
 * -----------------------------------------------------------------------------
 *
 * GET /projects/:projectId/activity
 *
 * Supports pagination.
 * -----------------------------------------------------------------------------
 */

export async function getProjectActivity(
    projectId: string,
    params?: {
        page?: number;

        limit?: number;
    },
): Promise<ProjectActivityResponse> {
    const query = new URLSearchParams();

    if (params?.page !== undefined) {
        query.set(
            "page",
            String(params.page),
        );
    }

    if (params?.limit !== undefined) {
        query.set(
            "limit",
            String(params.limit),
        );
    }

    const queryString =
        query.toString();

    const encodedProjectId =
        encodeURIComponent(projectId);

    const path =
        queryString.length > 0
            ? `${PROJECTS_ENDPOINT}/${encodedProjectId}/activity?${queryString}`
            : `${PROJECTS_ENDPOINT}/${encodedProjectId}/activity`;

    const response =
        await apiClient<
            ApiResponse<ProjectActivityResponse>
        >(path);

    return response.data;
}

/**
 * -----------------------------------------------------------------------------
 * Service Object
 * -----------------------------------------------------------------------------
 */

const projectService = {
    /**
     * Project collection
     */
    getProjects,

    getDashboard,

    createProject,

    /**
     * Individual project
     */
    getProject,

    updateProject,

    deleteProject,

    /**
     * Archive / Restore
     */
    archiveProject,

    restoreProject,

    /**
     * Project members
     */
    getProjectMembers,

    inviteMember,

    updateMemberRole,

    removeMember,

    transferOwnership,

    leaveProject,

    /**
     * Project information
     */
    getProjectStats,

    getProjectActivity,
};

export default projectService;