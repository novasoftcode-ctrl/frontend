import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Store, Search, Heart, Menu, X, LayoutDashboard, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StoreFooter from "@/components/StoreFooter";
import { useStore } from "@/contexts/StoreContext";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();
  const { storeData, loading, error } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const storeName = storeData?.name || "My Store";
  const storeLogo = storeData?.logoUrl || null;

  const storeNav = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Products", href: `/store/${slug}/products` },
    { label: "About", href: `/store/${slug}/about` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  // Monitor loading state if needed, or just let it render with defaults

  const handleMonitorStore = () => {
    const savedAccount = localStorage.getItem("user_account_data");
    const signupPassword = savedAccount ? JSON.parse(savedAccount).password : "admin123";

    const password = prompt("Enter password to access Dashboard:");
    if (password === signupPassword) {
      navigate("/dashboard");
    } else if (password !== null) {
      alert("Incorrect password!");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store/${slug}/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/store/${slug}/products`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-18 px-4 py-2">
          <Link to={`/store/${slug}`} className="flex items-center gap-2.5 font-heading font-black text-xl hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden text-primary-foreground">
              {storeLogo ? (
                <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-5 h-5" />
              )}
            </div>
            <span className="truncate max-w-[120px] md:max-w-[200px]">{storeName}</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-8">
            {storeNav.map((n) => (
              <Link key={n.label} to={n.href} className={`text-sm font-bold tracking-tight transition-all relative py-1 group ${location.pathname === n.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {n.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 ${location.pathname === n.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative group">
              <Search className="absolute left-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-11 w-48 xl:w-64 h-11 rounded-full bg-slate-100 border-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
              />
            </form>

            <Button variant="outline" className="hidden lg:flex rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold h-11" asChild>
              <Link to="/stores"><Compass className="w-4 h-4 mr-2" /> Explore Stores</Link>
            </Button>

            <div className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={handleMonitorStore}
                variant="ghost"
                size="icon"
                className="flex sm:hidden w-11 h-11 rounded-full hover:bg-slate-100"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleMonitorStore}
                className="hidden sm:flex h-11 px-5 rounded-full font-bold shadow-lg shadow-primary/10 transition-all active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dash
              </Button>

              <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full hover:bg-slate-100 relative group" asChild>
                <Link to={`/store/${slug}/favorites`}>
                  <Heart className="w-5 h-5 group-hover:text-destructive transition-all" />
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-black shadow-md border-2 border-white">
                    {JSON.parse(localStorage.getItem("user_favorites") || "[]").length}
                  </span>
                </Link>
              </Button>
            </div>

            <button className="xl:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="xl:hidden border-t border-border px-4 py-4 bg-white/95 backdrop-blur-lg shadow-xl">
            <div className="space-y-1">
              {storeNav.map((n) => (
                <Link key={n.label} to={n.href} className={`block py-3 px-4 rounded-xl text-base font-bold transition-colors ${location.pathname === n.href ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"}`} onClick={() => setMenuOpen(false)}>
                  {n.label}
                </Link>
              ))}
              <div className="px-4 py-3">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9 h-11 rounded-xl bg-slate-100 border-0"
                  />
                </form>
              </div>
              <Button variant="outline" className="w-full mt-2 h-12 rounded-xl font-bold" asChild onClick={() => setMenuOpen(false)}>
                <Link to="/stores"><Compass className="w-4 h-4 mr-2" /> Explore Stores</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}
