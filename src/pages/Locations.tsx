import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ParallaxBanner } from "@/components/motion/ParallaxBanner";
import { PageTransition } from "@/components/motion/PageTransition";
import Footer from "@/components/Footer";
import ModelCard from "@/components/ModelCard";
import bannerImage from "@/assets/detail-hex.jpg";
import { models as locations } from "@/data/models";


const Locations = () => {


  return (
    <PageTransition className="min-h-screen overflow-x-hidden">
      <Navigation />

      <ParallaxBanner image={bannerImage} alt="Noeti models" eyebrow="Four plans, one model" title="Pro. Pro+. Max. Enterprise." />

      <main className="py-24 lg:py-32 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ModelCard model={location} highlight={location.id === "pro-plus"} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Locations;
