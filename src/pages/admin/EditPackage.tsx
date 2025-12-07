import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  adminPackagesApi,
  packageApi,
  contentApi,
  adminDealsApi,
  IMAGE_BASE_URL,
  Deal,
} from "@/lib/api";
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface PackageType {
  id: number;
  pkgName: string;
}

interface TourFeature {
  id: number;
  name: string;
  image: string;
}

interface Addon {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface ContentSection {
  id?: number;
  content_heading: string;
  content_description: string;
}

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [tourFeatures, setTourFeatures] = useState<TourFeature[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [attachedDeals, setAttachedDeals] = useState<Deal[]>([]);

  const [formData, setFormData] = useState({
    packagename: "",
    packagetype: "",
    packagedescription: "",
    packageprice: "",
    headline: "",
    packagefeatures1: "",
    packagefeatures2: "",
    slug: "",
    status: "active",
    featured: "no",
    priority: 0,
  });

  const [images, setImages] = useState({
    packagemainimage: "",
    packagesideimage1: "",
    packagesideimage2: "",
    packagesideimage3: "",
    packagesideimage4: "",
    packagefeatureimage: "",
  });

  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>(
    {}
  );
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [selectedFaqs, setSelectedFaqs] = useState<number[]>([]);
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { content_heading: "", content_description: "" },
  ]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load package types
      const typesResponse = await packageApi.getTypes();
      if (typesResponse.success) {
        setPackageTypes(typesResponse.data);
      }

      // Load tour features
      const featuresResponse = await contentApi.getTourFeatures();
      if (featuresResponse.success) {
        setTourFeatures(featuresResponse.data);
      }

      // Load addons
      const addonsResponse = await contentApi.getAddons();
      if (addonsResponse.success) {
        setAddons(addonsResponse.data);
      }

      // Load FAQs
      const faqsResponse = await contentApi.getFAQs();
      if (faqsResponse.success) {
        setFaqs(faqsResponse.data);
      }

      // Load all deals
      const dealsResponse = await adminDealsApi.getAll();
      if (dealsResponse.success) {
        setAllDeals(dealsResponse.data);
      }

