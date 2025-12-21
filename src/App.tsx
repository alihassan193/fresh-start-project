import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { useMetadata } from "./hooks/useMetadata";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";

// Lazy load pages
const Tours = lazy(() => import("./pages/Tours"));
const TourDetails = lazy(() => import("./pages/TourDetails"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load admin pages
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Packages = lazy(() => import("./pages/admin/Packages"));
const EditPackage = lazy(() => import("./pages/admin/EditPackage"));
const Bookings = lazy(() => import("./pages/admin/Bookings"));
const AdminBlogs = lazy(() => import("./pages/admin/Blogs"));
const AddBlog = lazy(() => import("./pages/admin/AddBlog"));
const EditBlog = lazy(() => import("./pages/admin/EditBlog"));
const AdminFAQs = lazy(() => import("./pages/admin/FAQs"));
const AdminAddons = lazy(() => import("./pages/admin/Addons"));
const AdminEnquiries = lazy(() => import("./pages/admin/Enquiries"));
const AdminMedia = lazy(() => import("./pages/admin/Media"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminTripAdvisorReviews = lazy(() => import("./pages/admin/TripAdvisorReviews"));
const AdminMetaData = lazy(() => import("./pages/admin/MetaData"));
const AdminFeatures = lazy(() => import("./pages/admin/Features"));
const AdminPackageTypes = lazy(() => import("./pages/admin/PackageTypes"));
const AdminDeals = lazy(() => import("./pages/admin/Deals"));
const AdminPageContent = lazy(() => import("./pages/admin/PageContent"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

const queryClient = new QueryClient();

const MetadataWrapper = ({ children }: { children: React.ReactNode }) => {
  useMetadata();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <MetadataWrapper>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }
            >
              {/* ✅ Add main landmark here */}
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <>
                        <WhatsAppFloat />
                        <Index />
                      </>
                    }
                  />
                  <Route
                    path="/tours"
                    element={
                      <>
                        <WhatsAppFloat />
                        <Tours />
                      </>
                    }
                  />
                  <Route
                    path="/tours/:slug"
                    element={
                      <>
                        <WhatsAppFloat />
                        <TourDetails />
                      </>
                    }
                  />
                  <Route
                    path="/blogs"
                    element={
                      <>
                        <WhatsAppFloat />
                        <Blogs />
                      </>
                    }
                  />
                  <Route
                    path="/blogs/:slug"
                    element={
                      <>
                        <WhatsAppFloat />
                        <BlogDetails />
                      </>
                    }
                  />
                  <Route
                    path="/gallery"
                    element={
                      <>
                        <WhatsAppFloat />
                        <Gallery />
                      </>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <>
                        <WhatsAppFloat />
                        <About />
                      </>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <>
                        <WhatsAppFloat />
                        <ContactUs />
                      </>
                    }
                  />
                  <Route
                    path="/thank-you"
                    element={
                      <>
                        <WhatsAppFloat />
                        <ThankYou />
                      </>
                    }
                  />
                  <Route
                    path="/booking-confirmation/:id"
                    element={
                      <>
                        <WhatsAppFloat />
                        <BookingConfirmation />
                      </>
                    }
                  />
                  <Route
                    path="/sitemap"
                    element={
                      <>
                        <WhatsAppFloat />
                        <Sitemap />
                      </>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <>
                        <WhatsAppFloat />
                        <Terms />
                      </>
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <>
                        <WhatsAppFloat />
                        <Privacy />
                      </>
                    }
                  />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="packages" element={<Packages />} />
                    <Route path="packages/:id" element={<EditPackage />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="blogs/add" element={<AddBlog />} />
                    <Route path="blogs/edit/:id" element={<EditBlog />} />
                    <Route path="faqs" element={<AdminFAQs />} />
                    <Route path="addons" element={<AdminAddons />} />
                    <Route path="features" element={<AdminFeatures />} />
                    <Route
                      path="package-types"
                      element={<AdminPackageTypes />}
                    />
                    <Route path="deals" element={<AdminDeals />} />
                    <Route path="page-content" element={<AdminPageContent />} />
                    <Route path="enquiries" element={<AdminEnquiries />} />
                    <Route path="media" element={<AdminMedia />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route
                      path="testimonials"
                      element={<AdminTestimonials />}
                    />
                    <Route
                      path="tripadvisor-reviews"
                      element={<AdminTripAdvisorReviews />}
                    />
                    <Route path="meta" element={<AdminMetaData />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </Suspense>
          </MetadataWrapper>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
