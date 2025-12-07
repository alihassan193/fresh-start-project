import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Award,
  Shield,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Star, label: "Average Rating", value: "4.9" },
    { icon: Award, label: "Years Experience", value: "8+" },
    { icon: Shield, label: "Safety Record", value: "100%" },
  ];

  const team = [
    {
      name: "Ahmed Al-Rashid",
      role: "Lead Safari Guide",
      image: "/placeholder.svg",
      description:
        "With over 10 years of desert experience, Ahmed leads our most adventurous expeditions.",
    },
    {
      name: "Fatima Hassan",
      role: "Cultural Ambassador",
      image: "/placeholder.svg",
      description:
        "Fatima brings authentic Emirati culture to life through storytelling and traditional shows.",
    },
    {
      name: "Omar Khalil",
      role: "Adventure Specialist",
      image: "/placeholder.svg",
      description:
        "Omar ensures every guest experiences the thrill of dune bashing safely and memorably.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Desert Safari Dubai
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            For over 8 years, we've been creating unforgettable desert
            adventures that showcase the beauty, culture, and traditions of the
            Arabian Peninsula.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-desert-night mb-4 md:mb-6">
                Our Story
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6">
                Founded in 2016 with a simple mission: to share the magic of
                Dubai's desert with travelers from around the world. What
                started as a small family business has grown into one of Dubai's
                most trusted desert safari operators.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We believe that every guest deserves an authentic Arabian
                experience that combines adventure, culture, and luxury. Our
                expert guides are not just drivers – they're storytellers,
                cultural ambassadors, and safety experts who ensure your desert
                journey is both thrilling and safe.
              </p>
              <Button variant="desert" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us Today
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://backend.desert-safaridubai.ae/uploads/dubai-tourist-landmark-6e7e97a9-4919-47d1-a55d-f76ac4a09df2.jpg"
                alt="Our team in the desert"
                className="w-full h-96 object-cover rounded-lg shadow-elegant"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-lg shadow-warm">
                <div className="text-3xl font-bold text-desert-sunset">8+</div>
                <div className="text-muted-foreground">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-desert-night mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-muted-foreground">
              Numbers that speak for our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-warm">
                <CardContent className="p-8">
                  <stat.icon className="w-12 h-12 text-desert-gold mx-auto mb-4" />
                  <div className="text-3xl font-bold text-desert-sunset mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto mb-8 md:mb-12">
              <TabsTrigger value="mission" className="text-xs sm:text-sm py-2">
                Our Mission
              </TabsTrigger>
              <TabsTrigger value="safety" className="text-xs sm:text-sm py-2">
                Safety First
              </TabsTrigger>
              <TabsTrigger value="team" className="text-xs sm:text-sm py-2">
                Our Team
              </TabsTrigger>
              <TabsTrigger
                value="sustainability"
                className="text-xs sm:text-sm py-2"
              >
                Sustainability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mission">
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-3xl font-bold text-desert-night mb-6">
                    Our Mission
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    To provide authentic, safe, and unforgettable desert
                    experiences that showcase the rich culture and natural
                    beauty of the Arabian Peninsula. We are committed to
                    preserving Emirati traditions while creating magical
                    memories for travelers from around the world.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-8">
                    <Shield className="w-12 h-12 text-desert-gold mb-4" />
                    <h3 className="text-2xl font-bold text-desert-night mb-4">
                      Safety Standards
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• All vehicles undergo daily safety inspections</li>
                      <li>• Licensed and experienced professional drivers</li>
                      <li>• First aid trained guides on every tour</li>
                      <li>• Comprehensive insurance coverage</li>
                      <li>• 24/7 emergency support team</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <Award className="w-12 h-12 text-desert-gold mb-4" />
                    <h3 className="text-2xl font-bold text-desert-night mb-4">
                      Certifications
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>• Dubai Department of Tourism licensed</li>
                      <li>• ISO 9001:2015 Quality Management</li>
                      <li>• Dubai Municipality approved</li>
                      <li>• TripAdvisor Certificate of Excellence</li>
                      <li>• World Travel Awards nominee</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team">
              <div className="grid md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <Card
                    key={index}
                    className="text-center border-0 shadow-warm"
                  >
                    <CardContent className="p-8">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-bold text-desert-night mb-2">
                        {member.name}
                      </h3>
                      <p className="text-desert-gold font-semibold mb-4">
                        {member.role}
                      </p>
                      <p className="text-muted-foreground">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sustainability">
              <Card>
                <CardContent className="p-12">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-desert-night mb-4">
                      Environmental Responsibility
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We are committed to preserving the desert ecosystem for
                      future generations while providing unforgettable
                      experiences.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-bold text-desert-night mb-4">
                        Our Initiatives
                      </h4>
                      <ul className="space-y-3 text-muted-foreground">
                        <li>• Zero-waste policy in desert camps</li>
                        <li>• Solar-powered camp facilities</li>
                        <li>• Local community employment</li>
                        <li>• Wildlife conservation support</li>
                        <li>• Sustainable tourism practices</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-desert-night mb-4">
                        Conservation Efforts
                      </h4>
                      <ul className="space-y-3 text-muted-foreground">
                        <li>• Desert flora restoration projects</li>
                        <li>• Educational programs for guests</li>
                        <li>• Partnership with Emirates Wildlife Society</li>
                        <li>• Minimal impact tourism guidelines</li>
                        <li>• Annual environmental audits</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-sunset">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for Your Desert Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have experienced the magic
            of the Arabian desert with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: +971 50 113 1852
            </Button>
            <Button variant="outline-light" size="lg">
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
