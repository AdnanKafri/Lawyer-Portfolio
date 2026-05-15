import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDashboardSummary(organizationId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      totalServices: 0,
      totalStatistics: 0,
      totalTestimonials: 0,
      totalFaqs: 0,
      totalSocialLinks: 0,
      totalLeads: 0,
    };
  }

  const [services, statistics, testimonials, faqs, socialLinks, leads] = await Promise.all([
    supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("statistics")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("testimonials")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("faqs")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("social_links")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("lead_submissions")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
  ]);

  return {
    totalServices: services.count ?? 0,
    totalStatistics: statistics.count ?? 0,
    totalTestimonials: testimonials.count ?? 0,
    totalFaqs: faqs.count ?? 0,
    totalSocialLinks: socialLinks.count ?? 0,
    totalLeads: leads.count ?? 0,
  };
}
