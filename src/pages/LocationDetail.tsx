import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, MapPin, Star, Calendar, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getModelById } from "@/data/models";
import { easeOutExpo, bannerTransition } from "@/lib/motion";

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = id ? getModelById(id) : null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-light mb-4">Model not found</h1>
          <Button onClick={() => navigate("/")} variant="outline" size="sm" className="text-xs font-light">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  // Combine main image with detail images for the gallery
  const allImages = [location.image, ...location.images];

  const handleBooking = () => {
    navigate(`/?plan=${location.id}#booking`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Hero Image with Parallax */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <motion.img
          src={allImages[0]}
          alt={location.name}
          style={{ y }}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={bannerTransition}
          className="absolute inset-0 w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 max-w-full overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/models")}
            className="mb-8 text-[11px] uppercase tracking-wider font-normal"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to models
          </Button>

          {/* Title, Description, Rating */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: easeOutExpo }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <MapPin className="h-3 w-3" />
              <span className="font-light">{location.location}</span>
              <div className="flex items-center gap-1 ml-4">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="font-light text-foreground">{location.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
              {location.name}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-2xl">
              {location.description}
            </p>
          </motion.div>

          {/* Full Width Image Slideshow */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: easeOutExpo }}
            className="relative w-full h-[50vh] lg:h-[60vh] mb-16 rounded-lg overflow-hidden max-w-full"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={`${location.name} ${currentImageIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: easeOutExpo }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-light">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.22, ease: easeOutExpo }}
              >
                <Card className="p-8 border border-border shadow-soft">
                  <h2 className="text-[11px] uppercase tracking-wider font-normal mb-6">Meters</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {location.amenities.map((amenity: any, index: number) => {
                      const Icon = amenity.icon;
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-normal mb-1">{amenity.label}</h3>
                            <p className="text-xs text-muted-foreground font-light">{amenity.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.32, ease: easeOutExpo }}
              >
                <Card className="p-8 border border-border shadow-soft">
                  <h2 className="text-[11px] uppercase tracking-wider font-normal mb-6">Specification</h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {location.details.map((detail: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              {/* Reviews Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.42, ease: easeOutExpo }}
              >
                <Card className="p-8 border border-border shadow-soft">
                  <h2 className="text-[11px] uppercase tracking-wider font-normal mb-6">Early Notes</h2>
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {location.reviews.map((review, index) => (
                        <CarouselItem key={index} className="pl-4 md:basis-1/2">
                          <div className="h-full p-6 bg-accent/30 rounded-lg">
                            <Quote className="h-6 w-6 text-primary/30 mb-4" />
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground font-light mb-4 leading-relaxed">
                              "{review.comment}"
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-normal text-foreground">{review.author}</span>
                              <span className="text-xs text-muted-foreground font-light">{review.date}</span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <CarouselPrevious className="static translate-y-0" />
                      <CarouselNext className="static translate-y-0" />
                    </div>
                  </Carousel>
                </Card>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, delay: 0.18, ease: easeOutExpo }}
                className="sticky top-24"
              >
                <Card className="p-8 border border-border shadow-soft">
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-light">€{location.price}</span>
                      <span className="text-xs text-muted-foreground font-light">/ mo</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="font-light">{location.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-normal mb-2 text-muted-foreground">
                        Included
                      </p>
                      <p className="text-sm font-light">
                        {location.usage} usage / mo · {location.scale} Solo
                      </p>
                      <p className="text-xs text-muted-foreground font-light mt-1">
                        {location.features.slice(1).join(" · ")}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      A 30-minute setup meeting. The Gmail invite lands on both calendars.
                    </p>

                    <Button
                      size="default"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal"
                      onClick={handleBooking}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book setup
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LocationDetail;
