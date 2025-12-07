import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminBlogsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Eye, Edit, Plus } from "lucide-react";

interface Blog {
  id: number;
  blog_name: string;
  slug: string;
  category: string;
  featured_image: string;
  header_image?: string;
  content: string;
  created_at: string;
}

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await adminBlogsApi.getAll();
      if (response.success) {
        setBlogs(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (blog: Blog) => {
    setViewingBlog(blog);
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <Button onClick={() => navigate("/admin/blogs/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.blog_name}</TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>{blog.slug}</TableCell>
                  <TableCell>
                    {new Date(blog.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(blog)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Blog</DialogTitle>
          </DialogHeader>
          {viewingBlog && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Title</h3>
                <p>{viewingBlog.blog_name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Category</h3>
                <p>{viewingBlog.category}</p>
              </div>
              {viewingBlog.featured_image && (
                <div>
                  <h3 className="font-semibold mb-1">Featured Image</h3>
                  <img
                    src={`https://backend.desert-safaridubai.ae${
                      viewingBlog.featured_image.startsWith("/") ? "" : "/"
                    }${viewingBlog.featured_image}`}
                    alt="Featured"
                    className="max-w-md rounded border"
                  />
                </div>
              )}
              {viewingBlog.header_image && (
                <div>
                  <h3 className="font-semibold mb-1">Header Image</h3>
                  <img
                    src={`https://backend.desert-safaridubai.ae${
                      viewingBlog.header_image.startsWith("/") ? "" : "/"
                    }${viewingBlog.header_image}`}
                    alt="Header"
                    className="max-w-md rounded border"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-1">Content</h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: viewingBlog.content }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blogs;
