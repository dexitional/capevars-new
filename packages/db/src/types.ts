// Row shapes for the tables the app reads most. DATETIME/TIMESTAMP columns
// come back as plain strings (the pool sets dateStrings), DECIMAL as strings,
// TINYINT(1) as 0/1 and JSON as parsed values.

export type AdminRole = "super_admin" | "admin" | "moderator" | "editor" | "support";

export interface AdminRow {
  id: number;
  full_name: string;
  email: string;
  role: AdminRole;
  position: string | null;
  phone: string | null;
  photo_url: string | null;
  password_hash: string;
  is_active: 0 | 1;
  failed_login_attempts: number;
  locked_until: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export type MemberType = "public" | "student" | "staff" | "alumni";

export interface UserRow {
  id: number;
  full_name: string;
  username: string;
  email: string;
  password_hash: string | null;
  google_sub: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  member_type: MemberType;
  institution: string | null;
  skills: Array<string> | null;
  open_to_work: 0 | 1;
  is_verified: 0 | 1;
  is_active: 0 | 1;
  failed_login_attempts: number;
  locked_until: string | null;
  last_login_at: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaAssetRow {
  id: number;
  file_key: string;
  url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  folder: string;
  uploaded_by: number | null;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

export type SellerKind = "products" | "food" | "events" | "transport" | "exhibitions";
export type SellerStatus = "pending" | "approved" | "rejected" | "suspended";

export interface SellerRow {
  id: number;
  user_id: number;
  store_name: string;
  slug: string;
  kinds: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  email: string | null;
  phone: string;
  whatsapp: string | null;
  location: string | null;
  business_reg_no: string | null;
  id_document_url: string | null;
  cuisine: string | null;
  opening_hours: string | null;
  delivers: 0 | 1;
  delivery_fee: string;
  is_open: 0 | 1;
  status: SellerStatus;
  status_reason: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  is_featured: 0 | 1;
  is_verified: 0 | 1;
  rating_avg: string | null;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export type FinderType = "person" | "place" | "business" | "hostel" | "hotel" | "restaurant";

export type PaymentPurpose = "order" | "ticket" | "enrollment" | "donation" | "booth" | "lead" | "credits";

export interface PaymentRow {
  id: number;
  reference: string;
  user_id: number | null;
  purpose: PaymentPurpose;
  target_ids: Array<number>;
  meta: Record<string, unknown> | null;
  amount: string;
  currency: string;
  provider: "paystack" | "manual";
  status: "pending" | "success" | "failed";
  channel: string | null;
  email: string | null;
  return_path: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}
