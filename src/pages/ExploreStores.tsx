import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Star, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const stores = [
  { id: "fashion-hub", name: "Fashion Hub", category: "Fashion", products: 120, rating: 4.8, emoji: "👗" },
  { id: "tech-zone", name: "Tech Zone", category: "Electronics", products: 85, rating: 4.9, emoji: "💻" },
  { id: "beauty-bar", name: "Beauty Bar", category: "Beauty", products: 64, rating: 4.7, emoji: "💄" },
  { id: "home-haven", name: "Home Haven", category: "Home & Garden", products: 92, rating: 4.6, emoji: "🏠" },
  { id: "sport-central", name: "Sport Central", category: "Sports", products: 45, rating: 4.5, emoji: "⚽" },
  { id: "artisan-crafts", name: "Artisan Crafts", category: "Arts & Crafts", products: 78, rating: 4.9, emoji: "🎨" },
];

export default function ExploreStores() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-bold mb-3">Explore Stores</h1>
          <p className="text-muted-foreground mb-6">Discover unique stores from vendors around the world.</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search stores..." className="pl-9" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to="/store/my-store" className="block bg-card rounded-xl border border-border overflow-hidden hover-lift">
                <div className="h-32 gradient-bg flex items-center justify-center text-5xl">{s.emoji}</div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg">{s.name}</h3>
                    <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" /><span className="text-sm">{s.rating}</span></div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{s.category} · {s.products} products</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1">Visit Store <ArrowRight className="w-3 h-3" /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
