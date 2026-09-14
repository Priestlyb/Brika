/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/BrikaText.tsx
 * -----------------------------------------------------------------------------
 * Brika typography component.
 * -----------------------------------------------------------------------------
 */

import React from "react";
import {
    Text,
    TextProps,
    StyleSheet,
} from "react-native";

import {
    colors,
    typography,
} from "@/constants/theme/index";

type TextVariant =
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "title"
    | "body"
    | "bodyMedium"
    | "bodySmall"
    | "bodySmallMedium"
    | "caption"
    | "captionMedium"
    | "button";

export interface BrikaTextProps
    extends TextProps {
    variant?: TextVariant;
    color?: string;
}

export function BrikaText({
    variant = "body",
    color = colors.text.primary,
    style,
    children,
    ...props
}: BrikaTextProps) {
    return (
        <Text
            {...props}
            style={[
                styles.base,
                typography[variant],
                { color },
                style,
            ]}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        includeFontPadding: false,
    },
});