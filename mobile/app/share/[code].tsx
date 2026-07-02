import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Card, Badge, Button } from "@/components/ui";
import {
  UnderlineDoodle,
  CheckmarkDoodle,
  WavyUnderline,
  CloudDoodle,
} from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import { useSQLiteContext } from "expo-sqlite";
import * as db from "@/lib/db";

export default function ShareScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const database = useSQLiteContext();

  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const found = await db.getGroup(database, code || "");
        if (!found) {
          // Try finding by share_code
          const all = await database.getAllAsync<any>(
            `SELECT * FROM groups WHERE share_code = ?`,
            [code]
          );
          if (all.length > 0) {
            setGroup(all[0]);
            const m = await db.getGroupMembers(database, all[0].id);
            setMembers(m);
            const p = await db.getPayments(database, all[0].id);
            setPayments(p);
          } else {
            setError("Grup tidak ditemukan");
          }
        } else {
          setGroup(found);
          const m = await db.getGroupMembers(database, found.id);
          setMembers(m);
          const p = await db.getPayments(database, found.id);
          setPayments(p);
        }
      } catch (e) {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.display_name || "?";

  const paidCount = payments.filter((p) => p.is_paid).length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  if (error || !group) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.errorIcon}>🔍</Text>
        <Text style={styles.errorTitle}>{error || "Grup tidak ditemukan"}</Text>
        <Text style={styles.errorHint}>Cek link dan coba lagi</Text>
        <Button
          title="Kembali"
          onPress={() => router.replace("/(tabs)")}
          variant="secondary"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.doodleDecor}>
          <CloudDoodle width={80} height={46} color={colors.ink} style={{ opacity: 0.04 }} />
        </View>

        <View style={styles.header}>
          <Text style={styles.brand}>patungin</Text>
          <UnderlineDoodle width={100} height={8} color={colors.blue} style={{ marginTop: -2 }} />
        </View>

        <Card variant="elevated" style={styles.groupCard}>
          <Text style={styles.groupName}>{group.name}</Text>
          <WavyUnderline width={240} height={10} color={colors.blue} style={{ opacity: 0.3, marginTop: 4 }} />
          <View style={styles.groupMeta}>
            <Text style={styles.metaText}>{members.length} orang</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{payments.length} tagihan</Text>
            <Text style={styles.metaDot}>·</Text>
            <Badge
              label={group.status === "active" ? "Aktif" : group.status === "settled" ? "Lunas" : "Arsip"}
              variant={group.status === "active" ? "info" : group.status === "settled" ? "success" : "default"}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Tagihan</Text>

        {payments.map((payment, index) => (
          <Card key={payment.id} variant="default" style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <View style={[
                styles.avatar,
                payment.is_paid ? styles.avatarPaid : null,
              ]}>
                <Text style={[
                  styles.avatarText,
                  payment.is_paid ? styles.avatarTextPaid : null,
                ]}>
                  {getMemberName(payment.from_user_id).charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentNames}>
                  <Text style={styles.paymentFrom}>
                    {getMemberName(payment.from_user_id)}
                  </Text>
                  <Text style={styles.paymentArrow}>→</Text>
                  <Text style={styles.paymentTo}>
                    {getMemberName(payment.to_user_id)}
                  </Text>
                </View>
                <Text style={styles.paymentAmount}>
                  {formatCurrency(payment.amount)}
                </Text>
              </View>
              {payment.is_paid ? (
                <View style={styles.paidBadge}>
                  <CheckmarkDoodle width={14} height={14} color={colors.green} />
                  <Text style={styles.paidText}>Lunas</Text>
                </View>
              ) : (
                <View style={styles.unpaidBadge}>
                  <Text style={styles.unpaidText}>Belum</Text>
                </View>
              )}
            </View>
          </Card>
        ))}

        {payments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Belum ada tagihan</Text>
          </View>
        )}

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.totalStatus}>
            {paidCount}/{payments.length} lunas
          </Text>
        </View>

        {paidCount === payments.length && payments.length > 0 && (
          <View style={styles.allPaidBanner}>
            <CheckmarkDoodle width={22} height={22} color={colors.green} />
            <Text style={styles.allPaidText}>Semua sudah lunas!</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>patungin</Text>
          <Text style={styles.footerTagline}>Split bill gampang, tanpa ribet</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title="Buka di App"
          onPress={() => router.replace("/(tabs)")}
          variant="primary"
          size="lg"
          fullWidth
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  doodleDecor: {
    position: "absolute",
    top: 40,
    right: -10,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  brand: {
    fontFamily: "Caveat-Bold",
    fontSize: 36,
    color: colors.ink,
  },
  loadingText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.inkMuted,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 24,
    color: colors.ink,
    marginBottom: 4,
  },
  errorHint: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
  },
  groupCard: {
    alignItems: "center",
    marginBottom: 24,
  },
  groupName: {
    fontFamily: "Caveat-Bold",
    fontSize: 26,
    color: colors.ink,
    textAlign: "center",
  },
  groupMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  metaText: {
    fontFamily: "Caveat-Regular",
    fontSize: 15,
    color: colors.inkFaint,
  },
  metaDot: {
    fontFamily: "Caveat-Regular",
    fontSize: 15,
    color: colors.inkFaint,
  },
  sectionTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
    marginBottom: 12,
  },
  paymentCard: {
    marginBottom: 8,
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
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  unpaidText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 14,
    color: "#991b1b",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
  },
  totalSection: {
    alignItems: "center",
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1.5,
    borderTopColor: colors.stroke,
  },
  totalLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
  },
  totalValue: {
    fontFamily: "Caveat-Bold",
    fontSize: 40,
    color: colors.blue,
  },
  totalStatus: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 16,
    color: colors.inkMuted,
    marginTop: 4,
  },
  allPaidBanner: {
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
    marginTop: 16,
  },
  allPaidText: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: "#166534",
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
    gap: 4,
  },
  footerBrand: {
    fontFamily: "Caveat-Bold",
    fontSize: 24,
    color: colors.ink,
    opacity: 0.12,
  },
  footerTagline: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    opacity: 0.4,
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
