import { useState, useEffect } from "react";
import { adminTripAdvisorApi, TripAdvisorReview } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function TripAdvisorReviews() {
  const [reviews, setReviews] = useState<TripAdvisorReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<TripAdvisorReview | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    author_name: "",
    author_location: "",
    rating: 5,
    review_date: "",
    review_title: "",
    review_content: "",
    is_featured: 1,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await adminTripAdvisorApi.getAll();
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch TripAdvisor reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await adminTripAdvisorApi.update(editingReview.id, formData);
        toast({ title: "Success", description: "Review updated successfully" });
      } else {
        await adminTripAdvisorApi.create(formData);
        toast({ title: "Success", description: "Review created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save review",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await adminTripAdvisorApi.delete(id);
      toast({ title: "Success", description: "Review deleted successfully" });
      fetchReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (review: TripAdvisorReview) => {
    setEditingReview(review);
    setFormData({
      author_name: review.author_name,
      author_location: review.author_location || "",
      rating: review.rating,
      review_date: review.review_date || "",
      review_title: review.review_title || "",
      review_content: review.review_content,
      is_featured: review.is_featured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      author_name: "",
      author_location: "",
      rating: 5,
      review_date: "",
      review_title: "",
      review_content: "",
      is_featured: 1,
    });
    setEditingReview(null);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TripAdvisor Reviews</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingReview ? "Edit Review" : "Add New TripAdvisor Review"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author_location">Location</Label>
                  <Input
                    id="author_location"
                    placeholder="e.g., New York, USA"
                    value={formData.author_location}
                    onChange={(e) => setFormData({ ...formData, author_location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="review_date">Review Date</Label>
                  <Input
                    id="review_date"
                    type="date"
                    value={formData.review_date}
                    onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="review_title">Review Title</Label>
                <Input
                  id="review_title"
                  placeholder="e.g., Amazing Desert Experience!"
                  value={formData.review_title}
                  onChange={(e) => setFormData({ ...formData, review_title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="review_content">Review Content</Label>
                <Textarea
                  id="review_content"
                  rows={5}
                  value={formData.review_content}
                  onChange={(e) => setFormData({ ...formData, review_content: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured === 1}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked ? 1 : 0 })}
                />
                <Label htmlFor="is_featured">Show on Homepage</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingReview ? "Update Review" : "Create Review"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All TripAdvisor Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.author_name}</TableCell>
                  <TableCell>{review.author_location}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="line-clamp-1">{review.review_title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${review.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {review.is_featured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(review)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No reviews yet. Add your first TripAdvisor review!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
