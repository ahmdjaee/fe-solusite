import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "./providers";
import { fetchServerSettings } from "./lib/server-data";
import { defaultLanguage, isLanguage, type Language } from "./lang/config";
import { absoluteUrl, siteDescription, siteKeywords, siteTitle } from "./lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchServerSettings();
  const title = settings.metaTitle || siteTitle;
  const description = settings.metaDescription || siteDescription;
  const keywords = settings.metaKeywords
    ? settings.metaKeywords.split(",").map((keyword) => keyword.trim()).filter(Boolean)
    : siteKeywords;
  const ogImage = settings.ogImageUrl ?? "/opengraph-image";

  return {
    metadataBase: new URL(absoluteUrl()),
    applicationName: settings.siteName,
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    keywords,
    authors: [{ name: settings.siteName, url: absoluteUrl() }],
    creator: settings.siteName,
    publisher: settings.siteName,
    category: "technology",
    alternates: {
      canonical: "/",
      languages: {
        "id-ID": "/",
        "en-US": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      alternateLocale: "en_US",
      url: "/",
      siteName: settings.siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    manifest: "/manifest.webmanifest",
  };
}

function getInitialLanguage(value: string | undefined): Language {
  return isLanguage(value) ? value : defaultLanguage;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLanguage = getInitialLanguage(cookieStore.get("language")?.value);
  const initialTheme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";
  const settings = await fetchServerSettings();

  return (
    <html
      lang={initialLanguage}
      className={initialTheme === "dark" ? "dark" : undefined}
      style={{ colorScheme: initialTheme }}
      suppressHydrationWarning
    >
      <body>
        <Providers
          initialLanguage={initialLanguage}
          initialTheme={initialTheme}
          settings={settings}
        >
          {children}
        </Providers>
        {settings.googleAnalyticsId && (
          <GoogleAnalytics gaId={settings.googleAnalyticsId} />
        )}
      </body>
    </html>
  );
}
