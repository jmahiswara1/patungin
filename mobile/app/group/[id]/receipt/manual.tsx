import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Input, Button, Card } from "@/components/ui";
import { UnderlineDoodle, SparkDoodle } from "@/components/doodles";
import { colors, formatCurrency, generateId } from "@/lib/theme";
import { useDraftStore } from "@/stores/draftStore";
import { useCreateReceipt, useCreateReceiptItem, useGroupMembers } from "@/hooks";

interface ItemDraft {
  id: string;
  name: string;
  price: string;
  quantity: string;
}

export default function ManualReceiptScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const { data: members } = useGroupMembers(groupId!);
  const createReceipt = useCreateReceipt();
  const createItem = useCreateReceiptItem();

  const [items, setItems] = useState<ItemDraft[]>([
    { id: generateId(), name: "", price: "", quantity: "1" },
  ]);
  const [discount, setDiscount] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    setItems([...items, { id: generateId(), name: "", price: "", quantity: "1" }]);
  };

  const updateItem = (id: string, field: keyof ItemDraft, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => {
    const price = parseInt(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const total = subtotal - (parseInt(discount) || 0) + (parseInt(shipping) || 0);

  const handleSave = async () => {
    const validItems = items.filter((i) => i.name.trim() && i.price);
    if (validItems.length === 0) return;

    setSaving(true);
    try {
      const receiptId = await createReceipt.mutateAsync({
        group_id: groupId!,
        source: "manual",
        subtotal,
        discount: parseInt(discount) || 0,
        shipping: parseInt(shipping) || 0,
        total: Math.max(0, total),
        status: "draft",
      });

      for (const item of validItems) {
        await createItem.mutateAsync({
          receipt_id: receiptId,
          name: item.name.trim(),
          price: parseInt(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
          participants: [],
        });
      }

      router.replace(`/group/${groupId}/receipt/edit?id=${receiptId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Input Manual</Text>
            <UnderlineDoodle width={140} height={8} color={colors.blue} style={{ marginTop: -2 }} />
          </View>
          <SparkDoodle width={24} height={24} color={colors.blue} style={{ opacity: 0.3 }} />
        </View>

        <Text style={styles.sectionLabel}>Item</Text>
        {items.map((item, index) => (
          <Card key={item.id} variant="default" style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNumber}>#{index + 1}</Text>
              {items.length > 1 && (
                <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
                  <Text style={styles.removeText}>Hapus</Text>
                </Pressable>
              )}
            </View>
            <Input
              placeholder="Nama item"
              value={item.name}
              onChangeText={(v) => updateItem(item.id, "name", v)}
              containerStyle={{ marginBottom: 8 }}
            />
            <View style={styles.itemRow}>
              <View style={{ flex: 2 }}>
                <Input
                  placeholder="Harga"
                  value={item.price}
                  onChangeText={(v) => updateItem(item.id, "price", v.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Input
                  placeholder="Qty"
                  value={item.quantity}
                  onChangeText={(v) => updateItem(item.id, "quantity", v.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            </View>
          </Card>
        ))}

        <Button
          title="+ Tambah Item"
          onPress={addItem}
          variant="ghost"
          fullWidth
          style={styles.addItemButton}
        />

        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <Input
            label="Diskon"
            value={discount}
            onChangeText={(v) => setDiscount(v.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            containerStyle={{ marginBottom: 8 }}
          />
          <Input
            label="Ongkir"
            value={shipping}
            onChangeText={(v) => setShipping(v.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            containerStyle={{ marginBottom: 8 }}
          />
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(Math.max(0, total))}</Text>
          </View>
        </Card>

        <Button
          title="Simpan & Pilih Peserta"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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
  sectionLabel: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
    marginBottom: 10,
  },
  itemCard: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemNumber: {
    fontFamily: "Caveat-Bold",
    fontSize: 18,
    color: colors.blue,
  },
  removeText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 14,
    color: colors.red,
  },
  itemRow: {
    flexDirection: "row",
  },
  addItemButton: {
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    borderStyle: "dashed",
    borderRadius: 10,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: "Caveat-Regular",
    fontSize: 18,
    color: colors.inkMuted,
  },
  summaryValue: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  divider: {
    height: 1.5,
    backgroundColor: colors.stroke,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: "Caveat-Bold",
    fontSize: 22,
    color: colors.ink,
  },
  totalValue: {
    fontFamily: "Caveat-Bold",
    fontSize: 24,
    color: colors.blue,
  },
});
