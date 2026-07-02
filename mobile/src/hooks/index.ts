import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import * as db from "@/lib/db";

// ── Groups ──

export function useGroups(userId: string) {
  const database = useSQLiteContext();
  return useQuery({
    queryKey: ["groups", userId],
    queryFn: () => db.getGroups(database, userId),
    enabled: !!userId,
  });
}

export function useGroup(id: string) {
  const database = useSQLiteContext();
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => db.getGroup(database, id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; creator_id: string; share_code?: string }) =>
      db.createGroup(database, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useDeleteGroup() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => db.deleteGroup(database, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// ── Group Members ──

export function useGroupMembers(groupId: string) {
  const database = useSQLiteContext();
  return useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => db.getGroupMembers(database, groupId),
    enabled: !!groupId,
  });
}

export function useAddGroupMember() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { group_id: string; user_id?: string | null; display_name: string; role?: string }) =>
      db.addGroupMember(database, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", variables.group_id] });
    },
  });
}

export function useRemoveGroupMember() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => db.removeGroupMember(database, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
  });
}

// ── Receipts ──

export function useReceipts(groupId: string) {
  const database = useSQLiteContext();
  return useQuery({
    queryKey: ["receipts", groupId],
    queryFn: () => db.getReceipts(database, groupId),
    enabled: !!groupId,
  });
}

export function useReceipt(id: string) {
  const database = useSQLiteContext();
  return useQuery({
    queryKey: ["receipt", id],
    queryFn: () => db.getReceipt(database, id),
    enabled: !!id,
  });
}

export function useCreateReceipt() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof db.createReceipt>[1]) =>
      db.createReceipt(database, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["receipts", variables.group_id] });
    },
  });
}

export function useDeleteReceipt() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => db.deleteReceipt(database, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
  });
}

// ── Receipt Items ──

export function useReceiptItems(receiptId: string) {
  const database = useSQLiteContext();
  return useQuery({
    queryKey: ["receiptItems", receiptId],
    queryFn: () => db.getReceiptItems(database, receiptId),
    enabled: !!receiptId,
  });
}

export function useCreateReceiptItem() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof db.createReceiptItem>[1]) =>
      db.createReceiptItem(database, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["receiptItems", variables.receipt_id] });
    },
  });
}

export function useUpdateReceiptItem() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof db.updateReceiptItem>[2] }) =>
      db.updateReceiptItem(database, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receiptItems"] });
    },
  });
}

export function useDeleteReceiptItem() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => db.deleteReceiptItem(database, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receiptItems"] });
    },
  });
}

// ── Payments ──

export function usePayments(groupId: string) {
  const database = useSQLiteContext();
  return useQuery({
    queryKey: ["payments", groupId],
    queryFn: () => db.getPayments(database, groupId),
    enabled: !!groupId,
  });
}

export function useCreatePayment() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof db.createPayment>[1]) =>
      db.createPayment(database, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", variables.group_id] });
    },
  });
}

export function useMarkPaymentPaid() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => db.markPaymentPaid(database, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useMarkPaymentUnpaid() {
  const database = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => db.markPaymentUnpaid(database, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
