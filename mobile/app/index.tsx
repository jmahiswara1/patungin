import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { View } from "react-native";

export default function Index() {
  const { userId, isLoading } = useAuthStore();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  if (userId) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/welcome" />;
}
