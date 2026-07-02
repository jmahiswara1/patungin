import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-paper items-center justify-center">
      <Text className="font-display text-2xl text-ink">Patungin</Text>
      <Text className="font-script text-lg text-ink-muted mt-2">
        Split bill gampang, tanpa ribet
      </Text>
    </View>
  );
}
