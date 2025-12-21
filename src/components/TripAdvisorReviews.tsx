import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { tripAdvisorApi, TripAdvisorReview } from "@/lib/api";

const TripAdvisorIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#00AA6C]">
    <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 5.997 5.997 0 0 0 4.04-10.43L24 6.647h-4.35a13.573 13.573 0 0 0-7.644-2.352zM12 6.255c1.531 0 3.063.303 4.504.91C14.943 8.11 14 9.94 14 12a6.02 6.02 0 0 0 1.262 3.673L12 19.102l-3.262-3.43A6.018 6.018 0 0 0 10 12c0-2.06-.943-3.89-2.504-4.835A11.54 11.54 0 0 1 12 6.255zM6.003 8.015a3.988 3.988 0 1 1 0 7.976 3.988 3.988 0 0 1 0-7.976zm11.994 0a3.988 3.988 0 1 1 0 7.976 3.988 3.988 0 0 1 0-7.976zM6.003 9.52a2.482 2.482 0 1 0 0 4.964 2.482 2.482 0 0 0 0-4.963zm11.994 0a2.482 2.482 0 1 0 0 4.964 2.482 2.482 0 0 0 0-4.963z"/>
  </svg>
);

// Fallback reviews when API is not available
const fallbackReviews: TripAdvisorReview[] = [
  {
    id: 1,
    author_name: "Sarah M.",
    author_location: "London, UK",
    rating: 5,
    review_date: "December 2024",
    review_title: "Unforgettable Desert Experience!",
    review_content: "This was the highlight of our Dubai trip! The dune bashing was thrilling, the sunset views were breathtaking, and the BBQ dinner under the stars was delicious. Our guide Ahmed was fantastic - knowledgeable and fun!",
    is_featured: 1,
    created_at: "",
  },
  {
    id: 2,
    author_name: "James T.",
    author_location: "Sydney, Australia",
    rating: 5,
    review_date: "November 2024",
    review_title: "Best Safari Tour in Dubai",
    review_content: "We've done safaris before but this was exceptional. The camp setup was beautiful with traditional Arabic decorations. Kids loved the camel rides and henna painting. Highly recommend the overnight camping option!",
    is_featured: 1,
    created_at: "",
  },
  {
    id: 3,
    author_name: "Maria G.",
    author_location: "Barcelona, Spain",
    rating: 5,
    review_date: "November 2024",
    review_title: "Professional Service, Amazing Views",
    review_content: "From pickup to drop-off, everything was perfectly organized. The sunset photography spots they took us to were incredible. The traditional entertainment including belly dancing and tanoura show was mesmerizing.",
    is_featured: 1,
    created_at: "",
  },
];

const TripAdvisorReviews = () => {
  const [reviews, setReviews] = useState<TripAdvisorReview[]>(fallbackReviews);
  const [isLoading, setIsLoading] = useState(true);
  const totalReviews = 2847;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await tripAdvisorApi.getFeatured();
        if (response.success && response.data && response.data.length > 0) {
          setReviews(response.data);
        }
      } catch (error) {
        // Use fallback reviews on error
        console.log("Using fallback reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 4.9;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header with TripAdvisor branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TripAdvisorIcon />
            <span className="text-2xl font-semibold text-[#00AA6C]">Tripadvisor</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Guests Say
          </h2>
          
          {/* Rating summary */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'fill-[#00AA6C] text-[#00AA6C]' : 'fill-muted text-muted'}`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">{averageRating}</span>
          </div>
          <p className="text-muted-foreground">
            Based on <span className="font-semibold text-foreground">{totalReviews.toLocaleString()}</span> reviews
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reviews.slice(0, 3).map((review) => (
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
                <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                  {review.review_title}
                </h3>

                {/* Review content */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
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

        {/* CTA */}
        <div className="text-center">
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
              <span className="ml-2">Read All Reviews on Tripadvisor</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TripAdvisorReviews;
