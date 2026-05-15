import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/lib/i18n/config";
import { createMiddlewareSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/middleware";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!isSupabaseConfigured()) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient(request, response);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const isLoginPath = pathname === "/admin/login";

    if (!session && !isLoginPath) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (session && isLoginPath) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (session && !isLoginPath) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("auth_user_id", session.user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (!adminUser) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }

    return response;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!pathnameHasLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  const locale = pathname.split("/")[1];

  if (!hasLocale(locale)) {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
