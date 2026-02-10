import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { supabase } from "../supabaseClient";

type GalleryImage = {
  id: number;
  image_url: string;
  alt: string;
  caption?: string;
};

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showAll, setShowAll] = useState(false); // ✅ NEW

  // 🔥 Fetch gallery images from Supabase
  useEffect(() => {
    async function fetchGallery() {
      const { data } = await supabase
        .from("Gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setImages(data);
    }

    fetchGallery();
  }, []);

  // ✅ Only 7 images by default
  const visibleImages = showAll ? images : images.slice(0, 7);

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container-cafe">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-forest font-semibold text-sm tracking-widest uppercase mb-2">
            The Vibe
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Moments at Brew & Co.
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {visibleImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="break-inside-avoid overflow-hidden rounded-xl group relative"
            >
              <img
                src={img.image_url}
                alt={img.alt || "Cafe moment"}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Caption overlay */}
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                  <p className="text-cream text-xs sm:text-sm font-medium">
                    {img.caption}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ✅ Show More / Show Less */}
        {images.length > 7 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-full border border-forest text-forest
                font-medium text-sm hover:bg-primary/95 hover:text-cream
                transition-all duration-300"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}

        {/* Instagram CTA */}
        <div className="text-center mt-14 pb-6">
          <a
            href="https://instagram.com/code_by_mohit"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 
              bg-forest text-cream rounded-full text-sm font-semibold 
              shadow-lg hover:bg-forest/90 transition-all duration-300
              hover:scale-105 active:scale-95"
          >
            <Instagram className="h-5 w-5 group-hover:rotate-6 transition-transform" />
            <span className="border-l border-cream/30 pl-3">
              Follow us on Instagram
            </span>
            <motion.span
              initial={{ x: -6, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              className="hidden group-hover:inline-block"
            >
              →
            </motion.span>
          </a>

          <p className="text-muted-foreground text-xs mt-4 italic opacity-70">
            Daily specials • Cozy vibes • Cafe moments
          </p>
        </div>
      </div>
    </section>
  );
}
