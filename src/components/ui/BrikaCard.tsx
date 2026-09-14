/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/BrikaCard.tsx
 * -----------------------------------------------------------------------------
 * Reusable Brika surface/card.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
    StyleProp,
    StyleSheet,
    View,
    ViewProps,
    ViewStyle,
} from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
} from "@/constants/theme/index";

interface BrikaCardProps
    extends ViewProps {
    children: React.ReactNode;
    elevated?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function BrikaCard({
    children,
    elevated = false,
    style,
    ...props
}: BrikaCardProps) {
    return (
        <View
            {...props}
            style={[
                styles.card,
                elevated && shadows.sm,
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.background.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
        padding: spacing.lg,
    },
});