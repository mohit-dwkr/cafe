import { Coffee, MapPin, Phone, Clock, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-cream">
      {/* Map */}
      <div className="w-full h-64 md:h-80">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d72.8777!3d19.076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(0.3) contrast(1.1)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Brew & Co. location on Google Maps"
        />
      </div>

      <div className="container-cafe px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-5 w-5" />
              <span className="font-heading text-xl font-bold">Brew & Co.</span>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed">
              Authentic artisan coffee, homestyle breakfast, and the coziest corners in Mumbai.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 text-sm text-cream/60">
              <a href="tel:+919630955951" className="flex items-center gap-2 hover:text-cream transition-colors">
                <Phone className="h-4 w-4" /> +91 9630955951
              </a>
              <a href="mailto:hello@brewandco.in" className="flex items-center gap-2 hover:text-cream transition-colors">
                <Mail className="h-4 w-4" /> hello@brewandco.in
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> 42 Colaba Causeway, Mumbai 400005
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Opening Hours</h3>
            <div className="space-y-2 text-sm text-cream/60">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Mon – Sun: 9:00 AM – 11:00 PM
              </div>
              <p className="text-cream/40 text-xs mt-2">Open all days including public holidays</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-6 text-center text-cream/30 text-xs">
          © {new Date().getFullYear()} Brew & Co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
