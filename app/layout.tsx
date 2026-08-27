import type { Metadata } from "next";
import { headers } from "next/headers";
import { IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { BRAND_NAME } from "@/lib/constants/brand";
import { createDefaultMetadata } from "@/lib/seo/metadata";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = createDefaultMetadata({
  title: BRAND_NAME,
  description:
    "Premium bilingual legal services platform for a modern personal legal brand.",
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") === "ar" ? "ar" : "en";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${manrope.variable} ${ibmPlexSansArabic.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
