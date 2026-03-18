import { SearchForm } from "@/components/search/SearchForm";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="container mx-auto relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
                The world is yours
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                to explore.
              </span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-600 md:text-xl lg:text-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Seamlessly book flights to any corner of the globe with SkyBooker&apos;s refined travel experience.
            </p>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 opacity-20 blur-[120px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-blue-300 to-transparent" />
      </section>

      {/* Search Section */}
      <section className="container mx-auto relative z-20 -mt-32 md:-mt-48 mb-24">
        <SearchForm />
      </section>

      {/* Featured Destinations / Benefits */}
      <section className="container mx-auto mb-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="group space-y-4">
            <div className="glass-card flex h-16 w-16 items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <h3 className="text-xl font-bold">Trusted Security</h3>
            <p className="text-slate-500 leading-relaxed">
              We employ military-grade encryption to ensure your booking data and personal information remain private.
            </p>
          </div>
          <div className="group space-y-4">
            <div className="glass-card flex h-16 w-16 items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <h3 className="text-xl font-bold">Smart Pricing</h3>
            <p className="text-slate-500 leading-relaxed">
              Our algorithms analyze thousands of routes to find you the most efficient and cost-effective travel options.
            </p>
          </div>
          <div className="group space-y-4">
            <div className="glass-card flex h-16 w-16 items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3 className="text-xl font-bold">Global Support</h3>
            <p className="text-slate-500 leading-relaxed">
              Travel with peace of mind knowing our support team is available 24/7 across every time zone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
