import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BookNowFloat from "@/components/BookNowFloat";
import FeaturedPackages from "@/components/FeaturedPackages";
import TourTypes from "@/components/TourTypes";
import {
  useStructuredData,
  generateLocalBusinessSchema,
  generateTourOperatorSchema,
  generateWebsiteSchema,
  generatePageBreadcrumbSchema,
} from "@/hooks/useStructuredData";

// Lazy load below-the-fold components
const DesertOffers = lazy(() => import("@/components/DesertOffers"));
const TripAdvisorReviews = lazy(() => import("@/components/TripAdvisorReviews"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const HomeFAQs = lazy(() => import("@/components/HomeFAQs"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

const BASE_URL = "https://desert-safaridubai.ae";

const Index = () => {
  // Add structured data for SEO
  useStructuredData({
    data: generateLocalBusinessSchema(BASE_URL),
    id: "local-business-schema",
  });

  useStructuredData({
    data: generateTourOperatorSchema(BASE_URL),
    id: "tour-operator-schema",
  });

  useStructuredData({
    data: generateWebsiteSchema(BASE_URL),
    id: "website-schema",
  });

  // Homepage breadcrumb (just home)
  useStructuredData({
    data: generatePageBreadcrumbSchema([], BASE_URL),
    id: "breadcrumb-schema",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BookNowFloat />
      <div id="main-content">
        <Hero />
        <FeaturedPackages />
        <TourTypes />
        <Suspense
          fallback={
            <div className="h-20 flex items-center justify-center" role="status" aria-live="polite">
              <span className="sr-only">Loading additional content</span>
            </div>
          }
        >
          <DesertOffers />
          <TripAdvisorReviews />
          <Testimonials />
          <HomeFAQs />
          <Contact />
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Index;
