import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Locations from "@/components/Locations";
import Process from "@/components/Process";
import Architecture from "@/components/Architecture";
import FAQ from "@/components/FAQ";
import Booking from "@/components/Booking";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/motion/PageTransition";

const Index = () => (
  <PageTransition className="min-h-screen overflow-x-hidden">
    <Navigation />
    <Hero />
    <Stats />
    <Locations />
    <Process />
    <Architecture />
    <FAQ />
    <Booking />
    <CTABand />
    <Footer />
  </PageTransition>
);

export default Index;
