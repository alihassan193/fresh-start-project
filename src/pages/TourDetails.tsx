import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import MobileMenu from "@/components/MobileMenu";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Star,
  BellRing,
  Megaphone,
  MapPin,
  Check,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Menu,
} from "lucide-react";
import {
  packageApi,
  Package,
  ApiResponse,
  PackageDeal,
  packageDealsApi,
  IMAGE_BASE_URL,
  PageContent,
  pageContentApi,
} from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useStructuredData,
  generateProductSchema,
  generateFAQSchema,
  generateImageCarouselSchema,
  generateBreadcrumbSchema,
} from "@/hooks/useStructuredData";

const TourDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const isMobile = useIsMobile();
  const [package_, setPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [deals, setDeals] = useState<PackageDeal[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<PageContent[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPackage();
    }
  }, [slug]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Package> = await packageApi.getBySlug(slug!);

      if (response.success && response.data) {
        setPackage(response.data);
        // Fetch deals for this package
        fetchDeals(response.data.id);
        // Fetch page content for this package
        fetchPageContent(response.data.id);
      } else {
        setError("Package not found");
      }
    } catch (error) {
      console.error("Error fetching package:", error);
      setError("Failed to load package details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async (packageId: number) => {
    try {
      const response = await packageDealsApi.getByPackageId(packageId);
      if (response.success) {
        setDeals(response.data);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  const fetchPageContent = async (packageId: number) => {
    try {
      const response = await pageContentApi.getByPackageId(packageId);
      if (response.success) {
        setPageContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching page content:", error);
    }
  };

  // Add structured data for product, carousel, and FAQs
  const baseUrl = window.location.origin;

  const productSchema = package_
    ? generateProductSchema(package_, baseUrl)
    : null;

  const images = package_
    ? [
        package_.packagemainimage,
        package_.packagesideimage1,
        package_.packagesideimage2,
      ].filter(Boolean)
    : [];

  const imageCarouselSchema =
    images.length > 0 && package_
      ? generateImageCarouselSchema(images, package_, baseUrl)
      : null;

  const faqSchema =
    package_?.faqs?.length > 0 ? generateFAQSchema(package_.faqs) : null;

  const breadcrumbSchema = package_
    ? generateBreadcrumbSchema(package_, baseUrl)
    : null;

  // ✅ Hooks must be called unconditionally
  useStructuredData({
    data: productSchema,
    id: "tour-product-schema",
  });

  useStructuredData({
    data: imageCarouselSchema,
    id: "tour-carousel-schema",
  });

  useStructuredData({
    data: faqSchema,
    id: "tour-faq-schema",
  });

  useStructuredData({
    data: breadcrumbSchema,
    id: "tour-breadcrumb-schema",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-96 rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!package_ || error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-desert-night mb-4">
              {error || "Tour Not Found"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error === "Package not found"
                ? "The tour you're looking for doesn't exist or may have been moved."
                : "There was an error loading the tour details. Please try again later."}
            </p>
            <Button variant="desert" asChild>
              <Link to="/tours">Browse All Tours</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className=" bg-background">
      {isMobile ? (
        // Mobile App-style Header (transparent, floating buttons)
        <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-white/90"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-white/90"
            asChild
          >
            <Link to="/">
              <Menu className="h-5 w-5 text-foreground" />
            </Link>
          </Button> */}
          <MobileMenu />
        </div>
      ) : (
        <Header />
      )}

      {/* Hero Banner - Grid on Desktop, Slider on Mobile */}
      <section className={isMobile ? "pt-0 pb-0" : "pt-20 pb-0"}>
        {isMobile ? (
          // Mobile View - Full Screen Carousel Slider (no padding, background)
          <Carousel
            className="w-full"
            opts={{
              loop: true,
              align: "start",
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent className="-ml-0 h-full">
              {[
                package_.packagemainimage,
                package_.packagesideimage1,
                package_.packagesideimage2,
                package_.packagesideimage3,
                package_.packagesideimage4,
              ]
                .filter(Boolean)
                .map((image, index) => (
                  <CarouselItem key={index} className="pl-0 h-full">
                    <div className="relative w-full h-full">
                      <img
                        src={`${IMAGE_BASE_URL}${image}`}
                        alt={`${package_.packagename} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
          </Carousel>
        ) : (
          // Desktop View - Grid Layout
          <div className="relative container pt-10 mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Main Large Image - Left */}
              <div className="relative rounded-lg overflow-hidden max-h-[500px] h-full">
                <img
                  src={`${IMAGE_BASE_URL}${package_.packagemainimage}`}
                  alt={`${package_.packagename} - Main`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Grid of 4 smaller images - Right */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  package_.packagesideimage1,
                  package_.packagesideimage2,
                  package_.packagesideimage3,
                  package_.packagesideimage4,
                ]
                  .filter(Boolean)
                  .map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden max-h-[246px]"
                    >
                      <img
                        src={`${IMAGE_BASE_URL}${image}`}
                        alt={`${package_.packagename} - ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* View All Images Button */}
            <button
              onClick={() => setShowGallery(true)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-foreground px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md transition-colors"
            >
              <Images className="w-4 h-4" />
              View all images
            </button>
          </div>
        )}
      </section>

      {/* Image Gallery Dialog - Desktop Only */}
      {!isMobile && (
        <Dialog open={showGallery} onOpenChange={setShowGallery}>
          <DialogContent className="max-w-6xl h-[90vh] p-0 bg-black/95">
            <DialogClose className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
              <X className="w-5 h-5 text-white" />
            </DialogClose>

            <div className="flex h-full gap-4 p-6">
              {/* Main Image - Left */}
              <div className="flex-1 relative flex items-center justify-center">
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev > 0
                        ? prev - 1
                        : package_?.packagesideimage1 &&
                          package_?.packagesideimage2
                        ? 2
                        : 0
                    )
                  }
                  className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <img
                  src={`${IMAGE_BASE_URL}${
                    [
                      package_?.packagemainimage,
                      package_?.packagesideimage1,
                      package_?.packagesideimage2,
                      package_?.packagesideimage3,
                      package_?.packagesideimage4,
                    ].filter(Boolean)[currentImageIndex]
                  }`}
                  alt={`${package_?.packagename} - ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />

                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev < 2 ? prev + 1 : 0))
                  }
                  className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} /{" "}
                  {
                    [
                      package_?.packagemainimage,
                      package_?.packagesideimage1,
                      package_?.packagesideimage2,
                      package_?.packagesideimage3,
                      package_?.packagesideimage4,
                    ].filter(Boolean).length
                  }
                </div>
              </div>

              {/* Thumbnail Grid - Right */}
              <div className="w-64 overflow-y-auto space-y-2">
                {[
                  package_?.packagemainimage,
                  package_?.packagesideimage1,
                  package_?.packagesideimage2,
                  package_?.packagesideimage3,
                  package_?.packagesideimage4,
                ]
                  .filter(Boolean)
                  .map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-full aspect-video rounded-lg overflow-hidden border-2 transition-all",
                        currentImageIndex === index
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-transparent hover:border-white/30"
                      )}
                    >
                      <img
                        src={`${IMAGE_BASE_URL}${image}`}
                        alt={`${package_?.packagename} - Thumbnail ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Main Content Area */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Tour Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tour Title & Rating */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-desert-night mb-3">
                  {package_.packagename}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 bg-white border border-green-500 text-black px-2 py-0.5 rounded-full">
                    <BellRing className="w-5 h-5 text-green-400  " />
                    <span className="text-sm font-semibold text-orange-500">
                      {package_.headline}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Dubai Desert</span>
                  </div> */}
                </div>
              </div>

              {/* Activity Icons */}
              {package_.features && package_.features.length > 0 && (
                <div className=" ">
                  <h3 className="text-lg font-bold text-desert-night mb-4">
                    Activities
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {package_.features.slice(0, 8).map((feature) => (
                      <div
                        key={feature.id}
                        className="relative group flex flex-col items-center gap-1"
                      >
                        <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-md">
                          <img
                            src={`${IMAGE_BASE_URL}${feature.image}`}
                            alt={feature.name}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                        {/* <span className="text-xs text-center max-w-[70px] leading-tight">{feature.name}</span> */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {feature.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Package Included */}
              <div className="">
                <h3 className="text-lg font-bold text-desert-night mb-4 ">
                  {/* <Check className="w-5 h-5 text-green-600" /> */}
                  Package Included
                </h3>
                {package_.features && package_.features.length > 0 ? (
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {package_.features.map((feature) => (
                      <li
                        key={feature.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Hotel pickup and drop-off</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Professional guide</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>All activities mentioned</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Traditional BBQ dinner</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Tour Content Sections - Accordion */}
              {package_.content && package_.content.length > 0 && (
                <div className="">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-0"
                    className="w-full"
                  >
                    {package_.content.map((contentSection, index) => (
                      <AccordionItem
                        key={contentSection.id}
                        value={`item-${index}`}
                        className="border-b last:border-b-0"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base font-semibold text-primary text-left">
                              {contentSection.content_heading}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                          <div
                            className="prose max-w-none prose-headings:font-bold prose-headings:text-desert-night prose-h1:text-xl prose-h1:mb-4 prose-h2:text-lg prose-h2:mb-4 prose-h3:text-lg prose-h3:mb-4 prose-p:text-sm prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-2 prose-li:text-sm prose-li:text-foreground prose-ul:space-y-2 prose-ol:space-y-2 [&_ul]:list-none [&_ol]:list-none [&_ul]:ml-0 [&_ol]:ml-0 [&_ul]:pl-0 [&_ol]:pl-0 [&_ul>li]:flex [&_ul>li]:items-start [&_ul>li]:gap-2 [&_ul>li]:before:content-[''] [&_ul>li]:before:w-1.5 [&_ul>li]:before:h-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-green-500 [&_ul>li]:before:mt-1.5 [&_ul>li]:before:flex-shrink-0 prose-strong:font-semibold prose-strong:text-desert-night prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-sm"
                            dangerouslySetInnerHTML={{
                              __html: contentSection.content_description,
                            }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Highlights */}
              {/* <div className="p-6">
                <h3 className="text-lg font-bold text-desert-night mb-4">
                  Highlights
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Star className="w-4 h-4 text-desert-gold mt-0.5" />
                    <span>Experience thrilling dune bashing adventure</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Star className="w-4 h-4 text-desert-gold mt-0.5" />
                    <span>Watch stunning desert sunset views</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Star className="w-4 h-4 text-desert-gold mt-0.5" />
                    <span>Enjoy traditional entertainment and BBQ dinner</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Star className="w-4 h-4 text-desert-gold mt-0.5" />
                    <span>Camel riding and sandboarding included</span>
                  </li>
                </ul>
              </div> */}

              {/* FAQs */}
              {package_.faqs && package_.faqs.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-bold text-desert-night mb-4">
                    Frequently Asked Questions
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {package_.faqs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-sm font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className="text-sm text-muted-foreground prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card (Desktop Only) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Card className="border-2">
                  <CardContent className="p-6 space-y-6">
                    {/* Price Display */}
                    <div className="text-center border-b pb-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Starting from
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        AED {package_.packageprice}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per person
                      </div>
                    </div>

                    {/* Select Your Deal */}
                    {deals.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-desert-night mb-4">
                          Available Deals
                        </h3>
                        <div className="space-y-3">
                          {deals.map((deal) => (
                            <div
                              key={deal.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm mb-1">
                                    {deal.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {deal.tagline}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-primary">
                                    AED {deal.price}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Addons */}
                    {package_.addons && package_.addons.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-desert-night mb-4">
                          Available Add-ons
                        </h3>
                        <div className="space-y-3">
                          {package_.addons.map((addon) => (
                            <div
                              key={addon.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm">
                                    {addon.name}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-primary">
                                    AED {addon.price}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="desert"
                      className="w-full"
                      size="lg"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page Content Section - Full Width */}
      {pageContent && pageContent.length > 0 && (
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            {pageContent.map((content) => (
              <div
                key={content.id}
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-desert-night prose-h1:text-3xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mb-4 prose-h3:text-xl prose-h3:mb-3 prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4 prose-li:text-foreground prose-ul:space-y-2 prose-ol:space-y-2 prose-strong:font-semibold prose-strong:text-desert-night prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic"
                dangerouslySetInnerHTML={{
                  __html: content.detail,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Floating Booking Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="text-xl font-bold text-primary">
              AED {package_.packageprice}
            </div>
          </div>
          <Button
            variant="desert"
            size="lg"
            onClick={() => setShowBookingForm(true)}
            className="flex-1"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          package_={package_}
          onClose={() => setShowBookingForm(false)}
        />
      )}

      <WhatsAppFloat />
      <Footer />
    </div>
  );
};

export default TourDetails;
