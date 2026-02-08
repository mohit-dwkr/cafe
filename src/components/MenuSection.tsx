import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, ChevronUp } from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  bestSeller?: boolean;
};

const menuItems: MenuItem[] = [
  { id: 1, name: "Masala Chai Latte", price: 180, description: "Spiced Indian tea with frothy steamed milk", category: "Coffee", bestSeller: true },
  { id: 2, name: "Filter Kaapi", price: 150, description: "South Indian drip coffee, bold & authentic", category: "Coffee", bestSeller: true },
  { id: 3, name: "Cold Brew", price: 220, description: "24-hour slow-steeped, silky smooth", category: "Coffee" },
  { id: 4, name: "Hazelnut Cappuccino", price: 250, description: "Rich espresso with hazelnut & foam art", category: "Coffee" },
  { id: 5, name: "Avocado Toast", price: 320, description: "Sourdough, smashed avo, chilli flakes, poached egg", category: "Breakfast", bestSeller: true },
  { id: 6, name: "Masala Omelette", price: 220, description: "Fluffy eggs with onions, tomatoes & green chillies", category: "Breakfast" },
  { id: 7, name: "Pancake Stack", price: 280, description: "Buttermilk pancakes with maple syrup & berries", category: "Breakfast" },
  { id: 8, name: "Eggs Benedict", price: 350, description: "Poached eggs, hollandaise on English muffins", category: "Breakfast" },
  { id: 9, name: "Tiramisu", price: 280, description: "Classic Italian with our espresso & mascarpone", category: "Desserts", bestSeller: true },
  { id: 10, name: "Chocolate Lava Cake", price: 320, description: "Warm molten center, served with vanilla gelato", category: "Desserts" },
  { id: 11, name: "Gulab Jamun Cheesecake", price: 300, description: "A fusion of Indian & Western dessert traditions", category: "Desserts" },
  { id: 12, name: "Affogato", price: 200, description: "Vanilla gelato drowned in a shot of hot espresso", category: "Desserts" },
];

const categories = ["All", "Coffee", "Breakfast", "Desserts"];

export default function MenuSection() {
  const [active, setActive] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const filtered = active === "All" ? menuItems : menuItems.filter((i) => i.category === active);
  const initialCount = isMobile ? 3 : 6;
  const showToggle = active === "All" && filtered.length > initialCount;
  const visibleItems = active === "All" && !expanded ? filtered.slice(0, initialCount) : filtered;

  const handleCategoryChange = (cat: string) => {
    setActive(cat);
    setExpanded(false);
  };

  const handleOrder = (item: MenuItem) => {
    const text = encodeURIComponent(`Hi! I'd like to order: ${item.name} (₹${item.price}). Please confirm availability.`);
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-forest font-semibold text-sm tracking-widest uppercase mb-2">Our Menu</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Crafted with Love
          </h2>
        </motion.div>

        {/* Category Filter */}
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
                className="group relative bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-shadow"
              >
                {item.bestSeller && (
                  <span className="absolute top-3 right-3 bg-gold text-espresso text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Best Seller
                  </span>
                )}
                <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">
                  {item.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold text-lg">₹{item.price}</span>
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* See More / Show Less Toggle */}
        {showToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
