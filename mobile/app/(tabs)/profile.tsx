import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Card, Badge } from "@/components/ui";
import {
  UnderlineDoodle,
  StarburstDoodle,
  SparkDoodle,
  WavyUnderline,
} from "@/components/doodles";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import { useGroups } from "@/hooks";

export default function ProfileScreen() {
  const { userId, userName, isGuest, logout } = useAuthStore();
  const { data: groups } = useGroups(userId || "");

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);
  const avatarScale = useSharedValue(0.8);

  useFocusEffect(
    useCallback(() => {
      headerOpacity.value = withTiming(1, { duration: 400 });
      headerY.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1.05),
      });
      avatarScale.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1.05),
      });
    }, [])
  );

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const allGroups = groups || [];
  const activeGroups = allGroups.filter((g) => g.status === "active").length;
  const settledGroups = allGroups.filter((g) => g.status === "settled").length;
  const archivedGroups = allGroups.filter((g) => g.status === "archived").length;

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>Profil</Text>
        <UnderlineDoodle
          width={80}
          height={8}
          color={colors.blue}
          style={{ marginTop: -2 }}
        />
      </Animated.View>

      <View style={styles.profileSection}>
        <Animated.View style={[styles.avatarWrap, avatarStyle]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userName || "G").charAt(0).toUpperCase()}
            </Text>
          </View>
          <StarburstDoodle
            width={24}
            height={24}
            color={colors.blue}
            style={{ position: "absolute", top: -8, right: -8, opacity: 0.4 }}
          />
          <SparkDoodle
            width={18}
            height={18}
            color={colors.blue}
            style={{ position: "absolute", bottom: -4, left: -8, opacity: 0.3 }}
          />
        </Animated.View>
        <Text style={styles.userName}>{userName || "Guest"}</Text>
        <Badge
          label={isGuest ? "Guest" : "User"}
          variant={isGuest ? "warning" : "info"}
        />
      </View>

      <WavyUnderline width={300} height={10} color={colors.stroke} style={{ marginHorizontal: 20, opacity: 0.4, marginBottom: 20 }} />

      <View style={styles.statsGrid}>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statNumber}>{allGroups.length}</Text>
          <Text style={styles.statLabel}>Total Grup</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={[styles.statNumber, { color: colors.blue }]}>{activeGroups}</Text>
          <Text style={styles.statLabel}>Aktif</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={[styles.statNumber, { color: colors.green }]}>{settledGroups}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={[styles.statNumber, { color: colors.inkFaint }]}>{archivedGroups}</Text>
          <Text style={styles.statLabel}>Arsip</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Pengaturan</Text>
      <View style={styles.menuSection}>
        <Card variant="default" style={styles.menuCard}>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/welcome")}
          >
            <Text style={styles.menuIcon}>🏠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Onboarding</Text>
              <Text style={styles.menuHint}>Lihat welcome screen lagi</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </Pressable>
        </Card>

        <Card variant="default" style={styles.menuCard}>
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Notifikasi</Text>
              <Text style={styles.menuHint}>Pengaturan reminder bayar</Text>
            </View>
            <Badge label="Segera" variant="default" />
          </Pressable>
        </Card>

        <Card variant="default" style={styles.menuCard}>
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuIcon}>🌙</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Dark Mode</Text>
              <Text style={styles.menuHint}>Tema gelap</Text>
            </View>
            <Badge label="Segera" variant="default" />
          </Pressable>
        </Card>

        <Card variant="default" style={styles.menuCard}>
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Tentang Patungin</Text>
              <Text style={styles.menuHint}>Versi 1.0.0</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </Pressable>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Akun</Text>
      <View style={styles.menuSection}>
        <Card variant="default" style={styles.menuCard}>
          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuIcon}>🚪</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuText, { color: colors.red }]}>Keluar</Text>
              <Text style={styles.menuHint}>
                {isGuest ? "Hapus data guest & mulai ulang" : "Logout dari akun"}
              </Text>
            </View>
            <Text style={[styles.menuArrow, { color: colors.red }]}>→</Text>
          </Pressable>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>patungin</Text>
        <Text style={styles.footerVersion}>v1.0.0</Text>
        <Text style={styles.footerTagline}>Split bill gampang, tanpa ribet</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    paddingBottom: 100,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.blue,
    borderStyle: "dashed",
  },
  avatarText: {
    fontFamily: "Caveat-Bold",
    fontSize: 40,
    color: colors.blue,
  },
  userName: {
    fontFamily: "Caveat-Bold",
    fontSize: 30,
    color: colors.ink,
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: "47.5%",
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statIcon: {
    fontSize: 22,
  },
  statNumber: {
    fontFamily: "Caveat-Bold",
    fontSize: 36,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  sectionTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
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
    fontSize: 22,
  },
  menuText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
  },
  menuHint: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  menuArrow: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.inkFaint,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 4,
  },
  footerBrand: {
    fontFamily: "Caveat-Bold",
    fontSize: 28,
    color: colors.ink,
    opacity: 0.15,
  },
  footerVersion: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    opacity: 0.5,
  },
  footerTagline: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    opacity: 0.4,
  },
});
