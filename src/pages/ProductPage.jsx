import React from "react";
import Products from "../components/product/Products";
import MainLayout from "../components/layout/MainLayout";

const ProductPage = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-theme-primary flex flex-col gap-4">
        <Products />
      </div>
    </MainLayout>
  );
};

export default ProductPage;
