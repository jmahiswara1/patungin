import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Card, Badge } from "@/components/ui";
import { UnderlineDoodle } from "@/components/doodles";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import { useGroups } from "@/hooks";

export default function HistoryScreen() {
  const { userId } = useAuthStore();
  const { data: groups } = useGroups(userId || "");

  const settledGroups = (groups || []).filter((g) => g.status === "settled");
  const totalSpent = 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat</Text>
        <UnderlineDoodle
          width={100}
          height={8}
          color={colors.blue}
          style={{ marginTop: -2 }}
        />
      </View>

      <View style={styles.statsRow}>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statNumber}>{settledGroups.length}</Text>
          <Text style={styles.statLabel}>Patungan Selesai</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statNumber}>{(groups || []).length}</Text>
          <Text style={styles.statLabel}>Total Grup</Text>
        </Card>
      </View>

      <FlatList
        data={settledGroups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/group/${item.id}`)}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Card variant="default" style={styles.historyCard}>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <Text style={styles.iconText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <Badge label="Lunas" variant="success" />
              </View>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
            <Text style={styles.emptySubtitle}>
              Grup yang sudah selesai akan muncul di sini
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
    paddingBottom: 16,
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 32,
    color: colors.ink,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  statNumber: {
    fontFamily: "Caveat-Bold",
    fontSize: 36,
    color: colors.blue,
  },
  statLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  historyCard: {
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.paperSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  iconText: {
    fontFamily: "Caveat-Bold",
    fontSize: 18,
    color: colors.inkMuted,
  },
  name: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
    marginLeft: 12,
  },
  date: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    marginLeft: 12,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 22,
    color: colors.inkMuted,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
    textAlign: "center",
  },
});
