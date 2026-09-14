/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/[projectId]/index.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Individual Project screen.
 *
 * Responsibilities:
 *
 * - Read the project ID from the route.
 * - Load the project.
 * - Display project information.
 * - Edit project information.
 * - Archive and restore the project.
 * - Delete the project.
 * - Provide navigation to project files, members, and activity.
 *
 * This screen does NOT:
 *
 * - Perform API requests directly.
 * - Manage project data outside the project hook.
 * - Implement file upload networking.
 * - Manage project files directly.
 *
 * All project mutations are handled by useProject.
 * File upload and file management are handled by the project Files screen.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useProject } from "@/hooks/projects/useProject";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";
import { radius } from "@/constants/theme/radius";

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export default function ProjectScreen() {
  const { projectId } = useLocalSearchParams<{
    projectId: string;
  }>();

  const {
    project,
    isLoading,
    isMutating,
    error,
    refetch,
    update,
    remove,
    archive,
    restore,
  } = useProject(projectId);

  /**
   * ---------------------------------------------------------------------------
   * Local edit state
   * ---------------------------------------------------------------------------
   */

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /**
   * Keep the local edit form synchronized with the loaded project.
   */

  useEffect(() => {
    if (!project) {
      return;
    }

    setName(project.name);
    setDescription(project.description ?? "");
  }, [project]);

  /**
   * ---------------------------------------------------------------------------
   * Edit
   * ---------------------------------------------------------------------------
   */

  const handleStartEditing = () => {
    if (!project || isMutating) {
      return;
    }

    setName(project.name);
    setDescription(project.description ?? "");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (isMutating) {
      return;
    }

    setName(project?.name ?? "");
    setDescription(project?.description ?? "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!project || isMutating) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert(
        "Project name required",
        "Please enter a name for the project.",
      );

      return;
    }

    try {
      await update({
        name: trimmedName,
        description: description.trim() || undefined,
      });

      setIsEditing(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update the project.";

      Alert.alert("Update failed", message);
    }
  };

  /**
   * ---------------------------------------------------------------------------
   * Archive
   * ---------------------------------------------------------------------------
   */

  const handleArchive = () => {
    if (!project || isMutating) {
      return;
    }

    Alert.alert(
      "Archive project",
      `Are you sure you want to archive "${project.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Archive",
          onPress: async () => {
            try {
              await archive();
            } catch (err) {
              const message =
                err instanceof Error
                  ? err.message
                  : "Unable to archive the project.";

              Alert.alert("Archive failed", message);
            }
          },
        },
      ],
    );
  };

  /**
   * ---------------------------------------------------------------------------
   * Restore
   * ---------------------------------------------------------------------------
   */

  const handleRestore = async () => {
    if (!project || isMutating) {
      return;
    }

    try {
      await restore();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to restore the project.";

      Alert.alert("Restore failed", message);
    }
  };

  /**
   * ---------------------------------------------------------------------------
   * Delete
   * ---------------------------------------------------------------------------
   */

  const handleDelete = () => {
    if (!project || isMutating) {
      return;
    }

    Alert.alert(
      "Delete project",
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await remove();

              router.replace("/(tabs)/projects");
            } catch (err) {
              const message =
                err instanceof Error
                  ? err.message
                  : "Unable to delete the project.";

              Alert.alert("Delete failed", message);
            }
          },
        },
      ],
    );
  };

  /**
   * ---------------------------------------------------------------------------
   * Project Files Navigation
   * ---------------------------------------------------------------------------
   */

  const handleOpenFiles = () => {
    if (!project?.id) {
      return;
    }

    router.push({
      pathname: "/(tabs)/projects/[projectId]/files",
      params: {
        projectId: project.id,
      },
    });
  };

  /**
   * ---------------------------------------------------------------------------
   * Project Members Navigation
   * ---------------------------------------------------------------------------
   */

  const handleOpenMembers = () => {
    if (!project) {
      return;
    }

    router.push(`/(tabs)/projects/${project.id}/members`);
  };

  /**
   * ---------------------------------------------------------------------------
   * Project Activity Navigation
   * ---------------------------------------------------------------------------
   */

  const handleOpenActivity = () => {
    if (!project) {
      return;
    }

    router.push(`/(tabs)/projects/${project.id}/activity`);
  };

  /**
   * ---------------------------------------------------------------------------
   * Loading
   * ---------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brand.accent} />

          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.statusText}
          >
            Loading project...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Error
   * ---------------------------------------------------------------------------
   */

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color={colors.status.error}
            />
          </View>

          <ThemedText type="title" style={styles.errorTitle}>
            Unable to load project
          </ThemedText>

          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.errorMessage}
          >
            {error.message}
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try again"
            onPress={refetch}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.text.inverse}
            />

            <ThemedText type="smallBold" themeColor="inverse">
              Try again
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Missing Project
   * ---------------------------------------------------------------------------
   */

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="folder-open-outline"
              size={28}
              color={colors.brand.accent}
            />
          </View>

          <ThemedText type="title" style={styles.errorTitle}>
            Project not found
          </ThemedText>

          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.errorMessage}
          >
            This project may have been deleted or you may no longer have access
            to it.
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to projects"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back-outline"
              size={18}
              color={colors.text.inverse}
            />

            <ThemedText type="smallBold" themeColor="inverse">
              Back to projects
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Edit Project
   * ---------------------------------------------------------------------------
   */

  if (isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* -----------------------------------------------------------------
             * Edit Header
             * ----------------------------------------------------------------- */}

            <View style={styles.editHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel editing"
                disabled={isMutating}
                onPress={handleCancelEditing}
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={colors.text.primary}
                />
              </Pressable>

              <View style={styles.editHeaderContent}>
                <ThemedText type="title">Edit project</ThemedText>

                <ThemedText
                  type="small"
                  themeColor="secondary"
                  style={styles.editSubtitle}
                >
                  Update your project information.
                </ThemedText>
              </View>
            </View>

            {/* -----------------------------------------------------------------
             * Form
             * ----------------------------------------------------------------- */}

            <View style={styles.card}>
              <View style={styles.field}>
                <ThemedText type="smallBold" style={styles.fieldLabel}>
                  Project name
                </ThemedText>

                <TextInput
                  accessibilityLabel="Project name"
                  editable={!isMutating}
                  onChangeText={setName}
                  placeholder="Enter project name"
                  placeholderTextColor={colors.text.muted}
                  style={styles.input}
                  value={name}
                />
              </View>

              <View style={styles.field}>
                <ThemedText type="smallBold" style={styles.fieldLabel}>
                  Description
                </ThemedText>

                <TextInput
                  accessibilityLabel="Project description"
                  editable={!isMutating}
                  multiline
                  numberOfLines={5}
                  onChangeText={setDescription}
                  placeholder="Add a project description"
                  placeholderTextColor={colors.text.muted}
                  style={[styles.input, styles.textArea]}
                  textAlignVertical="top"
                  value={description}
                />
              </View>
            </View>

            {/* -----------------------------------------------------------------
             * Form Actions
             * ----------------------------------------------------------------- */}

            <View style={styles.formActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                disabled={isMutating}
                onPress={handleCancelEditing}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressed,
                  isMutating && styles.disabled,
                ]}
              >
                <ThemedText type="smallBold">Cancel</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save project"
                disabled={isMutating}
                onPress={handleSave}
                style={({ pressed }) => [
                  styles.primaryButton,
                  styles.formPrimaryButton,
                  pressed && styles.pressed,
                  isMutating && styles.disabled,
                ]}
              >
                {isMutating ? (
                  <ActivityIndicator size="small" color={colors.text.inverse} />
                ) : (
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={colors.text.inverse}
                  />
                )}

                <ThemedText type="smallBold" themeColor="inverse">
                  {isMutating ? "Saving..." : "Save changes"}
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Project
   * ---------------------------------------------------------------------------
   */

  const isArchived = String(project.status).toUpperCase() === "ARCHIVED";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ---------------------------------------------------------------------
         * Header
         * --------------------------------------------------------------------- */}

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="folder-outline"
              size={28}
              color={colors.brand.accent}
            />
          </View>

          <View style={styles.headerContent}>
            <ThemedText type="title">{project.name}</ThemedText>

            {project.description ? (
              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.description}
              >
                {project.description}
              </ThemedText>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit project"
            disabled={isMutating}
            onPress={handleStartEditing}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
              isMutating && styles.disabled,
            ]}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={colors.text.primary}
            />
          </Pressable>
        </View>

        {/* ---------------------------------------------------------------------
         * Project Information
         * --------------------------------------------------------------------- */}

        <View style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardTitle}>
            Project information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText type="small" themeColor="secondary">
              Status
            </ThemedText>

            <View
              style={[styles.statusBadge, isArchived && styles.archivedBadge]}
            >
              <ThemedText
                type="smallBold"
                style={
                  isArchived ? styles.archivedBadgeText : styles.activeBadgeText
                }
              >
                {String(project.status)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <ThemedText type="small" themeColor="secondary">
              Visibility
            </ThemedText>

            <ThemedText type="smallBold">
              {String(project.visibility)}
            </ThemedText>
          </View>
        </View>

        {/* ---------------------------------------------------------------------
         * Project Navigation
         * --------------------------------------------------------------------- */}

        <View style={styles.actions}>
          {/* -------------------------------------------------------------------
           * Files
           * ------------------------------------------------------------------- */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View and upload project files"
            onPress={handleOpenFiles}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="document-attach-outline"
                size={22}
                color={colors.brand.accent}
              />
            </View>

            <View style={styles.actionContent}>
              <ThemedText type="smallBold">Files</ThemedText>

              <ThemedText type="small" themeColor="secondary">
                Upload and manage project files
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.muted}
            />
          </Pressable>

          {/* -------------------------------------------------------------------
           * Members
           * ------------------------------------------------------------------- */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View project members"
            onPress={handleOpenMembers}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="people-outline"
                size={22}
                color={colors.brand.accent}
              />
            </View>

            <View style={styles.actionContent}>
              <ThemedText type="smallBold">Members</ThemedText>

              <ThemedText type="small" themeColor="secondary">
                Manage project members
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.muted}
            />
          </Pressable>

          {/* -------------------------------------------------------------------
           * Activity
           * ------------------------------------------------------------------- */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View project activity"
            onPress={handleOpenActivity}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="time-outline"
                size={22}
                color={colors.brand.accent}
              />
            </View>

            <View style={styles.actionContent}>
              <ThemedText type="smallBold">Activity</ThemedText>

              <ThemedText type="small" themeColor="secondary">
                View project activity
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.muted}
            />
          </Pressable>
        </View>

        {/* ---------------------------------------------------------------------
         * Project Management
         * --------------------------------------------------------------------- */}

        <View style={styles.managementCard}>
          <ThemedText type="smallBold" style={styles.cardTitle}>
            Project management
          </ThemedText>

          {isArchived ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restore project"
              disabled={isMutating}
              onPress={handleRestore}
              style={({ pressed }) => [
                styles.managementButton,
                pressed && styles.pressedCard,
                isMutating && styles.disabled,
              ]}
            >
              <View style={styles.managementIcon}>
                {isMutating ? (
                  <ActivityIndicator size="small" color={colors.brand.accent} />
                ) : (
                  <Ionicons
                    name="refresh-outline"
                    size={21}
                    color={colors.brand.accent}
                  />
                )}
              </View>

              <View style={styles.actionContent}>
                <ThemedText type="smallBold">
                  {isMutating ? "Restoring..." : "Restore project"}
                </ThemedText>

                <ThemedText type="small" themeColor="secondary">
                  Move this project back to active projects
                </ThemedText>
              </View>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Archive project"
              disabled={isMutating}
              onPress={handleArchive}
              style={({ pressed }) => [
                styles.managementButton,
                pressed && styles.pressedCard,
                isMutating && styles.disabled,
              ]}
            >
              <View style={styles.managementIcon}>
                {isMutating ? (
                  <ActivityIndicator size="small" color={colors.brand.accent} />
                ) : (
                  <Ionicons
                    name="archive-outline"
                    size={21}
                    color={colors.brand.accent}
                  />
                )}
              </View>

              <View style={styles.actionContent}>
                <ThemedText type="smallBold">
                  {isMutating ? "Archiving..." : "Archive project"}
                </ThemedText>

                <ThemedText type="small" themeColor="secondary">
                  Hide this project from your active projects
                </ThemedText>
              </View>
            </Pressable>
          )}

          <View style={styles.managementDivider} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete project"
            disabled={isMutating}
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.managementButton,
              pressed && styles.pressedCard,
              isMutating && styles.disabled,
            ]}
          >
            <View style={styles.deleteIcon}>
              <Ionicons
                name="trash-outline"
                size={21}
                color={colors.status.error}
              />
            </View>

            <View style={styles.actionContent}>
              <ThemedText type="smallBold" style={styles.deleteTitle}>
                Delete project
              </ThemedText>

              <ThemedText type="small" themeColor="secondary">
                Permanently remove this project
              </ThemedText>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  statusText: {
    marginTop: spacing.md,
  },

  errorIcon: {
    width: 56,
    height: 56,
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.status.errorBackground,
  },

  errorTitle: {
    textAlign: "center",
  },

  errorMessage: {
    maxWidth: 400,
    marginTop: spacing.xs,
    textAlign: "center",
  },

  primaryButton: {
    minHeight: 46,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.brand.accent,
  },

  formPrimaryButton: {
    flex: 1,
    marginTop: 0,
  },

  secondaryButton: {
    minHeight: 46,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  pressed: {
    opacity: 0.7,
  },

  pressedCard: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  headerIcon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.brand.accentLight,
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
  },

  description: {
    marginTop: spacing.xs,
  },

  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  card: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  cardTitle: {
    marginBottom: spacing.md,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.status.successBackground,
  },

  activeBadgeText: {
    color: colors.status.success,
  },

  archivedBadge: {
    backgroundColor: colors.status.warningBackground,
  },

  archivedBadgeText: {
    color: colors.status.warning,
  },

  actions: {
    gap: spacing.md,
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  actionIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.brand.accentLight,
  },

  actionContent: {
    flex: 1,
    gap: spacing.xs,
  },

  managementCard: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.surface,
  },

  managementButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },

  managementIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.brand.accentLight,
  },

  deleteIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.status.errorBackground,
  },

  deleteTitle: {
    color: colors.status.error,
  },

  managementDivider: {
    height: 1,
    marginVertical: spacing.sm,
    backgroundColor: colors.border.light,
  },

  editHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  editHeaderContent: {
    flex: 1,
    minWidth: 0,
  },

  editSubtitle: {
    marginTop: spacing.xs,
  },

  field: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },

  fieldLabel: {
    marginBottom: spacing.xs,
  },

  input: {
    minHeight: 46,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    fontFamily: "Inter-Regular",
    fontSize: 15,
  },

  textArea: {
    minHeight: 120,
    paddingTop: spacing.md,
  },

  formActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
});
