import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedPackages from "@/components/FeaturedPackages";
import TourTypes from "@/components/TourTypes";
import {
  useStructuredData,
  generateLocalBusinessSchema,
  generateTourOperatorSchema,
  generateWebsiteSchema,
} from "@/hooks/useStructuredData";

// Lazy load below-the-fold components
const DesertOffers = lazy(() => import("@/components/DesertOffers"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
          <Testimonials />
          <Contact />
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Index;
