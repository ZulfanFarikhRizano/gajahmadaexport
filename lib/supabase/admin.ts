import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service role bypasses RLS entirely — this file must never be imported
// into a Client Component or shipped to the browser. Every table has RLS
// enabled with no policies, so this is the only key that can read or write.
let client: ReturnType<typeof createClient> | null = null;

export function supabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
