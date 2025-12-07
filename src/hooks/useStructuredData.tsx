import { useEffect } from "react";

interface StructuredDataProps {
  data: object;
  id?: string;
}

export const useStructuredData = ({
  data,
  id = "structured-data",
}: StructuredDataProps) => {
  useEffect(() => {
    const scriptId = id;
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (script) {
      script.innerHTML = JSON.stringify(data);
    } else {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(data);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [data, id]);
};

export const generateItemListSchema = (items: any[], baseUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.packagename,
        description: item.packagedescription,
        image: `${baseUrl}/${item.packagemainimage}`,
        url: `${baseUrl}/tours/${item.slug}`,
        offers: {
          "@type": "Offer",
          price: item.packageprice,
          priceCurrency: "AED",
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/tours/${item.slug}`,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "245",
        },
      },
    })),
  };
};

export const generateProductSchema = (pkg: any, baseUrl: string) => {
  const imgUrl = "https://backend.desertsafaridubai.ae";
  const images = [
    pkg.packagemainimage,
    pkg.packagesideimage1,
    pkg.packagesideimage2,
  ]
    .filter(Boolean)
    .map((img) => `${imgUrl}${img}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.packagename,
    description: pkg.packagedescription,
    image: images,
    sku: pkg.id || pkg.packageid || pkg.slug, // recommended
    brand: {
      "@type": "Brand",
      name: "Desert Safari Dubai",
    },
    offers: {
      "@type": "Offer",
      price: String(pkg.packageprice),
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/tours/${pkg.slug}`,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "245",
      bestRating: "5",
    },
  };
};

export const generateFAQSchema = (faqs: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateImageCarouselSchema = (
  images: string[],
  pkg: any,
  baseUrl: string
) => {
  const imgUrl = "https://backend.desertsafaridubai.ae";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: images.map((img, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ImageObject",
        contentUrl: `${imgUrl}/${img}`,
        description: `${pkg.packagename} - Desert Safari Dubai`,
      },
    })),
  };
};

export const generateBreadcrumbSchema = (pkg: any, baseUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": baseUrl,
          name: "Home",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": `${baseUrl}/tours`,
          name: "Tours",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@id": `${baseUrl}/tours/${pkg.slug}`,
          name: pkg.packagename,
        },
      },
    ],
  };
};
