import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Card, Button, Input, Badge } from "@/components/ui";
import { UnderlineDoodle } from "@/components/doodles";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import {
  useGroup,
  useGroupMembers,
  useAddGroupMember,
  useRemoveGroupMember,
} from "@/hooks";

export default function MembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuthStore();
  const { data: group } = useGroup(id!);
  const { data: members } = useGroupMembers(id!);
  const addMember = useAddGroupMember();
  const removeMember = useRemoveGroupMember();

  const [newName, setNewName] = useState("");

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    await addMember.mutateAsync({
      group_id: id!,
      display_name: name,
    });
    setNewName("");
  };

  const handleRemove = async (memberId: string) => {
    await removeMember.mutateAsync(memberId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Anggota</Text>
          <UnderlineDoodle
            width={100}
            height={8}
            color={colors.blue}
            style={{ marginTop: -2 }}
          />
        </View>
        <Badge label={`${members?.length || 0} orang`} variant="info" />
      </View>

      <View style={styles.addSection}>
        <View style={styles.addInputRow}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Nama anggota baru"
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAdd}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
          <Button
            title="Tambah"
            onPress={handleAdd}
            variant="primary"
            size="sm"
            style={{ marginLeft: 8, marginTop: 22 }}
            loading={addMember.isPending}
          />
        </View>
      </View>

      <FlatList
        data={members || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card variant="default" style={styles.memberCard}>
            <View style={styles.memberRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{item.display_name}</Text>
                <Badge
                  label={item.role === "admin" ? "Admin" : "Anggota"}
                  variant={item.role === "admin" ? "info" : "default"}
                />
              </View>
              {item.role !== "admin" && (
                <Pressable
                  onPress={() => handleRemove(item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>Hapus</Text>
                </Pressable>
              )}
            </View>
          </Card>
        )}
      />
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
  addSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addInputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  memberCard: {
    marginBottom: 2,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
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
  avatarText: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.blue,
  },
  memberName: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 20,
    color: colors.ink,
    marginBottom: 2,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  removeText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 14,
    color: colors.red,
  },
});
