import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Tabs } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import { colors } from "@/lib/theme";

function HomeIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5 L12 3 L21 10.5 L21 20 C21 20.5 20.5 21 20 21 L4 21 C3.5 21 3 20.5 3 20 Z"
        stroke={color}
        strokeWidth={focused ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.15 : 0}
      />
      <Path
        d="M9 21 L9 14 C9 13.4 9.4 13 10 13 L14 13 C14.6 13 15 13.4 15 14 L15 21"
        stroke={color}
        strokeWidth={focused ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HistoryIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={9}
        stroke={color}
        strokeWidth={focused ? 2.5 : 2}
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.15 : 0}
      />
      <Path
        d="M12 7 L12 12 L16 14"
        stroke={color}
        strokeWidth={focused ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ProfileIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={8}
        r={4}
        stroke={color}
        strokeWidth={focused ? 2.5 : 2}
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.15 : 0}
      />
      <Path
        d="M4 20 C4 16 8 14 12 14 C16 14 20 16 20 20"
        stroke={color}
        strokeWidth={focused ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, focused }) => (
            <HistoryIcon color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon color={String(color)} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.paper,
    borderTopColor: colors.stroke,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 13,
  },
  tabItem: {
    gap: 4,
  },
});
