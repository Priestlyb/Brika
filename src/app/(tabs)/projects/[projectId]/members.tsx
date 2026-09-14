/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/[projectId]/members.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project members screen.
 *
 * Responsibilities:
 *
 * - Load project members.
 * - Render the extracted members UI components.
 * - Connect project-member service calls to the management hook.
 * - Handle ownership transfer.
 * - Support pull-to-refresh.
 * - Display loading and error states.
 * - Navigate back to the project.
 *
 * UI responsibilities have been extracted into:
 *
 * - ProjectMembersHeader
 * - ProjectMembersEmptyState
 * - ProjectMembersList
 * - ProjectMembersActions
 * - InviteMemberModal
 * - EditMemberRoleModal
 * - RemoveMemberModal
 * - LeaveProjectModal
 * - TransferOwnershipModal
 * - MemberMutationOverlay
 *
 * Member-management state has been extracted into:
 *
 * - useProjectMemberManagement
 *
 * Shared member utilities live in:
 *
 * - project-member.helpers
 * -----------------------------------------------------------------------------
 */

import React, { useCallback, useState } from "react";

import { Alert, SafeAreaView, StyleSheet, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import ProjectMembersHeader from "@/components/projects/members/ProjectMembersHeader";
import ProjectMembersEmptyState from "@/components/projects/members/ProjectMembersEmptyState";
import ProjectMembersList from "@/components/projects/members/ProjectMembersList";
import ProjectMembersActions from "@/components/projects/members/ProjectMembersActions";

import InviteMemberModal from "@/components/projects/members/InviteMemberModal";
import EditMemberRoleModal from "@/components/projects/members/EditMemberRoleModal";
import RemoveMemberModal from "@/components/projects/members/RemoveMemberModal";
import LeaveProjectModal from "@/components/projects/members/LeaveProjectModal";
import TransferOwnershipModal from "@/components/projects/members/TransferOwnershipModal";
import MemberMutationOverlay from "@/components/projects/members/MemberMutationOverlay";

import useProjectMembers from "@/hooks/projects/useProjectMembers";
import { useProjectMemberManagement } from "@/hooks/projects/useProjectMemberManagement";

import projectService from "@/services/projects/project.service";

import type { ProjectMember } from "@/types/project.types";

/**
 * -----------------------------------------------------------------------------
 * Screen
 * -----------------------------------------------------------------------------
 */

export default function ProjectMembersScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    projectId: string | string[];
  }>();

  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  /**
   * ---------------------------------------------------------------------------
   * Project Members
   * ---------------------------------------------------------------------------
   */

  const { members, isLoading, isRefreshing, error, refresh, refetch } =
    useProjectMembers(projectId);

  /**
   * ---------------------------------------------------------------------------
   * Permissions
   * ---------------------------------------------------------------------------
   *
   * The existing screen currently exposes member-management controls.
   *
   * The backend remains authoritative for the actual permission check.
   */

  const canManageMembers = true;

  /**
   * ---------------------------------------------------------------------------
   * Ownership Transfer State
   * ---------------------------------------------------------------------------
   */

  const [isTransferringOwnership, setIsTransferringOwnership] = useState(false);

  const [isTransferOwnershipModalVisible, setIsTransferOwnershipModalVisible] =
    useState(false);

  const [memberToTransfer, setMemberToTransfer] =
    useState<ProjectMember | null>(null);

  /**
   * ---------------------------------------------------------------------------
   * Member Management
   * ---------------------------------------------------------------------------
   */

  const handleInviteMember = useCallback(
    async ({ email, role }: { email: string; role: "EDITOR" | "VIEWER" }) => {
      if (!projectId) {
        throw new Error("Project ID is required.");
      }

      console.log(
        "[Brika Members] Inviting member:",
        JSON.stringify(
          {
            projectId,
            email,
            role,
          },
          null,
          2,
        ),
      );

      const response = await projectService.inviteMember(projectId, {
        email,
        role,
      });

      console.log(
        "[Brika Members] Invite response:",
        JSON.stringify(response, null, 2),
      );

      return response;
    },
    [projectId],
  );

  const handleUpdateMemberRole = useCallback(
    async (memberId: string, role: "EDITOR" | "VIEWER") => {
      if (!projectId) {
        throw new Error("Project ID is required.");
      }

      console.log(
        "[Brika Members] Updating member role:",
        JSON.stringify(
          {
            projectId,
            memberId,
            role,
          },
          null,
          2,
        ),
      );

      const response = await projectService.updateMemberRole(
        projectId,
        memberId,
        {
          role,
        },
      );

      console.log(
        "[Brika Members] Update role response:",
        JSON.stringify(response, null, 2),
      );

      return response;
    },
    [projectId],
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!projectId) {
        throw new Error("Project ID is required.");
      }

      console.log(
        "[Brika Members] Removing member:",
        JSON.stringify(
          {
            projectId,
            memberId,
          },
          null,
          2,
        ),
      );

      const response = await projectService.removeMember(projectId, memberId);

      console.log(
        "[Brika Members] Remove member response:",
        JSON.stringify(response, null, 2),
      );

      return response;
    },
    [projectId],
  );

  const handleLeaveProject = useCallback(async () => {
    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    console.log("[Brika Members] Leaving project:", projectId);

    const response = await projectService.leaveProject(projectId);

    console.log(
      "[Brika Members] Leave project response:",
      JSON.stringify(response, null, 2),
    );

    return response;
  }, [projectId]);

  /**
   * ---------------------------------------------------------------------------
   * Management Hook
   * ---------------------------------------------------------------------------
   */

  const memberManagement = useProjectMemberManagement({
    projectId: projectId ?? "",

    members,

    onInviteMember: handleInviteMember,

    onUpdateMemberRole: handleUpdateMemberRole,

    onRemoveMember: handleRemoveMember,

    onLeaveProject: handleLeaveProject,

    onMutationSuccess: async (mutation) => {
      console.log("[Brika Members] Mutation succeeded:", mutation);

      await refetch();
    },

    onMutationError: (mutationError, mutation) => {
      console.error(
        `[Brika Members] ${mutation} mutation failed:`,
        mutationError,
      );

      Alert.alert(
        "Action failed",
        getErrorMessage(
          mutationError,
          `Unable to ${getMutationActionLabel(mutation)}.`,
        ),
      );
    },
  });

  /**
   * ---------------------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------------------
   */

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * ---------------------------------------------------------------------------
   * Open Transfer Ownership Modal
   * ---------------------------------------------------------------------------
   *
   * This only opens the confirmation modal.
   *
   * No API request is made here.
   * ---------------------------------------------------------------------------
   */

  const handleTransferOwnership = useCallback(
    (member: ProjectMember) => {
      if (!projectId || isTransferringOwnership) {
        return;
      }

      const userId = member.userId;

      if (!userId) {
        Alert.alert(
          "Unable to transfer ownership",
          "The project member user ID is missing.",
        );

        return;
      }

      console.log(
        "[Brika Members] Preparing ownership transfer:",
        JSON.stringify(
          {
            projectId,
            userId,
            memberId: member.id,
            memberName: getMemberDisplayName(member),
          },
          null,
          2,
        ),
      );

      setMemberToTransfer(member);

      setIsTransferOwnershipModalVisible(true);
    },
    [projectId, isTransferringOwnership],
  );

  /**
   * ---------------------------------------------------------------------------
   * Close Transfer Ownership Modal
   * ---------------------------------------------------------------------------
   */

  const handleCloseTransferOwnershipModal = useCallback(() => {
    if (isTransferringOwnership) {
      return;
    }

    setIsTransferOwnershipModalVisible(false);

    setMemberToTransfer(null);
  }, [isTransferringOwnership]);

  /**
   * ---------------------------------------------------------------------------
   * Confirm Transfer Ownership
   * ---------------------------------------------------------------------------
   *
   * This is the actual ownership-transfer action.
   * ---------------------------------------------------------------------------
   */

  const handleConfirmTransferOwnership = useCallback(async () => {
    if (!projectId || !memberToTransfer || isTransferringOwnership) {
      return;
    }

    const userId = memberToTransfer.userId;

    if (!userId) {
      Alert.alert(
        "Unable to transfer ownership",
        "The project member user ID is missing.",
      );

      return;
    }

    const memberName = getMemberDisplayName(memberToTransfer);

    try {
      setIsTransferringOwnership(true);

      console.log(
        "[Brika Members] Confirmed ownership transfer:",
        JSON.stringify(
          {
            projectId,
            userId,
            memberId: memberToTransfer.id,
            memberName,
          },
          null,
          2,
        ),
      );

      /**
       * Close the confirmation modal before
       * starting the API mutation.
       */
      setIsTransferOwnershipModalVisible(false);

      const response = await projectService.transferOwnership(
        projectId,
        userId,
      );

      console.log(
        "[Brika Members] Transfer ownership response:",
        JSON.stringify(response, null, 2),
      );

      /**
       * Refresh the member list so the new
       * owner immediately appears with role OWNER.
       */
      await refetch();

      /**
       * Clear the selected member after
       * successful completion.
       */
      setMemberToTransfer(null);

      Alert.alert(
        "Ownership transferred",
        `${memberName} is now the project owner.`,
      );
    } catch (transferError) {
      console.error(
        "[Brika Members] Transfer ownership failed:",
        transferError,
      );

      Alert.alert(
        "Unable to transfer ownership",
        getErrorMessage(
          transferError,
          "Project ownership could not be transferred.",
        ),
      );
    } finally {
      setIsTransferringOwnership(false);
    }
  }, [projectId, memberToTransfer, isTransferringOwnership, refetch]);

  /**
   * ---------------------------------------------------------------------------
   * Member Actions
   * ---------------------------------------------------------------------------
   */

  const handleMemberPress = useCallback(
    (member: ProjectMember) => {
      if (member.role === "OWNER") {
        return;
      }

      memberManagement.openRoleModal(member);
    },
    [memberManagement],
  );

  const handleRemovePress = useCallback(
    (member: ProjectMember) => {
      if (member.role === "OWNER") {
        Alert.alert(
          "Owner cannot be removed",
          "Project ownership must be transferred before this member can be removed.",
        );

        return;
      }

      memberManagement.openRemoveModal(member);
    },
    [memberManagement],
  );

  /**
   * ---------------------------------------------------------------------------
   * Refresh
   * ---------------------------------------------------------------------------
   */

  const handleRefresh = useCallback(() => {
    void refresh();
  }, [refresh]);

  /**
   * ---------------------------------------------------------------------------
   * Error / Empty State
   * ---------------------------------------------------------------------------
   */

  const hasMembers = members.length > 0;

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* =================================================================
            Header
            ================================================================= */}

        <ProjectMembersHeader
          memberCount={members.length}
          canManageMembers={canManageMembers}
          onBack={handleBack}
          onAddMember={memberManagement.openInviteModal}
        />

        {/* =================================================================
            Members / Empty / Error
            ================================================================= */}

        {isLoading && !hasMembers ? (
          <ProjectMembersList
            members={[]}
            canManageMembers={canManageMembers}
            isLoading
            isRefreshing={isRefreshing}
            error={null}
            onRefresh={handleRefresh}
            onMemberPress={handleMemberPress}
            onRemoveMember={handleRemovePress}
            onTransferOwnership={handleTransferOwnership}
          />
        ) : error && !hasMembers ? (
          <ProjectMembersEmptyState
            isLoading={false}
            error={error}
            canManageMembers={canManageMembers}
            onRetry={handleRefresh}
          />
        ) : hasMembers ? (
          <ProjectMembersList
            members={members}
            canManageMembers={canManageMembers}
            isLoading={false}
            isRefreshing={isRefreshing}
            error={null}
            onRefresh={handleRefresh}
            onMemberPress={handleMemberPress}
            onRemoveMember={handleRemovePress}
            onTransferOwnership={handleTransferOwnership}
          />
        ) : (
          <ProjectMembersEmptyState
            isLoading={false}
            error={null}
            canManageMembers={canManageMembers}
            onAddMember={memberManagement.openInviteModal}
            onRetry={handleRefresh}
          />
        )}

        {/* =================================================================
            Project Actions
            ================================================================= */}

        {canManageMembers ? (
          <ProjectMembersActions
            canLeave={canManageMembers}
            isLeaving={memberManagement.isLeaving}
            onLeave={memberManagement.openLeaveModal}
          />
        ) : null}

        {/* =================================================================
            Invite Member
            ================================================================= */}

        <InviteMemberModal
          visible={memberManagement.isInviteModalVisible}
          email={memberManagement.inviteEmail}
          role={memberManagement.inviteRole}
          isSubmitting={memberManagement.isInviting}
          accountNotFound={memberManagement.inviteAccountNotFound}
          onEmailChange={memberManagement.setInviteEmail}
          onRoleChange={memberManagement.setInviteRole}
          onClose={memberManagement.closeInviteModal}
          onSubmit={() => {
            void memberManagement.submitInviteMember();
          }}
          onOpenSignUp={() => {
            if (typeof window !== "undefined") {
              window.open(
                `${window.location.origin}/register`,
                "_blank",
                "noopener,noreferrer",
              );

              return;
            }

            router.push("/(auth)/register");
          }}
        />

        {/* =================================================================
            Edit Member Role
            ================================================================= */}

        <EditMemberRoleModal
          visible={memberManagement.isRoleModalVisible}
          member={memberManagement.selectedMember}
          role={memberManagement.selectedRole}
          isSubmitting={memberManagement.isUpdatingRole}
          onRoleChange={memberManagement.setSelectedRole}
          onClose={memberManagement.closeRoleModal}
          onSave={() => {
            void memberManagement.submitUpdateMemberRole();
          }}
        />

        {/* =================================================================
            Remove Member
            ================================================================= */}

        <RemoveMemberModal
          visible={memberManagement.isRemoveModalVisible}
          member={memberManagement.selectedMember}
          isSubmitting={memberManagement.isRemoving}
          onClose={memberManagement.closeRemoveModal}
          onConfirm={() => {
            void memberManagement.submitRemoveMember();
          }}
        />

        {/* =================================================================
            Leave Project
            ================================================================= */}

        <LeaveProjectModal
          visible={memberManagement.isLeaveModalVisible}
          isSubmitting={memberManagement.isLeaving}
          onClose={memberManagement.closeLeaveModal}
          onConfirm={() => {
            void memberManagement.submitLeaveProject();
          }}
        />

        {/* =================================================================
            Transfer Ownership
            ================================================================= */}

        <TransferOwnershipModal
          visible={isTransferOwnershipModalVisible}
          member={memberToTransfer}
          isSubmitting={isTransferringOwnership}
          onClose={handleCloseTransferOwnershipModal}
          onConfirm={() => {
            void handleConfirmTransferOwnership();
          }}
        />

        {/* =================================================================
            Mutation Overlay
            ================================================================= */}

        <MemberMutationOverlay
          visible={
            memberManagement.isMemberMutationPending || isTransferringOwnership
          }
          mutationType={
            isTransferringOwnership
              ? "transfer"
              : (memberManagement.memberMutationType ?? "invite")
          }
        />
      </View>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

function getMemberDisplayName(member: ProjectMember): string {
  const user = member.user;

  const fullName = [user?.firstName, user?.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (user?.email?.trim()) {
    return user.email.trim();
  }

  return "Project member";
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const value = error as Record<string, unknown>;

    if (typeof value.message === "string" && value.message.trim()) {
      return value.message;
    }
  }

  return fallback;
}

function getMutationActionLabel(
  mutation: "invite" | "update-role" | "remove" | "leave",
): string {
  switch (mutation) {
    case "invite":
      return "add the member";

    case "update-role":
      return "update the member role";

    case "remove":
      return "remove the member";

    case "leave":
      return "leave the project";

    default:
      return "complete this action";
  }
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
  },
});
