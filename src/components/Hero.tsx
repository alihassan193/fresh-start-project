import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-desert-camp.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
      aria-label="Desert Safari Dubai hero section"
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading - Professional Style */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8 leading-tight italic text-white drop-shadow-2xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] px-4">
            Desert Safari Dubai
          </h1>

          {/* Subheading - With backdrop for visibility */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-white max-w-3xl mx-auto font-medium px-6 py-3 bg-black/40 backdrop-blur-sm rounded-lg inline-block drop-shadow-lg [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">
            Experience the ultimate Arabian adventure with premium desert safaris
          </p>

          {/* Trust Indicators */}
          <ul 
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 mb-8 md:mb-12 px-4 list-none"
            aria-label="Trust indicators"
          >
            <li className="flex items-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-desert-gold mr-2" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">Licensed</span>
            </li>
            <li className="flex items-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-desert-gold mr-2" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">
                10,000+ Guests
              </span>
            </li>
            <li className="flex items-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-desert-gold mr-2" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">Premium</span>
            </li>
          </ul>

          <div className="mb-12 md:mb-16 px-4">
            <Button
              variant="hero"
              size="lg"
              className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 font-semibold w-full sm:w-auto"
              asChild
            >
              <Link to="#packages">
                <Calendar className="w-10 h-10 md:w-10 md:h-10 mr-3 md:mr-4" aria-hidden="true" />
                <span className="hidden sm:inline">
                  Book Now - Best Price Guaranteed
                </span>
                <span className="sm:hidden">Book Now</span>
              </Link>
            </Button>
          </div>

          {/* Quick Info Cards */}
          <ul 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 list-none"
            aria-label="Service highlights"
          >
            <li className="bg-black/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
              <h2 className="text-base sm:text-lg font-semibold mb-2 text-desert-gold [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Premium Experience
              </h2>
              <p className="text-white/90 text-xs sm:text-sm">
                Luxury camp setup with traditional entertainment
              </p>
            </li>
            <li className="bg-black/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
              <h2 className="text-base sm:text-lg font-semibold mb-2 text-desert-gold [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Expert Guides
              </h2>
              <p className="text-white/90 text-xs sm:text-sm">
                Professional drivers and cultural ambassadors
              </p>
            </li>
            <li className="bg-black/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
              <h2 className="text-base sm:text-lg font-semibold mb-2 text-desert-gold [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Safety First
              </h2>
              <p className="text-white/90 text-xs sm:text-sm">
                Full insurance coverage and safety equipment
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
