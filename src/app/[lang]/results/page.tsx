import { Suspense } from "react";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n-config";
import { ResultsList } from "@/components/results/ResultsList";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  if (!dictionary || !dictionary.search) {
    return <div className="p-8 text-center">Error loading translations.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Suspense fallback={<div className="p-8 text-center">Loading search results...</div>}>
        <ResultsList 
          dictionary={dictionary.search} 
          common={dictionary.common} 
        />
      </Suspense>
    </div>
  );
}
