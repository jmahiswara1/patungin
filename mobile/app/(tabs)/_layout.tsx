import { Tabs } from "expo-router";
import { View, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E2E5EE",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#2F66F4",
        tabBarInactiveTintColor: "#8590A6",
        tabBarLabelStyle: {
          fontFamily: "Caveat-Regular",
          fontSize: 14,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>H</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>R</Text>
          ),
        }}
      />
    </Tabs>
  );
}
