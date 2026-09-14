/**
 * -----------------------------------------------------------------------------
 * File: src/theme/shadows.ts
 * -----------------------------------------------------------------------------
 * Brika shadow system.
 * -----------------------------------------------------------------------------
 */

import { Platform } from "react-native";

export const shadows = {
    none: {
        shadowColor: "transparent",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },

    sm: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: Platform.select({
            ios: 0.04,
            android: 0.08,
            default: 0.05,
        }),
        shadowRadius: 3,
        elevation: 1,
    },

    md: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: Platform.select({
            ios: 0.07,
            android: 0.12,
            default: 0.08,
        }),
        shadowRadius: 8,
        elevation: 3,
    },

    lg: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: Platform.select({
            ios: 0.1,
            android: 0.16,
            default: 0.12,
        }),
        shadowRadius: 20,
        elevation: 8,
    },
} as const;