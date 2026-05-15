import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-[1.35rem] border border-border bg-white/[0.03] px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
