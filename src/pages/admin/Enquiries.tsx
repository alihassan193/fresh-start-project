import { useState, useEffect } from "react";
import { adminEnquiriesApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: number;
  created_at: string;
}

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await adminEnquiriesApi.getAll();
      if (response.success) {
        setEnquiries(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch enquiries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: number) => {
    try {
      await adminEnquiriesApi.updateStatus(id, status);
      toast({ title: "Success", description: "Status updated successfully" });
      fetchEnquiries();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enquiries</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="font-medium">{enquiry.name}</TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell>{enquiry.phone}</TableCell>
                  <TableCell>{enquiry.subject || "No subject"}</TableCell>
                  <TableCell className="max-w-xs truncate">{enquiry.message}</TableCell>
                  <TableCell>{new Date(enquiry.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={enquiry.status === 1 ? "default" : "secondary"}>
                      {enquiry.status === 1 ? "Resolved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {enquiry.status === 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(enquiry.id, 1)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(enquiry.id, 0)}
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
