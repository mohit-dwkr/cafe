import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [
  { src: gallery1, alt: "Chai and snacks spread" },
  { src: gallery2, alt: "Barista pouring latte art" },
  { src: gallery3, alt: "Cozy pet-friendly corner" },
  { src: gallery4, alt: "Dessert display" },
  { src: gallery5, alt: "Avocado toast and cold brew" },
  { src: gallery6, alt: "Friends enjoying coffee" },
];

export default function GallerySection() {
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
          <p className="text-forest font-semibold text-sm tracking-widest uppercase mb-2">The Vibe</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Moments at Brew & Co.
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="break-inside-avoid overflow-hidden rounded-xl group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://instagram.com/brewandco"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Instagram className="h-4 w-4" />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
