/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/projects/useProjectMemberManagement.ts
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project member management hook.
 *
 * Responsibilities:
 *
 * - Manage invite-member state.
 * - Manage edit-role state.
 * - Manage remove-member state.
 * - Manage leave-project state.
 * - Track the currently selected member.
 * - Expose mutation/loading state.
 * - Keep member-management state out of the route component.
 *
 * This hook does not render UI.
 *
 * API calls are injected through callbacks so this hook remains independent
 * from a particular project-service implementation.
 * -----------------------------------------------------------------------------
 */

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type {
  ProjectMember,
} from "@/types/project.types";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export type ProjectMemberManagementRole =
  | "EDITOR"
  | "VIEWER";

export type ProjectMemberMutationType =
  | "invite"
  | "update-role"
  | "remove"
  | "leave"
  | null;

export interface InviteMemberInput {
  email: string;
  role: ProjectMemberManagementRole;
}

export interface UseProjectMemberManagementOptions {
  projectId: string;

  members?: ProjectMember[];

  onInviteMember: (
    input: InviteMemberInput,
  ) => Promise<unknown>;

  onUpdateMemberRole: (
    memberId: string,
    role: ProjectMemberManagementRole,
  ) => Promise<unknown>;

  onRemoveMember: (
    memberId: string,
  ) => Promise<unknown>;

  onLeaveProject: () => Promise<unknown>;

  onMutationSuccess?: (
    mutation: Exclude<
      ProjectMemberMutationType,
      null
    >,
  ) => void | Promise<void>;

  onMutationError?: (
    error: unknown,
    mutation: Exclude<
      ProjectMemberMutationType,
      null
    >,
  ) => void;
}

export interface UseProjectMemberManagementResult {
  isInviteModalVisible: boolean;
  inviteEmail: string;
  inviteRole: ProjectMemberManagementRole;
  inviteAccountNotFound: boolean;
  isInviting: boolean;

  isRoleModalVisible: boolean;
  selectedMember: ProjectMember | null;
  selectedRole: ProjectMemberManagementRole;
  isUpdatingRole: boolean;

  isRemoveModalVisible: boolean;
  isRemoving: boolean;

  isLeaveModalVisible: boolean;
  isLeaving: boolean;

  isMemberMutationPending: boolean;
  memberMutationType: ProjectMemberMutationType;

  setInviteEmail: (email: string) => void;
  setInviteRole: (
    role: ProjectMemberManagementRole,
  ) => void;

  openInviteModal: () => void;
  closeInviteModal: () => void;
  submitInviteMember: () => Promise<boolean>;

  openRoleModal: (
    member: ProjectMember,
  ) => void;
  closeRoleModal: () => void;
  setSelectedRole: (
    role: ProjectMemberManagementRole,
  ) => void;
  submitUpdateMemberRole: () => Promise<boolean>;

  openRemoveModal: (
    member: ProjectMember,
  ) => void;
  closeRemoveModal: () => void;
  submitRemoveMember: () => Promise<boolean>;

  openLeaveModal: () => void;
  closeLeaveModal: () => void;
  submitLeaveProject: () => Promise<boolean>;

  reset: () => void;
}

/**
 * -----------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------
 */

const DEFAULT_ROLE: ProjectMemberManagementRole =
  "VIEWER";

/**
 * -----------------------------------------------------------------------------
 * Hook
 * -----------------------------------------------------------------------------
 */

