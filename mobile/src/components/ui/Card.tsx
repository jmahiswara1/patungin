import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { colors } from "@/lib/theme";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "outlined" | "elevated";
  style?: StyleProp<ViewStyle>;
  padding?: number;
}

export function Card({
  children,
  variant = "default",
  style,
  padding = 16,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === "outlined" ? styles.outlined : null,
        variant === "elevated" ? styles.elevated : null,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.paper,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  outlined: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderStyle: "dashed",
  },
  elevated: {
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});
