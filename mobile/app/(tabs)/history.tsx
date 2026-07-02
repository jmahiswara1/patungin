import { View, Text } from "react-native";

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-paper items-center justify-center">
      <Text className="font-display text-2xl text-ink">Riwayat</Text>
      <Text className="font-script text-lg text-ink-muted mt-2">
        Belum ada riwayat
      </Text>
    </View>
  );
}
