import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tripAdvisorApi, TripAdvisorReview, TripAdvisorStats } from "@/lib/api";
import { TripAdvisorIcon } from "@/components/TripAdvisorReviews";
import { 
  useStructuredData, 
  generateAggregateReviewSchema,
  generatePageBreadcrumbSchema 
} from "@/hooks/useStructuredData";

const BASE_URL = "https://desert-safaridubai.ae";

const Reviews = () => {
  const [reviews, setReviews] = useState<TripAdvisorReview[]>([]);
  const [stats, setStats] = useState<TripAdvisorStats>({ average: "5.0", total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsResponse, statsResponse] = await Promise.all([
          tripAdvisorApi.getAll(),
          tripAdvisorApi.getStats(),
        ]);
        
        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }
        
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const averageRating = parseFloat(stats.average);
  const totalReviews = stats.total;

  // Add structured data for SEO
  useStructuredData({
    data: generateAggregateReviewSchema(reviews, BASE_URL, totalReviews),
    id: "reviews-aggregate-schema",
  });

  useStructuredData({
    data: generatePageBreadcrumbSchema(
      [
        { name: "Home", url: "/" },
        { name: "Reviews", url: "/reviews" },
      ],
      BASE_URL
    ),
    id: "reviews-breadcrumb-schema",
  });

  // Generate individual review schema for rich snippets
  useStructuredData({
    data: {
      "@context": "https://schema.org",
      "@type": "ReviewPage",
      name: "Customer Reviews - Desert Safari Dubai",
      description: "Read authentic customer reviews and testimonials from travelers who experienced our desert safari tours in Dubai.",
      url: `${BASE_URL}/reviews`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: reviews.map((review, index) => ({
          "@type": "Review",
          position: index + 1,
          author: {
            "@type": "Person",
            name: review.author_name,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
          },
          reviewBody: review.review_content,
          datePublished: review.review_date,
          itemReviewed: {
            "@type": "TouristAttraction",
            name: "Desert Safari Dubai",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Dubai",
              addressCountry: "UAE",
            },
          },
        })),
      },
    },
    id: "reviews-list-schema",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TripAdvisorIcon />
            <span className="text-2xl font-semibold text-[#00AA6C]">Tripadvisor</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Customer Reviews
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover what our guests say about their unforgettable desert safari experiences in Dubai
          </p>
          
          {/* Rating summary */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-8 h-8 ${i < Math.floor(averageRating) ? 'fill-[#00AA6C] text-[#00AA6C]' : 'fill-muted text-muted'}`}
                />
              ))}
            </div>
            <span className="text-3xl font-bold text-foreground">{averageRating}</span>
          </div>
          <p className="text-muted-foreground">
            Based on <span className="font-semibold text-foreground">{totalReviews.toLocaleString()}</span> reviews
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reviews available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card 
                  key={review.id} 
                  className="bg-card border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    {/* Rating stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full ${i < review.rating ? 'bg-[#00AA6C]' : 'bg-muted'}`}
                        />
                      ))}
                    </div>

                    {/* Review title */}
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {review.review_title}
                    </h3>

                    {/* Review content */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-6">
                      "{review.review_content}"
                    </p>

                    {/* Author info */}
                    <div className="border-t border-border pt-4">
                      <p className="font-medium text-foreground">{review.author_name}</p>
                      <p className="text-sm text-muted-foreground">{review.author_location}</p>
                      <p className="text-xs text-muted-foreground mt-1">{review.review_date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* TripAdvisor CTA */}
          <div className="text-center mt-12">
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g295424-d34078013-Reviews-Crown_Arabia-Dubai_Emirate_of_Dubai.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#00AA6C] text-[#00AA6C] hover:bg-[#00AA6C] hover:text-white"
              >
                <TripAdvisorIcon />
                <span className="ml-2">Read More Reviews on Tripadvisor</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reviews;
