import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, Locale } from '@/routing';
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";

const geistSans = localFont({
  src: "../../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "../../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Hand Talk",
  description: "Radiography communication bridge for deaf patients.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hand Talk",
  },
};

export const viewport: Viewport = {
  themeColor: "#004d40",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full overflow-x-hidden`}
      >
        <a href="#main-content" className="skip-nav">
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div id="main-content">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
