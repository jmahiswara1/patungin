import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { colors } from "@/lib/theme";

interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          focused && styles.focused,
          error ? styles.errorBorder : null,
          style,
        ]}
        placeholderTextColor={colors.inkFaint}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
    marginBottom: 6,
  },
  input: {
    fontFamily: "Caveat-Regular",
    fontSize: 20,
    color: colors.ink,
    backgroundColor: colors.paperSoft,
    borderWidth: 2,
    borderColor: colors.stroke,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  focused: {
    borderColor: colors.blue,
    backgroundColor: colors.paper,
  },
  errorBorder: {
    borderColor: colors.red,
  },
  error: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.red,
    marginTop: 4,
  },
  hint: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    marginTop: 4,
  },
});
