import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { requireAdminContext } from "@/lib/domain/admin";
import { listLeadSubmissions } from "@/lib/domain/leads";

export default async function AdminLeadsPage() {
  await requireAdminContext();
  const leads = await listLeadSubmissions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Leads"
        title="Lead inbox"
        description="Review contact inquiries as they arrive and keep the follow-up process organized."
      />
      <Card className="p-7">
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          New submissions from the public contact form are stored here first. The
          structure is ready for follow-up workflows and CRM-style actions later.
        </p>
      </Card>
      <div className="space-y-4">
        {leads.length === 0 ? (
          <Card className="p-7 text-sm text-muted-foreground">
            No leads yet. Public form submissions will appear here once Supabase is configured.
          </Card>
        ) : (
          leads.map((lead) => (
            <Card key={lead.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{lead.full_name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent">
                    {lead.status}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(lead.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {lead.message}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
