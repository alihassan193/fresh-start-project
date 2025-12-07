import { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  adminPageContentApi,
  adminPackagesApi,
  PageContent,
  Package,
} from "@/lib/api";
import RichTextEditor from "@/components/admin/RichTextEditor";

const AdminPageContent = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: "",
    detail: "",
    package_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagesRes, packagesRes] = await Promise.all([
        adminPageContentApi.getAll(),
        adminPackagesApi.getAll({ page: 1, limit: 100 }),
      ]);

      if (pagesRes.success) {
        setPages(pagesRes.data);
      }
      if (packagesRes.success) {
        setPackages(packagesRes.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.package_id || !formData.detail) {
      toast({
        title: "Error",
        description: "Package and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const result = editingId
        ? await adminPageContentApi.update(editingId, {
            type: formData.type,
            detail: formData.detail,
            package_id: parseInt(formData.package_id),
          })
        : await adminPageContentApi.create({
            type: formData.type,
            detail: formData.detail,
            package_id: parseInt(formData.package_id),
          });

      if (result.success) {
        toast({
          title: "Success",
          description: `Page content ${editingId ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "create"} page content`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const result = await adminPageContentApi.delete(deleteId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Page content deleted successfully",
        });
        setDeleteId(null);
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page content",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      detail: "",
      package_id: "",
    });
    setEditingId(null);
  };

  const handleEdit = (page: PageContent) => {
    setFormData({
      type: page.type,
      detail: page.detail,
      package_id: page.package_id.toString(),
    });
    setEditingId(page.id);
    setIsDialogOpen(true);
  };

  const getPackageName = (packageId: number) => {
    const pkg = packages.find((p) => p.id === packageId);
    return pkg?.packagename || "Unknown Package";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Package Page Content</h1>
          <p className="text-muted-foreground">
            Manage additional content for package pages
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Page Content</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="package">Package *</Label>
                <Select
                  value={formData.package_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, package_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id.toString()}>
                        {pkg.packagename}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type (Optional)</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  placeholder="e.g., About, Description, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail">Content *</Label>
                <RichTextEditor
                  content={formData.detail}
                  onChange={(value) =>
                    setFormData({ ...formData, detail: value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update" : "Create")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No page content found</p>
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.id}</TableCell>
                  <TableCell>{getPackageName(page.package_id)}</TableCell>
                  <TableCell>
                    {page.type || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-md truncate text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: page.detail.substring(0, 100) + "...",
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(page.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the page
              content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPageContent;
