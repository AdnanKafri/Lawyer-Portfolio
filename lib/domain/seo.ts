import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveOrganization } from "@/lib/domain/organization";
import type { Locale } from "@/lib/i18n/config";

export async function getSeoMetadataForPage(locale: Locale, pageKey: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return null;
  }

  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("organization_id", organization.id)
    .eq("locale", locale)
    .eq("page_key", pageKey)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}
