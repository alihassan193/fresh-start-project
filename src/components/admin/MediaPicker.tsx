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
import { Upload, Search, Check } from "lucide-react";
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

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imagePath: string) => void;
  currentImage?: string;
}

export default function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  currentImage,
}: MediaPickerProps) {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [filteredImages, setFilteredImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(
    null
  );
  const [showUpload, setShowUpload] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const [uploadAltText, setUploadAltText] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");

  useEffect(() => {
    if (open) {
      fetchImages();
      setSelectedImagePath(currentImage || null);
    }
  }, [open, currentImage]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = images.filter(
        (img) =>
          img.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchQuery, images]);

  const fetchImages = async () => {
    try {
      const response = await adminMediaApi.getAll();
      if (response.success) {
        setImages(response.data);
        setFilteredImages(response.data);
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
        resetUploadForm();
        await fetchImages();
        // Auto-select the newly uploaded image
        setSelectedImagePath(response.data.file_path);
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

  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${BASE_URL}${path}`;
    return `${BASE_URL}/${path}`;
  };

  const handleSelectImage = () => {
    if (selectedImagePath) {
      onSelect(selectedImagePath);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowUpload(!showUpload)}
              variant={showUpload ? "secondary" : "outline"}
            >
              <Upload className="mr-2 h-4 w-4" />
              {showUpload ? "Hide Upload" : "Show Upload"}
            </Button>
          </div>

          {/* Upload Section */}
          {showUpload && (
            <Card className="mb-4 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upload-image">Select Image File *</Label>
                      <Input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>

                    <div>
                      <Label htmlFor="upload-title">Title</Label>
                      <Input
                        id="upload-title"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="Image title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="upload-alt">Alt Text</Label>
                      <Input
                        id="upload-alt"
                        value={uploadAltText}
                        onChange={(e) => setUploadAltText(e.target.value)}
                        placeholder="Alternative text for accessibility"
                      />
                    </div>

                    <div>
                      <Label htmlFor="upload-caption">Caption</Label>
                      <Textarea
                        id="upload-caption"
                        value={uploadCaption}
                        onChange={(e) => setUploadCaption(e.target.value)}
                        placeholder="Image caption (optional)"
                        rows={2}
                      />
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={uploading || !uploadFile}
                      className="w-full"
                      size="lg"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>

                  {uploadPreview ? (
                    <div className="flex items-center justify-center">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden max-w-full w-full">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden max-w-full w-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center p-6">
                          <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">
                            Image preview will appear here
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.map((image) => (
                  <Card
                    key={image.id}
                    className={`cursor-pointer transition-all overflow-hidden ${
                      selectedImagePath === image.file_path
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedImagePath(image.file_path)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted relative overflow-hidden">
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
                        {selectedImagePath === image.file_path && (
                          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">
                          {image.title || image.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {image.file_name}
                        </p>
                        {dimensions[image.id] && (
                          <p className="text-xs text-muted-foreground">
                            {dimensions[image.id].width} ×{" "}
                            {dimensions[image.id].height}
                            px
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredImages.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    {searchQuery
                      ? "No images found matching your search"
                      : "No images uploaded yet"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelectImage} disabled={!selectedImagePath}>
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
