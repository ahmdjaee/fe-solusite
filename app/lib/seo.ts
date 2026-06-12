import type { LandingData } from "./server-data";
import type { Product } from "./data";
import { formatPrice, getProductPricing } from "./data";

export const siteName = "Solusite Studio";
export const siteTitle = "Solusite Studio | Jasa Website, Aplikasi Web, dan Produk Digital";
export const siteDescription =
  "Solusite Studio membantu bisnis membangun website profesional, aplikasi web kustom, kode sumber siap pakai, dan integrasi backend Laravel.";
export const siteKeywords = [
  "Solusite Studio",
  "jasa website",
  "jasa pembuatan website",
  "jasa aplikasi web",
  "produk digital",
  "source code Laravel",
  "landing page bisnis",
  "integrasi API Laravel",
  "web developer Indonesia",
];

export const businessEmail = "hello@solusite.studio";
export const businessPhone = "+6281234567890";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;

  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function getSeoImageUrl(image?: string) {
  if (!image) return absoluteUrl("/opengraph-image");
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return absoluteUrl(image);

  return absoluteUrl("/opengraph-image");
}

export function buildHomeJsonLd(data: LandingData) {
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const productItems = data.products.slice(0, 12).map((product, index) => {
    const pricing = getProductPricing(product, data.discounts);

    return {
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/detail/${product.id}`),
      item: {
        "@type": "Product",
        name: product.name,
        description: product.short || product.description,
        image: getSeoImageUrl(product.thumbnailUrl),
        brand: {
          "@id": organizationId,
        },
        offers: {
          "@type": "Offer",
          url: absoluteUrl(`/detail/${product.id}`),
          priceCurrency: "IDR",
          price: pricing.finalPrice,
          availability: "https://schema.org/InStock",
        },
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteUrl,
        email: businessEmail,
        telephone: businessPhone,
        description: siteDescription,
        logo: absoluteUrl("/favicon.ico"),
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: businessPhone,
          contactType: "sales",
          areaServed: "ID",
          availableLanguage: ["Indonesian", "English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        url: siteUrl,
        inLanguage: ["id-ID", "en-US"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "ProfessionalService",
        name: siteName,
        url: siteUrl,
        email: businessEmail,
        telephone: businessPhone,
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
        serviceType: data.services.map((service) => service.name),
        priceRange: data.plans.length
          ? `${formatPrice(Math.min(...data.plans.map((plan) => plan.price)))}+`
          : "Hubungi untuk estimasi",
      },
      {
        "@type": "ItemList",
        name: "Produk digital Solusite Studio",
        itemListElement: productItems,
      },
    ],
  };
}

export function buildProductJsonLd(product: Product) {
  const pricing = getProductPricing(product);
  const productUrl = absoluteUrl(`/detail/${product.id}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.description || product.short,
        image: getSeoImageUrl(product.thumbnailUrl),
        category: product.label,
        brand: {
          "@type": "Organization",
          name: siteName,
          url: getSiteUrl(),
        },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "IDR",
          price: pricing.finalPrice,
          availability:
            product.availability === "ready"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
          seller: {
            "@type": "Organization",
            name: siteName,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: getSiteUrl(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  };
}
