import "server-only";

import { createClient } from "@supabase/supabase-js";

import { SUPABASE_URL } from "@/lib/supabase/config";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !serviceRoleKey) {
    return null;
  }

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getAdminEmails() {
  return (process.env.ENDORSEMENT_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getTrustedDomains() {
  return (process.env.ENDORSEMENT_TRUSTED_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}
