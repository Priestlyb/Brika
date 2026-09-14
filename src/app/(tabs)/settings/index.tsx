/**

* ---
* File: src/app/(tabs)/settings/index.tsx
* ---
* Brika Settings Screen
*
* Responsibilities:
*
* * Display the user's application settings.
* * Provide access to account preferences.
* * Provide appearance controls.
* * Provide notification preferences.
* * Provide security/account actions.
* * Follow the centralized Brika design system.
* * Remain responsive across web and mobile.
* ---

*/

import React from "react";

import { router, useRouter } from "expo-router";

import { Pressable, ScrollView, Switch, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";

import { colors } from "@/constants/theme";

import { useAuth } from "@/services/auth/auth.context";

import { styles } from "./settings.styles";

/**

* ---
* Settings Item
* ---

*/

type SettingsItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress?: () => void;
  danger?: boolean;
};

function SettingsItem({
  icon,
  title,
  description,
  onPress,
  danger = false,
}: SettingsItemProps) {
  const foregroundColor = danger ? colors.status.error : colors.text.primary;

  const secondaryColor = danger ? colors.status.error : colors.text.secondary;

  const router = useRouter();
  const { logout } = useAuth();

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.settingsItem,
        hovered && styles.settingsItemHovered,
        pressed && styles.settingsItemPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* Icon */}
      <View
        style={[
          styles.settingsIconContainer,
          {
            backgroundColor: danger
              ? colors.status.errorBackground
              : colors.background.secondary,
          },
        ]}
      >
        {" "}
        <Ionicons name={icon} size={20} color={foregroundColor} />{" "}
      </View>
      ```
      {/* Text */}
      <View style={styles.settingsItemContent}>
        <ThemedText
          style={[
            styles.settingsItemTitle,
            {
              color: foregroundColor,
            },
          ]}
        >
          {title}
        </ThemedText>

        <ThemedText
          style={[
            styles.settingsItemDescription,
            {
              color: secondaryColor,
            },
          ]}
        >
          {description}
        </ThemedText>
      </View>
      {/* Chevron */}
      <Ionicons
        name="chevron-forward"
        size={18}
        color={danger ? colors.status.error : colors.text.tertiary}
      />
    </Pressable>
  );
}

/**

* ---
* Settings Section
* ---

*/

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      {" "}
      <ThemedText style={styles.sectionTitle}>{title} </ThemedText>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.background.surface,
            borderColor: colors.border.light,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

/**

* ---
* Settings Screen
* ---

*/

export default function SettingsScreen() {
  /**

* ---
* Authentication
* ---
*
* Logout is handled through the centralized AuthProvider.
*
* This ensures:
*
* * The backend logout endpoint is called.
* * Local authentication storage is cleared.
* * The access token is removed from React state.
* * The current user is removed from React state.
* * The AuthenticationGuard can redirect to the login screen.
    */

  const { logout } = useAuth();

  /**

* ---
* Notification Preferences
* ---

*/

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    React.useState(true);

  /**

* ---
* Logout State
* ---

*/

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  /**

* ---
* Handle Logout
* ---

*/

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ScrollView
      style={[
        styles.screen,
        {
          backgroundColor: colors.background.primary,
        },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {" "}
      <View style={styles.container}>
        {/* -------------------------------------------------------------------
         * Header
         * ------------------------------------------------------------------- */}

        <View style={styles.header}>
          <ThemedText
            style={[
              styles.title,
              {
                color: colors.text.primary,
              },
            ]}
          >
            Settings
          </ThemedText>

          <ThemedText
            style={[
              styles.subtitle,
              {
                color: colors.text.secondary,
              },
            ]}
          >
            Manage your Brika account and preferences.
          </ThemedText>
        </View>

        {/* -------------------------------------------------------------------
         * Account
         * ------------------------------------------------------------------- */}

        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            title="Profile"
            description="Manage your name, email, and profile information."
            onPress={() => router.push("/settings/profile")}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />

          <SettingsItem
            icon="lock-closed-outline"
            title="Security"
            description="Manage your password and account security."
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />

          <SettingsItem
            icon="card-outline"
            title="Subscription"
            description="View your plan, billing, and subscription details."
          />
        </SettingsSection>

        {/* -------------------------------------------------------------------
         * Preferences
         * ------------------------------------------------------------------- */}

        <SettingsSection title="Preferences">
          {/* Push Notifications */}

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceContent}>
              <View
                style={[
                  styles.settingsIconContainer,
                  {
                    backgroundColor: colors.background.secondary,
                  },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.text.primary}
                />
              </View>

              <View style={styles.preferenceText}>
                <ThemedText
                  style={[
                    styles.preferenceTitle,
                    {
                      color: colors.text.primary,
                    },
                  ]}
                >
                  Push notifications
                </ThemedText>

                <ThemedText
                  style={[
                    styles.preferenceDescription,
                    {
                      color: colors.text.secondary,
                    },
                  ]}
                >
                  Receive notifications about your projects.
                </ThemedText>
              </View>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: colors.border.medium,
                true: colors.brand.accent,
              }}
              thumbColor={colors.background.surface}
              accessibilityLabel="Push notifications"
            />
          </View>

          {/* Divider */}

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />

          {/* Email Notifications */}

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceContent}>
              <View
                style={[
                  styles.settingsIconContainer,
                  {
                    backgroundColor: colors.background.secondary,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.text.primary}
                />
              </View>

              <View style={styles.preferenceText}>
                <ThemedText
                  style={[
                    styles.preferenceTitle,
                    {
                      color: colors.text.primary,
                    },
                  ]}
                >
                  Email notifications
                </ThemedText>

                <ThemedText
                  style={[
                    styles.preferenceDescription,
                    {
                      color: colors.text.secondary,
                    },
                  ]}
                >
                  Receive important updates by email.
                </ThemedText>
              </View>
            </View>

            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              trackColor={{
                false: colors.border.medium,
                true: colors.brand.accent,
              }}
              thumbColor={colors.background.surface}
              accessibilityLabel="Email notifications"
            />
          </View>

          {/* Divider */}

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />

          {/* Appearance */}

          <SettingsItem
            icon="color-palette-outline"
            title="Appearance"
            description="Customize the appearance of the Brika application."
          />
        </SettingsSection>

        {/* -------------------------------------------------------------------
         * Workspace
         * ------------------------------------------------------------------- */}

        <SettingsSection title="Workspace">
          <SettingsItem
            icon="business-outline"
            title="Workspace settings"
            description="Manage your workspace and team configuration."
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />

          <SettingsItem
            icon="people-outline"
            title="Team members"
            description="Manage members and their project permissions."
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />

          <SettingsItem
            icon="cloud-outline"
            title="Storage"
            description="View your storage usage and limits."
          />
        </SettingsSection>

        {/* -------------------------------------------------------------------
         * Support
         * ------------------------------------------------------------------- */}

        <SettingsSection title="Support">
          <SettingsItem
            icon="help-circle-outline"
            title="Help & support"
            description="Get help with Brika and contact support."
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />

          <SettingsItem
            icon="document-text-outline"
            title="Terms & privacy"
            description="Review Brika's terms and privacy information."
          />
        </SettingsSection>

        {/* -------------------------------------------------------------------
         * Account Actions
         * ------------------------------------------------------------------- */}

        <SettingsSection title="Account actions">
          <SettingsItem
            icon="log-out-outline"
            title={isLoggingOut ? "Logging out..." : "Log out"}
            description={
              isLoggingOut
                ? "Signing you out of your Brika account."
                : "Sign out of your Brika account."
            }
            onPress={handleLogout}
            danger
          />
        </SettingsSection>

        {/* -------------------------------------------------------------------
         * Footer
         * ------------------------------------------------------------------- */}

        <View style={styles.footer}>
          <ThemedText
            style={[
              styles.footerBrand,
              {
                color: colors.text.tertiary,
              },
            ]}
          >
            BRIKA
          </ThemedText>

          <ThemedText
            style={[
              styles.footerText,
              {
                color: colors.text.muted,
              },
            ]}
          >
            Brika • Architectural workspace
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}
