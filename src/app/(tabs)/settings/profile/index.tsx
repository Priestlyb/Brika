/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/settings/profile/index.tsx
 * -----------------------------------------------------------------------------
 * Brika Profile Screen
 *
 * Responsibilities:
 *
 * - Display the authenticated user's profile.
 * - Allow editing of supported profile information.
 * - Present account verification status.
 * - Display account metadata.
 * - Update profile information through the Brika backend API.
 * - Keep the AuthProvider user state synchronized after a successful update.
 * - Provide a futuristic but professional Brika experience.
 * - Use centralized Brika design tokens.
 * - Remain responsive across web and mobile.
 *
 * Notes:
 *
 * - Profile data is sourced from the centralized AuthProvider.
 * - Email is displayed as read-only until a dedicated email-change and
 *   verification flow is implemented.
 * - Profile persistence is handled through:
 *
 *   PATCH /api/v1/users/me
 *
 * - The AuthProvider updates the global authenticated user after a successful
 *   profile update.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme";

import { useAuth } from "@/services/auth/auth.context";

import { styles } from "./profile.styles";

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

/**
 * Creates initials from the authenticated user's first and last name.
 */
function getInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName.trim().charAt(0);
  const lastInitial = lastName.trim().charAt(0);

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

/**
 * Formats the user's account creation date.
 */
function formatMemberSince(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Member";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * -----------------------------------------------------------------------------
 * Profile Field
 * -----------------------------------------------------------------------------
 */

type ProfileFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  editable?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onChangeText?: (value: string) => void;
};

