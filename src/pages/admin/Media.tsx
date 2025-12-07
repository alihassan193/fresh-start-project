import { useState, useEffect } from "react";
import { adminMediaApi } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Edit2, Copy, Image as ImageIcon } from "lucide-react";
import { BASE_URL } from "@/lib/api";

interface MediaItem {
  id: number;
  file_name: string;
  file_path: string;
  alt_text: string | null;
  title: string | null;
  caption: string | null;
  upload_date: string;
}

export default function Media() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const [uploadAltText, setUploadAltText] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");

  // Edit form state
  const [editAltText, setEditAltText] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await adminMediaApi.getAll();
      if (response.success) {
        setImages(response.data);
      }
    } catch (error) {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };
  const [dimensions, setDimensions] = useState({});

  const handleImageLoad = (e, id) => {
    const { naturalWidth, naturalHeight } = e.target;
    setDimensions((prev) => ({
      ...prev,
      [id]: { width: naturalWidth, height: naturalHeight },
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select an image");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadFile);
      formData.append("alt_text", uploadAltText);
      formData.append("title", uploadTitle);
      formData.append("caption", uploadCaption);

      const response = await adminMediaApi.upload(formData);
      if (response.success) {
        toast.success("Image uploaded successfully");
        setUploadDialogOpen(false);
        resetUploadForm();
        fetchImages();
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadPreview("");
    setUploadAltText("");
    setUploadTitle("");
    setUploadCaption("");
  };

  const handleEditClick = (image: MediaItem) => {
    setSelectedImage(image);
    setEditAltText(image.alt_text || "");
    setEditTitle(image.title || "");
    setEditCaption(image.caption || "");
    setEditDialogOpen(true);
  };

  const handleUpdateMetadata = async () => {
    if (!selectedImage) return;

    try {
      const response = await adminMediaApi.updateMetadata(selectedImage.id, {
        alt_text: editAltText,
        title: editTitle,
        caption: editCaption,
      });

      if (response.success) {
        toast.success("Image metadata updated successfully");
        setEditDialogOpen(false);
        fetchImages();
      }
    } catch (error) {
      toast.error("Failed to update metadata");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Path copied to clipboard");
  };

  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${BASE_URL}${path}`;
    return `${BASE_URL}/${path}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your uploaded images</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={getImageUrl(image.file_path)}
                  alt={image.alt_text || image.file_name}
                  className="w-full h-full object-cover"
                  onLoad={(e) => handleImageLoad(e, image.id)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditClick(image)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(image.file_path)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="font-medium text-sm truncate">
                  {image.file_name}
                </p>
                {image.title && (
                  <p className="text-xs text-muted-foreground truncate">
                    {image.title}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(image.upload_date).toLocaleDateString()}
                </p>
                {dimensions[image.id] && (
                  <p className="text-xs text-muted-foreground">
                    {dimensions[image.id].width} × {dimensions[image.id].height}
                    px
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-4" />
            <p>No images uploaded yet</p>
          </div>
        )}
      </div>
      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Image File</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {uploadPreview && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={uploadPreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Image title"
              />
            </div>

            <div>
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input
                id="alt_text"
                value={uploadAltText}
                onChange={(e) => setUploadAltText(e.target.value)}
                placeholder="Alternative text for accessibility"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Image caption"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || !uploadFile}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image Metadata</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(selectedImage.file_path)}
                  alt={selectedImage.alt_text || selectedImage.file_name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <Label>File Name</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedImage.file_name}
                </p>
              </div>

              <div>
                <Label htmlFor="edit_title">Title</Label>
                <Input
                  id="edit_title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Image title"
                />
              </div>

              <div>
                <Label htmlFor="edit_alt_text">Alt Text</Label>
                <Input
                  id="edit_alt_text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="Alternative text for accessibility"
                />
              </div>

              <div>
                <Label htmlFor="edit_caption">Caption</Label>
                <Textarea
                  id="edit_caption"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Image caption"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMetadata}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
