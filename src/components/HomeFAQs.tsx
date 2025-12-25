import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStructuredData, generateFAQSchema } from "@/hooks/useStructuredData";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What's included in your Desert Safari packages?",
    answer: "All our packages include hotel pickup/drop-off, 30-45 minutes thrilling dune bashing in 4x4 Land Cruiser, camel riding, sandboarding, sunset photography, BBQ dinner with unlimited soft drinks, live cultural shows (belly dance, Tanoura, fire show), and henna painting. Our signature Desert Safari with Quad Bike adds an exhilarating 30-minute quad biking experience through the Red Dunes.",
    hasLink: true,
    linkText: "Desert Safari with Quad Bike",
    linkUrl: "/tours",
  },
  {
    question: "Do you offer Desert Safari with Quad Bike?",
    answer: "Yes! Our most popular package includes a full 30-minute quad biking adventure in addition to all standard safari activities. Perfect for thrill-seekers wanting extra adrenaline. Quad biking is available for guests aged 6 years and above with safety equipment provided.",
  },
  {
    question: "What are your pickup locations and timing?",
    answer: "We provide complimentary pickup from any hotel or residence across Dubai and Sharjah. For evening desert safaris, pickups start around 3:00 PM, and you'll return by 9:00-9:30 PM. Exact pickup time will be confirmed by your driver via WhatsApp 30 minutes before arrival.",
  },
  {
    question: "Which desert location do you visit?",
    answer: "We take guests to the spectacular Red Dunes (Lahbab Desert) in Sharjah on E44 highway - one of the most beautiful and photogenic desert areas in UAE, known for its vibrant red sand and perfect dune formations for bashing and photography.",
  },
  {
    question: "Is dune bashing safe? What about pregnant women and children?",
    answer: "Yes, dune bashing is safe with our professional safari drivers. However, it's not recommended for pregnant women, guests with back/neck problems, or children under 4 years. These guests can skip dune bashing and proceed directly to camp for other activities, or book our gentler heritage safari option.",
  },
  {
    question: "Can I upgrade to an Overnight Desert Safari?",
    answer: "Absolutely! If you're already booked for our evening safari and want to sleep under the stars, you can upgrade to our Overnight Safari package. Simply contact us on WhatsApp, and we'll arrange your overnight experience with comfortable bedding and sunrise views.",
    hasLink: true,
    linkText: "Overnight Safari",
    linkUrl: "/tours",
  },
  {
    question: "What should I wear and bring for the desert safari?",
    answer: "Wear comfortable, loose clothing (t-shirts, long shorts, or jeans), closed-toe shoes (sneakers/boots - avoid sandals), sunglasses, and hats. Bring sunscreen, a light jacket for cooler evenings (especially in winter), and your camera/phone for incredible photos. Scarves and caps are available at our desert stop.",
  },
  {
    question: "How do I book and what payment methods do you accept?",
    answer: "Book instantly through our website or contact us via WhatsApp at +971 50 113 1852. We accept online payments (credit/debit cards), bank transfers for group bookings, and cash payment options. Book 2-3 days in advance during peak season (December-March) to guarantee availability.",
    hasLink: true,
    linkText: "View All Tours",
    linkUrl: "/tours",
  },
];

const HomeFAQs = () => {
  // Add FAQ schema for SEO
  useStructuredData({
    data: generateFAQSchema(faqs),
    id: "faq-schema",
  });

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our Dubai Desert Safari experiences
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg border border-border px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                  {faq.hasLink && faq.linkUrl && (
                    <>
                      {" "}
                      <Link
                        to={faq.linkUrl}
                        className="text-primary hover:underline font-medium"
                      >
                        {faq.linkText} →
                      </Link>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQs;
