import { useState, useEffect } from "react";
import { Coffee, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Book a Table", href: "#booking" },
  { label: "Gallery", href: "#gallery" },
  { label: "Order Online", href: "#order" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 useEffect(() => {
  // 1. Initial Fetch (Page load hote hi status check karein)
  async function fetchStatus() {
    const { data, error } = await supabase
      .from("Status")
      .select("is_open")
      .eq("id", 1) // Specific ID 1 fetch karein
      .single();

    if (!error && data) {
      setOpen(data.is_open);
      console.log("Navbar Initial Load:", data.is_open);
    }
  }
  fetchStatus();


  
  // 2. Realtime Subscription (SQL ke baad ab ye kaam karega)
  const channel = supabase
    .channel('status_live')
    .on(
      'postgres_changes',
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'Status' 
        // Filter hata diya hai testing ke liye taaki har update catch ho
      },
      (payload) => {
        console.log("REALTIME SIGNAL RECEIVED:", payload.new.is_open);
        setOpen(payload.new.is_open);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    setTimeout(() => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 300);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="container-cafe flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
        <a href="#" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-cream" />
          <span className="font-heading text-xl font-bold text-cream">Brew & Co.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-cream/80 hover:text-cream text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="flex items-center gap-1.5 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${open ? "bg-forest animate-pulse" : "bg-destructive"
                }`}
            />
            <span className="text-cream/70">{open ? "Open Now" : "Closed"}</span>
          </div>

          <a
            href="tel:+919630955951"
            className="flex items-center gap-1.5 bg-forest text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone className="h-3.5 w-3.5" />
            Call Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-cream"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 pb-6 space-y-4">
              {navLinks.map((link) => (
  <a
    key={link.href}
    href={link.href}
    // Purana onClick hata kar yeh naya logic lagayein
    onClick={(e) => handleMobileClick(e, link.href)}
    className="block text-cream/80 hover:text-cream text-base font-medium py-2"
  >
    {link.label}
  </a>
))}
              <div className="flex items-center gap-2 py-2">
                <span
                  className={`h-2 w-2 rounded-full ${open ? "bg-forest animate-pulse" : "bg-destructive"
                    }`}
                />
                <span className="text-cream/70 text-sm">{open ? "Open Now" : "Closed"}</span>
              </div>
              <a
                href="tel:+919630955951"
                className="inline-flex items-center gap-1.5 bg-forest text-accent-foreground px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                <Phone className="h-3.5 w-3.5" />
                Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}