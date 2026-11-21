import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export interface SupabaseSyncStatus {
  connected: boolean;
  message: string;
  lastSyncedAt?: string;
}

export function getSupabaseStatus(): SupabaseSyncStatus {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: "Local Demo Mode (Persistent Browser Storage). Supabase credentials not set.",
    };
  }
  return {
    connected: true,
    message: "Connected to Supabase Cloud Database",
  };
}
