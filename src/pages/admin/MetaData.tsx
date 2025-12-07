import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminMetaApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MetaData {
  id: number;
  page_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export default function MetaData() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState<MetaData | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-meta", search, page, limit, sort, order],
    queryFn: () =>
      adminMetaApi.getAll({
        search,
        limit,
        offset: (page - 1) * limit,
        sort,
        order,
      }),
  });

  const createMutation = useMutation({
    mutationFn: adminMetaApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-meta"] });
      toast.success("Meta data created successfully");
      setIsDialogOpen(false);
      setEditingMeta(null);
    },
    onError: () => {
      toast.error("Failed to create meta data");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      adminMetaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-meta"] });
      toast.success("Meta data updated successfully");
      setIsDialogOpen(false);
      setEditingMeta(null);
    },
    onError: () => {
      toast.error("Failed to update meta data");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      page_url: formData.get("page_url") as string,
      meta_title: formData.get("meta_title") as string,
      meta_description: formData.get("meta_description") as string,
      meta_keywords: formData.get("meta_keywords") as string,
      og_title: formData.get("og_title") as string,
      og_description: formData.get("og_description") as string,
      og_image: formData.get("og_image") as string,
      canonical_url: formData.get("canonical_url") as string,
    };

    if (editingMeta) {
      updateMutation.mutate({ id: editingMeta.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (meta: MetaData) => {
    setEditingMeta(meta);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingMeta(null);
    setIsDialogOpen(true);
  };

  const metaItems = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SEO Meta Data</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meta Data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMeta ? "Edit Meta Data" : "Add New Meta Data"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="page_url">Page URL *</Label>
                <Input
                  id="page_url"
                  name="page_url"
                  defaultValue={editingMeta?.page_url || ""}
                  placeholder="/tours/example-tour"
                  required
                />
              </div>

              <div>
                <Label htmlFor="meta_title">Meta Title *</Label>
                <Input
                  id="meta_title"
                  name="meta_title"
                  defaultValue={editingMeta?.meta_title || ""}
                  placeholder="Page Title - Under 60 characters"
                  required
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description *</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  defaultValue={editingMeta?.meta_description || ""}
                  placeholder="Description - Under 160 characters"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Textarea
                  id="meta_keywords"
                  name="meta_keywords"
                  defaultValue={editingMeta?.meta_keywords || ""}
                  placeholder="keyword1, keyword2, keyword3"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  name="og_title"
                  defaultValue={editingMeta?.og_title || ""}
                  placeholder="Open Graph Title for social sharing"
                />
              </div>

              <div>
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  name="og_description"
                  defaultValue={editingMeta?.og_description || ""}
                  placeholder="Open Graph description for social sharing"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  name="og_image"
                  defaultValue={editingMeta?.og_image || ""}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  name="canonical_url"
                  defaultValue={editingMeta?.canonical_url || ""}
                  placeholder="https://example.com/page"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingMeta ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingMeta(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by page URL, title, or keywords..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Updated Date</SelectItem>
              <SelectItem value="created_at">Created Date</SelectItem>
              <SelectItem value="page_url">Page URL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="order">Order</Label>
          <Select value={order} onValueChange={(v) => setOrder(v as "asc" | "desc")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page URL</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : metaItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No meta data found
                </TableCell>
              </TableRow>
            ) : (
              metaItems.map((meta: MetaData) => (
                <TableRow key={meta.id}>
                  <TableCell className="font-medium">{meta.page_url}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {meta.meta_title}
                  </TableCell>
                  <TableCell>
                    {new Date(meta.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(meta)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
