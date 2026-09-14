/**
 * -----------------------------------------------------------------------------
 * File: src/app/(tabs)/notifications/index.tsx
 * -----------------------------------------------------------------------------
 * Brika Notifications Screen
 *
 * Responsibilities:
 *
 * - Display project and workspace notifications.
 * - Provide clear unread/read states.
 * - Provide notification categories.
 * - Follow the centralized Brika design system.
 * - Remain responsive across web and mobile.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    BrikaText,
} from "@/components/ui";

import {
    colors,
    spacing,
} from "@/constants/theme";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

type NotificationType =
    | "project"
    | "comment"
    | "member"
    | "system"
    | "success";

type Notification = {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    unread?: boolean;
};

/**
 * -----------------------------------------------------------------------------
 * Sample Notifications
 * -----------------------------------------------------------------------------
 *
 * Temporary local data for the notification interface.
 *
 * This can later be replaced with API data from the Brika backend.
 * -----------------------------------------------------------------------------
 */

const notifications: Notification[] = [
    {
        id: "1",
        type: "project",
        title: "Project updated",
        description:
            "The Riverside Residence project has been updated.",
        time: "10 min ago",
        unread: true,
    },
    {
        id: "2",
        type: "comment",
        title: "New comment",
        description:
            "David commented on the ground floor plan.",
        time: "32 min ago",
        unread: true,
    },
    {
        id: "3",
        type: "success",
        title: "3D model generated",
        description:
            "Your Riverside Residence model is ready to view.",
        time: "1 hour ago",
        unread: true,
    },
    {
        id: "4",
        type: "member",
        title: "New team member",
        description:
            "Sarah joined your Brika workspace.",
        time: "3 hours ago",
    },
    {
        id: "5",
        type: "project",
        title: "Project shared with you",
        description:
            "You were added to the Victoria Apartments project.",
        time: "Yesterday",
    },
    {
        id: "6",
        type: "system",
        title: "Storage information",
        description:
            "Your workspace is using 68% of its available storage.",
        time: "Yesterday",
    },
];

/**
 * -----------------------------------------------------------------------------
 * Notification Icon
 * -----------------------------------------------------------------------------
 */

function getNotificationIcon(
    type: NotificationType,
): keyof typeof Ionicons.glyphMap {
    switch (type) {
        case "project":
            return "folder-outline";

        case "comment":
            return "chatbubble-outline";

        case "member":
            return "person-add-outline";

        case "success":
            return "checkmark-circle-outline";

        case "system":
        default:
            return "information-circle-outline";
    }
}

/**
 * -----------------------------------------------------------------------------
 * Notification Colors
 * -----------------------------------------------------------------------------
 */

function getNotificationColor(
    type: NotificationType,
): string {
    switch (type) {
        case "success":
            return colors.status.success;

        case "system":
            return colors.status.info;

        case "member":
            return colors.brand.accent;

        case "comment":
            return colors.status.warning;

        case "project":
        default:
            return colors.text.primary;
    }
}

/**
 * -----------------------------------------------------------------------------
 * Notification Item
 * -----------------------------------------------------------------------------
 */

type NotificationItemProps = {
    notification: Notification;
    onPress?: () => void;
};

function NotificationItem({
    notification,
    onPress,
}: NotificationItemProps) {
    const iconColor = getNotificationColor(
        notification.type,
    );

    const icon = getNotificationIcon(
        notification.type,
    );

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={notification.title}
            style={({ hovered, pressed }) => [
                styles.notificationItem,

                notification.unread &&
                    styles.notificationItemUnread,

                hovered &&
                    styles.notificationItemHovered,

                pressed &&
                    styles.notificationItemPressed,
            ]}
        >
            {/* -----------------------------------------------------------------
             * Icon
             * -----------------------------------------------------------------
             */}

            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor:
                            notification.unread
                                ? colors.brand.accentLight
                                : colors.background.secondary,
                    },
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={iconColor}
                />
            </View>

            {/* -----------------------------------------------------------------
             * Content
             * -----------------------------------------------------------------
             */}

            <View style={styles.notificationContent}>
                <View style={styles.titleRow}>
                    <BrikaText
                        variant="body"
                        style={styles.notificationTitle}
                    >
                        {notification.title}
                    </BrikaText>

                    {notification.unread && (
                        <View
                            style={[
                                styles.unreadDot,
                                {
                                    backgroundColor:
                                        colors.brand.accent,
                                },
                            ]}
                        />
                    )}
                </View>

                <BrikaText
                    variant="bodySmall"
                    color={colors.text.secondary}
                    style={styles.notificationDescription}
                >
                    {notification.description}
                </BrikaText>

                <BrikaText
                    variant="caption"
                    color={colors.text.tertiary}
                    style={styles.notificationTime}
                >
                    {notification.time}
                </BrikaText>
            </View>

            {/* -----------------------------------------------------------------
             * Chevron
             * -----------------------------------------------------------------
             */}

            <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.text.tertiary}
            />
        </Pressable>
    );
}

