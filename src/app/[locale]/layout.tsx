import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SessionProvider } from '@/components/providers/SessionProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenFolio - Twoje Portfolio",
  description: "Nowoczesne portfolio do prezentacji Twoich projektów i umiejętności",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Walidacja locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Pobierz tłumaczenia
  const messages = await getMessages();

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SessionProvider>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </SessionProvider>
    </div>
  );
}

