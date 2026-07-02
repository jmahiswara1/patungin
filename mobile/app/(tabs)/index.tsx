import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
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
import { Card, Badge, SkeletonRow } from "@/components/ui";
import {
  UnderlineDoodle,
  ArrowDoodle,
  SparkDoodle,
  StarburstDoodle,
} from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import { useGroups } from "@/hooks";

export default function HomeScreen() {
  const { userId, userName } = useAuthStore();
  const { data: groups, isLoading, refetch, isRefetching } = useGroups(userId || "");

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

  const renderGroupCard = ({ item, index }: { item: any; index: number }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
      opacity.value = withDelay(
        index * 80,
        withTiming(1, { duration: 350 })
      );
      translateY.value = withDelay(
        index * 80,
        withTiming(0, {
          duration: 350,
          easing: Easing.bezier(0.2, 0.9, 0.3, 1.05),
        })
      );
    }, []);

    const animStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <Animated.View style={animStyle}>
        <Pressable
          onPress={() => router.push(`/group/${item.id}`)}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <Card variant="elevated" style={styles.groupCard}>
            <View style={styles.groupCardHeader}>
              <View style={styles.groupIcon}>
                <Text style={styles.groupIconText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.groupName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.groupDate}>
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <Badge
                label={item.status === "active" ? "Aktif" : item.status === "settled" ? "Lunas" : "Arsip"}
                variant={item.status === "active" ? "info" : item.status === "settled" ? "success" : "default"}
              />
            </View>
          </Card>
        </Pressable>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.empty}>
      <ArrowDoodle
        width={40}
        height={53}
        color={colors.inkFaint}
        style={{ marginBottom: 12 }}
      />
      <Text style={styles.emptyTitle}>Belum ada grup</Text>
      <Text style={styles.emptySubtitle}>
        Buat grup pertamamu untuk mulai split bill!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Halo,</Text>
            <Text style={styles.userName}>{userName || "Guest"} 👋</Text>
          </View>
          <SparkDoodle
            width={32}
            height={32}
            color={colors.blue}
            style={{ opacity: 0.4 }}
          />
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Patungan Kamu</Text>
          <UnderlineDoodle
            width={160}
            height={8}
            color={colors.blue}
            style={{ marginTop: -2 }}
          />
        </View>
      </Animated.View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 20 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} style={{ marginBottom: 8 }} />
          ))}
        </View>
      ) : (
        <FlatList
          data={groups || []}
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
          ListEmptyComponent={EmptyState}
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { transform: [{ scale: pressed ? 0.92 : 1 }] },
        ]}
        onPress={() => router.push("/group/new")}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontFamily: "Caveat-Regular",
    fontSize: 18,
    color: colors.inkFaint,
  },
  userName: {
    fontFamily: "Caveat-Bold",
    fontSize: 28,
    color: colors.ink,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 32,
    color: colors.ink,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  groupCard: {
    marginBottom: 4,
  },
  groupCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.blue,
    borderStyle: "dashed",
  },
  groupIconText: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.blue,
  },
  groupName: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 22,
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
  },
  emptyTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 24,
    color: colors.inkMuted,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontFamily: "Caveat-Bold",
    fontSize: 32,
    color: colors.paper,
    marginTop: -2,
  },
});
