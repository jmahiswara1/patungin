import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Card, Badge, Button, SkeletonCard, Sheet } from "@/components/ui";
import {
  UnderlineDoodle,
  ArrowDoodle,
  CheckmarkDoodle,
  SparkDoodle,
} from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import { useGroup, useGroupMembers, useReceipts, usePayments } from "@/hooks";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id!);
  const { data: members } = useGroupMembers(id!);
  const { data: receipts, refetch, isRefetching } = useReceipts(id!);
  const { data: payments } = usePayments(id!);

  const [showInputSheet, setShowInputSheet] = React.useState(false);

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

  const paidCount = (payments || []).filter((p) => p.is_paid).length;
  const totalPayments = (payments || []).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Animated.View style={[styles.headerInfo, headerStyle]}>
          <Text style={styles.title} numberOfLines={1}>
            {group?.name || "..."}
          </Text>
          <View style={styles.headerMeta}>
            <Text style={styles.metaText}>
              {members?.length || 0} orang
            </Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>
              {receipts?.length || 0} struk
            </Text>
            {totalPayments > 0 && (
              <>
                <Text style={styles.metaDot}>·</Text>
                <CheckmarkDoodle width={14} height={14} color={colors.green} />
                <Text style={styles.metaText}>
                  {paidCount}/{totalPayments} lunas
                </Text>
              </>
            )}
          </View>
        </Animated.View>
        <Badge
          label={group?.status === "active" ? "Aktif" : group?.status === "settled" ? "Lunas" : "Arsip"}
          variant={group?.status === "active" ? "info" : group?.status === "settled" ? "success" : "default"}
        />
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => router.push(`/group/${id}/members`)}>
          <Card variant="outlined" style={styles.actionCard}>
            <SparkDoodle width={20} height={20} color={colors.blue} />
            <Text style={styles.actionText}>Anggota</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => router.push(`/group/${id}/payments`)}>
          <Card variant="outlined" style={styles.actionCard}>
            <CheckmarkDoodle width={20} height={20} color={colors.green} />
            <Text style={styles.actionText}>Bayar</Text>
          </Card>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Struk</Text>
        <UnderlineDoodle width={60} height={6} color={colors.blue} style={{ marginTop: -2 }} />
      </View>

      <FlatList
        data={receipts || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.blue}
          />
        }
        renderItem={({ item, index }) => {
          const animOpacity = useSharedValue(0);
          const animY = useSharedValue(20);

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

          return (
            <Animated.View style={animStyle}>
              <Pressable
                onPress={() => router.push(`/group/${id}/receipt/split`)}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <Card variant="elevated" style={styles.receiptCard}>
                  <View style={styles.receiptHeader}>
                    <View style={styles.receiptIcon}>
                      <Text style={styles.receiptIconText}>
                        {item.source === "manual" ? "✏️" : item.source === "photo" ? "📷" : "📱"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.receiptSource}>
                        {item.source === "manual"
                          ? "Input Manual"
                          : item.source === "photo"
                            ? "Scan Struk"
                            : "Screenshot"}
                      </Text>
                      <Text style={styles.receiptDate}>
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <View style={styles.receiptAmount}>
                      <Text style={styles.receiptTotal}>
                        {formatCurrency(item.total)}
                      </Text>
                      <Badge
                        label={item.status === "draft" ? "Draft" : item.status === "confirmed" ? "Valid" : "Lunas"}
                        variant={item.status === "draft" ? "warning" : item.status === "confirmed" ? "info" : "success"}
                      />
                    </View>
                  </View>
                  {item.discount > 0 && (
                    <Text style={styles.receiptDetail}>
                      Diskon: {formatCurrency(item.discount)}
                    </Text>
                  )}
                  {item.shipping > 0 && (
                    <Text style={styles.receiptDetail}>
                      Ongkir: {formatCurrency(item.shipping)}
                    </Text>
                  )}
                </Card>
              </Pressable>
            </Animated.View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ArrowDoodle width={36} height={48} color={colors.inkFaint} />
            <Text style={styles.emptyTitle}>Belum ada struk</Text>
            <Text style={styles.emptySubtitle}>
              Tap tombol + untuk tambah struk
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { transform: [{ scale: pressed ? 0.92 : 1 }] },
        ]}
        onPress={() => setShowInputSheet(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Sheet visible={showInputSheet} onClose={() => setShowInputSheet(false)} snapPoint={0.35}>
        <Text style={styles.sheetTitle}>Tambah Struk</Text>
        <View style={styles.sheetOptions}>
          <Pressable
            style={styles.sheetOption}
            onPress={() => {
              setShowInputSheet(false);
              router.push(`/group/${id}/receipt/manual`);
            }}
          >
            <Text style={styles.sheetOptionIcon}>✏️</Text>
            <View>
              <Text style={styles.sheetOptionTitle}>Input Manual</Text>
              <Text style={styles.sheetOptionDesc}>Ketik item sendiri</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.sheetOption}
            onPress={() => {
              setShowInputSheet(false);
              router.push(`/group/${id}/receipt/scan`);
            }}
          >
            <Text style={styles.sheetOptionIcon}>📷</Text>
            <View>
              <Text style={styles.sheetOptionTitle}>Scan Struk</Text>
              <Text style={styles.sheetOptionDesc}>Foto struk fisik</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.sheetOption}
            onPress={() => {
              setShowInputSheet(false);
              router.push(`/group/${id}/receipt/screenshot`);
            }}
          >
            <Text style={styles.sheetOptionIcon}>📱</Text>
            <View>
              <Text style={styles.sheetOptionTitle}>Screenshot</Text>
              <Text style={styles.sheetOptionDesc}>Upload dari Shopee/Grab</Text>
            </View>
          </Pressable>
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.paperSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  backText: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 24,
    color: colors.ink,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  metaDot: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  actionText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 16,
    color: colors.ink,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  receiptCard: {
    marginBottom: 2,
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.paperSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  receiptIconText: {
    fontSize: 18,
  },
  receiptSource: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
    marginLeft: 12,
  },
  receiptDate: {
    fontFamily: "Caveat-Regular",
    fontSize: 13,
    color: colors.inkFaint,
    marginLeft: 12,
  },
  receiptAmount: {
    alignItems: "flex-end",
  },
  receiptTotal: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.ink,
  },
  receiptDetail: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: 8,
    marginLeft: 52,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 22,
    color: colors.inkMuted,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
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
  sheetTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 24,
    color: colors.ink,
    marginBottom: 16,
  },
  sheetOptions: {
    gap: 10,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.paperSoft,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  sheetOptionIcon: {
    fontSize: 24,
  },
  sheetOptionTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  sheetOptionDesc: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
});
