import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const platforms = [
  {
    name: "Zomato",
    color: "bg-[#E23744]",
    hoverColor: "hover:bg-[#c82e3a]",
    url: "https://zomato.com",
  },
  {
    name: "Swiggy",
    color: "bg-[#FC8019]",
    hoverColor: "hover:bg-[#e07316]",
    url: "https://swiggy.com",
  },
];

export default function DeliverySection() {
  return (
    <section id="order" className="section-padding bg-primary">
      <div className="container-cafe text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-cream/60 font-semibold text-sm tracking-widest uppercase mb-2">
            Delivery
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-cream mb-4">
            Order Online
          </h2>
          <p className="text-cream/60 text-base max-w-md mx-auto mb-10">
            Can't make it to the cafe? Get your favorites delivered right to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {platforms.map((p) => (
              <motion.a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`${p.color} ${p.hoverColor} text-white font-semibold px-10 py-4 rounded-full text-base flex items-center gap-2 transition-colors shadow-lg`}
              >
                Order on {p.name}
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
