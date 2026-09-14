/**

* ---
* File: src/components/ui/BrikaIconButton.tsx
* ---
* Brika Design System
*
* Theme-aware icon button.
* ---

*/

import React from "react";

import {
Pressable,
StyleSheet,
type ViewStyle,
} from "react-native";

import {
radius,
} from "@/constants/theme";

import {
useTheme,
} from "@/hooks/use-theme";

/**

* ---
* Props
* ---

*/

interface BrikaIconButtonProps {
children: React.ReactNode;
onPress: () => void;
style?: ViewStyle;
accessibilityLabel: string;
}

/**

* ---
* Component
* ---

*/

export function BrikaIconButton({
children,
onPress,
style,
accessibilityLabel,
}: BrikaIconButtonProps) {
const theme = useTheme();

return (
<Pressable
accessibilityRole="button"
accessibilityLabel={accessibilityLabel}
onPress={onPress}
style={({ pressed }) => [
styles.button,
{
backgroundColor:
theme.background.secondary,
},
pressed && styles.pressed,
style,
]}
>
{children} </Pressable>
);
}

/**

* ---
* Styles
* ---

*/

const styles = StyleSheet.create({
button: {
width: 44,
height: 44,
borderRadius: radius.pill,
alignItems: "center",
justifyContent: "center",

},

pressed: {
opacity: 0.7,
},
});
