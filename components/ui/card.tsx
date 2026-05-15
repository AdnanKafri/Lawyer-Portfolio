import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface-panel panel-outline rounded-[30px] border border-border bg-surface/78 p-6 backdrop-blur-xl",
        interactive && "interactive-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
