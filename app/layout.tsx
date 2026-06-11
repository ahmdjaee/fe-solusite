import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { defaultLanguage, isLanguage, type Language } from "./lang/config";
import { absoluteUrl, siteDescription, siteKeywords, siteName, siteTitle } from "./lib/seo";

const themeScript = `
(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const theme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

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

  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>
        <Providers initialLanguage={initialLanguage}>{children}</Providers>
      </body>
    </html>
  );
}
