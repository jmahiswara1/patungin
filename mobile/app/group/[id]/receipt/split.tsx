import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { Button, Card, Badge } from "@/components/ui";
import {
  UnderlineDoodle,
  CheckmarkDoodle,
  WavyUnderline,
  SparkDoodle,
} from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import { calculateSplit, getOptimalPayments } from "@/lib/calc";
import {
  useReceipt,
  useReceiptItems,
  useGroupMembers,
  useCreatePayment,
  useUpdateReceiptStatus,
} from "@/hooks";
import type { ReceiptItem, SplitResult } from "@/types";

export default function SplitResultScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const receiptId = useLocalSearchParams<{ id: string }>().id;

  const { data: receipt } = useReceipt(receiptId!);
  const { data: items } = useReceiptItems(receiptId!);
  const { data: members } = useGroupMembers(groupId!);
  const createPayment = useCreatePayment();
  const updateStatus = useUpdateReceiptStatus();

  const [splits, setSplits] = useState<SplitResult[]>([]);
  const [payments, setPayments] = useState<{ from: string; to: string; amount: number }[]>([]);

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);

  useEffect(() => {
    if (items && members && receipt) {
      const memberNames: Record<string, string> = {};
      for (const m of members) {
        memberNames[m.id] = m.display_name;
      }

      const receiptItems: ReceiptItem[] = items.map((item) => ({
        id: item.id,
        receipt_id: item.receipt_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        participants: item.participants,
      }));

      const result = calculateSplit({
        items: receiptItems,
        discount: receipt.discount,
        shipping: receipt.shipping,
        shippingSplit: "equal",
        memberNames,
      });

      setSplits(result);
      setPayments(getOptimalPayments(result));

      titleOpacity.value = withTiming(1, { duration: 500 });
      titleY.value = withTiming(0, {
        duration: 500,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1.05),
      });
    }
  }, [items, members, receipt]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const handleConfirm = async () => {
    if (!groupId) return;

    for (const payment of payments) {
      await createPayment.mutateAsync({
        group_id: groupId,
        from_user_id: payment.from,
        to_user_id: payment.to,
        amount: payment.amount,
      });
    }

    if (receiptId) {
      await updateStatus.mutateAsync({ id: receiptId, status: "confirmed" });
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Animated.View style={[styles.headerTitle, titleStyle]}>
          <Text style={styles.title}>Hasil Split</Text>
          <UnderlineDoodle width={120} height={8} color={colors.blue} style={{ marginTop: -2 }} />
        </Animated.View>
        <CheckmarkDoodle width={28} height={28} color={colors.green} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {receipt && (
          <Card variant="elevated" style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptLabel}>Total Tagihan</Text>
              <Text style={styles.receiptTotal}>{formatCurrency(receipt.total)}</Text>
            </View>
            <WavyUnderline width={280} height={10} color={colors.blue} style={{ opacity: 0.3, marginTop: 4 }} />
          </Card>
        )}

        <Text style={styles.sectionTitle}>Pembagian per Orang</Text>

        {splits.map((split, index) => {
          const animOpacity = useSharedValue(0);
          const animY = useSharedValue(20);

          useEffect(() => {
            animOpacity.value = withDelay(index * 100, withTiming(1, { duration: 350 }));
            animY.value = withDelay(
              index * 100,
              withTiming(0, { duration: 350, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) })
            );
          }, []);

          const animStyle = useAnimatedStyle(() => ({
            opacity: animOpacity.value,
            transform: [{ translateY: animY.value }],
          }));

          return (
            <Animated.View key={split.member_id} style={animStyle}>
              <Card variant="elevated" style={styles.splitCard}>
                <View style={styles.splitHeader}>
                  <View style={styles.splitAvatar}>
                    <Text style={styles.splitAvatarText}>
                      {split.member_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.splitName}>{split.member_name}</Text>
                    <Text style={styles.splitItemCount}>
                      {split.items.length} item
                    </Text>
                  </View>
                  <Text style={styles.splitAmount}>{formatCurrency(split.amount)}</Text>
                </View>

                {split.items.length > 0 && (
                  <View style={styles.splitItems}>
                    {split.items.map((item, i) => (
                      <View key={i} style={styles.splitItemRow}>
                        <Text style={styles.splitItemName}>{item.name}</Text>
                        <Text style={styles.splitItemShare}>{formatCurrency(item.share)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            </Animated.View>
          );
        })}

        {payments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Siapa Bayar Siapa</Text>
            {payments.map((payment, index) => {
              const fromMember = members?.find((m) => m.id === payment.from);
              const toMember = members?.find((m) => m.id === payment.to);

              return (
                <Card key={index} variant="default" style={styles.paymentCard}>
                  <View style={styles.paymentRow}>
                    <View style={styles.paymentAvatar}>
                      <Text style={styles.paymentAvatarText}>
                        {fromMember?.display_name.charAt(0).toUpperCase() || "?"}
                      </Text>
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentFrom}>
                        {fromMember?.display_name || "?"}
                      </Text>
                      <Text style={styles.paymentArrow}>→</Text>
                      <Text style={styles.paymentTo}>
                        {toMember?.display_name || "?"}
                      </Text>
                    </View>
                    <Text style={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        <View style={styles.confettiArea}>
          <SparkDoodle width={28} height={28} color={colors.blue} style={{ opacity: 0.2 }} />
          <Text style={styles.doneText}>Semua lunas!</Text>
          <SparkDoodle width={28} height={28} color={colors.blue} style={{ opacity: 0.2 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title="Konfirmasi & Buat Tagihan"
          onPress={handleConfirm}
          variant="primary"
          size="lg"
          fullWidth
          loading={createPayment.isPending}
        />
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  receiptCard: {
    marginBottom: 24,
    alignItems: "center",
    paddingVertical: 20,
  },
  receiptHeader: {
    alignItems: "center",
  },
  receiptLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
    marginBottom: 4,
  },
  receiptTotal: {
    fontFamily: "Caveat-Bold",
    fontSize: 42,
    color: colors.blue,
  },
  sectionTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
    marginBottom: 12,
  },
  splitCard: {
    marginBottom: 10,
  },
  splitHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  splitAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.blue,
    borderStyle: "dashed",
    marginRight: 12,
  },
  splitAvatarText: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.blue,
  },
  splitName: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
  },
  splitItemCount: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  splitAmount: {
    fontFamily: "Caveat-Bold",
    fontSize: 24,
    color: colors.blue,
  },
  splitItems: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    gap: 4,
  },
  splitItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  splitItemName: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkMuted,
  },
  splitItemShare: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 16,
    color: colors.inkMuted,
  },
  paymentCard: {
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.paperSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.stroke,
    marginRight: 10,
  },
  paymentAvatarText: {
    fontFamily: "Caveat-Bold",
    fontSize: 16,
    color: colors.inkMuted,
  },
  paymentInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paymentFrom: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  paymentArrow: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
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
  confettiArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    marginBottom: 8,
  },
  doneText: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.green,
  },
  bottomAction: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
  },
});
