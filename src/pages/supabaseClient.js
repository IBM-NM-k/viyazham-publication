import { createClient } from "@supabase/supabase-js";

// =====================================================
// VIYAZHAM PUBLICATION — SUPABASE CONNECTION
// =====================================================

const supabaseUrl = "https://cqrkpdizrvumkbidsgzi.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcmtwZGl6cnZ1bWtiaWRzZ3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDExOTEsImV4cCI6MjEwMzY3NzE5MX0.X_rFhbOCojjmpCE2fxbXL1bS356lAXpEGwMKas8Fur4";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);