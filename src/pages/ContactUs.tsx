import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

const ContactUs = () => {
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
