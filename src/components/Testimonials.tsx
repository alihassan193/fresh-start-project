import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { contentApi } from "@/lib/api";

interface Testimonial {
  id: number;
  full_name: string;
  testimonial: string;
  tag_line: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await contentApi.getTestimonials();
      setTestimonials(response.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-desert-night mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied adventurers who've experienced the magic of our desert safaris.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-warm hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                {/* Stars */}
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-desert-gold fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                  "{testimonial.testimonial}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-sunset rounded-full flex items-center justify-center text-white font-semibold mr-3 sm:mr-4 text-sm sm:text-base">
                    {getInitials(testimonial.full_name)}
                  </div>
                  <div>
                    <div className="font-semibold text-desert-night text-sm sm:text-base">{testimonial.full_name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.tag_line}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-desert-sunset mb-2">10,000+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-desert-sunset mb-2">4.9★</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-desert-sunset mb-2">1,500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">5-Star Reviews</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-desert-sunset mb-2">8+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;