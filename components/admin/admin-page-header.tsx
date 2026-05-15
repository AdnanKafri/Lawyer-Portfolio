import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <Card className="p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </Card>
  );
}
