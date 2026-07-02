import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: { bg: colors.paperSoft, text: colors.inkMuted, border: colors.stroke },
  success: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  warning: { bg: "#fef9c3", text: "#854d0e", border: "#fef08a" },
  danger: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
  info: { bg: colors.blueSoft, text: colors.blueDark, border: "#bfdbfe" },
};

export function Badge({ label, variant = "default", style }: BadgeProps) {
  const c = variantColors[variant];
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: c.bg, borderColor: c.border },
        style,
      ]}
    >
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 14,
  },
});
