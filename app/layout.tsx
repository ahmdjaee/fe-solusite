import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { defaultLanguage, isLanguage, type Language } from "./lang/config";
import { absoluteUrl, siteDescription, siteKeywords, siteName, siteTitle } from "./lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  applicationName: siteName,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteName, url: absoluteUrl() }],
  creator: siteName,
  publisher: siteName,
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
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteName} - solusi website dan aplikasi web`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
};

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

  return (
    <html
      lang={initialLanguage}
      className={initialTheme === "dark" ? "dark" : undefined}
      style={{ colorScheme: initialTheme }}
      suppressHydrationWarning
    >
      <body>
        <Providers initialLanguage={initialLanguage} initialTheme={initialTheme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
