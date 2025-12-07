import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  LayoutDashboard,
  Package,
  Calendar,
  FileText,
  HelpCircle,
  Plus,
  Mail,
  Image,
  Star,
  Upload,
  LogOut,
  Search,
  Award,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Packages", url: "/admin/packages", icon: Package },
  { title: "Package Types", url: "/admin/package-types", icon: Package },
  { title: "Package Deals", url: "/admin/deals", icon: Award },
  { title: "Page Content", url: "/admin/page-content", icon: FileText },
  { title: "Bookings", url: "/admin/bookings", icon: Calendar },
  { title: "Blogs", url: "/admin/blogs", icon: FileText },
  { title: "FAQs", url: "/admin/faqs", icon: HelpCircle },
  { title: "Addons", url: "/admin/addons", icon: Plus },
  { title: "Tour Features", url: "/admin/features", icon: Award },
  { title: "Enquiries", url: "/admin/enquiries", icon: Mail },
  { title: "Media", url: "/admin/media", icon: Upload },
  { title: "Gallery", url: "/admin/gallery", icon: Image },
  { title: "Testimonials", url: "/admin/testimonials", icon: Star },
  { title: "SEO Meta", url: "/admin/meta", icon: Search },
];

function AdminSidebar() {
  const { admin, logout } = useAdminAuth();

  return (
    <Sidebar className="w-60" collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">DSD Admin</h2>
          {admin && (
            <p className="text-sm text-muted-foreground">{admin.name}</p>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center bg-primary text-primary-foreground font-medium rounded-md px-3 py-2"
                          : "flex items-center text-foreground hover:bg-muted/50 rounded-md px-3 py-2"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login", { replace: true });
      return;
    }

    // Redirect from /admin to /admin/dashboard
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center px-4 bg-background">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-semibold">
              Desert Safari Dubai - Admin Panel
            </h1>
          </header>
          <main className="flex-1 p-6 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
