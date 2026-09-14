/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/BrikaInput.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Reusable theme-aware text input.
 *
 * Responsibilities:
 *
 * - Render an accessible React Native text input.
 * - Use Brika semantic theme colors.
 * - Use Brika spacing and radius tokens.
 * - Use Brika typography tokens.
 * - Support labels and validation errors.
 * - Support light, dark, and system themes.
 * -----------------------------------------------------------------------------
 */

import React from "react";

import {
    StyleSheet,
    TextInput,
    type TextInputProps,
    View,
} from "react-native";

import {
    radius,
    spacing,
    typography,
} from "@/constants/theme";

import {
    useTheme,
} from "@/hooks/use-theme";

import { BrikaText } from "./BrikaText";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface BrikaInputProps
    extends TextInputProps {
    /**
     * Optional input label.
     */
    label?: string;

    /**
     * Optional validation error.
     */
    error?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function BrikaInput({
    label,
    error,
    style,
    ...props
}: BrikaInputProps) {
    /**
     * -------------------------------------------------------------------------
     * Semantic Theme
     * -------------------------------------------------------------------------
     *
     * IMPORTANT:
     *
     * This hook comes from:
     *
     *     @/hooks/use-theme
     *
     * It returns the resolved Brika semantic theme.
     *
     * Therefore:
     *
     *     theme.text
     *     theme.background
     *     theme.border
     *     theme.status
     *
     * are all valid.
     */

    const theme = useTheme();

    /**
     * -------------------------------------------------------------------------
     * Render
     * -------------------------------------------------------------------------
     */

    return (
        <View style={styles.container}>
            {label ? (
                <BrikaText
                    variant="bodySmallMedium"
                    color={theme.text.secondary}
                    style={styles.label}
                >
                    {label}
                </BrikaText>
            ) : null}

            <TextInput
                {...props}
                placeholderTextColor={
                    theme.text.tertiary
                }
                style={[
                    styles.input,
                    {
                        backgroundColor:
                            theme.background.surface,

                        borderColor:
                            error
                                ? theme.status.error
                                : theme.border.medium,

                        color:
                            theme.text.primary,
                    },
                    style,
                ]}
            />

            {error ? (
                <BrikaText
                    variant="caption"
                    color={theme.status.error}
                    style={styles.error}
                >
                    {error}
                </BrikaText>
            ) : null}
        </View>
    );
}

/**
 * -----------------------------------------------------------------------------
 * Token Conversion
 * -----------------------------------------------------------------------------
 *
 * Brika typography uses CSS-style token values:
 *
 *     "16px"
 *     "24px"
 *
 * React Native expects numbers:
 *
 *     16
 *     24
 */
function px(value: string): number {
    return Number.parseFloat(value);
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
    /**
     * -------------------------------------------------------------------------
     * Container
     * -------------------------------------------------------------------------
     */

    container: {
        width: "100%",
    },

    /**
     * -------------------------------------------------------------------------
     * Label
     * -------------------------------------------------------------------------
     */

    label: {
        marginBottom: px(spacing.sm),
    },

    /**
     * -------------------------------------------------------------------------
     * Input
     * -------------------------------------------------------------------------
     *
     * React Native TextInput styles require numeric fontSize and lineHeight.
     * The Brika typography tokens are therefore converted with px().
     */

    input: {
        minHeight: 48,

        borderWidth: 1,

        borderRadius: 12,

        paddingHorizontal: 16,

        fontFamily:
            typography.body.fontFamily,

        fontSize:
            px(typography.body.fontSize),

        lineHeight:
            px(typography.body.lineHeight),

        fontWeight: "400",
    },

    /**
     * -------------------------------------------------------------------------
     * Error
     * -------------------------------------------------------------------------
     */

    error: {
        marginTop: px(spacing.xs),
    },
});