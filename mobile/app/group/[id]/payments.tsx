import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Card, Badge } from "@/components/ui";
import {
  UnderlineDoodle,
  CheckmarkDoodle,
  WavyUnderline,
} from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import {
  useGroup,
  useGroupMembers,
  usePayments,
  useMarkPaymentPaid,
  useMarkPaymentUnpaid,
} from "@/hooks";

export default function PaymentsScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(groupId!);
  const { data: members } = useGroupMembers(groupId!);
  const { data: payments, refetch } = usePayments(groupId!);
  const markPaid = useMarkPaymentPaid();
  const markUnpaid = useMarkPaymentUnpaid();

  const paidCount = (payments || []).filter((p) => p.is_paid).length;
  const totalCount = (payments || []).length;
  const totalOutstanding = (payments || [])
    .filter((p) => !p.is_paid)
    .reduce((sum, p) => sum + p.amount, 0);

  const getMemberName = (id: string) =>
    members?.find((m) => m.id === id)?.display_name || "?";

  const handleToggle = async (paymentId: string, isPaid: boolean) => {
    if (isPaid) {
      await markUnpaid.mutateAsync(paymentId);
    } else {
      await markPaid.mutateAsync(paymentId);
    }
    refetch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Pembayaran</Text>
          <UnderlineDoodle width={130} height={8} color={colors.blue} style={{ marginTop: -2 }} />
        </View>
        <Badge
          label={`${paidCount}/${totalCount}`}
          variant={paidCount === totalCount && totalCount > 0 ? "success" : "info"}
        />
      </View>

      <View style={styles.statsRow}>
        <Card variant="elevated" style={styles.statCard}>
          <CheckmarkDoodle width={24} height={24} color={colors.green} />
          <Text style={styles.statNumber}>{paidCount}</Text>
          <Text style={styles.statLabel}>Sudah Bayar</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statIcon}>⏳</Text>
          <Text style={[styles.statNumber, { color: colors.red }]}>
            {totalCount - paidCount}
          </Text>
          <Text style={styles.statLabel}>Belum Bayar</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={[styles.statNumber, { color: colors.blue, fontSize: 18 }]}>
            {formatCurrency(totalOutstanding)}
          </Text>
          <Text style={styles.statLabel}>Outstanding</Text>
        </Card>
      </View>

      <WavyUnderline width={300} height={10} color={colors.stroke} style={{ marginHorizontal: 20, opacity: 0.5 }} />

      <FlatList
        data={payments || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const animOpacity = useSharedValue(0);
          const animX = useSharedValue(-20);

          React.useEffect(() => {
            animOpacity.value = withDelay(index * 60, withTiming(1, { duration: 300 }));
            animX.value = withDelay(
              index * 60,
              withTiming(0, { duration: 300, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) })
            );
          }, []);

          const animStyle = useAnimatedStyle(() => ({
            opacity: animOpacity.value,
            transform: [{ translateX: animX.value }],
          }));

          return (
            <Animated.View style={animStyle}>
              <Pressable
                onPress={() => handleToggle(item.id, !!item.is_paid)}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              >
                <Card
                  variant={item.is_paid ? "default" : "outlined"}
                  style={[
                    styles.paymentCard,
                    item.is_paid ? styles.paymentCardPaid : null,
                  ]}
                >
                  <View style={styles.paymentRow}>
                    <View style={[
                      styles.avatar,
                      item.is_paid ? styles.avatarPaid : null,
                    ]}>
                      <Text style={[
                        styles.avatarText,
                        item.is_paid ? styles.avatarTextPaid : null,
                      ]}>
                        {getMemberName(item.from_user_id).charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.paymentInfo}>
                      <View style={styles.paymentNames}>
                        <Text style={styles.paymentFrom}>
                          {getMemberName(item.from_user_id)}
                        </Text>
                        <Text style={styles.paymentArrow}>→</Text>
                        <Text style={styles.paymentTo}>
                          {getMemberName(item.to_user_id)}
                        </Text>
                      </View>
                      <Text style={styles.paymentAmount}>
                        {formatCurrency(item.amount)}
                      </Text>
                    </View>

                    <View style={styles.statusArea}>
                      {item.is_paid ? (
                        <View style={styles.paidBadge}>
                          <CheckmarkDoodle width={16} height={16} color={colors.green} />
                          <Text style={styles.paidText}>Lunas</Text>
                        </View>
                      ) : (
                        <View style={styles.unpaidBadge}>
                          <Text style={styles.unpaidText}>Bayar</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {item.is_paid && item.paid_at && (
                    <Text style={styles.paidAt}>
                      Dibayar {new Date(item.paid_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  )}
                </Card>
              </Pressable>
            </Animated.View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💸</Text>
            <Text style={styles.emptyTitle}>Belum ada tagihan</Text>
            <Text style={styles.emptySubtitle}>
              Buat split bill dulu untuk generate tagihan
            </Text>
          </View>
        }
      />

      {paidCount === totalCount && totalCount > 0 && (
        <View style={styles.allPaidBanner}>
          <CheckmarkDoodle width={24} height={24} color={colors.green} />
          <Text style={styles.allPaidText}>Semua sudah lunas! 🎉</Text>
        </View>
      )}
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
    paddingBottom: 16,
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
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 28,
    color: colors.ink,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontFamily: "Caveat-Bold",
    fontSize: 28,
    color: colors.green,
  },
  statLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 12,
    color: colors.inkFaint,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 10,
  },
  paymentCard: {
    marginBottom: 2,
  },
  paymentCardPaid: {
    opacity: 0.7,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.blue,
    marginRight: 12,
  },
  avatarPaid: {
    backgroundColor: "#dcfce7",
    borderColor: colors.green,
  },
  avatarText: {
    fontFamily: "Caveat-Bold",
    fontSize: 18,
    color: colors.blue,
  },
  avatarTextPaid: {
    color: colors.green,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentNames: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  paymentFrom: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  paymentArrow: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  paymentTo: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  paymentAmount: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.blue,
  },
  statusArea: {
    marginLeft: 12,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  paidText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 14,
    color: "#166534",
  },
  unpaidBadge: {
    backgroundColor: colors.blue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  unpaidText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 14,
    color: colors.paper,
  },
  paidAt: {
    fontFamily: "Caveat-Regular",
    fontSize: 13,
    color: colors.inkFaint,
    marginTop: 8,
    marginLeft: 52,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
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
  allPaidBanner: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#bbf7d0",
  },
  allPaidText: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: "#166534",
  },
});
