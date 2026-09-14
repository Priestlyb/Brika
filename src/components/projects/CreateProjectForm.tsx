/**

* ---
* File: src/components/projects/CreateProjectForm.tsx
* ---
* Brika Projects
*
* Form used to create a new project.
*
* Responsibilities:
*
* * Collect project information.
* * Validate project input.
* * Display validation errors.
* * Submit validated project data.
* * Display submission state.
* * Disable all form controls while submission is processing.
*
* This component does NOT:
*
* * Call the Project API directly.
* * Navigate after creation.
* * Manage global project state.
*
* API communication belongs in:
*
* ```
  services/projects/project.service.ts
  ```
*
* Project mutation state belongs in:
*
* ```
  hooks/projects/useProject.ts
  ```
* ---

*/

import React from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Ionicons } from "@expo/vector-icons";

import { PROJECT_VISIBILITY_OPTIONS } from "@/constants/project.constants";

import { createProjectSchema } from "@/validation/project.validation";

import type { CreateProjectInput } from "@/types/project.types";

import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";
import { typography } from "@/constants/theme/typography";

import { ThemedText } from "@/components/themed-text";

/**

* ---
* Form Schema
* ---
*
* The central validation schema remains in:
*
* ```
  src/validation/project.validation.ts
  ```
*
* We infer the form type directly from the schema so the form and validation
* rules cannot drift apart.
* ---

*/

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

/**

* ---
* Props
* ---

*/

export interface CreateProjectFormProps {
  /**

* Called with validated project data.
  */
  onSubmit: (data: CreateProjectInput) => void | Promise<void>;

  /**

* Whether the project is currently being created.
  */
  loading?: boolean;

  /**

* Optional API/server error.
  */
  error?: string | null;

  /**

* Optional cancel handler.
  */
  onCancel?: () => void;

  /**

* Prevent form interaction.
  */
  disabled?: boolean;
}

/**

* ---
* Component
* ---

*/

