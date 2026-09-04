import { createClient } from "@/lib/supabase/server";

// Temporary connectivity check for Milestone 1 — delete this route in Milestone 2.
export default async function SmokeTestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("v_hero_stats").select("*").single();

  if (error) {
    return <pre>Error: {error.message}</pre>;
  }

  return <pre>{JSON.stringify(data)}</pre>;
}
