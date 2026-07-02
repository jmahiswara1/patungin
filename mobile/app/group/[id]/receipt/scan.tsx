import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Card } from "@/components/ui";
import { UnderlineDoodle, FrameDoodle, ArrowDoodle } from "@/components/doodles";
import { colors } from "@/lib/theme";
import { useCreateReceipt, useCreateReceiptItem } from "@/hooks";

export default function ScanReceiptScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const createReceipt = useCreateReceipt();
  const createItem = useCreateReceiptItem();

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    setScanning(true);
    // TODO: Phase 10 - AI integration
    setTimeout(() => {
      setScanning(false);
      setResult({
        items: [
          { name: "Bakso Spesial", price: 25000, quantity: 2 },
          { name: "Es Teh Manis", price: 5000, quantity: 4 },
        ],
        subtotal: 70000,
        discount: 0,
        shipping: 0,
        total: 70000,
      });
    }, 2000);
  };

  const handleSave = async () => {
    if (!result) return;

    const receiptId = await createReceipt.mutateAsync({
      group_id: groupId!,
      source: "photo",
      subtotal: result.subtotal,
      discount: result.discount,
      shipping: result.shipping,
      total: result.total,
      status: "draft",
    });

    for (const item of result.items) {
      await createItem.mutateAsync({
        receipt_id: receiptId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        participants: [],
      });
    }

    router.replace(`/group/${groupId}/receipt/edit?id=${receiptId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Scan Struk</Text>
          <UnderlineDoodle width={120} height={8} color={colors.blue} style={{ marginTop: -2 }} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {!result ? (
        <View style={styles.scanArea}>
          <View style={styles.viewfinder}>
            <FrameDoodle width={200} height={150} color={colors.blue} style={{ opacity: 0.5 }} />
            {scanning ? (
              <View style={styles.scanningOverlay}>
                <ActivityIndicator size="large" color={colors.blue} />
                <Text style={styles.scanningText}>Memindai struk...</Text>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <ArrowDoodle width={30} height={40} color={colors.inkFaint} />
                <Text style={styles.placeholderText}>Foto struk untuk scan</Text>
              </View>
            )}
          </View>

          <Button
            title={scanning ? "Memindai..." : "Foto Struk"}
            onPress={handleScan}
            variant="primary"
            size="lg"
            fullWidth
            loading={scanning}
            disabled={scanning}
          />

          <Text style={styles.hint}>
            AI akan otomatis mendeteksi item dan harga dari struk
          </Text>
        </View>
      ) : (
        <View style={styles.resultArea}>
          <Card variant="elevated" style={styles.resultCard}>
            <Text style={styles.resultTitle}>Hasil Scan</Text>
            {result.items.map((item: any, i: number) => (
              <View key={i} style={styles.resultItem}>
                <Text style={styles.resultItemName}>{item.name}</Text>
                <Text style={styles.resultItemQty}>x{item.quantity}</Text>
                <Text style={styles.resultItemPrice}>
                  Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                </Text>
              </View>
            ))}
            <View style={styles.resultDivider} />
            <View style={styles.resultTotal}>
              <Text style={styles.resultTotalLabel}>Total</Text>
              <Text style={styles.resultTotalValue}>
                Rp{result.total.toLocaleString("id-ID")}
              </Text>
            </View>
          </Card>

          <Button
            title="Simpan & Pilih Peserta"
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            loading={createReceipt.isPending}
          />
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
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
    alignItems: "center",
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 28,
    color: colors.ink,
  },
  scanArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  viewfinder: {
    width: 260,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  scanningOverlay: {
    position: "absolute",
    alignItems: "center",
    gap: 12,
  },
  scanningText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.blue,
  },
  placeholder: {
    position: "absolute",
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
  },
  hint: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
  resultArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resultCard: {
    marginBottom: 24,
  },
  resultTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  resultItemName: {
    flex: 1,
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  resultItemQty: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkFaint,
    marginRight: 12,
  },
  resultItemPrice: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  resultDivider: {
    height: 1.5,
    backgroundColor: colors.stroke,
    marginVertical: 12,
  },
  resultTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultTotalLabel: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
  },
  resultTotalValue: {
    fontFamily: "Caveat-Bold",
    fontSize: 24,
    color: colors.blue,
  },
});
