import { getRequestConfig } from 'next-intl/server';
import type { RequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is a string (fallback to 'en' if undefined)
  const safeLocale = locale || 'en';
  
  // Import the messages for the requested locale
  const messages = (await import(`./messages/${safeLocale}.json`)).default;
  
  return {
    locale: safeLocale,
    messages
  } as RequestConfig;
});