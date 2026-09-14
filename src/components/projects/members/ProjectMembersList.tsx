/**
 * -----------------------------------------------------------------------------
 * File: src/components/projects/members/ProjectMembersList.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Project members list.
 * -----------------------------------------------------------------------------
 */

import React, { useCallback } from "react";

import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

import ProjectMembersEmptyState from "@/components/projects/members/ProjectMembersEmptyState";
import ProjectMemberRow from "@/components/projects/ProjectMemberRow";

import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";

import type { ProjectMember } from "@/types/project.types";

export interface ProjectMembersListProps {
  members: ProjectMember[];

  isLoading?: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;

  canManageMembers?: boolean;

  onRefresh: () => void | Promise<void>;

  onAddMember?: () => void;

  onMemberPress?: (member: ProjectMember) => void;

  onRemoveMember?: (member: ProjectMember) => void;

  onTransferOwnership?: (member: ProjectMember) => void;

  getErrorMessage?: (error: unknown, fallback: string) => string;
}

export function ProjectMembersList({
  members,
  isLoading = false,
  isRefreshing = false,
  error = null,
  canManageMembers = false,
  onRefresh,
  onAddMember,
  onMemberPress,
  onRemoveMember,
  onTransferOwnership,
  getErrorMessage,
}: ProjectMembersListProps) {
  const handleRefresh = useCallback(() => {
    void onRefresh();
  }, [onRefresh]);

  const keyExtractor = useCallback((member: ProjectMember, index: number) => {
    return member.id || `project-member-${index}`;
  }, []);

  const renderMember = useCallback(
    ({ item }: { item: ProjectMember; index: number }) => {
      return (
        <ProjectMemberRow
          member={item}
          canManage={canManageMembers}
          onPress={onMemberPress ? () => onMemberPress(item) : undefined}
          onRemove={onRemoveMember ? () => onRemoveMember(item) : undefined}
          onTransferOwnership={
            onTransferOwnership ? () => onTransferOwnership(item) : undefined
          }
        />
      );
    },
    [canManageMembers, onMemberPress, onRemoveMember, onTransferOwnership],
  );

  const renderSeparator = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const renderEmptyComponent = useCallback(() => {
    return (
      <ProjectMembersEmptyState
        isLoading={isLoading}
        error={error}
        canManageMembers={canManageMembers}
        onRetry={onRefresh}
        onAddMember={onAddMember}
        getErrorMessage={getErrorMessage}
      />
    );
  }, [
    isLoading,
    error,
    canManageMembers,
    onRefresh,
    onAddMember,
    getErrorMessage,
  ]);

  const renderFooter = useCallback(() => {
    if (members.length === 0) {
      return null;
    }

    return <View style={styles.footer} />;
  }, [members.length]);

  return (
    <FlatList
      data={members}
      keyExtractor={keyExtractor}
      renderItem={renderMember}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooter}
      contentContainerStyle={[
        styles.contentContainer,
        members.length === 0 && styles.emptyContentContainer,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.brand.accent}
          colors={[colors.brand.accent]}
        />
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

export default ProjectMembersList;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  emptyContentContainer: {
    flexGrow: 1,
  },

  separator: {
    height: spacing.sm,
  },

  footer: {
    height: spacing.lg,
  },
});
