import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveOrganization } from "@/lib/domain/organization";
import { env } from "@/lib/env";
import type { LeadSubmissionCreate } from "@/types/domain";

async function sendLeadNotification(payload: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
}) {
  if (!env.RESEND_API_KEY || !env.LEAD_NOTIFICATION_EMAIL) {
    return { delivered: false, reason: "Notification provider not configured." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Lawyer Portfolio <onboarding@resend.dev>",
      to: [env.LEAD_NOTIFICATION_EMAIL],
      subject: `New lead from ${payload.fullName}`,
      html: `
        <h2>New lead submission</h2>
        <p><strong>Name:</strong> ${payload.fullName}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        <p><strong>Locale:</strong> ${payload.locale}</p>
        <p><strong>Message:</strong><br />${payload.message.replace(/\n/g, "<br />")}</p>
      `,
    }),
  });

  if (!response.ok) {
    return { delivered: false, reason: "Notification request failed." };
  }

  return { delivered: true };
}

export async function createLeadSubmission(input: LeadSubmissionCreate) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    throw new Error("No active organization found.");
  }

  const { error } = await supabase.from("lead_submissions").insert({
    organization_id: organization.id,
    locale: input.locale,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    message: input.message,
    source: "website_contact_form",
    status: "new",
  });

  if (error) {
    throw new Error(error.message);
  }

  return sendLeadNotification({
    locale: input.locale,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    message: input.message,
  });
}

export async function listLeadSubmissions() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return [];
  }

  const { data, error } = await supabase
    .from("lead_submissions")
    .select("*")
    .eq("organization_id", organization.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return data;
}
