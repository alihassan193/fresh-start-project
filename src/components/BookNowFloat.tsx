import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const BookNowFloat = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (approx 600px)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile: Full-width bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-md border-t border-border/50 animate-fade-in">
        <Link
          to="/tours"
          className="flex items-center justify-center gap-2 w-full bg-gradient-sunset text-white px-5 py-3.5 rounded-lg shadow-warm hover:shadow-elegant transition-all duration-300 font-semibold text-lg"
          aria-label="Book Now - View Tours"
        >
          <Calendar className="w-5 h-5" />
          <span>Book Your Safari Now</span>
        </Link>
      </div>

      {/* Desktop: Floating button */}
      <div className="hidden sm:block fixed bottom-8 right-6 z-50 animate-fade-in">
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        
        <Link
          to="/tours"
          className="relative flex items-center gap-2 bg-gradient-sunset text-white px-5 py-3 rounded-full shadow-warm hover:shadow-elegant transform hover:scale-105 transition-all duration-300 font-semibold"
          aria-label="Book Now - View Tours"
        >
          <Calendar className="w-5 h-5" />
          <span>Book Now</span>
        </Link>
      </div>
    </>
  );
};

export default BookNowFloat;
