// API Configuration
export const API_BASE_URL = "https://backend.desert-safaridubai.ae/api";
export const BASE_URL = "https://backend.desert-safaridubai.ae";
export const IMAGE_BASE_URL = "https://backend.desert-safaridubai.ae";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("admin_token");

// API Client Setup
const apiClient = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function for API calls
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiClient.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Helper for authenticated admin requests
const makeAdminRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/admin${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : apiClient.headers),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin";
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Package APIs
export const packageApi = {
  getAll: (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      packagetype?: string;
      featured?: string;
      minPrice?: number;
      maxPrice?: number;
    } = {}
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString());
      }
    });
    return makeRequest(`/public/packages?${searchParams}`);
  },

  getById: (id: string) => makeRequest(`/public/packages/${id}`),
  getBySlug: (slug: string) => makeRequest(`/public/packages/${slug}`),
  getFeatured: () => makeRequest("/public/packages/featured"),
  getTypes: () => makeRequest("/public/package-types"),
  getFAQs: (id: string) => makeRequest(`/public/packages/${id}/faqs`),
};

// Blog APIs
export const blogApi = {
  getAll: (
    params: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    } = {}
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString());
      }
    });
    return makeRequest(`/public/blogs?${searchParams}`);
  },

  getBySlug: (slug: string) => makeRequest(`/public/blogs/${slug}`),
  getCategories: () => makeRequest("/public/blog-categories"),
};

// Blog Types
export interface Blog {
  id: number;
  blog_name: string;
  slug: string;
  featured_image: string;
  header_image: string | null;
  created_at: string;
  updated_at: string;
  category: string;
  content: string;
}

