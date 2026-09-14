/**
 * -----------------------------------------------------------------------------
 * File: src/constants/project.constants.ts
 * -----------------------------------------------------------------------------
 * Brika Project Constants
 *
 * Shared constants used throughout the Projects feature.
 *
 * Keep API/business rules aligned with the backend project contract.
 * UI components should import project constants from this file instead of
 * defining their own project-specific values.
 * -----------------------------------------------------------------------------
 */

import type {
    ProjectStatus,
    ProjectVisibility,
    ProjectMemberRole,
    ProjectSortField,
    ProjectSortOrder,
} from "@/types/project.types";

/**
 * -----------------------------------------------------------------------------
 * Defaults
 * -----------------------------------------------------------------------------
 */

/**
 * Default values used when creating a new project.
 */
export const PROJECT_DEFAULTS = {
    visibility: "PRIVATE" as ProjectVisibility,
} as const;

/**
 * Default project list configuration.
 */
export const PROJECT_LIST_DEFAULTS = {
    page: 1,
    limit: 20,
    sortBy: "updatedAt" as ProjectSortField,
    sortOrder: "desc" as ProjectSortOrder,
} as const;

/**
 * -----------------------------------------------------------------------------
 * Pagination
 * -----------------------------------------------------------------------------
 */

export const PROJECT_PAGINATION = {
    defaultPage: 1,
    defaultLimit: 20,
    minLimit: 1,
    maxLimit: 100,
} as const;

/**
 * -----------------------------------------------------------------------------
 * Validation limits
 * -----------------------------------------------------------------------------
 */

export const PROJECT_LIMITS = {
    name: {
        min: 1,
        max: 100,
    },

    description: {
        min: 0,
        max: 2000,
    },
} as const;

/**
 * -----------------------------------------------------------------------------
 * Project statuses
 * -----------------------------------------------------------------------------
 */

/**
 * Canonical project status values.
 *
 * These values correspond directly to the backend project contract.
 */
export const PROJECT_STATUSES: readonly ProjectStatus[] = [
    "ACTIVE",
    "ARCHIVED",
    "DELETED",
];

/**
 * Human-readable project status labels.
 */
export const PROJECT_STATUS_LABELS: Record<
    ProjectStatus,
    string
> = {
    ACTIVE: "Active",
    ARCHIVED: "Archived",
    DELETED: "Deleted",
};

/**
 * -----------------------------------------------------------------------------
 * Project visibility
 * -----------------------------------------------------------------------------
 */

/**
 * Canonical project visibility values.
 *
 * These values correspond directly to the backend project contract.
 *
 * Use this collection for:
 *
 * - Validation
 * - Type/domain logic
 * - API payloads
 * - Business rules
 */
export const PROJECT_VISIBILITIES: readonly ProjectVisibility[] = [
    "PRIVATE",
    "TEAM",
    "PUBLIC",
];

/**
 * Human-readable visibility labels.
 */
export const PROJECT_VISIBILITY_LABELS: Record<
    ProjectVisibility,
    string
> = {
    PRIVATE: "Private",
    TEAM: "Team",
    PUBLIC: "Public",
};

/**
 * UI options for project visibility selectors.
 *
 * Unlike PROJECT_VISIBILITIES, these objects contain presentation
 * information used by components such as CreateProjectForm.
 */
export const PROJECT_VISIBILITY_OPTIONS: ReadonlyArray<{
    value: ProjectVisibility;
    label: string;
    description: string;
}> = [
    {
        value: "PRIVATE",
        label: "Private",
        description:
            "Only you and invited project members can access this project.",
    },

    {
        value: "TEAM",
        label: "Team",
        description:
            "Members of your team can access this project.",
    },

    {
        value: "PUBLIC",
        label: "Public",
        description:
            "Anyone with access to the project can view this project.",
    },
];

/**
 * -----------------------------------------------------------------------------
 * Project member roles
 * -----------------------------------------------------------------------------
 */

/**
 * Canonical project member role values.
 */
export const PROJECT_MEMBER_ROLES: readonly ProjectMemberRole[] = [
    "OWNER",
    "ADMIN",
    "MEMBER",
    "VIEWER",
];

/**
 * Human-readable member role labels.
 */
export const PROJECT_MEMBER_ROLE_LABELS: Record<
    ProjectMemberRole,
    string
> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MEMBER: "Member",
    VIEWER: "Viewer",
};

/**
 * -----------------------------------------------------------------------------
 * Project sorting
 * -----------------------------------------------------------------------------
 */

/**
 * Supported project sort fields.
 */
export const PROJECT_SORT_FIELDS: readonly ProjectSortField[] = [
    "name",
    "createdAt",
    "updatedAt",
];

/**
 * Human-readable sort field labels.
 */
export const PROJECT_SORT_FIELD_LABELS: Record<
    ProjectSortField,
    string
> = {
    name: "Name",
    createdAt: "Created",
    updatedAt: "Last updated",
};

/**
 * Supported sort directions.
 */
export const PROJECT_SORT_ORDERS: readonly ProjectSortOrder[] = [
    "asc",
    "desc",
];

/**
 * Human-readable sort direction labels.
 */
export const PROJECT_SORT_ORDER_LABELS: Record<
    ProjectSortOrder,
    string
> = {
    asc: "Ascending",
    desc: "Descending",
};

/**
 * -----------------------------------------------------------------------------
 * Search
 * -----------------------------------------------------------------------------
 */

export const PROJECT_SEARCH = {
    minLength: 1,
    debounceMs: 300,
} as const;

/**
 * -----------------------------------------------------------------------------
 * UI
 * -----------------------------------------------------------------------------
 */

/**
 * Number of skeleton cards displayed while the project list is loading.
 */
export const PROJECT_LOADING_SKELETON_COUNT = 4;

/**
 * Maximum number of project members displayed before pagination/load-more
 * behavior is introduced.
 */
export const PROJECT_MEMBER_PAGE_SIZE = 20;

/**
 * Maximum number of activity entries requested per page.
 */
export const PROJECT_ACTIVITY_PAGE_SIZE = 20;

/**
 * -----------------------------------------------------------------------------
 * Route names
 * -----------------------------------------------------------------------------
 *
 * These are centralized here so project navigation does not depend on
 * hard-coded route strings scattered throughout components.
 */

export const PROJECT_ROUTES = {
    list: "/(tabs)/projects",

    create: "/(tabs)/projects/create",

    details: (projectId: string) =>
        `/(tabs)/projects/${projectId}`,

    members: (projectId: string) =>
        `/(tabs)/projects/${projectId}/members`,

    activity: (projectId: string) =>
        `/(tabs)/projects/${projectId}/activity`,
} as const;

/**
 * -----------------------------------------------------------------------------
 * API configuration
 * -----------------------------------------------------------------------------
 */

export const PROJECT_API = {
    basePath: "/projects",
} as const;