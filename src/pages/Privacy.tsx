import { lazy } from "react";
import Header from "@/components/Header";
import { useStructuredData, generatePageBreadcrumbSchema } from "@/hooks/useStructuredData";

const Footer = lazy(() => import("@/components/Footer"));

const BASE_URL = "https://desert-safaridubai.ae";

const Privacy = () => {
  // Add breadcrumb schema
  useStructuredData({
    data: generatePageBreadcrumbSchema(
      [{ name: "Privacy Policy", url: `${BASE_URL}/privacy-policy` }],
      BASE_URL
    ),
    id: "breadcrumb-schema",
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold pt-10 text-foreground mb-8">
          Privacy Policy for Desert Safari Dubai
        </h1>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <p>
            At www.desert-safaridubai.ae, we are committed to protecting your
            privacy and ensuring that your personal information is handled
            responsibly. This Privacy Policy explains how we collect, use, and
            protect your data when you access or interact with our Website and
            services.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> Such as your name, email
                address, phone number, and payment details when you make a
                booking or inquiry.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our
                Website, including IP address, browser type, device information,
                and browsing behavior.
              </li>
              <li>
                <strong>Cookies:</strong> Small data files stored on your device
                to improve user experience and website functionality.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p>Your data is used for purposes such as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing bookings and payments.</li>
              <li>Providing customer support and responding to inquiries.</li>
              <li>
                Sending promotional offers, updates, or relevant information
                with your consent.
              </li>
              <li>Analyzing website usage to enhance user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3. Sharing Your Information
            </h2>
            <p>
              We value your trust and ensure that your personal information is
              not sold or rented to third parties. However, we may share your
              data with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> Third-party vendors who
                assist in processing payments or delivering services.
              </li>
              <li>
                <strong>Legal Authorities:</strong> If required by law or to
                protect our legal rights.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar technologies to enhance your experience
              on our Website. You can modify your browser settings to refuse
              cookies, but this may affect the functionality of certain
              features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              5. Data Security
            </h2>
            <p>
              We implement robust security measures to protect your personal
              data from unauthorized access, disclosure, or loss. Despite these
              measures, no online platform is entirely immune to risks, and we
              encourage you to use our services responsibly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Access, update, or delete your personal information by
                contacting us.
              </li>
              <li>
                Opt-out of receiving promotional communications by following the
                unsubscribe link in our emails.
              </li>
              <li>
                Request information about how your data is used and shared.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              7. Third-Party Links
            </h2>
            <p>
              Our Website may contain links to external websites. We are not
              responsible for the privacy practices or content of these
              third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page, and the updated policy will include
              the "last updated" date at the top.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              9. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              how we handle your data, please contact us at:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:desert.safaridubai025@gmail.com"
                  className="text-primary hover:underline"
                >
                  desert.safaridubai025@gmail.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+971501131852"
                  className="text-primary hover:underline"
                >
                  +971 (50) 113 1852
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
