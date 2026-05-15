import Link from "next/link";
import { ArrowRight, FileText, Globe2, ImageIcon, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const foundations = [
  {
    title: "Editorial control",
    description: "Update hero, about, services, testimonials, FAQs, and contact details from structured forms.",
    icon: FileText,
  },
  {
    title: "Locale-aware CMS",
    description: "Manage English and Arabic content separately while keeping the editing experience consistent.",
    icon: Globe2,
  },
  {
    title: "Asset workflow",
    description: "Upload images once, reuse them across content sections, and keep the brand imagery organized.",
    icon: ImageIcon,
  },
  {
    title: "Secure by design",
    description: "All content changes are validated server-side and protected through Supabase roles and RLS.",
    icon: Shield,
  },
];

export function AdminOverview({
  stats,
}: {
  stats: {
    totalServices: number;
    totalStatistics: number;
    totalTestimonials: number;
    totalFaqs: number;
    totalSocialLinks: number;
    totalLeads: number;
  };
}) {
  return (
    <div className="space-y-6">
      <Card className="p-7">
        <p className="eyebrow mb-4">Dashboard</p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-semibold text-foreground md:text-4xl">
              Content operations at a glance
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Use the dashboard to keep the public brand polished, current, and easy
              to maintain without touching code.
            </p>
          </div>
          <Link
            href="/admin/content/hero"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-5 py-3 text-sm text-foreground transition hover:border-accent hover:text-accent"
          >
            Open content editor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        {foundations.map((item) => (
          <Card key={item.title} className="p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Services", value: stats.totalServices },
          { label: "Statistics", value: stats.totalStatistics },
          { label: "Testimonials", value: stats.totalTestimonials },
          { label: "FAQs", value: stats.totalFaqs },
          { label: "Social links", value: stats.totalSocialLinks },
          { label: "Leads", value: stats.totalLeads },
        ].map((item) => (
          <Card key={item.label} className="p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-accent">{item.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-7">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-accent">Quick links</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            { href: "/admin/content/hero", label: "Hero" },
            { href: "/admin/content/services", label: "Services" },
            { href: "/admin/content/about", label: "About" },
            { href: "/admin/content/contact", label: "Contact" },
            { href: "/admin/content/testimonials", label: "Testimonials" },
            { href: "/admin/seo", label: "SEO" },
            { href: "/admin/settings", label: "Brand settings" },
            { href: "/admin/media", label: "Media" },
            { href: "/admin/content/social-links", label: "Social links" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-foreground transition hover:border-accent hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm leading-7 text-muted-foreground">
          Keep the site current by editing the public-facing sections directly from
          the dashboard. No page builder, no clutter, just structured content.
        </p>
      </Card>
    </div>
  );
}
