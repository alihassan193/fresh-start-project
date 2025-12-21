import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { useStructuredData, generatePageBreadcrumbSchema } from "@/hooks/useStructuredData";

const BASE_URL = "https://desert-safaridubai.ae";

const ContactUs = () => {
  // Add breadcrumb schema
  useStructuredData({
    data: generatePageBreadcrumbSchema(
      [{ name: "Contact Us", url: `${BASE_URL}/contact` }],
      BASE_URL
    ),
    id: "breadcrumb-schema",
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions? We're here to help you plan the perfect desert adventure. Reach out to our expert team today!
          </p>
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
};

export default ContactUs;
