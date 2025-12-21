import { lazy } from "react";
import Header from "@/components/Header";
import { useStructuredData, generatePageBreadcrumbSchema } from "@/hooks/useStructuredData";

const Footer = lazy(() => import("@/components/Footer"));

const BASE_URL = "https://desert-safaridubai.ae";

const Terms = () => {
  // Add breadcrumb schema
  useStructuredData({
    data: generatePageBreadcrumbSchema(
      [{ name: "Terms & Conditions", url: `${BASE_URL}/terms-conditions` }],
      BASE_URL
    ),
    id: "breadcrumb-schema",
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground pt-10 mb-8">
          Terms and Conditions for Desert Safari Dubai
        </h1>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <p>
            Welcome to www.desert-safaridubai.ae ("Website"). By accessing and
            using this Website, you agree to comply with the following Terms and
            Conditions. Please review them carefully before using our services.
            If you do not agree with these terms, please refrain from using the
            Website.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using our Website, you confirm that you have read,
              understood, and accepted these Terms and Conditions. These terms
              are subject to updates and changes at our discretion without prior
              notice. Continued use of the Website constitutes your acceptance
              of any modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              2. Use of the Website
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The Website is intended for informational and personal use.
              </li>
              <li>
                Unauthorized use, including activities that harm, disrupt, or
                manipulate the Website's functionality, is strictly prohibited.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                login credentials, where applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3. Intellectual Property
            </h2>
            <p>
              All content on www.desert-safaridubai.ae, including text, images,
              logos, and designs, is the exclusive property of Desert Safari
              Dubai or its authorized licensors. Any unauthorized reproduction,
              modification, or distribution of this content is prohibited and
              may result in legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              4. Booking and Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All bookings made via the Website are subject to availability
                and confirmation.
              </li>
              <li>
                Payments must be completed through the designated secure payment
                methods provided.
              </li>
              <li>
                Any cancellations or modifications are governed by our refund
                and cancellation policies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              5. User Submissions
            </h2>
            <p>
              By submitting reviews, feedback, or other content through the
              Website, you grant www.desert-safaridubai.ae the right to use and
              share your submissions for promotional purposes. Submissions
              should not infringe upon the rights of others or contain
              inappropriate content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              6. Third-Party Links
            </h2>
            <p>
              The Website may include links to third-party sites for
              convenience. Desert Safari Dubai is not responsible for the
              accuracy, privacy policies, or practices of these external sites.
              Visiting third-party links is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p>
              While we strive to maintain accurate and up-to-date information,
              Desert Safari Dubai is not liable for any errors, interruptions,
              or damages resulting from the use of this Website. Services are
              provided "as is" without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              8. Privacy Policy
            </h2>
            <p>
              Your use of this Website is also governed by our Privacy Policy,
              which explains how we collect, use, and protect your personal
              data. Please review it for detailed information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              9. Governing Law
            </h2>
            <p>
              These Terms and Conditions are governed by the laws of the United
              Arab Emirates. Any disputes arising from the use of this Website
              will be settled in the courts of the UAE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              10. Contact Information
            </h2>
            <p>
              If you have any questions or concerns about these Terms and
              Conditions, please contact us at{" "}
              <a
                href="mailto:desert.safaridubai025@gmail.com"
                className="text-primary hover:underline"
              >
                desert.safaridubai025@gmail.com
              </a>{" "}
              or call us directly at{" "}
              <a
                href="tel:+971501131852"
                className="text-primary hover:underline"
              >
                +971 (50) 113 1852
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
