import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Card, Badge } from "@/components/ui";
import { UnderlineDoodle, CheckmarkDoodle } from "@/components/doodles";
import { colors, formatCurrency } from "@/lib/theme";
import {
  useReceipt,
  useReceiptItems,
  useGroupMembers,
  useUpdateReceiptItem,
} from "@/hooks";

export default function EditReceiptScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const receiptId = useLocalSearchParams<{ id: string }>().id;

  const { data: receipt } = useReceipt(receiptId!);
  const { data: items, refetch } = useReceiptItems(receiptId!);
  const { data: members } = useGroupMembers(groupId!);
  const updateItem = useUpdateReceiptItem();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [itemParticipants, setItemParticipants] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (items) {
      const map: Record<string, string[]> = {};
      for (const item of items) {
        map[item.id] = item.participants;
      }
      setItemParticipants(map);
    }
  }, [items]);

  const toggleParticipant = (itemId: string, memberId: string) => {
    setItemParticipants((prev) => {
      const current = prev[itemId] || [];
      const updated = current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId];
      return { ...prev, [itemId]: updated };
    });
  };

  const handleSaveItem = async (itemId: string) => {
    await updateItem.mutateAsync({
      id: itemId,
      data: { participants: itemParticipants[itemId] || [] },
    });
    setSelectedItem(null);
    refetch();
  };

  const allAssigned = items?.every(
    (item) => (itemParticipants[item.id] || []).length > 0
  );

  const handleContinue = () => {
    if (!receiptId) return;
    router.push(`/group/${groupId}/receipt/split?id=${receiptId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Pilih Peserta</Text>
          <UnderlineDoodle width={140} height={8} color={colors.blue} style={{ marginTop: -2 }} />
        </View>
        <Badge
          label={items ? `${items.length} item` : "..."}
          variant="info"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {receipt && (
          <Card variant="elevated" style={styles.receiptSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(receipt.subtotal)}</Text>
            </View>
            {receipt.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Diskon</Text>
                <Text style={[styles.summaryValue, { color: colors.green }]}>
                  -{formatCurrency(receipt.discount)}
                </Text>
              </View>
            )}
            {receipt.shipping > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ongkir</Text>
                <Text style={styles.summaryValue}>{formatCurrency(receipt.shipping)}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(receipt.total)}</Text>
            </View>
          </Card>
        )}

        <Text style={styles.sectionTitle}>Siapa yang pesan tiap item?</Text>

        {items?.map((item, index) => {
          const isSelected = selectedItem === item.id;
          const participants = itemParticipants[item.id] || [];
          const isAssigned = participants.length > 0;

          return (
            <Card
              key={item.id}
              variant={isSelected ? "outlined" : "default"}
              style={styles.itemCard}
            >
              <Pressable
                onPress={() => setSelectedItem(isSelected ? null : item.id)}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetail}>
                      {formatCurrency(item.price)} x {item.quantity}
                    </Text>
                  </View>
                  <View style={styles.itemStatus}>
                    {isAssigned ? (
                      <CheckmarkDoodle width={20} height={20} color={colors.green} />
                    ) : (
                      <View style={styles.unassignedDot} />
                    )}
                    <Text style={styles.itemTotal}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {isSelected && (
                <View style={styles.participantSection}>
                  <Text style={styles.participantTitle}>Pilih peserta:</Text>
                  <View style={styles.participantList}>
                    {members?.map((member) => {
                      const isChecked = participants.includes(member.id);
                      return (
                        <Pressable
                          key={member.id}
                          style={[
                            styles.participantChip,
                            isChecked && styles.participantChipSelected,
                          ]}
                          onPress={() => toggleParticipant(item.id, member.id)}
                        >
                          <View style={[
                            styles.checkbox,
                            isChecked && styles.checkboxChecked,
                          ]}>
                            {isChecked && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </View>
                          <Text style={[
                            styles.participantName,
                            isChecked && styles.participantNameSelected,
                          ]}>
                            {member.display_name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Button
                    title="Simpan"
                    onPress={() => handleSaveItem(item.id)}
                    variant="primary"
                    size="sm"
                    fullWidth
                    loading={updateItem.isPending}
                  />
                </View>
              )}
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title={allAssigned ? "Hitung Pembagian" : "Lewati & Hitung"}
          onPress={handleContinue}
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
  receiptSummary: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
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
    marginVertical: 8,
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
  sectionTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
    marginBottom: 12,
  },
  itemCard: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
  },
  itemDetail: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
  },
  itemStatus: {
    alignItems: "flex-end",
    gap: 4,
  },
  unassignedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.stroke,
    borderWidth: 1.5,
    borderColor: colors.inkFaint,
  },
  itemTotal: {
    fontFamily: "Caveat-Bold",
    fontSize: 18,
    color: colors.ink,
  },
  participantSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
  },
  participantTitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
    marginBottom: 10,
  },
  participantList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  participantChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.paperSoft,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    gap: 6,
  },
  participantChipSelected: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.inkFaint,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  checkmark: {
    fontFamily: "Caveat-Bold",
    fontSize: 12,
    color: colors.paper,
  },
  participantName: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 16,
    color: colors.ink,
  },
  participantNameSelected: {
    color: colors.blueDark,
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
