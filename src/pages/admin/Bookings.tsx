import { useEffect, useState } from "react";
import { adminBookingsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { toast } = useToast();

  const loadBookings = () => {
    setIsLoading(true);
    adminBookingsApi
      .getAll({ 
        page, 
        limit: 10,
        status: statusFilter,
        date: dateFilter
      })
      .then((response) => {
        if (response.success) {
          setBookings(response.data);
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages);
            setTotal(response.pagination.total);
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, [page, statusFilter, dateFilter]);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const response = await adminBookingsApi.updateStatus(bookingId, newStatus);
      if (response.success) {
        toast({
          title: "Success",
          description: "Booking status updated successfully",
        });
        loadBookings();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    }
  };

  const viewBookingDetails = async (bookingId: number) => {
    try {
      const response = await adminBookingsApi.getById(bookingId);
      if (response.success) {
        setSelectedBooking(response.data);
        setIsDialogOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bookings</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value === "all" ? "" : value);
                setPage(1);
              }}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-filter">Tour Date</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("");
                  setDateFilter("");
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({total})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p>Loading bookings...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>{booking.first_name} {booking.last_name}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.packagename}</TableCell>
                    <TableCell>{new Date(booking.tour_date).toLocaleDateString()}</TableCell>
                    <TableCell>AED {booking.total_price}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewBookingDetails(booking.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} total bookings)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Booking ID</Label>
                  <p className="font-medium">#{selectedBooking.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p>{selectedBooking.first_name} {selectedBooking.last_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p>{selectedBooking.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p>{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">WhatsApp</Label>
                    <p>{selectedBooking.whatsapp || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Package</Label>
                    <p>{selectedBooking.packagename}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Deal</Label>
                    <p>{selectedBooking.deal_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tour Date</Label>
                    <p>{new Date(selectedBooking.tour_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Booking Date</Label>
                    <p>{new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Adults</Label>
                    <p>{selectedBooking.adults}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Infants</Label>
                    <p>{selectedBooking.infants || 0}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Base Price</Label>
                    <p>AED {selectedBooking.base_price}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Addons Total</Label>
                    <p>AED {selectedBooking.addons_total || 0}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Price</Label>
                    <p className="font-bold text-lg">AED {selectedBooking.total_price}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.addons && selectedBooking.addons.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Addons</h3>
                  <div className="space-y-2">
                    {selectedBooking.addons.map((addon: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{addon.addon_name} x {addon.quantity}</span>
                        <span>AED {addon.total_price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBooking.special_requests && (
                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">Special Requests</Label>
                  <p>{selectedBooking.special_requests}</p>
                </div>
              )}

              <div className="border-t pt-4 text-sm text-muted-foreground">
                <p>Created: {new Date(selectedBooking.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
