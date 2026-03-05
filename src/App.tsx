import { Toaster } from "@/components/ui/toaster";
// Sync: 2026-03-05
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import CreateStore from "./pages/CreateStore";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import DashboardSettings from "./pages/DashboardSettings";
import StoreFront from "./pages/StoreFront";
import StoreProducts from "./pages/StoreProducts";
import Favorites from "./pages/Favorites";
import ProductDetail from "./pages/ProductDetail";
import StoreAbout from "./pages/StoreAbout";
import StoreContact from "./pages/StoreContact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import ExploreStores from "./pages/ExploreStores";
import TrackOrder from "./pages/TrackOrder";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StoreManagement from "./pages/admin/StoreManagement";
import StoreControl from "./pages/admin/StoreControl";
import NewStores from "./pages/admin/NewStores";
import { StoreProvider } from "./contexts/StoreContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiesPolicy from "./pages/CookiesPolicy";

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-store" element={<CreateStore />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/products" element={<Products />} />
            <Route path="/dashboard/products/new" element={<AddProduct />} />
            <Route path="/dashboard/products/edit/:id" element={<AddProduct />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/customers" element={<Customers />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />

            {/* Storefront Routes with Context */}
            <Route path="/store/:slug/*" element={
              <StoreProvider>
                <Routes>
                  <Route path="/" element={<StoreFront />} />
                  <Route path="products" element={<StoreProducts />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="about" element={<StoreAbout />} />
                  <Route path="contact" element={<StoreContact />} />
                  <Route path="track" element={<TrackOrder />} />
                </Routes>
              </StoreProvider>
            } />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stores" element={<ExploreStores />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/store-management" element={<StoreManagement />} />
            <Route path="/admin/store-control" element={<StoreControl />} />
            <Route path="/admin/new-stores" element={<NewStores />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help" element={<Support />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
