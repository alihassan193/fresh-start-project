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
    <div className="fixed bottom-24 right-6 z-50 animate-fade-in">
      {/* Pulsing ring effect */}
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
      
      <Link
        to="/tours"
        className="relative flex items-center gap-2 bg-gradient-sunset text-white px-5 py-3 rounded-full shadow-warm hover:shadow-elegant transform hover:scale-105 transition-all duration-300 font-semibold"
        aria-label="Book Now - View Tours"
      >
        <Calendar className="w-5 h-5" />
        <span className="hidden sm:inline">Book Now</span>
      </Link>
    </div>
  );
};

export default BookNowFloat;
