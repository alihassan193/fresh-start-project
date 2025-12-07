import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedPackages from "@/components/FeaturedPackages";
import TourTypes from "@/components/TourTypes";

// Lazy load below-the-fold components
const DesertOffers = lazy(() => import("@/components/DesertOffers"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedPackages />
      <TourTypes />
      <Suspense fallback={<div className="h-20" />}>
        <DesertOffers />
        <Testimonials />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
