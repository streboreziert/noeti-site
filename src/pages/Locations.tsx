import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ParallaxBanner } from "@/components/motion/ParallaxBanner";
import { PageTransition } from "@/components/motion/PageTransition";
import Footer from "@/components/Footer";
import ModelCard from "@/components/ModelCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import bannerImage from "@/assets/detail-hex.jpg";
import { models as locations } from "@/data/models";

type SortOption = "price-low" | "price-high" | "rating";

const Locations = () => {
  const [sortBy, setSortBy] = useState<SortOption>("price-low");

  const sortedLocations = useMemo(() => {
    const sorted = [...locations];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [sortBy]);

  return (
    <PageTransition className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      <ParallaxBanner image={bannerImage} alt="Noeti models" eyebrow="Three plans, one model" title="Solo. Lab. Company." />

      <main className="py-24 lg:py-32 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Sort Controls */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-3">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[180px] text-sm font-light">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {sortedLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ModelCard model={location} highlight={location.id === "lab"} />
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
