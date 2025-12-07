import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Download, Share2 } from "lucide-react";
import { bookingApi, BookingDetails } from "@/lib/api";

// Use BookingDetails interface from API

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getById(id!);
      setBooking(response.data);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-desert-night mb-4">Booking Not Found</h1>
            <p className="text-muted-foreground mb-8">The booking you're looking for doesn't exist.</p>
            <Link to="/">
              <Button variant="desert">Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Success Header */}
      <section className="pt-32 pb-16 bg-gradient-sand">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-desert-night mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thank you for choosing Desert Safari Dubai. Your adventure awaits!
          </p>
        </div>
      </section>

      {/* Booking Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Booking Card */}
              <div className="lg:col-span-2">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-2xl text-desert-night">
                      Booking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Booking ID */}
                    <div className="flex justify-between items-center p-4 bg-gradient-sand rounded-lg">
                      <span className="font-semibold">Booking ID:</span>
                      <span className="text-desert-sunset font-bold">#{booking.id || id}</span>
                    </div>

                    {/* Package Info */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-desert-night">
                        {booking.packagename}
                      </h3>
                      <div className="text-sm text-muted-foreground mb-4">
                        Deal: {booking.deal_name}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-desert-gold" />
                          <div>
                            <div className="font-semibold">Tour Date</div>
                            <div className="text-muted-foreground">
                              {new Date(booking.tour_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-desert-gold" />
                          <div>
                            <div className="font-semibold">Guests</div>
                            <div className="text-muted-foreground">
                              {booking.adults} Adults, {booking.children} Children, {booking.infants} Infants
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-bold text-desert-night mb-4">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold">Name</div>
                          <div className="text-muted-foreground">{booking.first_name} {booking.last_name}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Email</div>
                          <div className="text-muted-foreground">{booking.email}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Phone</div>
                          <div className="text-muted-foreground">{booking.phone}</div>
                        </div>
                        <div>
                          <div className="font-semibold">WhatsApp</div>
                          <div className="text-muted-foreground">{booking.whatsapp}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Status</div>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-bold text-desert-night mb-2">Special Requests</h4>
                        <p className="text-muted-foreground">{booking.special_requests}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Summary */}
                <Card className="shadow-warm">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Base Price:</span>
                        <span>${booking.base_price}</span>
                      </div>
                      {booking.addons.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Add-ons:</span>
                          <span>${booking.addons_total}</span>
                        </div>
                      )}
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span className="font-bold">Total Amount</span>
                        <span className="font-bold text-desert-sunset text-lg">
                          ${booking.total_price}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Payment will be collected at the venue
                      </div>
                    </div>

                    {booking.addons.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Add-ons Selected</h4>
                        <div className="space-y-1">
                          {booking.addons.map((addon) => (
                            <div key={addon.id} className="flex justify-between text-sm">
                              <span>{addon.addon_name} ({addon.quantity}x)</span>
                              <span>${addon.total_price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <Button variant="desert" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Voucher
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Booking
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* What's Next */}
                <Card className="shadow-warm">
                  <CardHeader>
                    <CardTitle>What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-desert-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <div>
                        <div className="font-semibold">Confirmation Email</div>
                        <div className="text-sm text-muted-foreground">
                          Check your email for detailed booking information
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-desert-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <div>
                        <div className="font-semibold">Pickup Details</div>
                        <div className="text-sm text-muted-foreground">
                          We'll contact you 24 hours before with pickup time
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-desert-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div>
                        <div className="font-semibold">Enjoy Your Adventure</div>
                        <div className="text-sm text-muted-foreground">
                          Get ready for an unforgettable desert experience
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="shadow-warm">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      +971 50 113 1852
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      support@desertsafari.com
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;