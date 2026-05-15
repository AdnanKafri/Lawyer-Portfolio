import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { adminNavigation } from "@/lib/constants/navigation";
import { requireAdminContext } from "@/lib/domain/admin";

type AdminSectionPageProps = {
  params: Promise<{ segments: string[] }>;
};

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  await requireAdminContext();
  const { segments } = await params;
  const href = `/admin/${segments.join("/")}`;
  const match = adminNavigation.find((item) => item.href === href);

  if (!match) {
    notFound();
  }

  return (
    <Card className="p-7">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">Section</p>
      <h1 className="mt-3 text-3xl font-semibold text-foreground">
        {match.label}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
        This content area is reserved for the selected dashboard section.
      </p>
    </Card>
  );
}
