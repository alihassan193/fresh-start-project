import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { adminPackageTypesApi, PackageType, IMAGE_BASE_URL } from "@/lib/api";
import MediaPicker from "@/components/admin/MediaPicker";

const PackageTypes = () => {
  const navigate = useNavigate();
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PackageType | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pkgName: "",
    pkgImage: "",
  });

  useEffect(() => {
    fetchPackageTypes();
  }, []);

  const fetchPackageTypes = async () => {
    try {
      const response = await adminPackageTypesApi.getAll();
      if (response.success) {
        setPackageTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching package types:", error);
      toast.error("Failed to load package types");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type?: PackageType) => {
    if (type) {
      setSelectedType(type);
      setFormData({
        pkgName: type.pkgName,
        pkgImage: type.pkgImage,
      });
    } else {
      setSelectedType(null);
      setFormData({
        pkgName: "",
        pkgImage: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedType(null);
    setFormData({
      pkgName: "",
      pkgImage: "",
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.pkgName.trim()) {
        toast.error("Please enter a package type name");
        return;
      }

      if (!formData.pkgImage) {
        toast.error("Please select an image");
        return;
      }

      setSubmitting(true);
      if (selectedType) {
        const response = await adminPackageTypesApi.update(
          selectedType.id,
          formData
        );
        if (response.success) {
          toast.success("Package type updated successfully");
          fetchPackageTypes();
          handleCloseDialog();
        }
      } else {
        const response = await adminPackageTypesApi.create(formData);
        if (response.success) {
          toast.success("Package type created successfully");
          fetchPackageTypes();
          handleCloseDialog();
        }
      }
    } catch (error) {
      console.error("Error saving package type:", error);
      toast.error("Failed to save package type");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const response = await adminPackageTypesApi.delete(deleteId);
      if (response.success) {
        toast.success("Package type deleted successfully");
        fetchPackageTypes();
      }
    } catch (error) {
      console.error("Error deleting package type:", error);
      toast.error("Failed to delete package type");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleImageSelect = (imagePath: string) => {
    setFormData({ ...formData, pkgImage: imagePath });
    setIsMediaPickerOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Package Types</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Package Type
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packageTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No package types found
                  </TableCell>
                </TableRow>
              ) : (
                packageTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>{type.id}</TableCell>
                    <TableCell>
                      {type.pkgImage && (
                        <img
                          src={`${IMAGE_BASE_URL}${type.pkgImage}`}
                          alt={type.pkgName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {type.pkgName}
                    </TableCell>
                    <TableCell>
                      {new Date(type.creationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(type)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(type.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedType ? "Edit Package Type" : "Add Package Type"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pkgName">Package Type Name *</Label>
              <Input
                id="pkgName"
                value={formData.pkgName}
                onChange={(e) =>
                  setFormData({ ...formData, pkgName: e.target.value })
                }
                placeholder="Enter package type name"
              />
            </div>

            <div>
              <Label>Image *</Label>
              <div className="space-y-2">
                {formData.pkgImage && (
                  <img
                    src={`${IMAGE_BASE_URL}${formData.pkgImage}`}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="w-full"
                >
                  {formData.pkgImage ? "Change Image" : "Select Image"}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : selectedType ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleImageSelect}
        currentImage={formData.pkgImage}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              package type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PackageTypes;
