import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import dsdLogoWhite from "@/assets/dsd-logo-small.png";
import MobileMenu from "@/components/MobileMenu";

const Header = () => {
  const location = useLocation();

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Text */}
          <Link to="/" className="flex items-center gap-4">
            <img
              src={dsdLogoWhite}
              alt="Crown Arabia Tourism"
              className="h-12 w-auto"
            />
            <span className="text-foreground text-xl font-bold tracking-wide  sm:block">
              DESERT SAFARI DUBAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* <Link
              to="/"
              className={`text-foreground font-medium hover:text-foreground/80 transition-colors ${
                location.pathname === "/" ? "underline underline-offset-4" : ""
              }`}
            >
              Home
            </Link> */}
            <Link
              to="/tours"
              className={`text-foreground font-medium hover:text-foreground/80 transition-colors ${
                location.pathname === "/tours"
                  ? "underline underline-offset-4"
                  : ""
              }`}
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
            >
              Contact
            </Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="tel:+971501131852"
              className="flex items-center space-x-2 text-foreground hover:text-foreground/80 transition-colors"
            >
              <Phone className="w-5 h-5" />
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
  );
};

export default Header;
