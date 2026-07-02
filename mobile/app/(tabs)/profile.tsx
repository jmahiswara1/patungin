import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Card, Badge } from "@/components/ui";
import { UnderlineDoodle, StarburstDoodle } from "@/components/doodles";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import { useGroups } from "@/hooks";

export default function ProfileScreen() {
  const { userId, userName, isGuest, logout } = useAuthStore();
  const { data: groups } = useGroups(userId || "");

  const activeGroups = (groups || []).filter((g) => g.status === "active").length;
  const settledGroups = (groups || []).filter((g) => g.status === "settled").length;

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <UnderlineDoodle
          width={80}
          height={8}
          color={colors.blue}
          style={{ marginTop: -2 }}
        />
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(userName || "G").charAt(0).toUpperCase()}
          </Text>
          <StarburstDoodle
            width={20}
            height={20}
            color={colors.blue}
            style={{ position: "absolute", top: -6, right: -6, opacity: 0.4 }}
          />
        </View>
        <Text style={styles.userName}>{userName || "Guest"}</Text>
        <Badge
          label={isGuest ? "Guest" : "User"}
          variant={isGuest ? "warning" : "info"}
        />
      </View>

      <View style={styles.statsRow}>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statNumber}>{activeGroups}</Text>
          <Text style={styles.statLabel}>Grup Aktif</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statNumber}>{settledGroups}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statNumber}>{(groups || []).length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </Card>
      </View>

      <View style={styles.menuSection}>
        <Card variant="default" style={styles.menuCard}>
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>Tentang Patungin</Text>
          </Pressable>
        </Card>
        <Card variant="default" style={styles.menuCard}>
          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, { color: colors.red }]}>Keluar</Text>
          </Pressable>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 32,
    color: colors.ink,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.blue,
    borderStyle: "dashed",
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: "Caveat-Bold",
    fontSize: 36,
    color: colors.blue,
  },
  userName: {
    fontFamily: "Caveat-Bold",
    fontSize: 28,
    color: colors.ink,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  statNumber: {
    fontFamily: "Caveat-Bold",
    fontSize: 32,
    color: colors.blue,
  },
  statLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 13,
    color: colors.inkFaint,
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 10,
  },
  menuCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
  },
});
