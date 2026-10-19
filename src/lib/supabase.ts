import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// null jika env belum diisi -> tombol Like tetap jalan secara lokal (tanpa database).
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