function ProfileField({
  label,
  value,
  placeholder,
  editable = true,
  icon,
  onChangeText,
}: ProfileFieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>

      <View
        style={[
          styles.fieldContainer,
          editable
            ? styles.fieldContainerEditable
            : styles.fieldContainerReadonly,
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={editable ? colors.text.tertiary : colors.text.muted}
        />

        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          editable={editable}
          onChangeText={onChangeText}
          autoCapitalize="words"
          autoCorrect={false}
          style={[styles.fieldInput, !editable && styles.fieldInputReadonly]}
        />

        {!editable && (
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color={colors.text.muted}
          />
        )}
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Information Row
 * -----------------------------------------------------------------------------
 */

type InformationRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function InformationRow({
  icon,
  label,
  value,
}: InformationRowProps) {
  return (
    <View style={styles.informationRow}>
      <View style={styles.informationIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={colors.text.secondary}
        />
      </View>

      <View style={styles.informationContent}>
        <ThemedText style={styles.informationLabel}>
          {label}
        </ThemedText>

        <ThemedText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.informationValue}
        >
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Profile Screen
 * -----------------------------------------------------------------------------
 */

export default function ProfileScreen() {
  const router = useRouter();

  const {
    user,
    isLoading,
    error,
    clearError,
    updateProfile,
  } = useAuth();

  /**
   * ---------------------------------------------------------------------------
   * Form State
   * ---------------------------------------------------------------------------
   */

  const [firstName, setFirstName] = React.useState(
    user?.firstName ?? "",
  );

  const [lastName, setLastName] = React.useState(
    user?.lastName ?? "",
  );

  const [phone, setPhone] = React.useState(
    user?.phone ?? "",
  );

  const [company, setCompany] = React.useState(
    user?.company ?? "",
  );

  const [country, setCountry] = React.useState(
    user?.country ?? "",
  );

  const [isSaving, setIsSaving] = React.useState(false);

  const [hasChanges, setHasChanges] = React.useState(false);

  /**
   * ---------------------------------------------------------------------------
   * Sync Form With Authenticated User
   * ---------------------------------------------------------------------------
   *
   * This runs whenever AuthProvider receives a new user object.
   *
   * This is important after:
   *
   * - Login
   * - Registration
   * - Session refresh
   * - Profile update
   */

  React.useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.firstName);

    setLastName(user.lastName);

    setPhone(user.phone ?? "");

    setCompany(user.company ?? "");

    setCountry(user.country ?? "");

    setHasChanges(false);
  }, [user]);

  /**
   * ---------------------------------------------------------------------------
   * Loading State
   * ---------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator
          size="small"
          color={colors.brand.accent}
        />

        <ThemedText
          style={{
            marginTop: 12,
            color: colors.text.secondary,
            fontSize: 14,
          }}
        >
          Loading your profile...
        </ThemedText>
      </View>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * No User State
   * ---------------------------------------------------------------------------
   */

  if (!user) {
    return (
      <View style={styles.centeredState}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="person-outline"
            size={28}
            color={colors.status.error}
          />
        </View>

        <ThemedText style={styles.stateTitle}>
          Profile unavailable
        </ThemedText>

        <ThemedText style={styles.stateDescription}>
          We could not load your authenticated profile.
        </ThemedText>
      </View>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Form Helpers
   * ---------------------------------------------------------------------------
   */

  const updateField = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);

    setHasChanges(true);

    /**
     * Clear a previous API validation error as soon as the user starts
     * correcting the form.
     */
    if (error) {
      clearError();
    }
  };

  /**
   * ---------------------------------------------------------------------------
   * Save Profile
   * ---------------------------------------------------------------------------
   *
   * PATCH /api/v1/users/me
   *
   * The AuthContext handles the API request through authService.updateProfile()
   * and replaces the global authenticated user with the returned user.
   */

  const handleSave = async () => {
    if (isSaving || !hasChanges) {
      return;
    }

    /**
     * -------------------------------------------------------------------------
     * Basic Client-Side Validation
     * -------------------------------------------------------------------------
     *
     * The backend requires firstName and lastName to contain at least
     * two characters.
     */

    const trimmedFirstName = firstName.trim();

    const trimmedLastName = lastName.trim();

    const trimmedPhone = phone.trim();

    const trimmedCompany = company.trim();

    const trimmedCountry = country.trim();

    if (trimmedFirstName.length < 2) {
      return;
    }

    if (trimmedLastName.length < 2) {
      return;
    }

    setIsSaving(true);

    clearError();

    try {
      await updateProfile({
        firstName: trimmedFirstName,

        lastName: trimmedLastName,

        phone: trimmedPhone || null,

        company: trimmedCompany || null,

        country: trimmedCountry || null,
      });

      /**
       * updateProfile() only resolves when the backend update succeeds.
       *
       * AuthProvider has already synchronized its user state at this point.
       */
      setHasChanges(false);
    } catch {
      /**
       * AuthProvider already stores the error.
       *
       * We intentionally do not clear hasChanges so the user can correct
       * the form and retry the request.
       */
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * ---------------------------------------------------------------------------
   * Derived Values
   * ---------------------------------------------------------------------------
   */

  const initials = getInitials(
    user.firstName,
    user.lastName,
  );

  const memberSince = formatMemberSince(
    user.createdAt,
  );

  /**
   * Use current form values here rather than the old user values.
   *
   * This means the Account summary updates immediately while the user is
   * editing, and AuthProvider will provide the persisted values after save.
   */

  const displayCompany =
    company.trim() || "Not specified";

  const displayCountry =
    country.trim() || "Not specified";

  /**
   * ---------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* -------------------------------------------------------------------
         * Navigation
         * ------------------------------------------------------------------- */}

        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back to settings"
          style={({ pressed, hovered }) => [
            styles.backButton,

            pressed && {
              opacity: 0.7,
            },

            Platform.OS === "web" &&
              hovered && {
                opacity: 0.8,
              },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={colors.text.secondary}
          />

          <ThemedText style={styles.backButtonText}>
            Settings
          </ThemedText>
        </Pressable>

        {/* -------------------------------------------------------------------
         * Header
         * ------------------------------------------------------------------- */}

        <View style={styles.header}>
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowDot} />

            <ThemedText style={styles.eyebrowText}>
              Account identity
            </ThemedText>
          </View>

          <ThemedText style={styles.title}>
            Profile
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Manage your personal identity and the information associated with
            your Brika account.
          </ThemedText>
        </View>

        {/* -------------------------------------------------------------------
         * Profile Hero
         * ------------------------------------------------------------------- */}

        <View style={styles.hero}>
          <View style={styles.heroAccent} />

          <View style={styles.heroContent}>
            <View style={styles.identityRow}>
              {/* Avatar */}

              <View style={styles.avatar}>
                {user.avatarUrl ? (
                  <Image
                    source={{
                      uri: user.avatarUrl,
                    }}
                    accessibilityLabel="Profile avatar"
                    style={styles.avatarImage}
                  />
                ) : (
                  <ThemedText style={styles.avatarInitials}>
                    {initials}
                  </ThemedText>
                )}

                <View style={styles.avatarStatus} />
              </View>

              {/* Identity */}

              <View style={styles.identity}>
                <ThemedText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.identityName}
                >
                  {user.firstName} {user.lastName}
                </ThemedText>

                <ThemedText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.identityEmail}
                >
                  {user.email}
                </ThemedText>

                <View style={styles.roleBadge}>
                  <Ionicons
                    name={
                      user.role === "ADMIN"
                        ? "shield-checkmark-outline"
                        : "person-outline"
                    }
                    size={13}
                    color={colors.brand.accent}
                  />

                  <ThemedText style={styles.roleBadgeText}>
                    {user.role}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Verification */}

            <View style={styles.verification}>
              <Ionicons
                name={
                  user.emailVerified
                    ? "checkmark-circle"
                    : "alert-circle-outline"
                }
                size={21}
                color={
                  user.emailVerified
                    ? colors.status.success
                    : colors.status.warning
                }
              />

              <View style={styles.verificationContent}>
                <ThemedText style={styles.verificationTitle}>
                  {user.emailVerified
                    ? "Email verified"
                    : "Email verification required"}
                </ThemedText>

                <ThemedText style={styles.verificationDescription}>
                  {user.emailVerified
                    ? "Your account email has been successfully verified."
                    : "Verify your email address to secure your account."}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* -------------------------------------------------------------------
         * Main Content
         * ------------------------------------------------------------------- */}

        <View
          style={[
            styles.mainContent,
            Platform.OS === "web"
              ? styles.mainContentWeb
              : styles.mainContentMobile,
          ]}
        >
          {/* -----------------------------------------------------------------
           * Personal Information
           * ----------------------------------------------------------------- */}

          <View
            style={[
              styles.informationCard,
              styles.personalInformationCard,
            ]}
          >
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>
                Personal information
              </ThemedText>

              <ThemedText style={styles.cardDescription}>
                Keep your profile information accurate and up to date.
              </ThemedText>
            </View>

            <View style={styles.form}>
              <ProfileField
                label="First name"
                value={firstName}
                icon="person-outline"
                placeholder="Enter your first name"
                onChangeText={(value) =>
                  updateField(setFirstName, value)
                }
              />

              <ProfileField
                label="Last name"
                value={lastName}
                icon="person-outline"
                placeholder="Enter your last name"
                onChangeText={(value) =>
                  updateField(setLastName, value)
                }
              />

              <ProfileField
                label="Email address"
                value={user.email}
                icon="mail-outline"
                editable={false}
              />

              <ProfileField
                label="Phone number"
                value={phone}
                icon="call-outline"
                placeholder="Enter your phone number"
                onChangeText={(value) =>
                  updateField(setPhone, value)
                }
              />

              <ProfileField
                label="Company"
                value={company}
                icon="business-outline"
                placeholder="Enter your company"
                onChangeText={(value) =>
                  updateField(setCompany, value)
                }
              />

              <ProfileField
                label="Country"
                value={country}
                icon="globe-outline"
                placeholder="Enter your country"
                onChangeText={(value) =>
                  updateField(setCountry, value)
                }
              />
            </View>

            {/* -----------------------------------------------------------------
             * API Error
             * ----------------------------------------------------------------- */}

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={colors.status.error}
                />

                <ThemedText style={styles.errorText}>
                  {error}
                </ThemedText>
              </View>
            )}

            {/* Save */}

            <View style={styles.saveContainer}>
              <Pressable
                onPress={handleSave}
                disabled={isSaving || !hasChanges}
                accessibilityRole="button"
                accessibilityLabel="Save profile changes"
                style={({ pressed, hovered }) => [
                  styles.saveButton,

                  hasChanges
                    ? styles.saveButtonEnabled
                    : styles.saveButtonDisabled,

                  pressed && {
                    opacity: 0.85,
                  },

                  Platform.OS === "web" &&
                    hovered &&
                    !isSaving &&
                    hasChanges && {
                      opacity: 0.92,
                    },
                ]}
              >
                {isSaving ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      hasChanges
                        ? colors.text.inverse
                        : colors.text.secondary
                    }
                  />
                ) : (
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={
                      hasChanges
                        ? colors.text.inverse
                        : colors.text.muted
                    }
                  />
                )}

                <ThemedText
                  style={[
                    styles.saveButtonText,

                    hasChanges
                      ? styles.saveButtonTextEnabled
                      : styles.saveButtonTextDisabled,
                  ]}
                >
                  {isSaving
                    ? "Saving..."
                    : "Save changes"}
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {/* -----------------------------------------------------------------
           * Account Column
           * ----------------------------------------------------------------- */}

          <View style={styles.accountColumn}>
            {/* Account Information */}

            <View
              style={[
                styles.informationCard,
                styles.accountCard,
              ]}
            >
              <View style={styles.accountHeader}>
                <ThemedText style={styles.cardTitle}>
                  Account
                </ThemedText>

                <ThemedText style={styles.cardDescription}>
                  Your Brika account details.
                </ThemedText>
              </View>

              <InformationRow
                icon="shield-checkmark-outline"
                label="Account role"
                value={user.role}
              />

              <View style={styles.informationDivider} />

              <InformationRow
                icon="calendar-outline"
                label="Member since"
                value={memberSince}
              />

              <View style={styles.informationDivider} />

              <InformationRow
                icon="business-outline"
                label="Company"
                value={displayCompany}
              />

              <View style={styles.informationDivider} />

              <InformationRow
                icon="globe-outline"
                label="Country"
                value={displayCountry}
              />
            </View>

            {/* Security */}

            <View style={styles.securityCard}>
              <View style={styles.securityHeader}>
                <View style={styles.securityIcon}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color={colors.brand.accentDark}
                  />
                </View>

                <View style={styles.securityContent}>
                  <ThemedText style={styles.securityTitle}>
                    Profile security
                  </ThemedText>

                  <ThemedText style={styles.securityDescription}>
                    Your account credentials are managed through Brika
                    authentication.
                  </ThemedText>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open security settings"
                style={({ pressed }) => [
                  styles.securityAction,

                  pressed && {
                    opacity: 0.65,
                  },
                ]}
              >
                <ThemedText style={styles.securityActionText}>
                  Manage security
                </ThemedText>

                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color={colors.brand.accentDark}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* -------------------------------------------------------------------
         * Footer
         * ------------------------------------------------------------------- */}

        <View style={styles.footer}>
          <ThemedText style={styles.footerBrand}>
            BRIKA
          </ThemedText>

          <ThemedText style={styles.footerText}>
            Architectural workspace
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}