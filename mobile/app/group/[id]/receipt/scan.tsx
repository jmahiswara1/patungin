import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Button, Card } from "@/components/ui";
import { UnderlineDoodle, FrameDoodle, ArrowDoodle } from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import { scanReceipt, ParsedReceipt } from "@/lib/ai";
import { useCreateReceipt, useCreateReceiptItem } from "@/hooks";

export default function ScanReceiptScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const createReceipt = useCreateReceipt();
  const createItem = useCreateReceiptItem();

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ParsedReceipt | null>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Izin kamera diperlukan untuk scan struk");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: false,
    });

    if (pickerResult.canceled || !pickerResult.assets[0]) return;

    setScanning(true);
    setError("");
    setResult(null);

    try {
      const uri = pickerResult.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const parsed = await scanReceipt(base64);
      setResult(parsed);
    } catch (e: any) {
      setError(e.message || "Gagal scan struk. Coba lagi atau input manual.");
    } finally {
      setScanning(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      const receiptId = await createReceipt.mutateAsync({
        group_id: groupId!,
        source: "photo",
        subtotal: result.subtotal,
        discount: result.discount,
        shipping: result.shipping,
        total: result.total,
        platform: result.platform as any,
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
    } catch (e) {
      setError("Gagal menyimpan struk");
    }
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
                <Text style={styles.scanningEmoji}>🔍</Text>
                <Text style={styles.scanningText}>AI membaca struk...</Text>
                <Text style={styles.scanningHint}>Tunggu sebentar ya</Text>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <ArrowDoodle width={30} height={40} color={colors.inkFaint} />
                <Text style={styles.placeholderText}>Foto struk untuk scan</Text>
              </View>
            )}
          </View>

          {error ? (
            <Card variant="default" style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </Card>
          ) : null}

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
            AI akan otomatis mendeteksi item, harga, diskon, dan ongkir dari struk
          </Text>
        </View>
      ) : (
        <View style={styles.resultArea}>
          <Card variant="elevated" style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Hasil Scan</Text>
              <Text style={styles.resultPlatform}>
                {result.platform === "shopee" ? "🛒" : result.platform === "grabfood" ? "🍔" : "📋"}
              </Text>
            </View>

            {result.items.map((item, i) => (
              <View key={i} style={styles.resultItem}>
                <View style={styles.resultItemInfo}>
                  <Text style={styles.resultItemName}>{item.name}</Text>
                  <Text style={styles.resultItemQty}>x{item.quantity}</Text>
                </View>
                <Text style={styles.resultItemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            ))}

            {result.discount > 0 && (
              <View style={styles.resultRow}>
                <Text style={styles.resultRowLabel}>Diskon</Text>
                <Text style={styles.resultRowDiscount}>
                  -{formatCurrency(result.discount)}
                </Text>
              </View>
            )}

            {result.shipping > 0 && (
              <View style={styles.resultRow}>
                <Text style={styles.resultRowLabel}>Ongkir</Text>
                <Text style={styles.resultRowValue}>
                  {formatCurrency(result.shipping)}
                </Text>
              </View>
            )}

            <View style={styles.resultDivider} />
            <View style={styles.resultTotal}>
              <Text style={styles.resultTotalLabel}>Total</Text>
              <Text style={styles.resultTotalValue}>
                {formatCurrency(result.total)}
              </Text>
            </View>
          </Card>

          <View style={styles.resultActions}>
            <Button
              title="Scan Ulang"
              onPress={() => {
                setResult(null);
                setError("");
              }}
              variant="secondary"
              fullWidth
            />
            <Button
              title="Simpan & Pilih Peserta"
              onPress={handleSave}
              variant="primary"
              size="lg"
              fullWidth
              loading={createReceipt.isPending}
            />
          </View>
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
    marginBottom: 24,
  },
  scanningOverlay: {
    position: "absolute",
    alignItems: "center",
    gap: 8,
  },
  scanningEmoji: {
    fontSize: 36,
  },
  scanningText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.blue,
  },
  scanningHint: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
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
  errorCard: {
    marginBottom: 16,
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  errorText: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: "#991b1b",
    textAlign: "center",
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
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
  },
  resultPlatform: {
    fontSize: 24,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  resultItemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resultItemName: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  resultItemQty: {
    fontFamily: "Caveat-Regular",
    fontSize: 15,
    color: colors.inkFaint,
  },
  resultItemPrice: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  resultRowLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: colors.inkMuted,
  },
  resultRowValue: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 16,
    color: colors.ink,
  },
  resultRowDiscount: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 16,
    color: colors.green,
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
  resultActions: {
    gap: 10,
  },
});
