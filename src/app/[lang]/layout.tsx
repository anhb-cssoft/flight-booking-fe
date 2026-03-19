import type { Metadata, ResolvingMetadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import QueryProvider from "@/components/providers/QueryProvider";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/i18n/get-dictionary";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://flight-booking-fe-pied.vercel.app";

  return {
    title: {
      template: `%s | SkyBooker`,
      default: dictionary.seo.title,
    },
    description: dictionary.seo.description,
    keywords: dictionary.seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        "en-US": `${baseUrl}/en`,
        "vi-VN": `${baseUrl}/vi`,
      },
    },
    openGraph: {
      title: dictionary.seo.title,
      description: dictionary.seo.description,
      url: `${baseUrl}/${lang}`,
      siteName: "SkyBooker",
      locale: lang === "vi" ? "vi_VN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.seo.title,
      description: dictionary.seo.description,
      creator: "@skybooker",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

import { SuggestionProvider } from "@/components/providers/SuggestionProvider";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };

  return (
    <html lang={lang}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <QueryProvider>
          <SuggestionProvider>
            <Navbar lang={lang} />
            <main className="flex-1">{children}</main>
            <Footer lang={lang} />
          </SuggestionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
