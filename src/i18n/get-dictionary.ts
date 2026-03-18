import type en from './dictionaries/en.json'

type DictionaryLoader = () => Promise<typeof en>

const dictionaries: Record<string, DictionaryLoader> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  vi: () => import('./dictionaries/vi.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'vi') => {
  const loader = dictionaries[locale]
  if (typeof loader !== 'function') {
    return dictionaries.en()
  }
  return loader()
}
