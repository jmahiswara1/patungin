import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Button, Card } from "@/components/ui";
import { UnderlineDoodle, FrameDoodle, ArrowDoodle } from "@/components/doodles";
import { colors } from "@/lib/theme";
import { useCreateReceipt, useCreateReceiptItem } from "@/hooks";

export default function ScreenshotReceiptScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const createReceipt = useCreateReceipt();
  const createItem = useCreateReceiptItem();

  const [image, setImage] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setImage(pickerResult.assets[0].uri);
      parseScreenshot();
    }
  };

  const parseScreenshot = () => {
    setParsing(true);
    // TODO: Phase 10 - AI integration
    setTimeout(() => {
      setParsing(false);
      setResult({
        items: [
          { name: "Mie Ayam Spesial", price: 18000, quantity: 1 },
          { name: "Es Jeruk", price: 6000, quantity: 2 },
          { name: "Kerupuk", price: 3000, quantity: 1 },
        ],
        subtotal: 33000,
        discount: 3000,
        shipping: 5000,
        total: 35000,
        platform: "shopee",
      });
    }, 2000);
  };

  const handleSave = async () => {
    if (!result) return;

    const receiptId = await createReceipt.mutateAsync({
      group_id: groupId!,
      source: "screenshot",
      platform: result.platform || "lainnya",
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
                  <Text style={styles.parsingText}>Membaca screenshot...</Text>
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

          {!image && (
            <Button
              title="Pilih dari Gallery"
              onPress={pickImage}
              variant="primary"
              size="lg"
              fullWidth
            />
          )}
        </View>
      ) : (
        <View style={styles.resultArea}>
          <Card variant="elevated" style={styles.resultCard}>
            <Text style={styles.resultTitle}>Hasil Parse</Text>
            {result.items.map((item: any, i: number) => (
              <View key={i} style={styles.resultItem}>
                <Text style={styles.resultItemName}>{item.name}</Text>
                <Text style={styles.resultItemQty}>x{item.quantity}</Text>
                <Text style={styles.resultItemPrice}>
                  Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                </Text>
              </View>
            ))}
            {result.discount > 0 && (
              <View style={styles.resultRow}>
                <Text style={styles.resultRowLabel}>Diskon</Text>
                <Text style={styles.resultRowValueDiscount}>
                  -Rp{result.discount.toLocaleString("id-ID")}
                </Text>
              </View>
            )}
            {result.shipping > 0 && (
              <View style={styles.resultRow}>
                <Text style={styles.resultRowLabel}>Ongkir</Text>
                <Text style={styles.resultRowValue}>
                  Rp{result.shipping.toLocaleString("id-ID")}
                </Text>
              </View>
            )}
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
  uploadArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 24,
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
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  parsingText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.blue,
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
  resultRowValueDiscount: {
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
});
