import React from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/home/HeroBanner";
import CategorySlider from "../components/home/CategorySlider";
import PromotionalBanner from "../components/home/PromotionalBanner";
import ProductGrid from "../components/product/ProductGrid";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <MainLayout>
      <div className="container-custom pt-2 min-h-screen bg-theme-primary flex flex-col gap-4">
        <HeroBanner />
        <CategorySlider />
        <PromotionalBanner />
        <ProductGrid title="Featured Products" />
      </div>
    </MainLayout>
  );
};

export default Home;
