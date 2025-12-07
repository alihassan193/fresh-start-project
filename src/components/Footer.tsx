import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer 
      className="bg-desert-night text-white"
      role="contentinfo"
    >
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-desert-gold mb-4">
              Desert Safari Dubai
            </h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              Experience the authentic beauty of Dubai's desert with our premium
              safari packages. We offer unforgettable adventures combining
              thrilling activities, cultural experiences, and luxury hospitality
              in the heart of the Arabian desert.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/luxuarydesertsafaridubai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
              >
                <Button
                  variant="outline-light"
                  size="icon"
                >
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </Button>
              </a>

              <a
                href="https://www.instagram.com/crown_arabiatourism/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram profile"
              >
                <Button
                  variant="outline-light"
                  size="icon"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </Button>
              </a>

              <a
                href="https://www.youtube.com/@DesertSafariAE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our YouTube channel"
              >
                <Button
                  variant="outline-light"
                  size="icon"
                >
                  <Youtube className="w-5 h-5" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-lg font-semibold text-desert-gold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tours"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/sitemap"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Site Map
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-desert-gold mb-4">
              Contact Info
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-desert-gold flex-shrink-0" aria-hidden="true" />
                <a 
                  href="tel:+971501131852"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  +971 50 113 1852
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-desert-gold flex-shrink-0" aria-hidden="true" />
                <a 
                  href="mailto:info@desert-safaridubai.ae"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  info@desert-safaridubai.ae
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-desert-gold flex-shrink-0 mt-1" aria-hidden="true" />
                <p className="text-white/80">
                  Dubai Marina, Sheikh Zayed Road
                  <br />
                  Dubai, UAE
                </p>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Desert Safari Dubai. All rights reserved.
            </p>
            <nav 
              className="flex space-x-6 mt-4 md:mt-0"
              aria-label="Legal links"
            >
              <Link
                to="/privacy"
                className="text-white/60 hover:text-desert-gold text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-white/60 hover:text-desert-gold text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
