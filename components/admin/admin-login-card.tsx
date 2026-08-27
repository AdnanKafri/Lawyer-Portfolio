"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { loginAdminAction } from "@/lib/actions/admin-auth";
import { defaultFormActionState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginCard() {
  const [state, formAction, isPending] = useActionState(
    loginAdminAction,
    defaultFormActionState,
  );

  useEffect(() => {
    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form className="space-y-4" action={formAction}>
      <label htmlFor="admin-login-email" className="sr-only">
        Email address
      </label>
      <Input
        id="admin-login-email"
        type="email"
        name="email"
        placeholder="Email address"
        required
      />
      <label htmlFor="admin-login-password" className="sr-only">
        Password
      </label>
      <Input
        id="admin-login-password"
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <Button className="w-full" size="lg" type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-sm leading-7 text-muted-foreground">
        Use a Supabase Auth account that also has an active `admin_users`
        record.
      </p>
    </form>
  );
}
