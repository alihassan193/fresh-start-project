import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Star, MapPin, Tag } from "lucide-react";
import { packageApi, Package, IMAGE_BASE_URL } from "@/lib/api";
import safariImage from "@/assets/safari-adventure.jpg";

const FeaturedPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      setLoading(true);
      const response = await packageApi.getAll({ featured: "yes", limit: 6 });
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching featured packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = () => safariImage;

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-desert-sand/20 via-background to-desert-gold/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-desert-night">
              Loading featured packages...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-desert-night mb-4">
            Our Best Selling UAE Tours
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the UAE with our top-rated tours, featuring exhilarating
            Desert Safari, comprehensive Dubai City Tours, and romantic Dhow
            Cruises. Choose your ultimate Arabian experience today.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          id="packages"
        >
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className="group overflow-hidden border-0 shadow-warm hover:shadow-elegant transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <a href={`/tours/${pkg.slug}`}>
                  {" "}
                  <img
                    src={
                      pkg.packagefeatureimage
                        ? `${IMAGE_BASE_URL}${pkg.packagefeatureimage}`
                        : getDefaultImage()
                    }
                    alt={pkg.packagename}
                    className="w-full h-64 object-cover object-bottom group-hover:scale-110 transition-transform duration-500"
                  />
                </a>
                {pkg.featured === "yes" && (
                  <div className="absolute top-4 left-4 bg-desert-sunset text-white px-3 py-1 rounded-full text-sm font-bold drop-shadow-2xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                    Featured
                  </div>
                )}
                {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-desert-gold fill-current" />
                    <span className="text-sm font-semibold">4.9</span>
                  </div>
                </div> */}
              </div>

              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-desert-night mb-2">
                  <a href={`/tours/${pkg.slug}`}> {pkg.packagename}</a>
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 min-h-[100px]">
                  {pkg.packagedescription}
                </p>

                {/* Package Details */}
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4" />
                    <span>Starting from</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.packagefeatures2}</span>

                    {/* <span>All Ages</span> */}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <span className="text-2xl sm:text-3xl font-bold text-desert-sunset">
                      {pkg.packageprice} AED
                    </span>
                    <span className="text-sm font-bold-foreground">
                      {" "}
                      / Person
                    </span>
                  </div>
                  <Button
                    variant="desert"
                    className="w-full sm:w-auto font-bold drop-shadow-2xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]"
                    asChild
                  >
                    <a href={`/tours/${pkg.slug}`}>Book Now</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className=" bg-desert-gold
  text-gray-900
  border-desert-gold"
            asChild
          >
            <a href="/tours">
              <MapPin className="w-5 h-5 mr-2 " />
              View All Packages
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
