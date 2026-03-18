import Link from "next/link";
import { Plane } from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n-config";

export async function Navbar({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  return (
    <header className="glass-nav border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary">
          <Plane className="h-8 w-8 rotate-45" />
          <span>SkyBooker</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href={`/${lang}`} className="transition-colors hover:text-primary">
            {dictionary.common.search}
          </Link>
          <Link href={`/${lang}/my-bookings`} className="transition-colors hover:text-primary">
            {dictionary.common.myBookings}
          </Link>
          <div className="flex items-center gap-2 ml-4 border-l pl-4">
            <Link 
              href="/en" 
              className={`transition-colors hover:text-primary ${lang === 'en' ? 'text-primary font-bold' : ''}`}
            >
              EN
            </Link>
            <span className="text-slate-300">|</span>
            <Link 
              href="/vi" 
              className={`transition-colors hover:text-primary ${lang === 'vi' ? 'text-primary font-bold' : ''}`}
            >
              VI
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
