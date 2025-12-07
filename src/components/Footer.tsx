import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-desert-night text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-desert-gold mb-4">
              Desert Safari Dubai
            </h3>
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
                aria-label="luxuarydesertsafaridubai"
              >
                <Button
                  variant="outline-light"
                  size="icon"
                  aria-label="luxuarydesertsafaridubai"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
              </a>

              <a
                href="https://www.instagram.com/crown_arabiatourism/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="crown_arabiatourism"
              >
                <Button
                  variant="outline-light"
                  size="icon"
                  aria-label="crown_arabiatourism"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
              </a>

              {/* <a
                href="https://twitter.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon">
                  <Twitter className="w-5 h-5" />
                </Button>
              </a> */}

              <a
                href="https://www.youtube.com/@DesertSafariAE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="@DesertSafariAE"
              >
                <Button
                  variant="outline-light"
                  size="icon"
                  aria-label="@DesertSafariAE"
                >
                  <Youtube className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-desert-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/tours"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Tours
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/sitemap"
                  className="text-white/80 hover:text-desert-gold transition-colors"
                >
                  Site Map
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-desert-gold mb-4">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-desert-gold flex-shrink-0" />
                <div>
                  <p className="text-white/80">+971 50 113 1852</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-desert-gold flex-shrink-0" />
                <p className="text-white/80">info@desert-safaridubai.ae</p>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-desert-gold flex-shrink-0 mt-1" />
                <p className="text-white/80">
                  Dubai Marina, Sheikh Zayed Road
                  <br />
                  Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-white/60 text-sm">
              © 2024 Desert Safari Dubai. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-white/60 hover:text-desert-gold text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-white/60 hover:text-desert-gold text-sm transition-colors"
              >
                Terms of Service
              </a>
              {/* <a
                href="#"
                className="text-white/60 hover:text-desert-gold text-sm transition-colors"
              >
                Cancellation Policy
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
