import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export type AdminContext = {
  authUserId: string;
  email: string;
  adminUser: Database["public"]["Tables"]["admin_users"]["Row"];
};

export const getAdminContext = cache(async (): Promise<AdminContext | null> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !adminUser) {
    return null;
  }

  return {
    authUserId: user.id,
    email: user.email ?? adminUser.email,
    adminUser,
  };
});

export async function requireAdminContext() {
  const adminContext = await getAdminContext();

  if (!adminContext) {
    redirect("/admin/login");
  }

  return adminContext;
}