      // If editing, load package details
      if (id && id !== "new") {
        const packageResponse = await adminPackagesApi.getById(parseInt(id));
        if (packageResponse.success && packageResponse.data) {
          const pkg = packageResponse.data;
          setFormData({
            packagename: pkg.packagename,
            packagetype: pkg.packagetype.toString(),
            packagedescription: pkg.packagedescription,
            packageprice: pkg.packageprice,
            headline: pkg.headline,
            packagefeatures1: pkg.packagefeatures1,
            packagefeatures2: pkg.packagefeatures2,
            slug: pkg.slug,
            status: pkg.status,
            featured: pkg.featured,
            priority: pkg.priority || 0,
          });

          setImages({
            packagemainimage: pkg.packagemainimage,
            packagesideimage1: pkg.packagesideimage1,
            packagesideimage2: pkg.packagesideimage2,
            packagesideimage3: pkg.packagesideimage3 || "",
            packagesideimage4: pkg.packagesideimage4 || "",
            packagefeatureimage: pkg.packagefeatureimage,
          });

          if (pkg.features) {
            setSelectedFeatures(pkg.features.map((f: any) => f.id));
          }

          if (pkg.addons) {
            setSelectedAddons(pkg.addons.map((a: any) => a.id));
          }

          if (pkg.faqs) {
            setSelectedFaqs(pkg.faqs.map((f: any) => f.id));
          }

          if (pkg.content && pkg.content.length > 0) {
            setContentSections(pkg.content);
          }

          // Load attached deals
          const attachedDealsResponse = await adminDealsApi.getByPackage(
            parseInt(id)
          );
          if (attachedDealsResponse.success) {
            setAttachedDeals(attachedDealsResponse.data);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load package data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromMedia = (field: string) => {
    setCurrentImageField(field);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (imagePath: string) => {
    if (currentImageField) {
      setImages({ ...images, [currentImageField]: imagePath });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, you would upload files to the server first
      // For now, we'll just use the paths
      const payload = {
        ...formData,
        ...images,
        packagetype: parseInt(formData.packagetype),
        packageprice: parseFloat(formData.packageprice.toString()),
        priority: parseInt(formData.priority.toString()),
        features: selectedFeatures,
        addons: selectedAddons,
        faqs: selectedFaqs,
        content: contentSections.filter(
          (section) => section.content_heading && section.content_description
        ),
      };

      // Add id for update requests
      if (id && id !== "new") {
        (payload as any).id = parseInt(id);
      }

      let response;
      if (id && id !== "new") {
        response = await adminPackagesApi.update(parseInt(id), payload);
      } else {
        response = await adminPackagesApi.create(payload);
      }

      if (response.success) {
        toast({
          title: "Success",
          description:
            id && id !== "new"
              ? "Package updated successfully"
              : "Package created successfully",
        });
        navigate("/admin/packages");
      } else {
        throw new Error(response.message || "Failed to save package");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save package",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContentSection = () => {
    setContentSections([
      ...contentSections,
      { content_heading: "", content_description: "" },
    ]);
  };

  const removeContentSection = (index: number) => {
    setContentSections(contentSections.filter((_, i) => i !== index));
  };

  const updateContentSection = (
    index: number,
    field: "content_heading" | "content_description",
    value: string
  ) => {
    const updated = [...contentSections];
    updated[index][field] = value;
    setContentSections(updated);
  };

  const handleAttachDeal = async (dealId: number) => {
    if (!id || id === "new") {
      toast({
        title: "Error",
        description: "Please save the package first before attaching deals",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminDealsApi.attachToPackage(parseInt(id), dealId);
      toast({
        title: "Success",
        description: "Deal attached successfully",
      });

      // Reload attached deals
      const response = await adminDealsApi.getByPackage(parseInt(id));
      if (response.success) {
        setAttachedDeals(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to attach deal",
        variant: "destructive",
      });
    }
  };

  const handleDetachDeal = async (dealId: number) => {
    if (!id || id === "new") return;

    try {
      await adminDealsApi.detachFromPackage(parseInt(id), dealId);
      toast({
        title: "Success",
        description: "Deal detached successfully",
      });

      setAttachedDeals(attachedDeals.filter((d) => d.id !== dealId));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to detach deal",
        variant: "destructive",
      });
    }
  };

  if (loading && !formData.packagename) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/packages")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Packages
        </Button>
        <h1 className="text-3xl font-bold">
          {id && id !== "new" ? "Edit Package" : "Create New Package"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packagename">Package Name *</Label>
                <Input
                  id="packagename"
                  value={formData.packagename}
                  onChange={(e) =>
                    setFormData({ ...formData, packagename: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="packagetype">Package Type *</Label>
                <Select
                  value={formData.packagetype}
                  onValueChange={(value) =>
                    setFormData({ ...formData, packagetype: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.pkgName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="packageprice">Price *</Label>
                <Input
                  id="packageprice"
                  type="number"
                  step="0.01"
                  value={formData.packageprice}
                  onChange={(e) =>
                    setFormData({ ...formData, packageprice: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="featured">Featured</Label>
                <Select
                  value={formData.featured}
                  onValueChange={(value) =>
                    setFormData({ ...formData, featured: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) =>
                  setFormData({ ...formData, headline: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="packagedescription">Description</Label>
              <Input
                id="packagedescription"
                value={formData.packagedescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    packagedescription: e.target.value,
                  })
                }
                placeholder="Enter package description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packagefeatures1">Feature 1</Label>
                <Input
                  id="packagefeatures1"
                  value={formData.packagefeatures1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packagefeatures1: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="packagefeatures2">Feature 2</Label>
                <Input
                  id="packagefeatures2"
                  value={formData.packagefeatures2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packagefeatures2: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(images).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelectFromMedia(key)}
                    className="flex-1"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select from Media
                  </Button>
                  {value && (
                    <div className="flex items-center gap-2">
                      <img
                        src={`${IMAGE_BASE_URL}${value}`}
                        alt={key}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <span className="text-sm text-muted-foreground truncate max-w-xs">
                        {value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tour Features */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tourFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`feature-${feature.id}`}
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFeatures([...selectedFeatures, feature.id]);
                      } else {
                        setSelectedFeatures(
                          selectedFeatures.filter((id) => id !== feature.id)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`feature-${feature.id}`}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${feature.image}`}
                      alt={feature.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm">{feature.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Addons */}
        <Card>
          <CardHeader>
            <CardTitle>Addons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {addons.map((addon) => (
                <div key={addon.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`addon-${addon.id}`}
                    checked={selectedAddons.includes(addon.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAddons([...selectedAddons, addon.id]);
                      } else {
                        setSelectedAddons(
                          selectedAddons.filter((id) => id !== addon.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`addon-${addon.id}`} className="flex-1">
                    <div className="font-medium">{addon.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${addon.price} - {addon.description}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`faq-${faq.id}`}
                    checked={selectedFaqs.includes(faq.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFaqs([...selectedFaqs, faq.id]);
                      } else {
                        setSelectedFaqs(
                          selectedFaqs.filter((id) => id !== faq.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`faq-${faq.id}`} className="flex-1">
                    <div className="font-medium">{faq.question}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {faq.answer.replace(/<[^>]*>/g, "")}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Package Deals */}
        {id && id !== "new" && (
          <Card>
            <CardHeader>
              <CardTitle>Package Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Attached Deals</Label>
                  {attachedDeals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No deals attached yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {attachedDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{deal.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {deal.tagline} - AED {deal.price}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDetachDeal(deal.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Available Deals</Label>
                  <div className="space-y-2">
                    {allDeals
                      .filter(
                        (deal) =>
                          !attachedDeals.find((ad) => ad.id === deal.id) &&
                          deal.status === "active"
                      )
                      .map((deal) => (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{deal.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {deal.tagline} - AED {deal.price}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAttachDeal(deal.id)}
                          >
                            Attach
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Content Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentSections.map((section, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Section {index + 1}</Label>
                  {contentSections.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContentSection(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  placeholder="Heading"
                  value={section.content_heading}
                  onChange={(e) =>
                    updateContentSection(
                      index,
                      "content_heading",
                      e.target.value
                    )
                  }
                />
                <RichTextEditor
                  content={section.content_description}
                  onChange={(content) =>
                    updateContentSection(index, "content_description", content)
                  }
                  placeholder="Enter content description..."
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addContentSection}>
              Add Content Section
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Package"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/packages")}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Media Picker */}
      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        currentImage={
          currentImageField
            ? images[currentImageField as keyof typeof images]
            : undefined
        }
      />
    </div>
  );
};

export default EditPackage;
