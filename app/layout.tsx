import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { getTranslations } from "./i18n";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlashAI",
  description: "Level up your learning",
  icons: {
    icon: "/logo-white.svg",
    shortcut: "/logo-white.svg",
    apple: "/logo-white.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the locale from headers on the server-side
  // Get locale from cookies or default to 'en'
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  // Load messages for the current locale
  const messages = await getTranslations(locale);

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Toaster />
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
