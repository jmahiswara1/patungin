import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Button, Card, Badge } from "@/components/ui";
import { UnderlineDoodle, FrameDoodle } from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import { scanReceipt, ParsedReceipt } from "@/lib/ai";
import { useCreateReceipt, useCreateReceiptItem } from "@/hooks";

export default function ScreenshotReceiptScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const createReceipt = useCreateReceipt();
  const createItem = useCreateReceiptItem();

  const [image, setImage] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ParsedReceipt | null>(null);
  const [error, setError] = useState("");

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      const uri = pickerResult.assets[0].uri;
      setImage(uri);
      setResult(null);
      setError("");
      parseScreenshot(uri);
    }
  };

  const parseScreenshot = async (uri: string) => {
    setParsing(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const parsed = await scanReceipt(base64);
      setResult(parsed);
    } catch (e: any) {
      setError(e.message || "Gagal parse screenshot. Coba lagi.");
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      const receiptId = await createReceipt.mutateAsync({
        group_id: groupId!,
        source: "screenshot",
        platform: (result.platform as any) || "lainnya",
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
          <Text style={styles.title}>Screenshot</Text>
          <UnderlineDoodle width={130} height={8} color={colors.blue} style={{ marginTop: -2 }} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {!result ? (
        <View style={styles.uploadArea}>
          {image ? (
            <Card variant="outlined" style={styles.previewCard}>
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />
              {parsing && (
                <View style={styles.parsingOverlay}>
                  <Text style={styles.parsingEmoji}>🔍</Text>
                  <Text style={styles.parsingText}>AI membaca screenshot...</Text>
                </View>
              )}
            </Card>
          ) : (
            <Pressable onPress={pickImage} style={styles.uploadPlaceholder}>
              <FrameDoodle width={160} height={120} color={colors.inkFaint} style={{ opacity: 0.4 }} />
              <Text style={styles.uploadText}>Pilih screenshot dari gallery</Text>
              <Text style={styles.uploadHint}>
                Shopee, GrabFood, Tokopedia, dll
              </Text>
            </Pressable>
          )}

          {error ? (
            <Card variant="default" style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </Card>
          ) : null}

          {!image && (
            <Button
              title="Pilih dari Gallery"
              onPress={pickImage}
              variant="primary"
              size="lg"
              fullWidth
            />
          )}

          {image && !parsing && (
            <Button
              title="Pilih Ulang"
              onPress={() => {
                setImage(null);
                setResult(null);
                setError("");
              }}
              variant="secondary"
              fullWidth
            />
          )}
        </View>
      ) : (
        <View style={styles.resultArea}>
          <Card variant="elevated" style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Hasil Parse</Text>
              <Badge
                label={result.platform}
                variant="info"
              />
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
                setImage(null);
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
  uploadArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  uploadPlaceholder: {
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  uploadText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.inkMuted,
  },
  uploadHint: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  previewCard: {
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  parsingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  parsingEmoji: {
    fontSize: 36,
  },
  parsingText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.blue,
  },
  errorCard: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  errorText: {
    fontFamily: "Caveat-Regular",
    fontSize: 16,
    color: "#991b1b",
    textAlign: "center",
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