export function CreateProjectForm({
  onSubmit,
  loading = false,
  error = null,
  onCancel,
  disabled = false,
}: CreateProjectFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),

    defaultValues: {
      name: "",
      description: "",
      visibility: "PRIVATE",
    },
  });

  /**

* ---
* Combined disabled state
* ---
*
* A control is disabled when either:
*
* * the parent explicitly disables the form, or
* * the project creation request is currently processing.
    */

  const isDisabled = loading || disabled;

  /**

* ---
* Submit
* ---

*/

  const submitForm = async (values: CreateProjectFormValues) => {
    /**
     * Defensive protection against duplicate submissions.
     *
     * The button is already disabled while loading, but this guard ensures
     * that the callback cannot intentionally submit while the form is locked.
     */
    if (isDisabled) {
      return;
    }

    await onSubmit(values as CreateProjectInput);
  };

  /**

* ---
* Render
* ---

*/

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* -----------------------------------------------------------------
       * Header
       * ----------------------------------------------------------------- */}

      <View style={styles.header}>
        <ThemedText type="title">Create project</ThemedText>

        <ThemedText
          type="small"
          themeColor="secondary"
          style={styles.headerDescription}
        >
          Add the basic details for your new architectural project.
        </ThemedText>
      </View>
      {/* -----------------------------------------------------------------
       * Server Error
       * ----------------------------------------------------------------- */}
      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={colors.status.error}
          />

          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.errorBannerText}
          >
            {error}
          </ThemedText>
        </View>
      ) : null}
      {/* -----------------------------------------------------------------
       * Project Name
       * ----------------------------------------------------------------- */}
      <View style={styles.field}>
        <ThemedText type="smallBold" style={styles.label}>
          Project name
        </ThemedText>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!isDisabled}
              selectTextOnFocus={!isDisabled}
              placeholder="e.g. Riverside Residence"
              placeholderTextColor={colors.text.muted}
              style={[
                styles.input,
                errors.name && styles.inputError,
                isDisabled && styles.inputDisabled,
              ]}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              maxLength={100}
            />
          )}
        />

        {errors.name ? (
          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.fieldError}
          >
            {errors.name.message}
          </ThemedText>
        ) : null}
      </View>
      {/* -----------------------------------------------------------------
       * Description
       * ----------------------------------------------------------------- */}
      <View style={styles.field}>
        <ThemedText type="smallBold" style={styles.label}>
          Description
        </ThemedText>

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!isDisabled}
              selectTextOnFocus={!isDisabled}
              placeholder="Briefly describe the project"
              placeholderTextColor={colors.text.muted}
              style={[
                styles.input,
                styles.textarea,
                errors.description && styles.inputError,
                isDisabled && styles.inputDisabled,
              ]}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={1000}
            />
          )}
        />

        {errors.description ? (
          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.fieldError}
          >
            {errors.description.message}
          </ThemedText>
        ) : null}
      </View>
      {/* -----------------------------------------------------------------
       * Visibility
       * ----------------------------------------------------------------- */}
      <View style={styles.field}>
        <ThemedText type="smallBold" style={styles.label}>
          Visibility
        </ThemedText>

        <Controller
          control={control}
          name="visibility"
          render={({ field: { onChange, value } }) => (
            <View style={styles.visibilityList}>
              {PROJECT_VISIBILITY_OPTIONS.map((option) => {
                const selected = value === option.value;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityLabel={`${option.label} visibility`}
                    accessibilityState={{
                      checked: selected,
                      disabled: isDisabled,
                    }}
                    disabled={isDisabled}
                    onPress={() => onChange(option.value)}
                    style={({ pressed }) => [
                      styles.visibilityOption,

                      selected && styles.visibilityOptionSelected,

                      isDisabled && styles.disabled,

                      pressed && !isDisabled && styles.visibilityOptionPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.radio,
                        selected && styles.radioSelected,
                        isDisabled && styles.radioDisabled,
                      ]}
                    >
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>

                    <View style={styles.visibilityText}>
                      <ThemedText type="smallBold">{option.label}</ThemedText>

                      <ThemedText type="small" themeColor="secondary">
                        {option.description}
                      </ThemedText>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        />

        {errors.visibility ? (
          <ThemedText
            type="small"
            themeColor="secondary"
            style={styles.fieldError}
          >
            {errors.visibility.message}
          </ThemedText>
        ) : null}
      </View>
      {/* -----------------------------------------------------------------
       * Actions
       * ----------------------------------------------------------------- */}
      <View style={styles.actions}>
        {/* ---------------------------------------------------------------
         * Cancel
         * --------------------------------------------------------------- */}

        {onCancel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel project creation"
            accessibilityState={{
              disabled: isDisabled,
            }}
            disabled={isDisabled}
            onPress={onCancel}
            style={({ pressed }) => [
              styles.cancelButton,

              isDisabled && styles.disabled,

              pressed && !isDisabled && styles.cancelButtonPressed,
            ]}
          >
            <ThemedText type="button">Cancel</ThemedText>
          </Pressable>
        ) : null}

        {/* ---------------------------------------------------------------
         * Create Project
         * --------------------------------------------------------------- */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={loading ? "Creating project" : "Create project"}
          accessibilityState={{
            disabled: isDisabled,
            busy: loading,
          }}
          disabled={isDisabled}
          onPress={handleSubmit(submitForm)}
          style={({ pressed }) => [
            styles.submitButton,

            isDisabled && styles.disabled,

            pressed && !isDisabled && styles.submitButtonPressed,
          ]}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color={colors.text.inverse} />

              <ThemedText
                type="button"
                themeColor="inverse"
                style={styles.submitText}
              >
                Creating...
              </ThemedText>
            </>
          ) : (
            <>
              <Ionicons name="add" size={18} color={colors.text.inverse} />

              <ThemedText
                type="button"
                themeColor="inverse"
                style={styles.submitText}
              >
                Create project
              </ThemedText>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

/**

* ---
* Styles
* ---

*/

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,

    paddingVertical: spacing.xl,

    paddingBottom: spacing.xxxl,
  },

  header: {
    marginBottom: spacing.xxl,
  },

  headerDescription: {
    marginTop: spacing.xs,
  },

  field: {
    marginBottom: spacing.xl,
  },

  label: {
    marginBottom: spacing.sm,
  },

  input: {
    backgroundColor: colors.background.surface,

    borderColor: colors.border.light,

    borderRadius: 8,

    borderWidth: 1,

    color: colors.text.primary,

    fontFamily: typography.body.fontFamily,

    fontSize: typography.body.fontSize,

    lineHeight: typography.body.lineHeight,

    minHeight: 48,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,
  },

  inputDisabled: {
    opacity: 0.55,
  },

  textarea: {
    minHeight: 120,

    paddingTop: spacing.md,
  },

  inputError: {
    borderColor: colors.status.error,
  },

  fieldError: {
    color: colors.status.error,

    marginTop: spacing.xs,
  },

  errorBanner: {
    alignItems: "flex-start",

    backgroundColor: colors.status.errorBackground,

    borderColor: colors.status.error,

    borderRadius: 8,

    borderWidth: 1,

    flexDirection: "row",

    gap: spacing.sm,

    marginBottom: spacing.xl,

    padding: spacing.md,
  },

  errorBannerText: {
    color: colors.status.error,

    flex: 1,
  },

  visibilityList: {
    gap: spacing.sm,
  },

  visibilityOption: {
    alignItems: "center",

    backgroundColor: colors.background.surface,

    borderColor: colors.border.light,

    borderRadius: 8,

    borderWidth: 1,

    flexDirection: "row",

    padding: spacing.md,
  },

  visibilityOptionSelected: {
    borderColor: colors.brand.accent,

    backgroundColor: colors.brand.accentLight,
  },

  visibilityOptionPressed: {
    opacity: 0.85,
  },

  radio: {
    alignItems: "center",

    borderColor: colors.border.medium,

    borderRadius: 999,

    borderWidth: 2,

    height: 20,

    justifyContent: "center",

    width: 20,
  },

  radioSelected: {
    borderColor: colors.brand.accent,
  },

  radioDisabled: {
    opacity: 0.6,
  },

  radioDot: {
    backgroundColor: colors.brand.accent,

    borderRadius: 999,

    height: 10,

    width: 10,
  },

  visibilityText: {
    flex: 1,

    marginLeft: spacing.md,
  },

  actions: {
    flexDirection: "row",

    gap: spacing.md,

    marginTop: spacing.sm,
  },

  cancelButton: {
    alignItems: "center",

    borderColor: colors.border.medium,

    borderRadius: 8,

    borderWidth: 1,

    justifyContent: "center",

    minHeight: 48,

    paddingHorizontal: spacing.xl,
  },

  cancelButtonPressed: {
    opacity: 0.7,
  },

  submitButton: {
    alignItems: "center",

    backgroundColor: colors.brand.accent,

    borderRadius: 8,

    flex: 1,

    flexDirection: "row",

    gap: spacing.xs,

    justifyContent: "center",

    minHeight: 48,

    paddingHorizontal: spacing.xl,
  },

  submitButtonPressed: {
    opacity: 0.85,
  },

  submitText: {
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.5,
  },
});

export default CreateProjectForm;
