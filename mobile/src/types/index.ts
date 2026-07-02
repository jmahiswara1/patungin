export interface User {
  id: string;
  email: string | null;
  name: string;
  avatar_url: string | null;
  is_guest: boolean;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  creator_id: string;
  share_code: string;
  status: "active" | "settled" | "archived";
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string | null;
  display_name: string;
  role: "admin" | "member";
}

export interface Receipt {
  id: string;
  group_id: string;
  source: "photo" | "screenshot" | "manual";
  image_url: string | null;
  platform: "shopee" | "grabfood" | "tokped" | "lainnya" | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "draft" | "confirmed" | "settled";
  parsed_data: Record<string, unknown> | null;
  created_at: string;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  participants: string[];
}

export interface Payment {
  id: string;
  group_id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  is_paid: boolean;
  paid_at: string | null;
}

export interface SplitResult {
  member_id: string;
  member_name: string;
  amount: number;
  items: { name: string; share: number }[];
}