export function useProjectMemberManagement({
  projectId,
  members = [],
  onInviteMember,
  onUpdateMemberRole,
  onRemoveMember,
  onLeaveProject,
  onMutationSuccess,
  onMutationError,
}: UseProjectMemberManagementOptions): UseProjectMemberManagementResult {
  const [
    isInviteModalVisible,
    setIsInviteModalVisible,
  ] = useState(false);

  const [
    inviteEmail,
    setInviteEmailState,
  ] = useState("");

  const [
    inviteRole,
    setInviteRoleState,
  ] = useState<ProjectMemberManagementRole>(
    DEFAULT_ROLE,
  );

  const [
    inviteAccountNotFound,
    setInviteAccountNotFound,
  ] = useState(false);

  const [
    isInviting,
    setIsInviting,
  ] = useState(false);

  const [
    isRoleModalVisible,
    setIsRoleModalVisible,
  ] = useState(false);

  const [
    selectedMemberId,
    setSelectedMemberId,
  ] = useState<string | null>(null);

  const [
    selectedRole,
    setSelectedRoleState,
  ] = useState<ProjectMemberManagementRole>(
    DEFAULT_ROLE,
  );

  const [
    isUpdatingRole,
    setIsUpdatingRole,
  ] = useState(false);

  const [
    isRemoveModalVisible,
    setIsRemoveModalVisible,
  ] = useState(false);

  const [
    isRemoving,
    setIsRemoving,
  ] = useState(false);

  const [
    isLeaveModalVisible,
    setIsLeaveModalVisible,
  ] = useState(false);

  const [
    isLeaving,
    setIsLeaving,
  ] = useState(false);

  /**
   * ---------------------------------------------------------------------------
   * Selected member
   * ---------------------------------------------------------------------------
   *
   * ProjectMember already has a canonical `id`, so there is no need to use
   * getProjectMemberId() or a loose ProjectMemberLike type here.
   */
  const selectedMember = useMemo(() => {
    if (!selectedMemberId) {
      return null;
    }

    return (
      members.find(
        (member) =>
          member.id === selectedMemberId,
      ) ?? null
    );
  }, [members, selectedMemberId]);

  const isMemberMutationPending =
    isInviting ||
    isUpdatingRole ||
    isRemoving ||
    isLeaving;

  const memberMutationType: ProjectMemberMutationType =
    isInviting
      ? "invite"
      : isUpdatingRole
        ? "update-role"
        : isRemoving
          ? "remove"
          : isLeaving
            ? "leave"
            : null;

  /**
   * ---------------------------------------------------------------------------
   * Invite
   * ---------------------------------------------------------------------------
   */

  const setInviteEmail = useCallback(
    (email: string) => {
      setInviteEmailState(email);
      setInviteAccountNotFound(false);
    },
    [],
  );

  const setInviteRole = useCallback(
    (role: ProjectMemberManagementRole) => {
      setInviteRoleState(role);
    },
    [],
  );

  const openInviteModal = useCallback(() => {
    setInviteEmailState("");
    setInviteRoleState(DEFAULT_ROLE);
    setInviteAccountNotFound(false);
    setIsInviteModalVisible(true);
  }, []);

  const closeInviteModal = useCallback(() => {
    if (isInviting) {
      return;
    }

    setIsInviteModalVisible(false);
    setInviteEmailState("");
    setInviteRoleState(DEFAULT_ROLE);
    setInviteAccountNotFound(false);
  }, [isInviting]);

  const submitInviteMember = useCallback(
    async (): Promise<boolean> => {
      const normalizedEmail =
        inviteEmail.trim();

      if (!normalizedEmail || isInviting) {
        return false;
      }

      setIsInviting(true);
      setInviteAccountNotFound(false);

      try {
        await onInviteMember({
          email: normalizedEmail,
          role: inviteRole,
        });

        setIsInviteModalVisible(false);
        setInviteEmailState("");
        setInviteRoleState(DEFAULT_ROLE);
        setInviteAccountNotFound(false);

        await onMutationSuccess?.("invite");

        return true;
      } catch (error) {
        const errorMessage =
          getErrorMessage(error);

        if (
          isAccountNotFoundError(
            error,
            errorMessage,
          )
        ) {
          setInviteAccountNotFound(true);
        }

        onMutationError?.(
          error,
          "invite",
        );

        return false;
      } finally {
        setIsInviting(false);
      }
    },
    [
      inviteEmail,
      inviteRole,
      isInviting,
      onInviteMember,
      onMutationSuccess,
      onMutationError,
    ],
  );

  /**
   * ---------------------------------------------------------------------------
   * Edit member role
   * ---------------------------------------------------------------------------
   */

  const openRoleModal = useCallback(
    (member: ProjectMember) => {
      const memberId = member.id;

      if (!memberId) {
        return;
      }

      setSelectedMemberId(memberId);

      setSelectedRoleState(
        member.role === "EDITOR"
          ? "EDITOR"
          : "VIEWER",
      );

      setIsRoleModalVisible(true);
    },
    [],
  );

  const closeRoleModal = useCallback(() => {
    if (isUpdatingRole) {
      return;
    }

    setIsRoleModalVisible(false);
    setSelectedMemberId(null);
    setSelectedRoleState(DEFAULT_ROLE);
  }, [isUpdatingRole]);

  const setSelectedRole = useCallback(
    (role: ProjectMemberManagementRole) => {
      setSelectedRoleState(role);
    },
    [],
  );

  const submitUpdateMemberRole =
    useCallback(async (): Promise<boolean> => {
      if (!selectedMemberId || isUpdatingRole) {
        return false;
      }

      setIsUpdatingRole(true);

      try {
        await onUpdateMemberRole(
          selectedMemberId,
          selectedRole,
        );

        setIsRoleModalVisible(false);
        setSelectedMemberId(null);
        setSelectedRoleState(DEFAULT_ROLE);

        await onMutationSuccess?.(
          "update-role",
        );

        return true;
      } catch (error) {
        onMutationError?.(
          error,
          "update-role",
        );

        return false;
      } finally {
        setIsUpdatingRole(false);
      }
    }, [
      selectedMemberId,
      selectedRole,
      isUpdatingRole,
      onUpdateMemberRole,
      onMutationSuccess,
      onMutationError,
    ]);

  /**
   * ---------------------------------------------------------------------------
   * Remove member
   * ---------------------------------------------------------------------------
   */

  const openRemoveModal = useCallback(
    (member: ProjectMember) => {
      const memberId = member.id;

      if (!memberId) {
        return;
      }

      setSelectedMemberId(memberId);
      setIsRemoveModalVisible(true);
    },
    [],
  );

  const closeRemoveModal = useCallback(() => {
    if (isRemoving) {
      return;
    }

    setIsRemoveModalVisible(false);
    setSelectedMemberId(null);
  }, [isRemoving]);

  const submitRemoveMember = useCallback(
    async (): Promise<boolean> => {
      if (!selectedMemberId || isRemoving) {
        return false;
      }

      setIsRemoving(true);

      try {
        await onRemoveMember(
          selectedMemberId,
        );

        setIsRemoveModalVisible(false);
        setSelectedMemberId(null);

        await onMutationSuccess?.("remove");

        return true;
      } catch (error) {
        onMutationError?.(
          error,
          "remove",
        );

        return false;
      } finally {
        setIsRemoving(false);
      }
    },
    [
      selectedMemberId,
      isRemoving,
      onRemoveMember,
      onMutationSuccess,
      onMutationError,
    ],
  );

  /**
   * ---------------------------------------------------------------------------
   * Leave project
   * ---------------------------------------------------------------------------
   */

  const openLeaveModal = useCallback(() => {
    setIsLeaveModalVisible(true);
  }, []);

  const closeLeaveModal = useCallback(() => {
    if (isLeaving) {
      return;
    }

    setIsLeaveModalVisible(false);
  }, [isLeaving]);

  const submitLeaveProject = useCallback(
    async (): Promise<boolean> => {
      if (isLeaving) {
        return false;
      }

      setIsLeaving(true);

      try {
        await onLeaveProject();

        setIsLeaveModalVisible(false);

        await onMutationSuccess?.("leave");

        return true;
      } catch (error) {
        onMutationError?.(
          error,
          "leave",
        );

        return false;
      } finally {
        setIsLeaving(false);
      }
    },
    [
      isLeaving,
      onLeaveProject,
      onMutationSuccess,
      onMutationError,
    ],
  );

  /**
   * ---------------------------------------------------------------------------
   * Reset
   * ---------------------------------------------------------------------------
   */

  const reset = useCallback(() => {
    setIsInviteModalVisible(false);
    setInviteEmailState("");
    setInviteRoleState(DEFAULT_ROLE);
    setInviteAccountNotFound(false);

    setIsRoleModalVisible(false);
    setSelectedMemberId(null);
    setSelectedRoleState(DEFAULT_ROLE);

    setIsRemoveModalVisible(false);

    setIsLeaveModalVisible(false);
  }, []);

  /**
   * ---------------------------------------------------------------------------
   * Result
   * ---------------------------------------------------------------------------
   */

  return {
    isInviteModalVisible,
    inviteEmail,
    inviteRole,
    inviteAccountNotFound,
    isInviting,

    isRoleModalVisible,
    selectedMember,
    selectedRole,
    isUpdatingRole,

    isRemoveModalVisible,
    isRemoving,

    isLeaveModalVisible,
    isLeaving,

    isMemberMutationPending,
    memberMutationType,

    setInviteEmail,
    setInviteRole,

    openInviteModal,
    closeInviteModal,
    submitInviteMember,

    openRoleModal,
    closeRoleModal,
    setSelectedRole,
    submitUpdateMemberRole,

    openRemoveModal,
    closeRemoveModal,
    submitRemoveMember,

    openLeaveModal,
    closeLeaveModal,
    submitLeaveProject,

    reset,
  };
}

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

function getErrorMessage(
  error: unknown,
): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "";
}

function isAccountNotFoundError(
  error: unknown,
  message: string,
): boolean {
  const normalizedMessage =
    message.toLowerCase();

  if (
    normalizedMessage.includes(
      "account not found",
    ) ||
    normalizedMessage.includes(
      "user not found",
    ) ||
    normalizedMessage.includes(
      "no account",
    ) ||
    normalizedMessage.includes(
      "no user",
    )
  ) {
    return true;
  }

  if (
    error &&
    typeof error === "object"
  ) {
    const candidate =
      error as Record<string, unknown>;

    const code =
      typeof candidate.code === "string"
        ? candidate.code.toUpperCase()
        : "";

    const status =
      typeof candidate.status === "number"
        ? candidate.status
        : typeof candidate.statusCode ===
          "number"
          ? candidate.statusCode
          : null;

    if (
      code === "USER_NOT_FOUND" ||
      code === "ACCOUNT_NOT_FOUND"
    ) {
      return true;
    }

    if (
      status === 404 &&
      normalizedMessage.includes("user")
    ) {
      return true;
    }
  }

  return false;
}