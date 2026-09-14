/**
 * -----------------------------------------------------------------------------
 * File: src/validation/project.validation.ts
 * -----------------------------------------------------------------------------
 * Brika Project Validation
 *
 * Client-side validation schemas for the Projects feature.
 *
 * These schemas are intended for:
 *
 * - Create project forms
 * - Update project forms
 * - Project list filters
 * - Project sorting and pagination
 *
 * Backend validation remains authoritative.
 * -----------------------------------------------------------------------------
 */

import { z } from "zod";

import {
    PROJECT_LIMITS,
    PROJECT_PAGINATION,
} from "@/constants/project.constants";

import type {
    ProjectStatus,
    ProjectVisibility,
    ProjectSortField,
    ProjectSortOrder,
} from "@/types/project.types";

/**
 * -----------------------------------------------------------------------------
 * Shared enum schemas
 * -----------------------------------------------------------------------------
 */

export const projectStatusSchema = z.enum([
    "ACTIVE",
    "ARCHIVED",
    "DELETED",
]);

export const projectVisibilitySchema = z.enum([
    "PRIVATE",
    "TEAM",
    "PUBLIC",
]);

export const projectSortFieldSchema = z.enum([
    "name",
    "createdAt",
    "updatedAt",
]);

export const projectSortOrderSchema = z.enum([
    "asc",
    "desc",
]);

/**
 * -----------------------------------------------------------------------------
 * Project name
 * -----------------------------------------------------------------------------
 */

export const projectNameSchema = z
    .string()
    .trim()
    .min(
        PROJECT_LIMITS.name.min,
        `Project name must be at least ${PROJECT_LIMITS.name.min} character.`,
    )
    .max(
        PROJECT_LIMITS.name.max,
        `Project name must be ${PROJECT_LIMITS.name.max} characters or fewer.`,
    );

/**
 * -----------------------------------------------------------------------------
 * Project description
 * -----------------------------------------------------------------------------
 */

export const projectDescriptionSchema = z
    .string()
    .trim()
    .max(
        PROJECT_LIMITS.description.max,
        `Description must be ${PROJECT_LIMITS.description.max} characters or fewer.`,
    );

/**
 * -----------------------------------------------------------------------------
 * Create project
 * -----------------------------------------------------------------------------
 */

export const createProjectSchema = z.object({
    name: projectNameSchema,

    description: projectDescriptionSchema
        .optional()
        .or(z.literal("")),

    visibility: projectVisibilitySchema.optional(),
});

/**
 * Inferred create-project form data.
 */
export type CreateProjectFormData = z.infer<
    typeof createProjectSchema
>;

/**
 * -----------------------------------------------------------------------------
 * Update project
 * -----------------------------------------------------------------------------
 */

export const updateProjectSchema = z.object({
    name: projectNameSchema.optional(),

    description: projectDescriptionSchema
        .nullable()
        .optional()
        .or(z.literal("")),

    visibility: projectVisibilitySchema.optional(),
});

/**
 * Inferred update-project form data.
 */
export type UpdateProjectFormData = z.infer<
    typeof updateProjectSchema
>;

/**
 * -----------------------------------------------------------------------------
 * Project list query
 * -----------------------------------------------------------------------------
 */

export const getProjectsSchema = z.object({
    page: z
        .number()
        .int()
        .min(PROJECT_PAGINATION.minLimit)
        .optional(),

    limit: z
        .number()
        .int()
        .min(PROJECT_PAGINATION.minLimit)
        .max(PROJECT_PAGINATION.maxLimit)
        .optional(),

    search: z
        .string()
        .trim()
        .optional(),

    status: projectStatusSchema.optional(),

    visibility: projectVisibilitySchema.optional(),

    sortBy: projectSortFieldSchema.optional(),

    sortOrder: projectSortOrderSchema.optional(),
});

/**
 * Inferred project query data.
 */
export type GetProjectsFormData = z.infer<
    typeof getProjectsSchema
>;

/**
 * -----------------------------------------------------------------------------
 * Project ID
 * -----------------------------------------------------------------------------
 *
 * IDs are validated as non-empty strings here rather than enforcing a
 * particular database ID format. This keeps the frontend independent of
 * whether the backend uses UUIDs, CUIDs, or another identifier format.
 */

export const projectIdSchema = z
    .string()
    .trim()
    .min(1, "Project ID is required.");

/**
 * -----------------------------------------------------------------------------
 * Archive / restore
 * -----------------------------------------------------------------------------
 */

export const projectArchiveSchema = z.object({
    projectId: projectIdSchema,
});

/**
 * Restore uses the same project ID validation.
 */
export const projectRestoreSchema = z.object({
    projectId: projectIdSchema,
});

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

/**
 * Validate a project ID.
 */
export function isValidProjectId(
    projectId: string,
): boolean {
    return projectIdSchema.safeParse(projectId).success;
}

/**
 * Validate project creation data.
 */
export function validateCreateProject(
    data: unknown,
) {
    return createProjectSchema.safeParse(data);
}

/**
 * Validate project update data.
 */
export function validateUpdateProject(
    data: unknown,
) {
    return updateProjectSchema.safeParse(data);
}

/**
 * Validate project list parameters.
 */
export function validateGetProjects(
    data: unknown,
) {
    return getProjectsSchema.safeParse(data);
}

/**
 * -----------------------------------------------------------------------------
 * Type guards
 * -----------------------------------------------------------------------------
 *
 * These are useful when working with values coming from route parameters,
 * query strings, or external API data.
 */

export function isProjectStatus(
    value: unknown,
): value is ProjectStatus {
    return projectStatusSchema.safeParse(value).success;
}

export function isProjectVisibility(
    value: unknown,
): value is ProjectVisibility {
    return projectVisibilitySchema.safeParse(value).success;
}

export function isProjectSortField(
    value: unknown,
): value is ProjectSortField {
    return projectSortFieldSchema.safeParse(value).success;
}

export function isProjectSortOrder(
    value: unknown,
): value is ProjectSortOrder {
    return projectSortOrderSchema.safeParse(value).success;
}