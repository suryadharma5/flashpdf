import { createTranslator } from 'next-intl';

export const locales = ['en', 'id']; // Update with your supported locales
export const defaultLocale = 'en';

// This function can be used to get translations in server components
export async function getTranslations(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback to default locale if translation not found
    return (await import(`./messages/en.json`)).default;
  }
}

// Helper to create a translator with the right locale and messages
export async function getTranslator(locale: string) {
  const messages = await getTranslations(locale);
  return createTranslator({ locale, messages });
}