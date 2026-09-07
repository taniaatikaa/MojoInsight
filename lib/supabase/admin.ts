import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. Only ever import this from
// "use server" action files, never from client components.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function generateRandomPassword() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}
