/**
 * -----------------------------------------------------------------------------
 * File: src/components/ui/BrikaDivider.tsx
 * -----------------------------------------------------------------------------
 */

import React from "react";
import {
    StyleSheet,
    View,
} from "react-native";

import { colors } from "@/constants/theme/index";

export function BrikaDivider() {
    return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border.light,
    },
});