import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent px-5 py-3 text-accent-foreground shadow-[0_16px_36px_rgba(193,161,103,0.22)] hover:-translate-y-0.5 hover:bg-accent-strong",
        secondary:
          "border border-border bg-white/[0.02] px-5 py-3 text-foreground hover:-translate-y-0.5 hover:border-border-strong hover:bg-white/[0.04] hover:text-accent",
        ghost:
          "px-3 py-2 text-muted-foreground hover:bg-white/[0.03] hover:text-foreground",
        subtle:
          "border border-white/8 bg-white/[0.04] px-4 py-3 text-foreground hover:-translate-y-0.5 hover:border-border-strong hover:bg-white/[0.06]",
      },
      size: {
        default: "",
        lg: "px-6 py-3.5 text-[0.96rem]",
        sm: "px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.24em]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);

Button.displayName = "Button";
