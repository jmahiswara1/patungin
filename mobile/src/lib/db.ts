import type { SQLiteDatabase } from "expo-sqlite";
import { generateId } from "./theme";

export async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT UNIQUE,
      name TEXT NOT NULL DEFAULT '',
      avatar_url TEXT,
      is_guest INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      creator_id TEXT NOT NULL,
      share_code TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','settled','archived')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (creator_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS group_members (
      id TEXT PRIMARY KEY NOT NULL,
      group_id TEXT NOT NULL,
      user_id TEXT,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('admin','member')),
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY NOT NULL,
      group_id TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('photo','screenshot','manual')),
      image_url TEXT,
      platform TEXT CHECK(platform IN ('shopee','grabfood','tokped','lainnya')),
      subtotal INTEGER NOT NULL DEFAULT 0,
      discount INTEGER NOT NULL DEFAULT 0,
      shipping INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','confirmed','settled')),
      parsed_data TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipt_items (
      id TEXT PRIMARY KEY NOT NULL,
      receipt_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      quantity INTEGER NOT NULL DEFAULT 1,
      discount INTEGER NOT NULL DEFAULT 0,
      participants TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY NOT NULL,
      group_id TEXT NOT NULL,
      from_user_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      amount INTEGER NOT NULL DEFAULT 0,
      is_paid INTEGER NOT NULL DEFAULT 0,
      paid_at TEXT,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (from_user_id) REFERENCES users(id),
      FOREIGN KEY (to_user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_groups_creator ON groups(creator_id);
    CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
    CREATE INDEX IF NOT EXISTS idx_receipts_group ON receipts(group_id);
    CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt ON receipt_items(receipt_id);
    CREATE INDEX IF NOT EXISTS idx_payments_group ON payments(group_id);
  `);
}

// ── Users ──

export async function createUser(
  db: SQLiteDatabase,
  user: { id?: string; email?: string | null; name: string; avatar_url?: string | null; is_guest?: boolean }
) {
  const id = user.id || generateId();
  await db.runAsync(
    `INSERT OR REPLACE INTO users (id, email, name, avatar_url, is_guest) VALUES (?, ?, ?, ?, ?)`,
    [id, user.email ?? null, user.name, user.avatar_url ?? null, user.is_guest ? 1 : 0]
  );
  return id;
}

export async function getUser(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<{
    id: string;
    email: string | null;
    name: string;
    avatar_url: string | null;
    is_guest: number;
    created_at: string;
  }>(`SELECT * FROM users WHERE id = ?`, [id]);
}

// ── Groups ──

export async function createGroup(
  db: SQLiteDatabase,
  data: { name: string; creator_id: string; share_code?: string }
) {
  const id = generateId();
  const share_code = data.share_code || Math.random().toString(36).substring(2, 8).toUpperCase();
  await db.runAsync(
    `INSERT INTO groups (id, name, creator_id, share_code) VALUES (?, ?, ?, ?)`,
    [id, data.name, data.creator_id, share_code]
  );
  return { id, share_code };
}

export async function getGroups(db: SQLiteDatabase, userId: string) {
  return db.getAllAsync<{
    id: string;
    name: string;
    creator_id: string;
    share_code: string;
    status: string;
    created_at: string;
  }>(
    `SELECT DISTINCT g.* FROM groups g
     LEFT JOIN group_members gm ON gm.group_id = g.id
     WHERE g.creator_id = ? OR gm.user_id = ?
     ORDER BY g.created_at DESC`,
    [userId, userId]
  );
}

export async function getGroup(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<{
    id: string;
    name: string;
    creator_id: string;
    share_code: string;
    status: string;
    created_at: string;
  }>(`SELECT * FROM groups WHERE id = ?`, [id]);
}

export async function updateGroupStatus(db: SQLiteDatabase, id: string, status: string) {
  await db.runAsync(`UPDATE groups SET status = ? WHERE id = ?`, [status, id]);
}

export async function deleteGroup(db: SQLiteDatabase, id: string) {
  await db.runAsync(`DELETE FROM groups WHERE id = ?`, [id]);
}

// ── Group Members ──

export async function addGroupMember(
  db: SQLiteDatabase,
  data: { group_id: string; user_id?: string | null; display_name: string; role?: string }
) {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO group_members (id, group_id, user_id, display_name, role) VALUES (?, ?, ?, ?, ?)`,
    [id, data.group_id, data.user_id ?? null, data.display_name, data.role || "member"]
  );
  return id;
}

export async function getGroupMembers(db: SQLiteDatabase, groupId: string) {
  return db.getAllAsync<{
    id: string;
    group_id: string;
    user_id: string | null;
    display_name: string;
    role: string;
  }>(`SELECT * FROM group_members WHERE group_id = ?`, [groupId]);
}

export async function removeGroupMember(db: SQLiteDatabase, id: string) {
  await db.runAsync(`DELETE FROM group_members WHERE id = ?`, [id]);
}

