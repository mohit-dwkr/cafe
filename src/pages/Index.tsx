import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import BookingSection from "@/components/BookingSection";
import GallerySection from "@/components/GallerySection";
import DeliverySection from "@/components/DeliverySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MenuSection />
      <BookingSection />
      <GallerySection />
      <DeliverySection />
      <Footer />
    </div>
  );
};

export default Index;
