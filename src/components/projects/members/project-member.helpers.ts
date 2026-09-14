/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/project-member.helpers.ts
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project-member presentation and utility helpers.
 *
 * Responsibilities:
 *
 * - Resolve a member's display name.
 * - Resolve a member's email address.
 * - Resolve a stable member identifier.
 * - Format member roles for display.
 * - Provide small reusable member-related utility functions.
 *
 * These helpers contain no React state and perform no API requests.
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface ProjectMemberUser {
  id?: string | number | null;
  name?: string | null;
  email?: string | null;
}

export interface ProjectMemberLike {
  id?: string | number | null;
  userId?: string | number | null;

  name?: string | null;
  email?: string | null;

  role?: string | null;

  user?: ProjectMemberUser | null;

  [key: string]: unknown;
}

/**
 * -----------------------------------------------------------------------------
 * getProjectMemberId
 * -----------------------------------------------------------------------------
 *
 * Returns the best available identifier for a project member.
 * -----------------------------------------------------------------------------
 */

export function getProjectMemberId(
  member: ProjectMemberLike | null | undefined,
): string | null {
  if (!member) {
    return null;
  }

  if (
    member.id !== undefined &&
    member.id !== null &&
    String(member.id).trim()
  ) {
    return String(member.id);
  }

  if (
    member.userId !== undefined &&
    member.userId !== null &&
    String(member.userId).trim()
  ) {
    return String(member.userId);
  }

  if (
    member.user?.id !== undefined &&
    member.user?.id !== null &&
    String(member.user.id).trim()
  ) {
    return String(member.user.id);
  }

  return null;
}

/**
 * -----------------------------------------------------------------------------
 * getProjectMemberName
 * -----------------------------------------------------------------------------
 *
 * Resolves the most useful human-readable name.
 *
 * Priority:
 *
 * 1. member.name
 * 2. member.user.name
 * 3. member.email
 * 4. member.user.email
 * 5. fallback
 * -----------------------------------------------------------------------------
 */

export function getProjectMemberName(
  member: ProjectMemberLike | null | undefined,
  fallback = "Project member",
): string {
  if (!member) {
    return fallback;
  }

  if (
    typeof member.name === "string" &&
    member.name.trim()
  ) {
    return member.name.trim();
  }

  if (
    typeof member.user?.name === "string" &&
    member.user.name.trim()
  ) {
    return member.user.name.trim();
  }

  if (
    typeof member.email === "string" &&
    member.email.trim()
  ) {
    return member.email.trim();
  }

  if (
    typeof member.user?.email === "string" &&
    member.user.email.trim()
  ) {
    return member.user.email.trim();
  }

  return fallback;
}

/**
 * -----------------------------------------------------------------------------
 * getProjectMemberEmail
 * -----------------------------------------------------------------------------
 */

export function getProjectMemberEmail(
  member: ProjectMemberLike | null | undefined,
): string | null {
  if (!member) {
    return null;
  }

  if (
    typeof member.email === "string" &&
    member.email.trim()
  ) {
    return member.email.trim();
  }

  if (
    typeof member.user?.email === "string" &&
    member.user.email.trim()
  ) {
    return member.user.email.trim();
  }

  return null;
}

/**
 * -----------------------------------------------------------------------------
 * getProjectMemberInitials
 * -----------------------------------------------------------------------------
 *
 * Generates initials suitable for an avatar.
 *
 * Examples:
 *
 * "John Doe" -> "JD"
 * "John"     -> "J"
 * "john@example.com" -> "J"
 * -----------------------------------------------------------------------------
 */

export function getProjectMemberInitials(
  member: ProjectMemberLike | null | undefined,
): string {
  const name = getProjectMemberName(
    member,
    "",
  ).trim();

  if (!name) {
    return "?";
  }

  const parts = name
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0][0].toUpperCase();
}

/**
 * -----------------------------------------------------------------------------
 * formatProjectMemberRole
 * -----------------------------------------------------------------------------
 *
 * Converts API-style role values into readable UI labels.
 *
 * Examples:
 *
 * "EDITOR" -> "Editor"
 * "VIEWER" -> "Viewer"
 * "PROJECT_ADMIN" -> "Project Admin"
 * -----------------------------------------------------------------------------
 */

export function formatProjectMemberRole(
  role: string | null | undefined,
  fallback = "Member",
): string {
  if (
    typeof role !== "string" ||
    !role.trim()
  ) {
    return fallback;
  }

  return role
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

/**
 * -----------------------------------------------------------------------------
 * isProjectMemberRole
 * -----------------------------------------------------------------------------
 *
 * Checks whether a value represents one of the roles currently supported
 * by the members UI.
 * -----------------------------------------------------------------------------
 */

export function isProjectMemberRole(
  role: unknown,
): role is "EDITOR" | "VIEWER" {
  return role === "EDITOR" || role === "VIEWER";
}

/**
 * -----------------------------------------------------------------------------
 * getProjectMemberRole
 * -----------------------------------------------------------------------------
 *
 * Returns a normalized member role when possible.
 * -----------------------------------------------------------------------------
 */

export function getProjectMemberRole(
  member: ProjectMemberLike | null | undefined,
): string | null {
  if (!member) {
    return null;
  }

  if (
    typeof member.role === "string" &&
    member.role.trim()
  ) {
    return member.role.trim().toUpperCase();
  }

  return null;
}

/**
 * -----------------------------------------------------------------------------
 * isProjectMember
 * -----------------------------------------------------------------------------
 *
 * Basic runtime guard for member-shaped values.
 * -----------------------------------------------------------------------------
 */

export function isProjectMember(
  value: unknown,
): value is ProjectMemberLike {
  return (
    typeof value === "object" &&
    value !== null
  );
}

/**
 * -----------------------------------------------------------------------------
 * getProjectMemberCountLabel
 * -----------------------------------------------------------------------------
 *
 * Returns a human-readable member count.
 *
 * Examples:
 *
 * 1 -> "1 member"
 * 4 -> "4 members"
 * -----------------------------------------------------------------------------
 */

export function getProjectMemberCountLabel(
  count: number,
): string {
  const normalizedCount = Math.max(
    0,
    Number.isFinite(count) ? Math.floor(count) : 0,
  );

  return normalizedCount === 1
    ? "1 member"
    : `${normalizedCount} members`;
}

/**
 * -----------------------------------------------------------------------------
 * getProjectMemberListKey
 * -----------------------------------------------------------------------------
 *
 * Provides a stable FlatList key.
 * -----------------------------------------------------------------------------
 */

export function getProjectMemberListKey(
  member: ProjectMemberLike,
  index = 0,
): string {
  return (
    getProjectMemberId(member) ??
    `project-member-${index}`
  );
}