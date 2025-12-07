import { useState, useEffect } from "react";
import { adminGalleryApi, IMAGE_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

interface GalleryImage {
  id: number;
  image_path: string;
  image_name: string;
  description: string;
  created_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image_path: "",
    image_name: "",
    description: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await adminGalleryApi.getAll();
      if (response.success) {
        setImages(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminGalleryApi.upload(
        formData.image_path,
        formData.image_name,
        formData.description
      );
      toast({ title: "Success", description: "Image uploaded successfully" });
      setIsDialogOpen(false);
      resetForm();
      fetchGallery();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await adminGalleryApi.delete(id);
      toast({ title: "Success", description: "Image deleted successfully" });
      fetchGallery();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleMediaSelect = (imagePath: string) => {
    setFormData({ ...formData, image_path: imagePath });
    setShowMediaPicker(false);
  };

  const resetForm = () => {
    setFormData({
      image_path: "",
      image_name: "",
      description: "",
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Image</Label>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMediaPicker(true)}
                    className="w-full"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select Image from Media
                  </Button>
                  {formData.image_path && (
                    <div className="relative">
                      <img
                        src={`${IMAGE_BASE_URL}${formData.image_path}`}
                        alt="Selected"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="image_name">Image Name</Label>
                <Input
                  id="image_name"
                  value={formData.image_name}
                  onChange={(e) =>
                    setFormData({ ...formData, image_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Upload Image
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardHeader className="p-0">
              <img
                src={`${IMAGE_BASE_URL}${image.image_path}`}
                alt={image.image_name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-sm mb-2">{image.image_name}</CardTitle>
              {image.description && (
                <p className="text-xs text-muted-foreground mb-3">
                  {image.description}
                </p>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={handleMediaSelect}
        currentImage={formData.image_path}
      />
    </div>
  );
}