/**
 * -----------------------------------------------------------------------------
 * Notifications Screen
 * -----------------------------------------------------------------------------
 */

export default function NotificationsScreen() {
    const unreadCount = notifications.filter(
        (notification) => notification.unread,
    ).length;

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                {
                    backgroundColor:
                        colors.background.primary,
                },
            ]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.container}>
                    {/* ---------------------------------------------------------
                     * Header
                     * ---------------------------------------------------------
                     */}

                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <BrikaText
                                variant="h1"
                                style={styles.title}
                            >
                                Notifications
                            </BrikaText>

                            <BrikaText
                                variant="body"
                                color={colors.text.secondary}
                                style={styles.subtitle}
                            >
                                Stay up to date with your projects
                                and workspace.
                            </BrikaText>
                        </View>

                        {unreadCount > 0 && (
                            <View
                                style={[
                                    styles.countBadge,
                                    {
                                        backgroundColor:
                                            colors.brand.accent,
                                    },
                                ]}
                            >
                                <BrikaText
                                    variant="caption"
                                    color={
                                        colors.background.surface
                                    }
                                    style={
                                        styles.countBadgeText
                                    }
                                >
                                    {unreadCount}
                                </BrikaText>
                            </View>
                        )}
                    </View>

                    {/* ---------------------------------------------------------
                     * Actions
                     * ---------------------------------------------------------
                     */}

                    <View style={styles.actions}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Mark all notifications as read"
                            style={({ hovered, pressed }) => [
                                styles.actionButton,
                                hovered &&
                                    styles.actionButtonHovered,
                                pressed &&
                                    styles.actionButtonPressed,
                            ]}
                        >
                            <Ionicons
                                name="checkmark-done-outline"
                                size={18}
                                color={colors.brand.accent}
                            />

                            <BrikaText
                                variant="bodySmall"
                                color={colors.brand.accent}
                                style={styles.actionText}
                            >
                                Mark all as read
                            </BrikaText>
                        </Pressable>
                    </View>

                    {/* ---------------------------------------------------------
                     * Notification List
                     * ---------------------------------------------------------
                     */}

                    <View
                        style={[
                            styles.notificationCard,
                            {
                                backgroundColor:
                                    colors.background.surface,
                                borderColor:
                                    colors.border.light,
                            },
                        ]}
                    >
                        {notifications.map(
                            (notification, index) => (
                                <React.Fragment
                                    key={notification.id}
                                >
                                    <NotificationItem
                                        notification={
                                            notification
                                        }
                                    />

                                    {index <
                                        notifications.length -
                                            1 && (
                                        <View
                                            style={[
                                                styles.divider,
                                                {
                                                    backgroundColor:
                                                        colors
                                                            .border
                                                            .light,
                                                },
                                            ]}
                                        />
                                    )}
                                </React.Fragment>
                            ),
                        )}
                    </View>

                    {/* ---------------------------------------------------------
                     * Empty State
                     * ---------------------------------------------------------
                     */}

                    {notifications.length === 0 && (
                        <View
                            style={[
                                styles.emptyState,
                                {
                                    backgroundColor:
                                        colors
                                            .background
                                            .surface,
                                    borderColor:
                                        colors.border.light,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.emptyIcon,
                                    {
                                        backgroundColor:
                                            colors
                                                .background
                                                .secondary,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="notifications-off-outline"
                                    size={24}
                                    color={
                                        colors.text.tertiary
                                    }
                                />
                            </View>

                            <BrikaText
                                variant="h3"
                                style={styles.emptyTitle}
                            >
                                You're all caught up
                            </BrikaText>

                            <BrikaText
                                variant="bodySmall"
                                color={colors.text.secondary}
                                style={styles.emptyDescription}
                            >
                                New project activity and workspace
                                updates will appear here.
                            </BrikaText>
                        </View>
                    )}

                    {/* ---------------------------------------------------------
                     * Footer
                     * ---------------------------------------------------------
                     */}

                    <View style={styles.footer}>
                        <BrikaText
                            variant="caption"
                            color={colors.text.muted}
                            style={styles.footerText}
                        >
                            Brika notifications
                        </BrikaText>
                    </View>
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
    /**
     * -------------------------------------------------------------------------
     * Safe Area
     * -------------------------------------------------------------------------
     */

    safeArea: {
        flex: 1,
    },

    /**
     * -------------------------------------------------------------------------
     * Page Content
     * -------------------------------------------------------------------------
     */

    content: {
        paddingBottom: spacing.xxl,
    },

    container: {
        width: "100%",
        maxWidth: 1080,
        alignSelf: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },

    /**
     * -------------------------------------------------------------------------
     * Header
     * -------------------------------------------------------------------------
     */

    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: spacing.md,
    },

    headerText: {
        flex: 1,
        minWidth: 0,
    },

    title: {
        fontWeight: "700",
        letterSpacing: -0.6,
    },

    subtitle: {
        marginTop: spacing.xs,
        maxWidth: 620,
    },

    countBadge: {
        minWidth: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xs,
        borderRadius: 999,
        marginLeft: spacing.md,
    },

    countBadgeText: {
        fontWeight: "700",
    },

    /**
     * -------------------------------------------------------------------------
     * Actions
     * -------------------------------------------------------------------------
     */

    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: spacing.md,
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 8,
    },

    actionButtonHovered: {
        backgroundColor: colors.brand.accentLight,
    },

    actionButtonPressed: {
        opacity: 0.7,
    },

    actionText: {
        fontWeight: "600",
    },

    /**
     * -------------------------------------------------------------------------
     * Notification Card
     * -------------------------------------------------------------------------
     */

    notificationCard: {
        overflow: "hidden",
        borderWidth: 1,
        borderRadius: 12,
    },

    /**
     * -------------------------------------------------------------------------
     * Notification Item
     * -------------------------------------------------------------------------
     */

    notificationItem: {
        minHeight: 88,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.md,
    },

    notificationItemUnread: {
        backgroundColor: colors.background.primary,
    },

    notificationItemHovered: {
        backgroundColor: colors.background.secondary,
    },

    notificationItemPressed: {
        opacity: 0.72,
    },

    /**
     * -------------------------------------------------------------------------
     * Notification Icon
     * -------------------------------------------------------------------------
     */

    iconContainer: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        flexShrink: 0,
    },

    /**
     * -------------------------------------------------------------------------
     * Notification Content
     * -------------------------------------------------------------------------
     */

    notificationContent: {
        flex: 1,
        minWidth: 0,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },

    notificationTitle: {
        fontWeight: "600",
    },

    unreadDot: {
        width: 7,
        height: 7,
        borderRadius: 999,
    },

    notificationDescription: {
        marginTop: 2,
    },

    notificationTime: {
        marginTop: 4,
    },

    /**
     * -------------------------------------------------------------------------
     * Divider
     * -------------------------------------------------------------------------
     */

    divider: {
        height: 1,
        marginLeft: 78,
    },

    /**
     * -------------------------------------------------------------------------
     * Empty State
     * -------------------------------------------------------------------------
     */

    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxxl,
        borderWidth: 1,
        borderRadius: 12,
    },

    emptyIcon: {
        width: 52,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
    },

    emptyTitle: {
        marginTop: spacing.md,
        textAlign: "center",
    },

    emptyDescription: {
        marginTop: spacing.xs,
        maxWidth: 420,
        textAlign: "center",
    },

    /**
     * -------------------------------------------------------------------------
     * Footer
     * -------------------------------------------------------------------------
     */

    footer: {
        alignItems: "center",
        paddingTop: spacing.xl,
    },

    footerText: {
        textAlign: "center",
    },
});