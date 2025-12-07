import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import desertOfferImage from "@/assets/desert-offer.jpg";

const DesertOffers = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl
  font-bold
  text-desert-gold-text
  leading-tight"
            >
              Best Desert Safari Offers – Unmatched Comfort & Thrills
            </h2>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed text-justify">
              Enjoy an unforgettable Desert Safari Dubai journey across the
              stunning Desert Red Dunes, where adventure meets it's luxury.
              Choose from our exclusive Desert Safari Packages, featuring
              adrenaline pumping Quad Bike rides, attractive Belly Dance
              performances, and premium Arabian hospitality. Whether you are
              looking for a Premium Desert Safari with VIP treatment or budget
              friendly Desert Safari Offers, we deliver the ultimate Dubai
              Adventures. Choose your package and get an experience that lasts
              forever. <br />
              <br />
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 text-base font-bold drop-shadow-2xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]"
              >
                Contact Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src={desertOfferImage}
              alt="Desert Safari Dubai with luxury vehicle in golden sand dunes"
              className="w-full h-auto rounded-lg shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesertOffers;
