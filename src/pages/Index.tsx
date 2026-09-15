import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Locations from "@/components/Locations";
import Experience from "@/components/Experience";
import AboutSection from "@/components/AboutSection";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <Hero />
      <Stats />
      <Locations />
      <Experience />
      <AboutSection />
      <Booking />
      <Footer />
    </div>
  );
};

export default Index;
