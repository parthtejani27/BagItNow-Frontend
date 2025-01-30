import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { openCart } from "../../store/slices/cartSlice";
import CartDrawer from "../cart/CartDrawer";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const dispatch = useDispatch();

  const handleCartClick = () => {
    console.log("handle cart");
    dispatch(openCart());
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-theme-primary">
      <header
        ref={navbarRef}
        className=" fixed bg-theme-primary  top-0 left-0 right-0 z-50 transition-colors duration-200"
      >
        <Navbar toggleSidebar={toggleSidebar} toggleCart={handleCartClick} />
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <CartDrawer />
      {/* Main Content */}
      <main style={{ marginTop: navbarHeight }} className="px-3">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
