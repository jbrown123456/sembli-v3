/**
 * Sembli — Supabase database types
 *
 * Hand-written to match migration 0002_core_schema.sql.
 * Once Supabase CLI is connected to a live project, regenerate with:
 *   supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 * and delete this file.
 */

// ─── Row types (what you get back from SELECT) ────────────────

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_yearly';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';

export interface Subscription {
  id: string;
  owner_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Home {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  year_built: number | null;
  type: string | null;
  owner_relationship: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomeMember {
  id: string;
  home_id: string;
  user_id: string;
  role: 'owner' | 'member';
  invited_by: string | null;
  created_at: string;
}

export type AssetSource = 'manual' | 'voice' | 'document' | 'ai_inferred';
export type AssetCategory =
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Exterior'
  | 'Appliance'
  | 'Contact'
  | string; // open-ended for future categories

export interface Asset {
  id: string;
  home_id: string;
  name: string;
  category: AssetCategory | null;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  install_year: number | null;
  last_service_date: string | null; // ISO date string
  expected_life_years: number | null;
  notes: string | null;
  source: AssetSource;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  home_id: string;
  name: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  last_used: string | null; // ISO date string
  created_at: string;
  updated_at: string;
}

export type MaintenanceSource = 'manual' | 'ai_suggested' | 'voice';
export type MaintenanceRecurrence = 'none' | 'monthly' | 'quarterly' | 'annual';
export type MaintenanceStatus = 'scheduled' | 'completed' | 'skipped';

export interface MaintenanceItem {
  id: string;
  home_id: string;
  asset_id: string | null;
  vendor_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;       // ISO date string
  completed_date: string | null; // ISO date string
  cost_cents: number | null;     // divide by 100 for display
  recurrence: MaintenanceRecurrence;
  source: MaintenanceSource;
  status: MaintenanceStatus;
  created_at: string;
  updated_at: string;
}

export type DocumentType = 'receipt' | 'manual' | 'permit' | 'warranty' | 'photo' | 'other';

export interface SembliDocument {
  id: string;
  home_id: string;
  asset_id: string | null;
  title: string;
  doc_type: DocumentType | null;
  storage_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  ai_processed: boolean;
  ai_extracted_data: Record<string, unknown> | null;
  created_at: string;
}

// ─── Insert types (omit generated fields) ─────────────────────

export type InsertHome = Omit<Home, 'id' | 'created_at' | 'updated_at'>;
export type InsertAsset = Omit<Asset, 'id' | 'created_at' | 'updated_at'>;
export type InsertVendor = Omit<Vendor, 'id' | 'created_at' | 'updated_at'>;
export type InsertMaintenanceItem = Omit<MaintenanceItem, 'id' | 'created_at' | 'updated_at'>;
export type InsertDocument = Omit<SembliDocument, 'id' | 'created_at'>;
export type InsertHomeMember = Omit<HomeMember, 'id' | 'created_at'>;

// ─── Update types (all fields optional except id) ─────────────

export type UpdateHome = Partial<InsertHome>;
export type UpdateAsset = Partial<InsertAsset>;
export type UpdateVendor = Partial<InsertVendor>;
export type UpdateMaintenanceItem = Partial<InsertMaintenanceItem>;

// ─── Conversations + Messages (migration 0005) ────────────────

export interface Conversation {
  id: string;
  home_id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export type MessageRole = 'user' | 'assistant' | 'tool_result';

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tool_use_id: string | null;
  tool_name: string | null;
  created_at: string;
}

// ─── Waitlist (migration 0001) ────────────────────────────────

export interface Waitlist {
  id: string;
  email: string;
  source: string;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

// ─── Database shape (for createClient<Database>() typing) ─────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'owner_id'>>;
        Relationships: [];
      };
      homes: {
        Row: Home;
        Insert: InsertHome;
        Update: UpdateHome;
        Relationships: [];
      };
      home_members: {
        Row: HomeMember;
        Insert: InsertHomeMember;
        Update: Partial<InsertHomeMember>;
        Relationships: [];
      };
      assets: {
        Row: Asset;
        Insert: InsertAsset;
        Update: UpdateAsset;
        Relationships: [];
      };
      vendors: {
        Row: Vendor;
        Insert: InsertVendor;
        Update: UpdateVendor;
        Relationships: [];
      };
      maintenance_items: {
        Row: MaintenanceItem;
        Insert: InsertMaintenanceItem;
        Update: UpdateMaintenanceItem;
        Relationships: [];
      };
      documents: {
        Row: SembliDocument;
        Insert: InsertDocument;
        Update: Partial<InsertDocument>;
        Relationships: [];
      };
      waitlist: {
        Row: Waitlist;
        Insert: Omit<Waitlist, 'id' | 'created_at'>;
        Update: Partial<Omit<Waitlist, 'id' | 'created_at'>>;
        Relationships: [];
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'home_id' | 'user_id'>>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'conversation_id'>>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      user_has_home_access: {
        Args: { p_home_id: string };
        Returns: boolean;
      };
    };
  };
}
