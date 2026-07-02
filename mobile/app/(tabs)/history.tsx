import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Card, Badge } from "@/components/ui";
import { UnderlineDoodle, ScribbleDoodle, SparkDoodle } from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import { useGroups, usePayments } from "@/hooks";

type FilterTab = "semua" | "aktif" | "selesai";

export default function HistoryScreen() {
  const { userId } = useAuthStore();
  const { data: groups, refetch, isRefetching } = useGroups(userId || "");
  const [activeTab, setActiveTab] = useState<FilterTab>("semua");

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);

  useFocusEffect(
    useCallback(() => {
      headerOpacity.value = withTiming(1, { duration: 400 });
      headerY.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1.05),
      });
    }, [])
  );

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const allGroups = groups || [];
  const activeGroups = allGroups.filter((g) => g.status === "active");
  const settledGroups = allGroups.filter((g) => g.status === "settled");

  const filteredGroups =
    activeTab === "semua"
      ? allGroups
      : activeTab === "aktif"
        ? activeGroups
        : settledGroups;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "semua", label: "Semua", count: allGroups.length },
    { key: "aktif", label: "Aktif", count: activeGroups.length },
    { key: "selesai", label: "Selesai", count: settledGroups.length },
  ];

  const renderGroupCard = ({ item, index }: { item: any; index: number }) => {
    const animOpacity = useSharedValue(0);
    const animY = useSharedValue(16);

    React.useEffect(() => {
      animOpacity.value = withDelay(index * 60, withTiming(1, { duration: 300 }));
      animY.value = withDelay(
        index * 60,
        withTiming(0, { duration: 300, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) })
      );
    }, []);

    const animStyle = useAnimatedStyle(() => ({
      opacity: animOpacity.value,
      transform: [{ translateY: animY.value }],
    }));

    const statusVariant =
      item.status === "active" ? "info" : item.status === "settled" ? "success" : "default";
    const statusLabel =
      item.status === "active" ? "Aktif" : item.status === "settled" ? "Lunas" : "Arsip";

    return (
      <Animated.View style={animStyle}>
        <Pressable
          onPress={() => router.push(`/group/${item.id}`)}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <Card variant="default" style={styles.groupCard}>
            <View style={styles.cardRow}>
              <View style={[
                styles.icon,
                item.status === "settled" ? styles.iconSettled : null,
              ]}>
                <Text style={[
                  styles.iconText,
                  item.status === "settled" ? styles.iconTextSettled : null,
                ]}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.groupName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.groupDate}>
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <Badge label={statusLabel} variant={statusVariant} />
            </View>
          </Card>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>Riwayat</Text>
        <UnderlineDoodle
          width={100}
          height={8}
          color={colors.blue}
          style={{ marginTop: -2, marginBottom: 16 }}
        />

        <View style={styles.statsRow}>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statNumber}>{allGroups.length}</Text>
            <Text style={styles.statLabel}>Total Grup</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.green }]}>
              {settledGroups.length}
            </Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.blue }]}>
              {activeGroups.length}
            </Text>
            <Text style={styles.statLabel}>Aktif</Text>
          </Card>
        </View>
      </Animated.View>

      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key ? styles.tabActive : null,
            ]}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.key ? styles.tabTextActive : null,
            ]}>
              {tab.label}
            </Text>
            <View style={[
              styles.tabBadge,
              activeTab === tab.key ? styles.tabBadgeActive : null,
            ]}>
              <Text style={[
                styles.tabBadgeText,
                activeTab === tab.key ? styles.tabBadgeTextActive : null,
              ]}>
                {tab.count}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.blue}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ScribbleDoodle width={60} height={22} color={colors.inkFaint} style={{ opacity: 0.4 }} />
            <Text style={styles.emptyTitle}>
              {activeTab === "selesai" ? "Belum ada yang selesai" : "Belum ada riwayat"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "selesai"
                ? "Grup yang sudah lunas akan muncul di sini"
                : "Buat patungan pertamamu!"}
            </Text>
          </View>
        }
      />
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
    paddingBottom: 8,
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 32,
    color: colors.ink,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  statNumber: {
    fontFamily: "Caveat-Bold",
    fontSize: 32,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 13,
    color: colors.inkFaint,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.paperSoft,
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  tabActive: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  tabText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 16,
    color: colors.inkMuted,
  },
  tabTextActive: {
    color: colors.blueDark,
  },
  tabBadge: {
    backgroundColor: colors.stroke,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: colors.blue,
  },
  tabBadgeText: {
    fontFamily: "Caveat-Bold",
    fontSize: 13,
    color: colors.inkMuted,
  },
  tabBadgeTextActive: {
    color: colors.paper,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  groupCard: {
    marginBottom: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.blue,
    marginRight: 12,
  },
  iconSettled: {
    backgroundColor: "#dcfce7",
    borderColor: colors.green,
  },
  iconText: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.blue,
  },
  iconTextSettled: {
    color: colors.green,
  },
  groupName: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
  },
  groupDate: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 22,
    color: colors.inkMuted,
  },
  emptySubtitle: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
    textAlign: "center",
  },
});
