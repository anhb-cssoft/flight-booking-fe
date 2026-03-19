import { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://flight-booking-fe-pied.vercel.app";

  const routes = ["", "/results", "/my-bookings"];

  const sitemaps = i18n.locales.flatMap((locale) => {
    return routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    }));
  });

  return sitemaps;
}
