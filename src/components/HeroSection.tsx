import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Wifi, PawPrint } from "lucide-react";

// ✅ Lovable wali default hero image
import heroImage from "../assets/hero-cafe.jpg";

export default function HeroSection() {
  // ✅ Default state = Lovable content
  const [hero, setHero] = useState({
    title: "Authentic Brews & Cozy Corners.",
    subtitle: "The best artisan coffee in the heart of Mumbai.",
    image_url: heroImage,
  });

  // ✅ Supabase se data lao (safe overwrite)
  useEffect(() => {
  async function fetchHero() {
    const { data } = await supabase
      .from("Hero")
      .select("*")
      .eq('id', 3)
      .single();

    if (!data) return;

    setHero((prev) => ({
      title: data.title?.trim() ? data.title : prev.title,
      subtitle: data.subtitle?.trim() ? data.subtitle : prev.subtitle,
      image_url:
        data.image_url && data.image_url.trim() !== ""
          ? data.image_url
          : prev.image_url,
    }));
  }

  fetchHero();
}, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={hero.image_url}
          alt="Cafe Interior"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/70 via-espresso/50 to-espresso/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-cream/70 text-sm">
              <PawPrint className="h-4 w-4" /> Pet Friendly
            </span>
            <span className="w-1 h-1 rounded-full bg-cream/40" />
            <span className="flex items-center gap-1.5 text-cream/70 text-sm">
              <Wifi className="h-4 w-4" /> Work-from-Cafe
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-cream leading-tight mb-6 text-balance">
            {hero.title}
          </h1>

          <p className="text-cream/70 text-base sm:text-lg max-w-xl mx-auto mb-10 font-light">
            {hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#menu"
              className="px-8 py-3.5 bg-cream text-espresso font-semibold rounded-full hover:bg-cream/90 transition-colors text-sm tracking-wide"
            >
              View Menu
            </a>
            <a
              href="#booking"
              className="px-8 py-3.5 border border-cream/30 text-cream font-semibold rounded-full hover:bg-cream/10 transition-colors text-sm tracking-wide"
            >
              Book a Table
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-5 h-8 border-2 border-cream/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-cream/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
