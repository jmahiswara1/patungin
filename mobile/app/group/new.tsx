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
import { router } from "expo-router";
import { Input, Button, Card } from "@/components/ui";
import { UnderlineDoodle, SparkDoodle } from "@/components/doodles";
import { colors, generateId } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";
import { useCreateGroup, useAddGroupMember } from "@/hooks";

function XCircleDoodle({ color = colors.inkFaint }: { color?: string }) {
  const Svg = require("react-native-svg").default;
  const { Path } = require("react-native-svg");
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M6 6 L14 14 M14 6 L6 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function NewGroupScreen() {
  const { userId } = useAuthStore();
  const createGroup = useCreateGroup();
  const addMember = useAddGroupMember();

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const [error, setError] = useState("");

  const addMemberHandler = () => {
    const name = newMember.trim();
    if (!name) return;
    if (members.includes(name)) {
      setError("Nama sudah ditambahkan");
      return;
    }
    setMembers([...members, name]);
    setNewMember("");
    setError("");
  };

  const removeMember = (name: string) => {
    setMembers(members.filter((m) => m !== name));
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError("Nama grup wajib diisi");
      return;
    }
    if (!userId) return;

    try {
      const result = await createGroup.mutateAsync({
        name: groupName.trim(),
        creator_id: userId,
      });

      await addMember.mutateAsync({
        group_id: result.id,
        user_id: userId,
        display_name: useAuthStore.getState().userName || "Admin",
        role: "admin",
      });

      for (const memberName of members) {
        await addMember.mutateAsync({
          group_id: result.id,
          display_name: memberName,
        });
      }

      router.replace(`/group/${result.id}`);
    } catch (e) {
      setError("Gagal membuat grup");
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
            <Text style={styles.title}>Buat Grup</Text>
            <UnderlineDoodle
              width={120}
              height={8}
              color={colors.blue}
              style={{ marginTop: -2 }}
            />
          </View>
          <SparkDoodle
            width={28}
            height={28}
            color={colors.blue}
            style={{ opacity: 0.3 }}
          />
        </View>

        <Card variant="elevated" style={styles.formCard}>
          <Input
            label="Nama Grup"
            placeholder="Contoh: Makan Bakso Pak Jenggot"
            value={groupName}
            onChangeText={setGroupName}
            error={error && !groupName.trim() ? error : undefined}
          />

          <View style={styles.sectionLabel}>
            <Text style={styles.sectionText}>Anggota</Text>
            <Text style={styles.sectionHint}>({members.length} orang)</Text>
          </View>

          <View style={styles.memberInputRow}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Nama anggota"
                value={newMember}
                onChangeText={setNewMember}
                onSubmitEditing={addMemberHandler}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <Button
              title="Tambah"
              onPress={addMemberHandler}
              variant="secondary"
              size="sm"
              style={{ marginLeft: 8, marginTop: 22 }}
            />
          </View>

          {members.length > 0 && (
            <View style={styles.memberList}>
              {members.map((member, index) => (
                <View key={index} style={styles.memberChip}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>
                      {member.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.memberName}>{member}</Text>
                  <Pressable onPress={() => removeMember(member)} hitSlop={8}>
                    <XCircleDoodle color={colors.inkFaint} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </Card>

        <View style={styles.actions}>
          <Button
            title="Buat Grup"
            onPress={handleCreate}
            variant="primary"
            size="lg"
            fullWidth
            loading={createGroup.isPending}
          />
        </View>
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
    marginBottom: 28,
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
  formCard: {
    marginBottom: 24,
  },
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionText: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  sectionHint: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    marginLeft: 6,
  },
  memberInputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  memberList: {
    marginTop: 16,
    gap: 10,
  },
  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paperSoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.blue,
    marginRight: 10,
  },
  memberAvatarText: {
    fontFamily: "Caveat-Bold",
    fontSize: 16,
    color: colors.blue,
  },
  memberName: {
    flex: 1,
    fontFamily: "Caveat-SemiBold",
    fontSize: 18,
    color: colors.ink,
  },
  actions: {
    gap: 12,
  },
});
