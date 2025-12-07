import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { contentApi, type ContactSubmission } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
});

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    if (!turnstileToken) {
      toast({
        title: "Verification Required",
        description: "Please complete the security verification",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const contactData: ContactSubmission = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        subject: "Home Page Inquiry",
      };

      await contentApi.submitContact(contactData);

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      navigate("/thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-gradient-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-desert-night mb-3 md:mb-4">
            Ready for Your Adventure?
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Get in touch with our expert team to plan your perfect desert safari
            experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
          {/* Contact Info */}
          <div className="space-y-4 md:space-y-8">
            <Card className="border-0 shadow-warm">
              <CardContent className="p-4 md:p-8">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-sunset rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-xl font-semibold text-desert-night mb-1 md:mb-2">
                      Call Us
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                      Speak with our safari experts
                    </p>
                    <address className="not-italic">
                      <p
                        className="text-sm md:text-lg
  font-bold
  text-desert-sunset-text
  break-words"
                      >
                        <a href="tel:+971501131852" className="hover:underline">
                          {" "}
                          +971 50 113 1852
                        </a>
                      </p>
                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-warm">
              <CardContent className="p-4 md:p-8">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-sunset rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-xl font-semibold text-desert-night mb-1 md:mb-2">
                      Email Us
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                      Get detailed information
                    </p>
                    <address className="not-italic">
                      <p
                        className="text-sm md:text-lg
  font-bold
  text-desert-sunset-text
  break-words"
                      >
                        info@desert-safaridubai.ae
                      </p>
                    </address>
                    {/* <p className="text-sm md:text-lg font-semibold text-desert-sunset break-words">
                      bookings@desertsafari.ae
                    </p> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-warm">
              <CardContent className="p-4 md:p-8">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-sunset rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-xl font-semibold text-desert-night mb-1 md:mb-2">
                      Visit Us
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                      Our office location
                    </p>
                    <p className="text-sm md:text-lg text-desert-night break-words">
                      Dubai Marina, Sheikh Zayed Road
                    </p>
                    <p className="text-sm md:text-lg text-desert-night break-words">
                      Dubai, UAE
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-warm">
              <CardContent className="p-4 md:p-8">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-sunset rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-xl font-semibold text-desert-night mb-1 md:mb-2">
                      Operating Hours
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                      We're here to help
                    </p>
                    <p className="text-sm md:text-lg text-desert-night break-words">
                      Daily: 8:00 AM - 10:00 PM
                    </p>
                    <p className="text-sm md:text-lg text-desert-night break-words">
                      24/7 Emergency Support
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-warm">
            <CardContent className="p-4 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-desert-night mb-4 md:mb-6">
                Send us a Message
              </h3>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 md:space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            id={field.name}
                            placeholder="Your full name"
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormDescription>
                          Please enter your full name.
                        </FormDescription>
                        {/* ✅ MUST exist */}
                        <FormMessage className="min-h-[1rem]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+971 XX XXX XXXX"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your preferred safari experience, group size, special requirements..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    <Turnstile
                      siteKey="0x4AAAAAAB4OlF_f488aEhjm"
                      onSuccess={setTurnstileToken}
                      onError={() => console.error("Turnstile failed to load")}
                      onExpire={() => setTurnstileToken("")}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="desert"
                    size="lg"
                    className="w-full text-lg"
                    disabled={isSubmitting}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
