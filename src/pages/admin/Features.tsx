import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminFeaturesApi, TourFeature, IMAGE_BASE_URL } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import MediaPicker from "@/components/admin/MediaPicker";

const AdminFeatures = () => {
  const [features, setFeatures] = useState<TourFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<TourFeature | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    position: "",
    creationDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const response = await adminFeaturesApi.getAll();
      if (response.success) {
        setFeatures(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load features",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Feature name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Feature image is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        name: formData.name,
        image: formData.image,
        position: formData.position ? parseInt(formData.position) : null,
        creationDate: formData.creationDate,
      };

      if (selectedFeature) {
        const response = await adminFeaturesApi.update(
          selectedFeature.id,
          data
        );
        if (response.success) {
          toast({
            title: "Success",
            description: "Feature updated successfully",
          });
        }
      } else {
        const response = await adminFeaturesApi.create(data);
        if (response.success) {
          toast({
            title: "Success",
            description: "Feature created successfully",
          });
        }
      }

      setDialogOpen(false);
      resetForm();
      loadFeatures();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          selectedFeature ? "update" : "create"
        } feature`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (feature: TourFeature) => {
    setSelectedFeature(feature);
    setFormData({
      name: feature.name,
      image: feature.image,
      position: feature.position?.toString() || "",
      creationDate: feature.creationDate
        ? new Date(feature.creationDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await adminFeaturesApi.delete(deleteId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Feature deleted successfully",
        });
        loadFeatures();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete feature",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      position: "",
      creationDate: new Date().toISOString().split("T")[0],
    });
    setSelectedFeature(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleImageSelect = (imagePath: string) => {
    setFormData({ ...formData, image: imagePath });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tour Features</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8">Loading features...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No features found. Create your first feature!
                  </TableCell>
                </TableRow>
              ) : (
                features.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell>
                      <img
                        src={`${IMAGE_BASE_URL}${feature.image}`}
                        alt={feature.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {feature.name}
                    </TableCell>
                    <TableCell>{feature.position || "-"}</TableCell>
                    <TableCell>
                      {new Date(feature.creationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(feature)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setDeleteId(feature.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFeature ? "Edit Feature" : "Add New Feature"}
            </DialogTitle>
            <DialogDescription>
              {selectedFeature
                ? "Update the feature details below"
                : "Fill in the details to create a new feature"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Feature Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Knowledgeable tour guide"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Feature Image *</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder={`${IMAGE_BASE_URL}${formData.image}`}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMediaPickerOpen(true)}
                >
                  Browse
                </Button>
              </div>
              {formData.image && (
                <img
                  src={`${IMAGE_BASE_URL}${formData.image}`}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position (Optional)</Label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="e.g., 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creationDate">Creation Date</Label>
              <Input
                id="creationDate"
                type="date"
                value={formData.creationDate}
                onChange={(e) =>
                  setFormData({ ...formData, creationDate: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedFeature ? "Update" : "Create"} Feature
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Media Picker */}
      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleImageSelect}
        currentImage={formData.image}
      />
    </div>
  );
};

export default AdminFeatures;
