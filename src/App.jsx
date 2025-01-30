// src/App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/common/PrivateRoute";
import AuthCheck from "./components/auth/AuthCheck";
import NotFoundPage from "./components/common/NotFoundPage";
import ThemeProvider from "./components/layout/ThemeProvider";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LocationInitializer from "./components/common/LocationInitializer";
import { useEffect } from "react";
import loadGoogleMapsScript from "./utils/loadGoogleMapsScript";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderHistory from "./components/order/OrderHistory";
import OrderDetails from "./components/order/OrderDetails";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const stripeOptions = {
  fonts: [
    {
      cssSrc:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
    },
  ],
};

// Main Layout Component (with Navbar and Footer)
const MainLayout = () => {
  return (
    <ThemeProvider>
      <LocationInitializer />
      <Elements stripe={stripePromise} options={stripeOptions}>
        <div className="min-h-screen flex flex-col">
          {/* <Navbar /> */}
          <AuthCheck>
            <main className="flex-grow">
              <Outlet />
            </main>
          </AuthCheck>
          {/* <Footer /> */}
          <ScrollRestoration />
        </div>
      </Elements>
    </ThemeProvider>
  );
};

// Minimal Layout Component (without Navbar and Footer)
const MinimalLayout = () => {
  return (
    <ThemeProvider>
      <Elements stripe={stripePromise} options={stripeOptions}>
        <div className="min-h-screen flex flex-col">
          <AuthCheck>
            <main className="flex-grow">
              <Outlet />
            </main>
          </AuthCheck>
          <ScrollRestoration />
        </div>
      </Elements>
    </ThemeProvider>
  );
};

// Private Route Wrapper Component
const PrivateRouteWrapper = ({ children }) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

// Router Configuration
const router = createBrowserRouter([
  {
    // Main routes with Navbar and Footer
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductPage />,
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
          },
          {
            path: "search",
            element: <ProductPage />,
          },
        ],
      },
      {
        path: "/category/:categoryId",
        element: <ProductPage />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "orders",
        element: (
          <PrivateRouteWrapper>
            <Orders />
          </PrivateRouteWrapper>
        ),
        children: [
          {
            index: true,
            element: <OrderHistory />, // Rendered as the default child route
          },
          {
            path: ":orderId",
            element: <OrderDetails />, // Rendered when the user visits /orders/:orderId
          },
        ],
      },
      {
        path: "profile/*", // Note the /* to enable nested routes
        element: (
          <PrivateRouteWrapper>
            <Profile />
          </PrivateRouteWrapper>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  // {
  //   // orders route with minimal layout
  //   path: "/orders",
  //   element: <MinimalLayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: (
  //         <PrivateRouteWrapper>
  //           <Orders />
  //         </PrivateRouteWrapper>
  //       ),
  //     },
  //   ],
  // },
  {
    // Checkout route with minimal layout
    path: "/checkout",
    element: <MinimalLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRouteWrapper>
            <Checkout />
          </PrivateRouteWrapper>
        ),
      },
    ],
  },
]);

const App = () => {
  // useEffect(() => {
  //   loadGoogleMapsScript().catch((error) => {
  //     console.warn("Failed to preload Google Maps:", error);
  //   });
  // }, []);

  return <RouterProvider router={router} />;
};

export default App;
