import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PromotionalBanner = () => {
  const [promotions, setPromotions] = useState([
    {
      id: "promo_001",
      title: "🎉 First-Time Customer Special!",
      description: "Get $20 off on your first order above $100",
      icon: "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      ctaText: "Claim Now",
      ctaLink: "/offers/first-time",
      backgroundColor: "#4ade80", // green shade for success/positive messages
      textColor: "#ffffff",
      priority: 1,
      startDate: "2024-11-26T00:00:00Z",
      endDate: "2024-12-31T23:59:59Z",
      isActive: true,
    },
    {
      id: "promo_002",
      title: "🚚 Free Delivery Weekend",
      description: "Free delivery on all orders above $50 this weekend",
      icon: "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      ctaText: "Shop Now",
      ctaLink: "/products",
      backgroundColor: "#3b82f6", // blue shade for informational messages
      textColor: "#ffffff",
      priority: 2,
      startDate: "2024-11-29T00:00:00Z",
      endDate: "2024-11-30T23:59:59Z",
      isActive: true,
    },
    {
      id: "promo_003",
      title: "🥬 Fresh Produce Sale",
      description: "30% off on all fresh vegetables and fruits",
      icon: "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      ctaText: "Explore Fresh Produce",
      ctaLink: "/category/fresh-produce",
      backgroundColor: "#f97316", // orange shade for limited time offers
      textColor: "#ffffff",
      priority: 3,
      startDate: "2024-11-26T00:00:00Z",
      endDate: "2024-11-28T23:59:59Z",
      isActive: true,
    },
    {
      id: "promo_004",
      title: "📱 Download Our App",
      description: "Get exclusive app-only offers and faster checkout",
      icon: "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      ctaText: "Download Now",
      ctaLink: "/download-app",
      backgroundColor: "#8b5cf6", // purple shade for app promotions
      textColor: "#ffffff",
      priority: 4,
      startDate: "2024-11-01T00:00:00Z",
      endDate: "2024-12-31T23:59:59Z",
      isActive: true,
    },
    {
      id: "promo_005",
      title: "🎄 Holiday Season Special",
      description: "Up to 40% off on festive groceries and decorations",
      icon: "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      ctaText: "Explore Holiday Deals",
      ctaLink: "/holiday-special",
      backgroundColor: "#ef4444", // red shade for holiday themes
      textColor: "#ffffff",
      priority: 5,
      startDate: "2024-12-01T00:00:00Z",
      endDate: "2024-12-25T23:59:59Z",
      isActive: true,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (promotions.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promotions.length]);

  if (isLoading || promotions.length === 0) return null;

  const currentPromotion = promotions[currentIndex];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full bg-theme-primary overflow-hidden  border-b border-t p-1 border-theme-secondary">
      <div className="max-w-6xl mx-auto relative">
        <div className="relative h-64 sm:h-40 md:h-32">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                  {currentPromotion.icon && (
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={currentPromotion.icon}
                        alt=""
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 max-w-2xl text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-theme-primary mb-2">
                      {currentPromotion.title}
                    </h3>
                    <p className="text-sm sm:text-base text-theme-secondary leading-relaxed line-clamp-2 sm:line-clamp-1">
                      {currentPromotion.description}
                    </p>
                  </div>
                </div>

                {currentPromotion.ctaText && (
                  <a
                    href={currentPromotion.ctaLink}
                    style={{
                      backgroundColor: currentPromotion.backgroundColor,
                      color: currentPromotion.textColor,
                    }}
                    className="w-full sm:w-auto mt-4 sm:mt-0 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:opacity-90 transition-all transform hover:scale-105 duration-200 shadow-lg hover:shadow-xl text-center"
                  >
                    {currentPromotion.ctaText}
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicators */}
        {promotions.length > 1 && (
          <div className="absolute -bottom-1 left-0 w-full flex justify-center space-x-2 pb-4">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-accent-success"
                    : "w-1.5 bg-theme-tertiary hover:bg-theme-secondary"
                }`}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionalBanner;
