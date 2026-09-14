/**
* -----------------------------------------------------------------------------
* File: src/types/project.types.ts
* -----------------------------------------------------------------------------
* Brika Project Types
*
* Shared frontend/domain types for Projects.
*
* These types represent the data returned by and sent to the Brika Project API.
* UI-specific types should remain inside their respective components.
* -----------------------------------------------------------------------------
*/

/**
 * Project lifecycle status.
 *
 * Must remain aligned with the backend ProjectStatus enum.
 */
export type ProjectStatus =
    | "ACTIVE"
    | "ARCHIVED"
    | "DELETED";

/**
 * Project visibility.
 *
 * Must remain aligned with the backend ProjectVisibility enum.
 */
export type ProjectVisibility =
    | "PRIVATE"
    | "TEAM"
    | "PUBLIC";

/**
 * Fields supported when sorting the project list.
 *
 * Keep this aligned with the backend ProjectSortField type.
 */
export type ProjectSortField =
    | "name"
    | "createdAt"
    | "updatedAt";

/**
 * Sort direction.
 */
export type ProjectSortOrder =
    | "asc"
    | "desc";

/**
 * Basic project entity returned by the API.
 */
export interface Project {
    id: string;

    name: string;

    description: string | null;

    status: ProjectStatus;

    visibility: ProjectVisibility;

    ownerId: string;

    createdAt: string;

    updatedAt: string;

    archivedAt: string | null;
}

/**
 * ---------------------------------------------------------------------------
 * Project Statistics
 * ---------------------------------------------------------------------------
 */

/**
 * Detailed project statistics returned by:
 *
 * GET /api/v1/projects/:projectId/stats
 *
 * Must remain aligned with the backend `ProjectStats` DTO.
 */
export interface ProjectStats {
    projectId: string;

    name: string;

    status: ProjectStatus;

    visibility: ProjectVisibility;

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

    /**
     * Serialized from the backend BigInt value.
     *
     * The backend uses `serializeBigInt()` before sending JSON,
     * so the frontend should represent the JSON value as a number
     * if that is the serialized API contract.
     */
    storageUsed: number;
}

/**
 * Data required to create a project.
 */
export interface CreateProjectInput {
    name: string;

    description?: string;

    visibility?: ProjectVisibility;
}

/**
 * Data supported when updating a project.
 */
export interface UpdateProjectInput {
    name?: string;

    description?: string | null;

    visibility?: ProjectVisibility;
}

/**
 * Query parameters for retrieving projects.
 */
export interface GetProjectsParams {
    page?: number;

    limit?: number;

    search?: string;

    status?: ProjectStatus;

    visibility?: ProjectVisibility;

    sortBy?: ProjectSortField;

    sortOrder?: ProjectSortOrder;
}

/**
 * Pagination information returned by the project API.
 *
 * This matches the backend `PaginatedResponse<T>` contract.
 */
export interface ProjectsPagination {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
}

/**
 * Response returned when retrieving multiple projects.
 *
 * NOTE:
 *
 * The frontend project service may transform the backend pagination
 * response into this shape.
 */
export interface ProjectsResponse {
    projects: Project[];

    pagination: ProjectsPagination;
}

/**
 * -----------------------------------------------------------------------------
 * Project Members
 * -----------------------------------------------------------------------------
 */

/**
 * Project member role.
 *
 * This should remain aligned with the backend project-member role enum.
 */
export type ProjectMemberRole =
    | "OWNER"
    | "ADMIN"
    | "EDITOR"
    | "VIEWER";

/**
 * User information included with a project member.
 *
 * This matches the backend `PROJECT_MEMBER_INCLUDE` selection:
 *
 * - id
 * - firstName
 * - lastName
 * - email
 * - avatarUrl
 * - company
 *
 * IMPORTANT:
 *
 * There is intentionally NO `name` property here.
 *
 * The backend returns firstName and lastName separately.
 */
export interface ProjectMemberUser {
    id: string;

    firstName: string | null;

    lastName: string | null;

    email: string;

    avatarUrl: string | null;

    company: string | null;
}

/**
 * Project member.
 *
 * This matches the backend ProjectMember record returned together
 * with its included user relation.
 */
export interface ProjectMember {
    id: string;

    projectId: string;

    userId: string;

    role: ProjectMemberRole;

    accepted: boolean;

    joinedAt: string | null;

    createdAt: string;

    updatedAt: string;

    user: ProjectMemberUser;
}

/**
 * Response returned when retrieving project members.
 *
 * IMPORTANT:
 *
 * The backend returns the paginated data directly in this shape:
 *
 * {
 *     data: [...],
 *     page: 1,
 *     limit: 20,
 *     total: 2,
 *     totalPages: 1
 * }
 *
 * Therefore this interface intentionally uses `data`.
 *
 * It does NOT use:
 *
 * {
 *     members: [...],
 *     pagination: {...}
 * }
 */
export interface ProjectMembersResponse {
    data: ProjectMember[];

    page: number;

    limit: number;

    total: number;

    totalPages: number;
}

/**
 * -----------------------------------------------------------------------------
 * Project Activity
 * -----------------------------------------------------------------------------
 */

/**
 * Activity action types.
 *
 * Keep these aligned with the backend ActivityLog/project activity
 * implementation once that contract is finalized.
 */
export type ProjectActivityAction =
    | "CREATED"
    | "UPDATED"
    | "ARCHIVED"
    | "RESTORED"
    | "MEMBER_ADDED"
    | "MEMBER_REMOVED"
    | "MEMBER_ROLE_UPDATED";

/**
 * Project activity entry.
 */
export interface ProjectActivity {
    id: string;

    projectId: string;

    userId: string;

    action: ProjectActivityAction;

    metadata?: Record<string, unknown> | null;

    createdAt: string;

    user: ProjectActivityUser;
}

/**
 * Minimal user information attached to an activity entry.
 */
export interface ProjectActivityUser {
    id: string;

    firstName: string | null;

    lastName: string | null;

    email: string;
}

/**
 * Response returned when retrieving project activity.
 */
export interface ProjectActivityResponse {
    data: ProjectActivity[];

    page: number;

    limit: number;

    total: number;

    totalPages: number;
}

/**
 * -----------------------------------------------------------------------------
 * Member Inputs
 * -----------------------------------------------------------------------------
 */

/**
 * Data required to invite a project member.
 */
export interface InviteProjectMemberInput {
    email: string;

    role: ProjectMemberRole;
}

/**
 * Data required to update a project member's role.
 */
export interface UpdateProjectMemberRoleInput {
    role: ProjectMemberRole;
}

/**
 * -----------------------------------------------------------------------------
 * Project Response
 * -----------------------------------------------------------------------------
 */

/**
 * Generic project response.
 *
 * The API service unwraps the HTTP response envelope and returns the
 * project directly.
 *
 * Therefore:
 *
 *     projectService.getProject(...)
 *
 * returns:
 *
 *     Project
 *
 * rather than:
 *
 *     { project: Project }
 */
export type ProjectResponse = Project;