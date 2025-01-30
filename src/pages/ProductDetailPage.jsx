import React from "react";
import MainLayout from "../components/layout/MainLayout";
import ProductDetail from "../components/product/ProductDetail";

const ProductDetailPage = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-theme-primary flex flex-col gap-4">
        <ProductDetail />
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