// Content APIs
export const contentApi = {
  getFAQs: () => makeRequest("/public/faqs"),
  getGallery: (type?: string) => {
    const params = type ? `?type=${type}` : "";
    return makeRequest(`/public/gallery${params}`);
  },
  getTestimonials: () => makeRequest("/public/testimonials"),
  submitContact: (data: ContactSubmission) =>
    makeRequest("/public/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getTourFeatures: () => makeRequest("/public/tour-features"),
  getAddons: () => makeRequest("/public/addons"),
  getMetaByUrl: (url: string) =>
    makeRequest(`/public/meta/page?url=${encodeURIComponent(url)}`),
};

// Package deals API
export const packageDealsApi = {
  getByPackageId: async (
    packageId: number
  ): Promise<ApiResponse<PackageDeal[]>> => {
    return makeRequest("/public/package-deals", {
      method: "POST",
      body: JSON.stringify({ package_id: packageId }),
    });
  },
};

// Booking APIs
export const bookingApi = {
  create: async (
    bookingData: BookingSubmission
  ): Promise<ApiResponse<{ booking_id: number; total_price: number }>> => {
    return makeRequest("/public/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  getById: async (id: string): Promise<ApiResponse<BookingDetails>> => {
    return makeRequest(`/public/bookings/${id}`);
  },

  calculatePrice: async (
    packageId: number,
    adults: number,
    children: number,
    infants: number
  ): Promise<ApiResponse<{ total_price: number }>> => {
    return makeRequest("/bookings/calculate-price", {
      method: "POST",
      body: JSON.stringify({
        package_id: packageId,
        adults,
        children,
        infants,
      }),
    });
  },
};

// Types
export interface Package {
  id: number;
  packagename: string;
  packagetype: number;
  packagedescription: string;
  packageprice: string;
  headline: string;
  packagefeatures1: string;
  packagefeatures2: string;
  packagefeatureimage: string;
  packagemainimage: string;
  packagesideimage1: string;
  packagesideimage2: string;
  packagesideimage3: string;
  packagesideimage4: string;
  featured: string;
  created_at: string;
  priority: number;
  slug: string;
  status: string;
  packageTypeName: string;
  content?: PackageContent[];
  images?: PackageImage[];
  features?: PackageFeature[];
  addons?: PackageAddon[];
  faqs?: PackageFAQ[];
}

export interface PackageContent {
  id: number;
  package_id: number;
  content_heading: string;
  content_description: string;
}

export interface PackageImage {
  id: number;
  package_id: number;
  image_url: string;
  alt_text?: string;
}

export interface PackageFeature {
  id: number;
  name: string;
  image: string;
  position: number | null;
  creationDate: string;
}

export interface TourFeature {
  id: number;
  name: string;
  image: string;
  position: number | null;
  creationDate: string;
}

export interface PackageAddon {
  id: number;
  name: string;
  price: string;
  description?: string;
  is_active: number;
  image?: string;
  status: string;
}

export interface PackageFAQ {
  id: number;
  question: string;
  answer: string;
  is_active: number;
  created_at: string;
}

export interface PackageDeal {
  id: number;
  name: string;
  tagline: string;
  description: string;
  creationDate: string;
  price: number;
  status: string;
}

export interface BookingSubmission {
  package_id: number;
  deal_id: number;
  booking_date: string;
  adults: number;
  infants: number;
  children: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  special_requests?: string;
  addons: {
    addon_id: number;
    quantity: number;
  }[];
}

export interface BookingDetails {
  id: number;
  deal_id: number;
  package_id: number;
  tour_date: string;
  adults: number;
  infants: number;
  children: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  special_requests?: string;
  base_price: string;
  addons_total: string;
  total_price: string;
  booking_date: string;
  status: string;
  updated_at: string;
  created_at: string;
  packagename: string;
  deal_name: string;
  addons: {
    id: number;
    booking_id: number;
    addon_id: number;
    quantity: number;
    price_per_unit: string;
    total_price: string;
    addon_name: string;
  }[];
}

export interface Booking {
  package_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  adults: number;
  children: number;
  infants: number;
  special_requests?: string;
  addons?: number[];
  total_amount: number;
  status: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Admin Authentication APIs
export const adminAuthApi = {
  login: async (username: string, password: string) => {
    return makeRequest("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  getProfile: async () => makeAdminRequest("/profile"),
  changePassword: async (currentPassword: string, newPassword: string) => {
    return makeAdminRequest("/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  logout: async () => makeAdminRequest("/logout", { method: "POST" }),
};

// Admin Dashboard APIs
export const adminDashboardApi = {
  getStats: async () => makeAdminRequest("/dashboard/stats"),
};

// Admin Packages APIs
export const adminPackagesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return makeAdminRequest(`/packages${query ? `?${query}` : ""}`);
  },
  getById: async (id: number) => {
    return makeAdminRequest(`/packages/${id}`);
  },
  create: async (packageData: any) => {
    return makeAdminRequest("/packages", {
      method: "POST",
      body:
        packageData instanceof FormData
          ? packageData
          : JSON.stringify(packageData),
    });
  },
  update: async (id: number, packageData: any) => {
    return makeAdminRequest(`/packages/${id}`, {
      method: "PUT",
      body:
        packageData instanceof FormData
          ? packageData
          : JSON.stringify(packageData),
    });
  },
  delete: async (id: number) => {
    return makeAdminRequest(`/packages/${id}`, { method: "DELETE" });
  },
};

// Admin Bookings APIs
export const adminBookingsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return makeAdminRequest(`/bookings${query ? `?${query}` : ""}`);
  },
  getById: async (id: number) => makeAdminRequest(`/bookings/${id}`),
  updateStatus: async (id: number, status: string, admin_notes?: string) => {
    return makeAdminRequest(`/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, ...(admin_notes && { admin_notes }) }),
    });
  },
};

// Admin Blogs APIs
export const adminBlogsApi = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return makeAdminRequest(`/blogs${query ? `?${query}` : ""}`);
  },
  create: async (blogData: any) => {
    return makeAdminRequest("/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
    });
  },
  update: async (id: number, blogData: any) => {
    return makeAdminRequest(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    });
  },
};

// Admin FAQs APIs
export const adminFaqsApi = {
  getAll: async () => makeAdminRequest("/faqs"),
  create: async (faqData: any) => {
    return makeAdminRequest("/faqs", {
      method: "POST",
      body: JSON.stringify(faqData),
    });
  },
  update: async (id: number, faqData: any) => {
    return makeAdminRequest(`/faqs/${id}`, {
      method: "PUT",
      body: JSON.stringify(faqData),
    });
  },
  delete: async (id: number) => {
    return makeAdminRequest(`/faqs/${id}`, { method: "DELETE" });
  },
};

// Admin Addons APIs
export const adminAddonsApi = {
  getAll: async () => makeAdminRequest("/addons"),
  create: async (addonData: any) => {
    return makeAdminRequest("/addons", {
      method: "POST",
      body: JSON.stringify(addonData),
    });
  },
  update: async (id: number, addonData: any) => {
    return makeAdminRequest(`/addons/${id}`, {
      method: "PUT",
      body: JSON.stringify(addonData),
    });
  },
};

// Admin Enquiries APIs
export const adminEnquiriesApi = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return makeAdminRequest(`/enquiries${query ? `?${query}` : ""}`);
  },
  updateStatus: async (id: number, status: number) => {
    return makeAdminRequest(`/enquiries/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// Admin Gallery APIs
export const adminGalleryApi = {
  getAll: async () => makeAdminRequest("/gallery"),
  upload: async (
    imagePath: string,
    imageName: string,
    description?: string
  ) => {
    return makeAdminRequest("/gallery", {
      method: "POST",
      body: JSON.stringify({
        image_path: imagePath,
        image_name: imageName,
        description,
      }),
    });
  },
  delete: async (id: number) => {
    return makeAdminRequest(`/gallery/${id}`, { method: "DELETE" });
  },
};

// Admin Testimonials APIs
export const adminTestimonialsApi = {
  getAll: async () => makeAdminRequest("/testimonials"),
  create: async (testimonialData: any) => {
    return makeAdminRequest("/testimonials", {
      method: "POST",
      body: JSON.stringify(testimonialData),
    });
  },
  update: async (id: number, testimonialData: any) => {
    return makeAdminRequest(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(testimonialData),
    });
  },
  delete: async (id: number) => {
    return makeAdminRequest(`/testimonials/${id}`, { method: "DELETE" });
  },
};

// Admin Media/Upload APIs
export const adminMediaApi = {
  getAll: async () => makeAdminRequest("/upload/images"),
  upload: async (formData: FormData) => {
    return makeAdminRequest("/upload/image", {
      method: "POST",
      body: formData,
    });
  },
  updateMetadata: async (
    id: number,
    metadata: { alt_text?: string; title?: string; caption?: string }
  ) => {
    return makeAdminRequest(`/upload/image?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(metadata),
    });
  },
};

// Admin Meta APIs
export const adminMetaApi = {
  getAll: async (params?: {
    search?: string;
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.order) queryParams.append("order", params.order);

    const queryString = queryParams.toString();
    return makeAdminRequest(`/meta${queryString ? `?${queryString}` : ""}`);
  },
  getByUrl: async (url: string) => {
    return makeAdminRequest(`/meta/page?url=${encodeURIComponent(url)}`);
  },
  create: async (data: any) => {
    return makeAdminRequest("/meta", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: any) => {
    return makeAdminRequest(`/meta/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// Admin Tour Features APIs
export const adminFeaturesApi = {
  getAll: async () => makeAdminRequest("/features"),
  create: async (data: Partial<TourFeature>) => {
    return makeAdminRequest("/features", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<TourFeature>) => {
    return makeAdminRequest(`/features/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return makeAdminRequest(`/features/${id}`, {
      method: "DELETE",
    });
  },
};

// Package Type Interface
export interface PackageType {
  id: number;
  pkgName: string;
  pkgImage: string;
  creationDate: string;
  updationDate: string | null;
}

// Admin Package Types APIs
export const adminPackageTypesApi = {
  getAll: async () => makeAdminRequest("/packageType"),
  getById: async (id: number) => makeAdminRequest(`/packageType/${id}`),
  create: async (data: { pkgName: string; pkgImage: string }) => {
    return makeAdminRequest("/packageType", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: { pkgName: string; pkgImage: string }) => {
    return makeAdminRequest(`/packageType/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return makeAdminRequest(`/packageType/${id}`, {
      method: "DELETE",
    });
  },
};

// Deal Interface
export interface Deal {
  id: number;
  name: string;
  tagline: string;
  description: string;
  creationDate: string;
  price: number;
  status: string;
}

// Admin Deals APIs
export const adminDealsApi = {
  getAll: async () => makeAdminRequest("/deals"),
  create: async (data: {
    deal_title: string;
    deal_description: string;
    deal_price: number;
    deal_tagline: string;
    deal_status: string;
  }) => {
    return makeAdminRequest("/deal", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (data: {
    deal_id: number;
    name: string;
    tagline: string;
    description: string;
    creationDate: string;
    price: number;
    status: string;
  }) => {
    return makeAdminRequest("/package-deals", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  attachToPackage: async (package_id: number, deals_id: number) => {
    return makeAdminRequest("/package/attach-deal", {
      method: "POST",
      body: JSON.stringify({ package_id, deals_id }),
    });
  },
  detachFromPackage: async (package_id: number, deals_id: number) => {
    return makeAdminRequest("/package/detach-deal", {
      method: "POST",
      body: JSON.stringify({ package_id, deals_id }),
    });
  },
  getByPackage: async (package_id: number) => {
    return makeAdminRequest(`/package/${package_id}/deals`);
  },
};

// Page Content Interface
export interface PageContent {
  id: number;
  type: string;
  detail: string;
  package_id: number;
}

// Admin Page Content APIs
export const adminPageContentApi = {
  getAll: async () => makeAdminRequest("/pages"),
  getByPackageId: async (package_id: number) =>
    makeAdminRequest(`/pages/package/${package_id}`),
  create: async (data: {
    type: string;
    detail: string;
    package_id: number;
  }) => {
    return makeAdminRequest("/pages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (
    id: number,
    data: {
      type: string;
      detail: string;
      package_id: number;
    }
  ) => {
    return makeAdminRequest(`/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return makeAdminRequest(`/pages/${id}`, { method: "DELETE" });
  },
};

// Public Page Content API
export const pageContentApi = {
  getByPackageId: async (
    packageId: number
  ): Promise<ApiResponse<PageContent[]>> => {
    return makeRequest(`/public/pages/package/${packageId}`);
  },
};
