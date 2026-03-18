import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function Footer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h4 className="text-lg font-bold">SkyBooker</h4>
            <p className="text-sm text-muted-foreground">
              {dictionary.home.hero.description}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@skybooker.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SkyBooker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
