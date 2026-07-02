import "../global.css";
import "react-native-gesture-handler";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Caveat-Regular": require("../assets/fonts/Caveat-Regular.ttf"),
        "Caveat-Bold": require("../assets/fonts/Caveat-Bold.ttf"),
        "Caveat-SemiBold": require("../assets/fonts/Caveat-SemiBold.ttf"),
        "Caveat-Medium": require("../assets/fonts/Caveat-Medium.ttf"),
      });
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#0F1B2D" }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        />
        <StatusBar style="dark" />
      </View>
    </QueryClientProvider>
  );
}
