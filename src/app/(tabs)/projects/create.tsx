/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/projects/create.tsx
 * -----------------------------------------------------------------------------
 * Brika Projects
 *
 * Create Project screen.
 *
 * Responsibilities:
 *
 * - Render the project creation form.
 * - Navigate back when creation is cancelled.
 * - Submit project creation through the project hook.
 * - Disable the form while the request is processing.
 * - Show a success modal after successful creation.
 * - Navigate to the newly-created project.
 *
 * This screen does NOT:
 *
 * - Implement form validation.
 * - Perform project API requests directly.
 * - Manage project creation business logic.
 * - Duplicate project form fields.
 * -----------------------------------------------------------------------------
 */

import React, { useState } from "react";

import { Modal, Pressable, SafeAreaView, StyleSheet, View } from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { CreateProjectForm } from "@/components/projects/CreateProjectForm";

import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";
import { radius } from "@/constants/theme/radius";

import { ThemedText } from "@/components/themed-text";

import type { CreateProjectInput } from "@/types/project.types";

import { useProject } from "@/hooks/projects/useProject";

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export default function CreateProjectScreen() {
  const { create, isMutating, error } = useProject();

  /**
   * ID of the successfully-created project.
   *
   * When this is not null, the success modal is displayed.
   */
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  /**
   * Name of the successfully-created project.
   *
   * Used only for the success message.
   */
  const [createdProjectName, setCreatedProjectName] = useState<string | null>(
    null,
  );

  /**
   * ---------------------------------------------------------------------------
   * Cancel
   * ---------------------------------------------------------------------------
   */

  const handleCancel = () => {
    /**
     * Never allow the user to leave while the creation request is processing.
     */
    if (isMutating) {
      return;
    }

    router.back();
  };

  /**
   * ---------------------------------------------------------------------------
   * Submit
   * ---------------------------------------------------------------------------
   */

  const handleSubmit = async (data: CreateProjectInput) => {
    if (isMutating) {
      return;
    }

    try {
      const project = await create(data);

      router.replace({
        pathname: "/(tabs)/projects/[projectId]",
        params: {
          projectId: project.id,
        },
      });
    } catch {
      // The hook owns the normalized error.
    }
  };

  /**
   * ---------------------------------------------------------------------------
   * Close Success Modal
   * ---------------------------------------------------------------------------
   */

  const handleCloseSuccessModal = () => {
    setCreatedProjectId(null);
    setCreatedProjectName(null);
  };

  /**
   * ---------------------------------------------------------------------------
   * Open Created Project
   * ---------------------------------------------------------------------------
   */

  const handleOpenProject = () => {
    /**
     * Do nothing if there is no project ID.
     */
    if (!createdProjectId) {
      return;
    }

    /**
     * Capture the ID before closing the modal.
     */
    const projectId = createdProjectId;

    /**
     * Close the modal immediately.
     */
    setCreatedProjectId(null);
    setCreatedProjectName(null);

    /**
     * Navigate directly to:
     *
     * /(tabs)/projects/[projectId]/index.tsx
     *
     * Using the object form makes the dynamic route explicit.
     */
    router.replace({
      pathname: "/(tabs)/projects/[projectId]",
      params: {
        projectId,
      },
    });
  };

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <CreateProjectForm
        onSubmit={handleSubmit}
        loading={isMutating}
        error={error?.message ?? null}
        onCancel={handleCancel}
        disabled={isMutating}
      />

      {/* -----------------------------------------------------------------------
       * Success Modal
       * ----------------------------------------------------------------------- */}

      <Modal
        animationType="fade"
        transparent
        visible={createdProjectId !== null}
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.modalRoot}>
          {/* -------------------------------------------------------------------
           * Dismissable Backdrop
           * ------------------------------------------------------------------- */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close project created dialog"
            onPress={handleCloseSuccessModal}
            style={styles.modalBackdrop}
          />

          {/* -------------------------------------------------------------------
           * Modal Card
           *
           * This is deliberately a View instead of a nested Pressable.
           * The backdrop is a separate sibling, so pressing anywhere inside
           * the white card cannot close the modal.
           * ------------------------------------------------------------------- */}

          <View accessible accessibilityViewIsModal style={styles.modalCard}>
            {/* -----------------------------------------------------------------
             * Success Icon
             * ----------------------------------------------------------------- */}

            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark"
                size={30}
                color={colors.brand.accent}
              />
            </View>

            {/* -----------------------------------------------------------------
             * Content
             * ----------------------------------------------------------------- */}

            <View style={styles.modalContent}>
              <ThemedText type="title" style={styles.modalTitle}>
                Project created
              </ThemedText>

              <ThemedText
                type="small"
                themeColor="secondary"
                style={styles.modalMessage}
              >
                {createdProjectName
                  ? `"${createdProjectName}" has been created successfully.`
                  : "Your project has been created successfully."}
              </ThemedText>
            </View>

            {/* -----------------------------------------------------------------
             * Open Project
             * ----------------------------------------------------------------- */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open project"
              accessibilityState={{
                disabled: !createdProjectId,
              }}
              disabled={!createdProjectId}
              onPress={handleOpenProject}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Ionicons
                name="folder-open-outline"
                size={19}
                color={colors.text.inverse}
              />

              <ThemedText type="button" themeColor="inverse">
                Open Project
              </ThemedText>
            </Pressable>

            {/* -----------------------------------------------------------------
             * Done
             * ----------------------------------------------------------------- */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close project created dialog"
              onPress={handleCloseSuccessModal}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <ThemedText type="button">Done</ThemedText>
            </Pressable>

            {/* -----------------------------------------------------------------
             * Dismiss Hint
             * ----------------------------------------------------------------- */}

            <ThemedText
              type="small"
              themeColor="muted"
              style={styles.dismissHint}
            >
              You can also tap outside to close
            </ThemedText>
          </View>
        </View>
      </Modal>
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

  /**
   * Modal root.
   *
   * Fills the entire native modal window.
   */
  modalRoot: {
    alignItems: "center",

    flex: 1,

    justifyContent: "center",

    paddingHorizontal: spacing.lg,
  },

  /**
   * Full-screen dark backdrop.
   *
   * This is intentionally a sibling of the modal card.
   *
   * Result:
   *
   * - Tap outside card -> closes modal.
   * - Tap inside card -> does NOT close modal.
   */
  modalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",

    bottom: 0,

    left: 0,

    position: "absolute",

    right: 0,

    top: 0,
  },

  /**
   * Success modal card.
   */
  modalCard: {
    backgroundColor: colors.background.surface,

    borderRadius: radius.lg,

    maxWidth: 440,

    padding: spacing.xl,

    width: "100%",
  },

  /**
   * Success icon container.
   */
  successIcon: {
    alignItems: "center",

    alignSelf: "center",

    backgroundColor: colors.brand.accentLight,

    borderRadius: radius.pill,

    height: 64,

    justifyContent: "center",

    marginBottom: spacing.lg,

    width: 64,
  },

  /**
   * Modal text content.
   */
  modalContent: {
    alignItems: "center",
  },

  modalTitle: {
    textAlign: "center",
  },

  modalMessage: {
    marginTop: spacing.sm,

    maxWidth: 360,

    textAlign: "center",
  },

  /**
   * Primary "Open Project" button.
   */
  primaryButton: {
    alignItems: "center",

    backgroundColor: colors.brand.accent,

    borderRadius: radius.md,

    flexDirection: "row",

    gap: spacing.xs,

    justifyContent: "center",

    marginTop: spacing.xl,

    minHeight: 48,

    paddingHorizontal: spacing.lg,
  },

  primaryButtonPressed: {
    opacity: 0.7,
  },

  /**
   * Secondary "Done" button.
   */
  secondaryButton: {
    alignItems: "center",

    borderColor: colors.border.light,

    borderRadius: radius.md,

    borderWidth: 1,

    justifyContent: "center",

    marginTop: spacing.sm,

    minHeight: 48,

    paddingHorizontal: spacing.lg,
  },

  secondaryButtonPressed: {
    opacity: 0.6,
  },

  /**
   * Outside-dismiss hint.
   */
  dismissHint: {
    marginTop: spacing.md,

    textAlign: "center",
  },
});
