import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";
import { blogApi, Blog, IMAGE_BASE_URL } from "@/lib/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    page: 1
  });

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const apiFilters = {
        ...filters,
        category: filters.category === "all" ? undefined : filters.category,
      };
      const response = await blogApi.getAll(apiFilters);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Desert Safari Blog
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover stories, tips, and insights about desert adventures in Dubai
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 md:py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                className="pl-10 text-sm"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tips">Travel Tips</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ search: "", category: "all", page: 1 })}
              className="sm:col-span-2 md:col-span-1 text-sm"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card key={blog.id} className="group overflow-hidden border-0 shadow-warm hover:shadow-elegant transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.featured_image ? `${IMAGE_BASE_URL}${blog.featured_image}` : "/placeholder.svg"}
                      alt={blog.blog_name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="bg-desert-sand text-desert-night px-2 py-0.5 rounded-full text-xs">
                        {blog.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-desert-night mb-2 sm:mb-3 group-hover:text-desert-sunset transition-colors line-clamp-2">
                      {blog.blog_name}
                    </h3>
                    
                     <div 
                      className="text-muted-foreground mb-3 sm:mb-4 line-clamp-3 text-xs sm:text-sm"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    <Link to={`/blogs/${blog.slug}`}>
                      <Button variant="outline" className="w-full text-sm group-hover:bg-desert-gold group-hover:border-desert-gold group-hover:text-white transition-colors">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-desert-night mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;