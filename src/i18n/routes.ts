/** RU slug → EN slug mapping for language switcher */
export const routeMap: Record<string, string> = {
  '': '',
  'beremennost': 'during-pregnancy',
  'posle-rodov': 'after-childbirth',
  'formaty-i-ceny': 'formats-pricing',
  'o-trenere': 'about',
  'bezopasnost-i-podhod': 'safety-approach',
  'otzyvy': 'reviews',
  'faq': 'faq',
  'blog': 'blog',
  'kontakty': 'contact',
  'privacy': 'privacy',
  'consent': 'consent',
};

/** EN slug → RU slug (reverse map) */
export const reverseRouteMap: Record<string, string> = Object.fromEntries(
  Object.entries(routeMap).map(([ru, en]) => [en, ru])
);

export function getAlternateSlug(slug: string, fromLang: 'ru' | 'en'): string {
  if (fromLang === 'ru') {
    return routeMap[slug] ?? slug;
  }
  return reverseRouteMap[slug] ?? slug;
}
