import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminBlogsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";
import MediaPicker from "@/components/admin/MediaPicker";

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

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [selectingField, setSelectingField] = useState<
    "featured" | "header" | null
  >(null);
  const [formData, setFormData] = useState({
    blog_name: "",
    category: "",
    featured_image: "",
    header_image: "",
    content: "",
  });

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await adminBlogsApi.getAll();
      const blog = response.data.find((b: Blog) => b.id === Number(id));

      if (blog) {
        setFormData({
          blog_name: blog.blog_name,
          category: blog.category,
          featured_image: blog.featured_image || "",
          header_image: blog.header_image || "",
          content: blog.content || "",
        });
      } else {
        toast({
          title: "Error",
          description: "Blog not found",
          variant: "destructive",
        });
        navigate("/admin/blogs");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch blog",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminBlogsApi.update(Number(id), formData);
      toast({
        title: "Success",
        description: "Blog updated successfully",
      });
      navigate("/admin/blogs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromMedia = (field: "featured" | "header") => {
    setSelectingField(field);
    setShowMediaPicker(true);
  };

  const handleMediaSelect = (path: string) => {
    if (selectingField === "featured") {
      setFormData({ ...formData, featured_image: path });
    } else if (selectingField === "header") {
      setFormData({ ...formData, header_image: path });
    }
    setShowMediaPicker(false);
    setSelectingField(null);
  };

  if (fetching) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/blogs")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Blog</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="blog_name">Title *</Label>
                <Input
                  id="blog_name"
                  value={formData.blog_name}
                  onChange={(e) =>
                    setFormData({ ...formData, blog_name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <div className="flex gap-2 items-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelectFromMedia("featured")}
                    className="flex-1"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select from Media
                  </Button>
                </div>
                {formData.featured_image && (
                  <div className="mt-2">
                    <img
                      src={`https://backend.desert-safaridubai.ae${
                        formData.featured_image.startsWith("/") ? "" : "/"
                      }${formData.featured_image}`}
                      alt="Featured preview"
                      className="h-32 w-auto rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Header Image</Label>
                <div className="flex gap-2 items-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelectFromMedia("header")}
                    className="flex-1"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select from Media
                  </Button>
                </div>
                {formData.header_image && (
                  <div className="mt-2">
                    <img
                      src={`https://backend.desert-safaridubai.ae${
                        formData.header_image.startsWith("/") ? "" : "/"
                      }${formData.header_image}`}
                      alt="Header preview"
                      className="h-32 w-auto rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/blogs")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Blog"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};

export default EditBlog;
