import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import dsdLogoWhite from "@/assets/dsd-logo-small.png";
import MobileMenu from "@/components/MobileMenu";

const Header = () => {
  const location = useLocation();

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      
      <header 
        className="absolute top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
        role="banner"
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Text */}
            <Link 
              to="/" 
              className="flex items-center gap-4"
              aria-label="Desert Safari Dubai - Home"
            >
              <img
                src={dsdLogoWhite}
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <span className="text-foreground text-xl font-bold tracking-wide sm:block">
                DESERT SAFARI DUBAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav 
              className="hidden md:flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                to="/tours"
                className={`text-foreground font-medium hover:text-foreground/80 transition-colors ${
                  location.pathname === "/tours"
                    ? "underline underline-offset-4"
                    : ""
                }`}
                aria-current={location.pathname === "/tours" ? "page" : undefined}
              >
                Tours
              </Link>
              <Link
                to="/blogs"
                className={`text-foreground font-medium hover:text-foreground/80 transition-colors ${
                  location.pathname === "/blogs"
                    ? "underline underline-offset-4"
                    : ""
                }`}
                aria-current={location.pathname === "/blogs" ? "page" : undefined}
              >
                Blogs
              </Link>
              <Link
                to="/gallery"
                className={`text-foreground font-medium hover:text-foreground/80 transition-colors ${
                  location.pathname === "/gallery"
                    ? "underline underline-offset-4"
                    : ""
                }`}
                aria-current={location.pathname === "/gallery" ? "page" : undefined}
              >
                Gallery
              </Link>
              <Link
                to="/about"
                className={`text-foreground font-medium hover:text-foreground/80 transition-colors ${
                  location.pathname === "/about"
                    ? "underline underline-offset-4"
                    : ""
                }`}
                aria-current={location.pathname === "/about" ? "page" : undefined}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`text-foreground font-medium hover:text-foreground/80 transition-colors ${
                  location.pathname === "/contact"
                    ? "underline underline-offset-4"
                    : ""
                }`}
                aria-current={location.pathname === "/contact" ? "page" : undefined}
              >
                Contact
              </Link>
            </nav>

            {/* Contact Info & CTA */}
            <div className="hidden lg:flex items-center space-x-6">
              <a
                href="tel:+971501131852"
                className="flex items-center space-x-2 text-foreground hover:text-foreground/80 transition-colors"
                aria-label="Call us at +971 50 113 1852"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-medium">+971 50 113 1852</span>
              </a>
              <Button
                variant="default"
                size="lg"
                asChild
                className="font-bold drop-shadow-2xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]"
              >
                <Link to="/tours">Book Now</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
