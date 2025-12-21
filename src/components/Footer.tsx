import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

// Custom icons for platforms not in Lucide
const MediumIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const BloggerIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21.976 24H2.026C.9 24 0 23.1 0 21.976V2.026C0 .9.9 0 2.026 0H22c1.1 0 2 .9 2 2.026v19.948C24 23.1 23.1 24 21.976 24zM12.5 5.5c-2.5 0-4.5 2-4.5 4.5v.5c0 .3-.2.5-.5.5H6c-.6 0-1 .4-1 1v.5c0 .3.2.5.5.5h1c.3 0 .5.2.5.5v1c0 2.5 2 4.5 4.5 4.5h5c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5h-4c-.8 0-1.5-.7-1.5-1.5v-.5c0-.3.2-.5.5-.5h4c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5h-4c-.3 0-.5-.2-.5-.5V10c0-.8.7-1.5 1.5-1.5h4c.3 0 .5-.2.5-.5V6c0-.3-.2-.5-.5-.5h-5z"/>
  </svg>
);

const TripAdvisorIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15a3 3 0 110-6 3 3 0 010 6zm4 0a3 3 0 110-6 3 3 0 010 6zm2.5-7h-9c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h9c.3 0 .5.2.5.5s-.2.5-.5.5z"/>
  </svg>
);

const ViatorIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

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
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/luxuarydesertsafaridubai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="Visit our Facebook page">
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </a>

              <a
                href="https://www.instagram.com/crown_arabiatourism/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="Visit our Instagram profile">
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </a>

              <a
                href="https://www.youtube.com/@DesertSafariAE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="Visit our YouTube channel">
                  <Youtube className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">YouTube</span>
                </Button>
              </a>

              <a
                href="https://www.linkedin.com/company/desert-safari-dubai-ae"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="Visit our LinkedIn page">
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </a>

              <a
                href="https://medium.com/@desertsafaridubai025"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="Read our Medium blog">
                  <MediumIcon />
                  <span className="sr-only">Medium</span>
                </Button>
              </a>

              <a
                href="https://desert-safari-dubai-2025.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="Read our Blogger posts">
                  <BloggerIcon />
                  <span className="sr-only">Blogger</span>
                </Button>
              </a>

              <a
                href="https://www.tripadvisor.com/Attraction_Review-g295424-d34078013-Reviews-Crown_Arabia-Dubai_Emirate_of_Dubai.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="See our TripAdvisor reviews">
                  <TripAdvisorIcon />
                  <span className="sr-only">TripAdvisor</span>
                </Button>
              </a>

              <a
                href="https://www.viator.com/Dubai-tours/Desert-Safari/d828-g6-c23"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline-light" size="icon" aria-label="Book on Viator">
                  <ViatorIcon />
                  <span className="sr-only">Viator</span>
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
