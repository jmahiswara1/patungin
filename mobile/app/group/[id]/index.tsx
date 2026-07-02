import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-paper items-center justify-center">
      <Text className="font-display text-2xl text-ink">Grup Detail</Text>
      <Text className="font-script text-ink-muted mt-2">{id}</Text>
    </View>
  );
}