// ── Receipts ──

export async function createReceipt(
  db: SQLiteDatabase,
  data: {
    group_id: string;
    source: string;
    image_url?: string | null;
    platform?: string | null;
    subtotal?: number;
    discount?: number;
    shipping?: number;
    total?: number;
    status?: string;
    parsed_data?: Record<string, unknown> | null;
  }
) {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO receipts (id, group_id, source, image_url, platform, subtotal, discount, shipping, total, status, parsed_data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.group_id,
      data.source,
      data.image_url ?? null,
      data.platform ?? null,
      data.subtotal ?? 0,
      data.discount ?? 0,
      data.shipping ?? 0,
      data.total ?? 0,
      data.status || "draft",
      data.parsed_data ? JSON.stringify(data.parsed_data) : null,
    ]
  );
  return id;
}

export async function getReceipts(db: SQLiteDatabase, groupId: string) {
  return db.getAllAsync<{
    id: string;
    group_id: string;
    source: string;
    image_url: string | null;
    platform: string | null;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    status: string;
    parsed_data: string | null;
    created_at: string;
  }>(`SELECT * FROM receipts WHERE group_id = ? ORDER BY created_at DESC`, [groupId]);
}

export async function getReceipt(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<{
    id: string;
    group_id: string;
    source: string;
    image_url: string | null;
    platform: string | null;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    status: string;
    parsed_data: string | null;
    created_at: string;
  }>(`SELECT * FROM receipts WHERE id = ?`, [id]);
}

export async function updateReceiptStatus(db: SQLiteDatabase, id: string, status: string) {
  await db.runAsync(`UPDATE receipts SET status = ? WHERE id = ?`, [status, id]);
}

export async function deleteReceipt(db: SQLiteDatabase, id: string) {
  await db.runAsync(`DELETE FROM receipts WHERE id = ?`, [id]);
}

// ── Receipt Items ──

export async function createReceiptItem(
  db: SQLiteDatabase,
  data: {
    receipt_id: string;
    name: string;
    price: number;
    quantity?: number;
    discount?: number;
    participants?: string[];
  }
) {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO receipt_items (id, receipt_id, name, price, quantity, discount, participants) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.receipt_id,
      data.name,
      data.price,
      data.quantity ?? 1,
      data.discount ?? 0,
      JSON.stringify(data.participants ?? []),
    ]
  );
  return id;
}

export async function getReceiptItems(db: SQLiteDatabase, receiptId: string) {
  const rows = await db.getAllAsync<{
    id: string;
    receipt_id: string;
    name: string;
    price: number;
    quantity: number;
    discount: number;
    participants: string;
  }>(`SELECT * FROM receipt_items WHERE receipt_id = ?`, [receiptId]);

  return rows.map((r) => ({
    ...r,
    participants: JSON.parse(r.participants) as string[],
  }));
}

export async function updateReceiptItem(
  db: SQLiteDatabase,
  id: string,
  data: { name?: string; price?: number; quantity?: number; discount?: number; participants?: string[] }
) {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
  if (data.price !== undefined) { fields.push("price = ?"); values.push(data.price); }
  if (data.quantity !== undefined) { fields.push("quantity = ?"); values.push(data.quantity); }
  if (data.discount !== undefined) { fields.push("discount = ?"); values.push(data.discount); }
  if (data.participants !== undefined) { fields.push("participants = ?"); values.push(JSON.stringify(data.participants)); }

  if (fields.length > 0) {
    values.push(id);
    await db.runAsync(`UPDATE receipt_items SET ${fields.join(", ")} WHERE id = ?`, values);
  }
}

export async function deleteReceiptItem(db: SQLiteDatabase, id: string) {
  await db.runAsync(`DELETE FROM receipt_items WHERE id = ?`, [id]);
}

// ── Payments ──

export async function createPayment(
  db: SQLiteDatabase,
  data: { group_id: string; from_user_id: string; to_user_id: string; amount: number }
) {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO payments (id, group_id, from_user_id, to_user_id, amount) VALUES (?, ?, ?, ?, ?)`,
    [id, data.group_id, data.from_user_id, data.to_user_id, data.amount]
  );
  return id;
}

export async function getPayments(db: SQLiteDatabase, groupId: string) {
  return db.getAllAsync<{
    id: string;
    group_id: string;
    from_user_id: string;
    to_user_id: string;
    amount: number;
    is_paid: number;
    paid_at: string | null;
  }>(`SELECT * FROM payments WHERE group_id = ?`, [groupId]);
}

export async function markPaymentPaid(db: SQLiteDatabase, id: string) {
  await db.runAsync(
    `UPDATE payments SET is_paid = 1, paid_at = datetime('now') WHERE id = ?`,
    [id]
  );
}

export async function markPaymentUnpaid(db: SQLiteDatabase, id: string) {
  await db.runAsync(
    `UPDATE payments SET is_paid = 0, paid_at = NULL WHERE id = ?`,
    [id]
  );
}
