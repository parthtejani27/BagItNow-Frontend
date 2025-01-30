import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroBanner = () => {
  const bannerData1 = [
    {
      id: "1",
      title: "Fresh & Organic Groceries",
      subtitle: "Delivered to Your Doorstep",
      description:
        "Get fresh fruits, vegetables, and daily essentials delivered within hours. Quality products at the best prices.",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      colorScheme: "emerald",
      discount: "30% OFF",
      discountText: "on first order",
      primaryCTA: "Shop Now",
      secondaryCTA: "Learn More",
    },
    {
      id: "2",
      title: "Weekend Special Offers",
      subtitle: "Save Big on Daily Essentials",
      description:
        "Up to 40% off on dairy, bread, and household items. Limited time offer!",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      colorScheme: "amber",
      discount: "40% OFF",
      discountText: "on first order",
      primaryCTA: "View Offers",
      secondaryCTA: "Learn More",
    },
    {
      id: "3",
      title: "Fresh from Local Farms",
      subtitle: "Support Local Farmers",
      description:
        "Discover fresh, seasonal produce from local farmers. Farm to table, delivered fresh.",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-1525213305.jpg",
      colorScheme: "blue",
      discount: "20% OFF",
      discountText: "on first order",
      primaryCTA: "Explore",
      secondaryCTA: "Learn More",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerData, setBannerData] = useState(bannerData1);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    setLoading(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSlideChange = (direction) => {
    setIsSliding(true);
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    } else {
      setCurrentSlide(
        (prev) => (prev - 1 + bannerData.length) % bannerData.length
      );
    }
    setTimeout(() => setIsSliding(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(() => handleSlideChange("next"), 5000);
    return () => clearInterval(timer);
  });

  if (loading) {
    return (
      <div className="w-full h-[400px] sm:h-[600px] bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
    );
  }

  if (error || !bannerData.length) return null;

  const slide = bannerData[currentSlide];
  const colorClasses = {
    emerald: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950",
      text: "text-emerald-800 dark:text-emerald-100",
      button:
        "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-950",
      text: "text-amber-800 dark:text-amber-100",
      button:
        "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600",
      accent: "text-amber-600 dark:text-amber-400",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950",
      text: "text-blue-800 dark:text-blue-100",
      button:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
      accent: "text-blue-600 dark:text-blue-400",
    },
  };

  const colors = colorClasses[slide.colorScheme];

  return (
    <div className="relative overflow-hidden rounded-xl group">
      <div
        className={`w-full ${isMobile ? "h-[450px]" : "h-[600px]"} ${
          colors.bg
        }`}
      >
        <div className="container mx-auto px-4 h-full">
          {isMobile ? (
            // Mobile View
            <div className="h-full flex flex-col justify-center px-3">
              {/* Discount Badge */}
              {slide.discount && (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md backdrop-blur-sm">
                    <span className={`font-bold ${colors.accent} text-lg`}>
                      {slide.discount}
                    </span>
                    {slide.discountText && (
                      <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {slide.discountText}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Text Content */}
              <div
                className={`space-y-4 text-center ${
                  isSliding
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                } transition-all duration-300`}
              >
                <h1
                  className={`text-3xl font-extrabold ${colors.text} tracking-tight leading-tight mb-2`}
                >
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <h2
                    className={`text-xl font-medium ${colors.text} opacity-90 mb-2`}
                  >
                    {slide.subtitle}
                  </h2>
                )}
                {slide.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-lg mx-auto">
                    {slide.description}
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-center gap-3 mt-8">
                {slide.primaryCTA && (
                  <button
                    className={`${colors.button} px-6 py-3 rounded-full text-white font-medium`}
                  >
                    {slide.primaryCTA}
                  </button>
                )}
                {slide.secondaryCTA && (
                  <button className="bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-full font-medium">
                    {slide.secondaryCTA}
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Desktop View - Keeping exactly the same as your original code
            <div className="h-full flex flex-row items-center gap-8">
              <div className="w-1/2 space-y-4 relative z-10">
                {slide.discount && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md backdrop-blur-sm">
                    <span className={`font-bold ${colors.accent} text-lg`}>
                      {slide.discount}
                    </span>
                    {slide.discountText && (
                      <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {slide.discountText}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`space-y-3 transition-all duration-300 ${
                    isSliding
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0"
                  }`}
                >
                  <h1
                    className={`text-4xl sm:text-6xl font-extrabold ${colors.text} tracking-tight leading-tight`}
                  >
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <h2
                      className={`text-xl sm:text-3xl font-medium ${colors.text} opacity-90`}
                    >
                      {slide.subtitle}
                    </h2>
                  )}
                  {slide.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-lg">
                      {slide.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  {slide.primaryCTA && (
                    <button
                      className={`${colors.button} px-8 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
                    >
                      {slide.primaryCTA}
                    </button>
                  )}
                  {slide.secondaryCTA && (
                    <button className="bg-white/90 dark:bg-gray-800/90 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                      {slide.secondaryCTA}
                    </button>
                  )}
                </div>
              </div>

              {/* Image */}
              {slide.imageUrl && (
                <div className="w-1/2 h-5/6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 dark:to-black/20 z-10 rounded-2xl" />
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Slide Indicators */}
        {bannerData.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {bannerData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full
                  ${
                    currentSlide === index
                      ? `w-8 h-2 ${colors.button}`
                      : "w-2 h-2 bg-gray-400/50 hover:bg-gray-400"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
