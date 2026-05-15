export const locales = ["en", "ar"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: string) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function swapLocale(locale: string): Locale {
  return locale === "ar" ? "en" : "ar";
}
