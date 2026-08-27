"use client";

import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils/cn";

type PendingLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "onClick"
> & {
  href: string;
  onClick?: ComponentProps<typeof Link>["onClick"];
};

export function PendingLink({
  href,
  className,
  children,
  onClick,
  ...props
}: PendingLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Link
      {...props}
      href={href}
      aria-busy={isPending || undefined}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          href.includes("#")
        ) {
          return;
        }

        event.preventDefault();
        startTransition(() => router.push(href));
      }}
      className={cn(className, isPending && "pointer-events-none opacity-70")}
    >
      {children}
      {isPending ? (
        <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
      ) : null}
    </Link>
  );
}
