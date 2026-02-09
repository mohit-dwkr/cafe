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

       <div className="text-center mt-12 pb-8">
  <a
    href="https://instagram.com/code_by_mohit"
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 px-8 py-4 bg-[#2D4236] text-[#FDF8F1] rounded-full text-sm font-bold tracking-wide shadow-xl hover:bg-[#1f2e25] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-[#C5A267]/50"
  >
    {/* Instagram Icon with a subtle bounce on hover */}
   <div className="relative flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
  <Instagram 
    className="h-5 w-5 transition-all duration-500" 
    style={{ stroke: "url(#insta-gradient)" }} 
  />
  <svg width="0" height="0" className="absolute">
    <linearGradient id="insta-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop stopColor="#f9ce34" offset="0%" />
      <stop stopColor="#ee2a7b" offset="50%" />
      <stop stopColor="#6228d7" offset="100%" />
    </linearGradient>
  </svg>
</div>
    
    <span className="border-l border-[#FDF8F1]/20 pl-3">
      Follow us @code_by_mohit
    </span>

    {/* Small Arrow that appears on hover */}
    <motion.span
      initial={{ x: -5, opacity: 0 }}
      whileHover={{ x: 0, opacity: 1 }}
      className="hidden group-hover:inline-block ml-1"
    >
      →
    </motion.span>
  </a>
  
  <p className="text-muted-foreground text-xs mt-4 italic opacity-70">
    See our daily specials & cozy vibes
  </p>
</div>
      </div>
    </section>
  );
}
