import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Tag,
  DollarSign,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { packageApi, Package, ApiResponse, IMAGE_BASE_URL } from "@/lib/api";
import {
  useStructuredData,
  generateItemListSchema,
  generatePageBreadcrumbSchema,
} from "@/hooks/useStructuredData";

const BASE_URL = "https://desert-safaridubai.ae";

interface PackageType {
  id: number;
  pkgName: string;
  pkgImage: string;
  creationDate: string;
}

const Tours = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    packagetype: "all",
    minPrice: "",
    maxPrice: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchPackageTypes();
    // Get packagetype from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const packagetypeFromUrl = urlParams.get("packagetype");
    if (packagetypeFromUrl && filters.packagetype === "all") {
      setFilters((prev) => ({ ...prev, packagetype: packagetypeFromUrl }));
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  // Add structured data for carousel/item list
  useStructuredData({
    data: generateItemListSchema(packages, BASE_URL),
    id: "tours-itemlist-schema",
  });

  // Add breadcrumb schema
  useStructuredData({
    data: generatePageBreadcrumbSchema(
      [{ name: "Tours", url: `${BASE_URL}/tours` }],
      BASE_URL
    ),
    id: "breadcrumb-schema",
  });

  const fetchPackageTypes = async () => {
    try {
      const response = await packageApi.getTypes();
      setPackageTypes(response.data);
    } catch (error) {
      console.error("Error fetching package types:", error);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const apiFilters = {
        ...filters,
        packagetype:
          filters.packagetype === "all" ? undefined : filters.packagetype,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
      };
      const response: ApiResponse<Package[]> = await packageApi.getAll(
        apiFilters
      );
      setPackages(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? Number(value) : 1, // ✅ Keep page when changing page
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 ">
        <div className="container mx-auto  text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tours And Attractions
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover authentic Arabian adventures with our curated collection of
            desert safari and many other experiences
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 md:py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 md:gap-4">
            {/* Search Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50 bg-background">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Search Tours</h4>
                  <Input
                    placeholder="Search tours..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* Tour Type Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50 bg-background">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tour Type</h4>
                  <Select
                    value={filters.packagetype}
                    onValueChange={(value) =>
                      handleFilterChange("packagetype", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tour Type" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background">
                      <SelectItem value="all">All Types</SelectItem>
                      {packageTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.pkgName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>

            {/* Price Range Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <DollarSign className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50 bg-background">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Price Range (AED)</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Min Price (AED)"
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Max Price (AED)"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="pb-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : packages.length > 0 ? (
            <>
              {/* <h2 className="text-2xl md:text-4xl font-bold mb-6">Tours :</h2> */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="group overflow-hidden border-0 shadow-warm hover:shadow-elegant transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <a href={`/tours/${pkg.slug}`}>
                        {" "}
                        <img
                          src={
                            pkg.packagefeatureimage
                              ? `${IMAGE_BASE_URL}${pkg.packagefeatureimage}`
                              : "/placeholder.svg"
                          }
                          alt={pkg.packagename}
                          className="w-full h-64 object-cover object-bottom group-hover:scale-110 transition-transform duration-500"
                        />
                      </a>
                      {pkg.featured === "yes" && (
                        <div className="absolute top-4 left-4 bg-desert-sunset text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      )}
                      {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-desert-gold fill-current" />
                          <span className="text-sm font-semibold">4.8</span>
                        </div>
                      </div> */}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-desert-night mb-2">
                        <a href={`/tours/${pkg.slug}`}> {pkg.packagename} </a>
                      </h3>
                      <p className="text-muted-foreground mb-4 min-h-[100px]">
                        {pkg.packagedescription}
                      </p>

                      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>Starting from</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{pkg.packagefeatures2}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-3xl font-bold text-desert-sunset">
                            {pkg.packageprice} AED
                          </span>
                          <span className="text-muted-foreground font-bold">
                            {" "}
                            / Person
                          </span>
                        </div>
                        <Link to={`/tours/${pkg.slug}`}>
                          <Button variant="desert">Book Now</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      onClick={() =>
                        handleFilterChange("page", page.toString())
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-desert-night mb-2">
                No tours found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tours;
