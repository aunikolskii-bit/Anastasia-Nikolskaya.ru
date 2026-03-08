import { ui, type UIKey } from './ui';
import { getAlternateSlug } from './routes';

export type Lang = 'ru' | 'en';

/** Extract language from URL path */
export function getLang(url: URL): Lang {
  const firstSegment = url.pathname.split('/').filter(Boolean)[0];
  if (firstSegment === 'en') return 'en';
  return 'ru';
}

/** Get a translated UI string */
export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key];
}

/** Get the slug portion of a page path (after /ru/ or /en/) */
function getSlugFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  // Remove the language prefix
  segments.shift();
  return segments.join('/');
}

/** Build the alternate-language URL for the current page */
export function getAlternateLangUrl(url: URL, currentLang: Lang): string {
  const targetLang = currentLang === 'ru' ? 'en' : 'ru';
  const slug = getSlugFromPath(url.pathname);

  // Handle blog post pages separately (blog/slug)
  if (slug.startsWith('blog/') && slug !== 'blog') {
    // Blog posts handle their own counterpart logic via frontmatter
    return `/${targetLang}/blog/`;
  }

  const alternateSlug = getAlternateSlug(slug, currentLang);
  return `/${targetLang}/${alternateSlug ? alternateSlug + '/' : ''}`;
}

/** Navigation items for the given language */
export function getNavItems(lang: Lang) {
  const prefix = `/${lang}`;
  const slugs = lang === 'ru'
    ? {
        pregnancy: 'beremennost',
        postpartum: 'posle-rodov',
        pricing: 'formaty-i-ceny',
        about: 'o-trenere',
        safety: 'bezopasnost-i-podhod',
        reviews: 'otzyvy',
        faq: 'faq',
        blog: 'blog',
        contact: 'kontakty',
      }
    : {
        pregnancy: 'during-pregnancy',
        postpartum: 'after-childbirth',
        pricing: 'formats-pricing',
        about: 'about',
        safety: 'safety-approach',
        reviews: 'reviews',
        faq: 'faq',
        blog: 'blog',
        contact: 'contact',
      };

  return [
    { label: t(lang, 'nav.pregnancy'), href: `${prefix}/${slugs.pregnancy}/` },
    { label: t(lang, 'nav.postpartum'), href: `${prefix}/${slugs.postpartum}/` },
    { label: t(lang, 'nav.pricing'), href: `${prefix}/${slugs.pricing}/` },
    { label: t(lang, 'nav.about'), href: `${prefix}/${slugs.about}/` },
    { label: t(lang, 'nav.safety'), href: `${prefix}/${slugs.safety}/` },
    { label: t(lang, 'nav.reviews'), href: `${prefix}/${slugs.reviews}/` },
    { label: t(lang, 'nav.faq'), href: `${prefix}/${slugs.faq}/` },
    { label: t(lang, 'nav.blog'), href: `${prefix}/${slugs.blog}/` },
    { label: t(lang, 'nav.contact'), href: `${prefix}/${slugs.contact}/` },
  ];
}

/** YCLIENTS booking URL */
export const YCLIENTS_URL = 'https://yclients.com/timetable/1767873/';

/** Phone number */
export const PHONE = '+7 927 01 01 378';
export const PHONE_TEL = 'tel:+79270101378';

/** Site URL */
export const SITE_URL = 'https://anastasia-nikolskaya.ru';
