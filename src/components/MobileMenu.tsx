import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Phone, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const MobileMenu = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tours", label: "Tours" },
    { to: "/blogs", label: "Blogs" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Menu"
          className="md:hidden rounded-full bg-white shadow-lg hover:bg-white/90"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px] pt-4">
        <SheetHeader className="mb-2">
          <SheetTitle className="text-base">Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-2 mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`text-base font-medium transition-colors py-2 px-4 rounded-lg ${
                location.pathname === link.to
                  ? "bg-desert-gold/10 text-desert-gold"
                  : "text-desert-night hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-6 border-t">
            <div className="flex items-center space-x-2 text-desert-night mb-4 px-4">
              <Phone className="w-5 h-5 text-desert-gold" />
              <a href="tel:+971501131852" className="text-sm font-medium">
                +971 50 113 1852
              </a>
            </div>
            <Button
              variant="desert"
              className="w-full"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/tours">Book Now</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
