import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { packageApi, blogApi } from "@/lib/api";
import {
  FileText,
  Home,
  Image,
  Mail,
  MapPin,
  BookOpen,
  Package,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface PackageType {
  id: number;
  pkgName: string;
}

interface Package {
  id: number;
  packagename: string;
  slug: string;
  packagetype: number;
}

interface Blog {
  id: number;
  blog_name: string;
  slug: string;
}

export default function Sitemap() {
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesData, packagesData, blogsData] = await Promise.all([
          packageApi.getTypes(),
          packageApi.getAll({ limit: 1000 }),
          blogApi.getAll({ limit: 1000 }),
        ]);

        setPackageTypes(typesData.data || []);
        setPackages(packagesData.data || []);
        setBlogs(blogsData.data || []);
      } catch (error) {
        console.error("Error fetching sitemap data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPackagesByType = (typeId: number) => {
    return packages.filter((pkg) => pkg.packagetype === typeId);
  };

  const mainPages = [
    { title: "Home", path: "/", icon: Home },
    { title: "Tours", path: "/tours", icon: MapPin },
    { title: "Blogs", path: "/blogs", icon: BookOpen },
    { title: "Gallery", path: "/gallery", icon: Image },
    { title: "About Us", path: "/about", icon: FileText },
    { title: "Contact Us", path: "/contact", icon: Mail },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-background to-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Sitemap
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Navigate through all pages and discover our complete collection of
              desert adventures
            </p>
          </div>

          {/* Main Pages */}
          <Card className="p-8 mb-8 border-2 hover:border-primary/50 transition-all duration-300 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-primary">
              <MapPin className="h-8 w-8" />
              Main Pages
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {mainPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="group flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 border border-border hover:border-primary/30"
                  >
                    <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {page.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Package Types with Packages */}
          <Card className="p-8 mb-8 border-2 hover:border-primary/50 transition-all duration-300 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-primary">
              <Package className="h-8 w-8" />
              Tour Packages
            </h2>
            <div className="space-y-8">
              {packageTypes.map((type) => {
                const typePackages = getPackagesByType(type.id);
                if (typePackages.length === 0) return null;

                return (
                  <div key={type.id} className="space-y-4">
                    <h3 className="text-2xl font-semibold text-foreground border-b-2 border-primary/20 pb-2">
                      {type.pkgName}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pl-4">
                      {typePackages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          to={`/tours/${pkg.slug}`}
                          className="group flex items-start gap-2 p-3 rounded-lg bg-muted/30 hover:bg-primary/10 transition-all duration-300 border border-border/50 hover:border-primary/30"
                        >
                          <div className="mt-1 h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors leading-relaxed">
                            {pkg.packagename}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Blog Posts */}
          {blogs.length > 0 && (
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 shadow-lg">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-primary">
                <BookOpen className="h-8 w-8" />
                Blog Posts
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.slug}`}
                    className="group flex items-start gap-2 p-3 rounded-lg bg-muted/30 hover:bg-primary/10 transition-all duration-300 border border-border/50 hover:border-primary/30"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors leading-relaxed">
                      {blog.blog_name}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
