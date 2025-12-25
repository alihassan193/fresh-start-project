import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { blogApi, Blog, IMAGE_BASE_URL } from "@/lib/api";
import { useStructuredData, generatePageBreadcrumbSchema, generateArticleSchema } from "@/hooks/useStructuredData";

const BASE_URL = "https://desert-safaridubai.ae";

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  // Add breadcrumb schema
  useStructuredData({
    data: generatePageBreadcrumbSchema(
      [
        { name: "Blog", url: `${BASE_URL}/blogs` },
        { name: blog?.blog_name || "Article", url: `${BASE_URL}/blogs/${slug}` },
      ],
      BASE_URL
    ),
    id: "breadcrumb-schema",
  });

  // Add Article schema for SEO
  useStructuredData({
    data: blog
      ? generateArticleSchema(
          {
            title: blog.blog_name,
            content: blog.content,
            slug: blog.slug,
            featuredImage: blog.featured_image,
            category: blog.category,
            createdAt: blog.created_at,
            updatedAt: blog.updated_at,
          },
          BASE_URL
        )
      : {},
    id: "article-schema",
  });

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getBySlug(slug!);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await blogApi.getAll({ limit: 3 });
      setRelatedBlogs(response.data.filter((b: Blog) => b.slug !== slug));
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-96 rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-desert-night mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blogs">
              <Button variant="desert">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/blogs" className="inline-flex items-center hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {blog.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {blog.blog_name}
              </h1>
              
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="relative mb-8">
              <img
                src={blog.featured_image ? `${IMAGE_BASE_URL}${blog.featured_image}` : "/placeholder.svg"}
                alt={blog.blog_name}
                className="w-full h-96 object-cover rounded-lg shadow-elegant"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose max-w-none prose-headings:font-bold prose-headings:text-desert-night prose-h1:text-xl prose-h1:mb-4 prose-h2:text-lg prose-h2:mb-4 prose-h3:text-lg prose-h3:mb-4 prose-p:text-sm prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-2 prose-li:text-sm prose-li:text-foreground prose-ul:space-y-2 prose-ol:space-y-2 [&_ul]:list-none [&_ol]:list-none [&_ul]:ml-0 [&_ol]:ml-0 [&_ul]:pl-0 [&_ol]:pl-0 [&_ul>li]:flex [&_ul>li]:items-start [&_ul>li]:gap-2 [&_ul>li]:before:content-[''] [&_ul>li]:before:w-1.5 [&_ul>li]:before:h-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-green-500 [&_ul>li]:before:mt-1.5 [&_ul>li]:before:flex-shrink-0 prose-strong:font-semibold prose-strong:text-desert-night prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-sm"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 bg-gradient-sand">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-desert-night mb-4">
                Related Articles
              </h2>
              <p className="text-muted-foreground">
                Discover more stories about desert adventures
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedBlogs.map((relatedBlog) => (
                <Card key={relatedBlog.id} className="group overflow-hidden border-0 shadow-warm hover:shadow-elegant transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedBlog.featured_image ? `${IMAGE_BASE_URL}${relatedBlog.featured_image}` : "/placeholder.svg"}
                      alt={relatedBlog.blog_name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-desert-night mb-2 group-hover:text-desert-sunset transition-colors line-clamp-2">
                      {relatedBlog.blog_name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(relatedBlog.created_at).toLocaleDateString()}</span>
                    </div>

                    <Link to={`/blogs/${relatedBlog.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetails;