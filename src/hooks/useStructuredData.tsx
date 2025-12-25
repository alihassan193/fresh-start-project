import { useEffect } from "react";

interface StructuredDataProps {
  data: object;
  id?: string;
}

export const useStructuredData = ({ data, id = "structured-data" }: StructuredDataProps) => {
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
  const imgUrl = "https://backend.desert-safaridubai.ae";
  
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
        image: item.packagefeatureimage ? `${imgUrl}${item.packagefeatureimage}` : `${baseUrl}/og-image.png`,
        url: `${baseUrl}/tours/${item.slug}`,
        sku: item.id || item.slug,
        brand: {
          "@type": "Brand",
          name: "Desert Safari Dubai",
        },
        offers: {
          "@type": "Offer",
          price: String(item.packageprice),
          priceCurrency: "AED",
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/tours/${item.slug}`,
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "245",
          bestRating: "5",
        },
      },
    })),
  };
};

export const generateProductSchema = (pkg: any, baseUrl: string) => {
  const imgUrl = "https://backend.desert-safaridubai.ae";
  const images = [pkg.packagemainimage, pkg.packagesideimage1, pkg.packagesideimage2]
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
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
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

export const generateImageCarouselSchema = (images: string[], pkg: any, baseUrl: string) => {
  const imgUrl = "https://backend.desert-safaridubai.ae";

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

// Generic breadcrumb for any page
export const generatePageBreadcrumbSchema = (
  breadcrumbs: { name: string; url: string }[],
  baseUrl: string
) => {
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
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        item: {
          "@id": crumb.url,
          name: crumb.name,
        },
      })),
    ],
  };
};

// Aggregate Review schema for TripAdvisor reviews
export interface ReviewData {
  author_name: string;
  rating: number;
  review_title: string;
  review_content: string;
  review_date: string;
}

export const generateAggregateReviewSchema = (
  reviews: ReviewData[],
  baseUrl: string,
  totalReviewCount: number = 2847
) => {
  const averageRating =
    reviews.length > 0
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        )
      : 4.9;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#reviews`,
    name: "Desert Safari Dubai",
    url: baseUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(averageRating),
      reviewCount: String(totalReviewCount),
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author_name,
      },
      datePublished: review.review_date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(review.rating),
        bestRating: "5",
        worstRating: "1",
      },
      name: review.review_title,
      reviewBody: review.review_content,
    })),
  };
};

export const generateLocalBusinessSchema = (baseUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: "Desert Safari Dubai",
    alternateName: "Desert Safari Dubai Tours",
    description:
      "Premier desert safari dubai tour operator in Dubai offering authentic Arabian desert experiences including dune bashing, camel rides, BBQ dinners, and cultural shows.",
    url: baseUrl,
    logo: `${baseUrl}/og-image.png`,
    image: `${baseUrl}/og-image.png`,
    telephone: "+971501748638",
    email: "info@desert-safaridubai.ae",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dubai Marina, Sheikh Zayed Road",
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.2048",
      longitude: "55.2708",
    },
    areaServed: {
      "@type": "City",
      name: "Dubai",
    },
    priceRange: "$$",
    currenciesAccepted: "AED, USD",
    paymentAccepted: "Cash, Credit Card",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [
      "https://www.facebook.com/luxuarydesertsafaridubai",
      "https://www.instagram.com/crown_arabiatourism/",
      "https://www.youtube.com/@DesertSafariAE",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "2450",
      bestRating: "5",
      worstRating: "1",
    },
  };
};

export const generateTourOperatorSchema = (baseUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": `${baseUrl}/#touroperator`,
    name: "Desert Safari Dubai",
    description:
      "Experience the magic of the Arabian desert with Dubai's premier desert safari tour operator. We offer unforgettable adventures including thrilling dune bashing, peaceful camel rides, mesmerizing sunset views, traditional BBQ dinners, and authentic cultural entertainment.",
    url: baseUrl,
    image: `${baseUrl}/og-image.png`,
    touristType: ["Adventure seekers", "Families", "Couples", "Groups"],
    isAccessibleForFree: false,
    publicAccess: true,
    availableLanguage: ["English", "Arabic", "Hindi", "Urdu", "Russian", "Chinese"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Hotel Pickup", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air-conditioned Vehicles", value: true },
      { "@type": "LocationFeatureSpecification", name: "Professional Guides", value: true },
      { "@type": "LocationFeatureSpecification", name: "BBQ Dinner Included", value: true },
    ],
    additionalType: "https://schema.org/TravelAgency",
    provider: {
      "@type": "Organization",
      name: "Desert Safari Dubai",
      url: baseUrl,
      logo: `${baseUrl}/og-image.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+971501748638",
        contactType: "customer service",
        availableLanguage: ["English", "Arabic"],
        areaServed: "AE",
      },
    },
  };
};

export const generateWebsiteSchema = (baseUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Desert Safari Dubai",
    url: baseUrl,
    description:
      "Book your desert safari adventure in Dubai. Experience dune bashing, camel rides, BBQ dinner, and traditional entertainment.",
    publisher: {
      "@type": "Organization",
      name: "Desert Safari Dubai",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/tours?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
};

// Article schema for blog posts
export interface BlogArticleData {
  title: string;
  description?: string;
  content?: string;
  slug: string;
  featuredImage?: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
}

export const generateArticleSchema = (blog: BlogArticleData, baseUrl: string) => {
  const imgUrl = "https://backend.desert-safaridubai.ae";
  const articleUrl = `${baseUrl}/blogs/${blog.slug}`;
  const imageUrl = blog.featuredImage 
    ? `${imgUrl}${blog.featuredImage}` 
    : `${baseUrl}/og-image.png`;

  // Strip HTML tags for description
  const plainDescription = blog.description || 
    (blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : '');

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: blog.title,
    description: plainDescription,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Organization",
      name: "Desert Safari Dubai",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.png`,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Desert Safari Dubai",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.png`,
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: blog.category || "Travel",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords: "desert safari dubai, dubai tours, desert adventure, dune bashing, camel ride",
  };
};
