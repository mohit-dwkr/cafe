import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  best_seller?: boolean;
  image_url: string;
};

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [active, setActive] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const { toast } = useToast();
  const isMobile = useIsMobile();

  // ✅ FETCH PRODUCTS FROM SUPABASE
  useEffect(() => {
  async function fetchProducts() {
   const { data, error } = await supabase
  .from("Products")
  .select("*")
  .order("created_at", { ascending: false }); // 🔥 IMPORTANT


    if (!data) return;

    setMenuItems(data);

    const uniqueCats: string[] = Array.from(
      new Set(data.map((item) => item.category as string))
    );

    setCategories(["All", ...uniqueCats]);
  }

  fetchProducts();
}, []);
  const filtered =
    active === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === active);

  const initialCount = isMobile ? 3 : 6;
  const showToggle = active === "All" && filtered.length > initialCount;
  const visibleItems =
    active === "All" && !expanded
      ? filtered.slice(0, initialCount)
      : filtered;

  const handleCategoryChange = (cat: string) => {
    setActive(cat);
    setExpanded(false);
  };

  const handleOrder = (item: MenuItem) => {
    const text = encodeURIComponent(
      `Hi! I'd like to order: ${item.name} (₹${item.price}). Please confirm availability.`
    );
    window.open(`https://wa.me/91?text=${text}`, "_blank");
  };

  const handleWishlist = (item: MenuItem) => {
    toast({
      title: "Added to wishlist ☕",
      description: `${item.name} saved! You can order it on your next visit.`,
    });
  };

  return (
    <section id="menu" className="section-padding bg-background">
      <div className="container-cafe">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-forest font-semibold text-sm tracking-widest uppercase mb-2">
            Our Menu
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Crafted with Love
          </h2>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group relative bg-card rounded-xl border border-border hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.best_seller && (
                    <span className="absolute top-3 right-3 bg-gold text-espresso text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">
                      Best Seller
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-bold text-lg">
                      ₹{item.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWishlist(item)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        ♡ Save
                      </button>
                      <button
                        onClick={() => handleOrder(item)}
                        className="text-xs px-3 py-1.5 rounded-full bg-forest text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                      >
                        Order →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* See More */}
        {showToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary text-primary font-medium text-sm hover:bg-primary/95 hover:text-primary-foreground transition-all duration-300"
            >
              {expanded ? "Show Less" : "See More"}
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
