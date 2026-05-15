import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionShell({
  children,
  className,
  id,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  innerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn("section-anchor px-[var(--section-space-x)] py-[var(--section-space-y)]", className)}
    >
      <div className={cn("mx-auto w-full max-w-[var(--container)]", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
