import Image from "next/image";
import { SearchForm } from "@/components/search/SearchForm";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n-config";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero & Search Background Wrapper */}
      <div className="relative w-full">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
          <Image
            src="/background.webp"
            alt="Sky and clouds background"
            fill
            priority
            quality={100}
            className="object-cover object-center transition-opacity duration-1000"
            sizes="100vw"
          />
          {/* Subtle gradient overlay to blend with the page flow and ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-[hsl(var(--background))]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-16 pb-24 md:pt-32 md:pb-48 px-4">
          <div className="container mx-auto relative z-10 flex flex-col items-center">
            <div className="max-w-4xl text-center w-full">
              <h1 className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight">
                <span className="bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  {dictionary.home.hero.title}
                </span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  {dictionary.home.hero.subtitle}
                </span>
              </h1>
              <p className="mx-auto mb-10 md:mb-12 max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                {dictionary.home.hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="px-4 relative z-20 -mt-20 sm:-mt-24 md:-mt-48 mb-20 md:mb-32 flex justify-center">
          <SearchForm dictionary={dictionary.search} common={dictionary.common} />
        </section>
      </div>

      {/* Featured Destinations / Benefits */}
      <section className="container mx-auto px-4 mb-24 md:mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="group space-y-5 p-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="glass-card flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{dictionary.home.features.security.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                {dictionary.home.features.security.description}
              </p>
            </div>
          </div>
          <div className="group space-y-5 p-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="glass-card flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{dictionary.home.features.pricing.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                {dictionary.home.features.pricing.description}
              </p>
            </div>
          </div>
          <div className="group space-y-5 p-2 flex flex-col items-center md:items-start text-center md:text-left sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none">
            <div className="glass-card flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{dictionary.home.features.support.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                {dictionary.home.features.support.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
