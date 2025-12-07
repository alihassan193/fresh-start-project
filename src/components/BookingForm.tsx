import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Package, PackageDeal, packageDealsApi, bookingApi } from "@/lib/api";

interface BookingFormProps {
  package_: Package;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ package_, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [deals, setDeals] = useState<PackageDeal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<string>("");
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: number]: number;
  }>({});

  const [formData, setFormData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    specialRequests: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch package deals
  useEffect(() => {
    const fetchDeals = async () => {
      if (!package_) return;

      try {
        const response = await packageDealsApi.getByPackageId(package_.id);
        if (response.success) {
          setDeals(response.data);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
        toast({
          title: "Error",
          description: "Failed to load package deals",
          variant: "destructive",
        });
      }
    };

    fetchDeals();
  }, [package_, toast]);

  // Update guest count
  const updateGuestCount = (
    type: "adults" | "children" | "infants",
    increment: boolean
  ) => {
    setFormData((prev) => {
      const currentValue = prev[type];
      const newValue = increment
        ? currentValue + 1
        : Math.max(0, currentValue - 1);

      // Don't allow adults to go below 1
      if (type === "adults" && newValue < 1) return prev;

      return { ...prev, [type]: newValue };
    });
  };

  // Handle addon quantity change
  const updateAddonQuantity = (addonId: number, increment: boolean) => {
    setSelectedAddons((prev) => {
      const currentQuantity = prev[addonId] || 0;
      const newQuantity = increment
        ? currentQuantity + 1
        : Math.max(0, currentQuantity - 1);

      if (newQuantity === 0) {
        const { [addonId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [addonId]: newQuantity };
    });
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const selectedDealObj = deals.find(
      (deal) => deal.id.toString() === selectedDeal
    );
    if (!selectedDealObj) return 0;
    let adult_price = selectedDealObj.price * formData.adults;
    let children_price = selectedDealObj.price * formData.children;
    let basePrice = adult_price + children_price;

    // Add addon prices
    let addonTotal = 0;
    Object.entries(selectedAddons).forEach(([addonId, quantity]) => {
      const addon = package_?.addons?.find((a) => a.id === parseInt(addonId));
      if (addon) {
        addonTotal += parseFloat(addon.price) * quantity;
      }
    });

    return basePrice + addonTotal;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!selectedDate) {
        toast({
          title: "Date Required",
          description: "Please select a booking date",
          variant: "destructive",
        });
        return;
      }

      if (!selectedDeal) {
        toast({
          title: "Deal Required",
          description: "Please select a package deal",
          variant: "destructive",
        });
        return;
      }

      // Prepare addons array
      const addons = Object.entries(selectedAddons).map(
        ([addonId, quantity]) => ({
          addon_id: parseInt(addonId),
          quantity,
        })
      );

      const bookingData = {
        package_id: package_.id,
        deal_id: parseInt(selectedDeal),
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        special_requests: formData.specialRequests,
        addons,
      };

      const response = await bookingApi.create(bookingData);

      if (response.success) {
        toast({
          title: "Booking Confirmed!",
          description: "Your booking has been successfully created.",
        });

        // Navigate to confirmation page
        navigate(`/booking-confirmation/${response.data.booking_id}`);
        onClose();
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description:
          "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Book {package_.packagename}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Package Deal Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Package Deal</h3>
            <div className="grid gap-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-colors",
                    selectedDeal === deal.id.toString()
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  )}
                  onClick={() => setSelectedDeal(deal.id.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="deal"
                          value={deal.id}
                          checked={selectedDeal === deal.id.toString()}
                          onChange={() => setSelectedDeal(deal.id.toString())}
                          className="w-4 h-4 text-primary"
                        />
                        <h4 className="font-semibold text-lg">{deal.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium mt-1">
                        {deal.tagline}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {deal.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary">
                        {deal.price} AED
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per person
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Number of Guests</h3>

            {/* Adults */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Adults</div>
                {/* <div className="text-sm text-muted-foreground">Age 12+</div> */}
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount("adults", false)}
                  disabled={formData.adults <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">
                  {formData.adults}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount("adults", true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            {/* <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Children</div>
                <div className="text-sm text-muted-foreground">Age 4-11</div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount("children", false)}
                  disabled={formData.children <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">
                  {formData.children}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount("children", true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div> */}

            {/* Infants */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Infants</div>
                <div className="text-sm text-muted-foreground">Age 0-3</div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount("infants", false)}
                  disabled={formData.infants <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">
                  {formData.infants}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount("infants", true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          {package_?.addons && package_.addons.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add-ons</h3>
              {package_.addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{addon.name}</div>
                    <div className="text-sm font-bold text-muted-foreground">
                      {Math.round(Number(addon.price))} AED each
                    </div>
                    {addon.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {addon.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateAddonQuantity(addon.id, false)}
                      disabled={(selectedAddons[addon.id] || 0) <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {selectedAddons[addon.id] || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateAddonQuantity(addon.id, true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">WhatsApp (optional)</label>
              <Input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))
                }
                placeholder="Leave empty to use phone number"
                minLength={10}
                maxLength={15}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Special Requests</label>
              <Textarea
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specialRequests: e.target.value,
                  }))
                }
                placeholder="Any special requirements or requests and pickup address..."
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2">
              {selectedDeal &&
                (() => {
                  const deal = deals.find(
                    (d) => d.id.toString() === selectedDeal
                  );
                  const price = deal?.price || 0;

                  return (
                    <>
                      <div className="flex justify-between">
                        <span>Package ({formData.adults} adults):</span>
                        <span>{price * formData.adults} AED</span>
                      </div>

                      {formData.children > 0 && (
                        <div className="flex justify-between">
                          <span>Package ({formData.children} children):</span>
                          <span>{price * formData.children} AED</span>
                        </div>
                      )}
                    </>
                  );
                })()}

              {Object.entries(selectedAddons).map(([addonId, quantity]) => {
                const addon = package_?.addons?.find(
                  (a) => a.id === parseInt(addonId)
                );
                if (!addon) return null;
                return (
                  <div key={addonId} className="flex justify-between">
                    <span>
                      {addon.name} ({quantity}x):
                    </span>
                    <span>
                      {(parseFloat(addon.price) * quantity).toFixed(2)} AED
                    </span>
                  </div>
                );
              })}
              <hr className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">
                  {calculateTotalPrice().toFixed(2)} AED
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Price includes all activities and services mentioned in the
              package
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !selectedDeal || !selectedDate}
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
