import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"];

export async function getActiveOrganization(
  supabase: SupabaseClient<Database>,
): Promise<OrganizationRow | null> {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
