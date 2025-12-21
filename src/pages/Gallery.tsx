import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image, Play, X } from "lucide-react";
import { contentApi, IMAGE_BASE_URL } from "@/lib/api";
import { useStructuredData, generatePageBreadcrumbSchema } from "@/hooks/useStructuredData";

const BASE_URL = "https://desert-safaridubai.ae";

interface GalleryItem {
  id: number;
  title: string;
  image_path: string;
  video_url?: string;
  category: string;
  description?: string;
}

const Gallery = () => {
  // Add breadcrumb schema
  useStructuredData({
    data: generatePageBreadcrumbSchema(
      [{ name: "Gallery", url: `${BASE_URL}/gallery` }],
      BASE_URL
    ),
    id: "breadcrumb-schema",
  });
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const type = selectedCategory === "all" ? undefined : selectedCategory;
      const response = await contentApi.getGallery(type);
      setGalleryItems(response.data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "All Media" },
    { id: "safari", label: "Desert Safari" },
    { id: "activities", label: "Activities" },
    { id: "food", label: "Traditional Food" },
    { id: "culture", label: "Culture & Shows" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore breathtaking moments from our desert safari adventures
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 h-auto mb-8 md:mb-12">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs sm:text-sm py-2"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden border-0 shadow-warm hover:shadow-elegant transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          item.image_path
                            ? `${IMAGE_BASE_URL}${item.image_path}`
                            : "/placeholder.svg"
                        }
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        {item.video_url ? (
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        ) : (
                          <Image className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-semibold">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-desert-night mb-2">
                  No media found
                </h3>
                <p className="text-muted-foreground">
                  Check back later for more amazing content.
                </p>
              </div>
            )}
          </Tabs>
        </div>
      </section>

      {/* Media Modal */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
            </DialogHeader>

            <div className="relative">
              {selectedItem.video_url ? (
                <video
                  controls
                  className="w-full h-auto max-h-[70vh] object-contain"
                  poster={
                    selectedItem.image_path
                      ? `${IMAGE_BASE_URL}${selectedItem.image_path}`
                      : undefined
                  }
                >
                  <source src={selectedItem.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={
                    selectedItem.image_path
                      ? `${IMAGE_BASE_URL}${selectedItem.image_path}`
                      : "/placeholder.svg"
                  }
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              )}
            </div>

            {selectedItem.description && (
              <div className="mt-4">
                <p className="text-muted-foreground">
                  {selectedItem.description}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
