import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Star, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

import { API_BASE_URL } from "@/config/api";
import { useEffect, useState } from "react";

export default function ExploreStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/store/explore`);
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error("Failed to fetch public stores:", error);
    } finally {
      setLoading(false);
    }
  };
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
          {loading ? (
            <div className="col-span-12 text-center py-12 text-muted-foreground">Loading stores...</div>
          ) : stores.length === 0 ? (
            <div className="col-span-12 text-center py-12 text-muted-foreground">No active stores found.</div>
          ) : (
            stores.map((s, i) => (
              <motion.div key={s._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/store/${s.slug}`} className="block bg-card rounded-xl border border-border overflow-hidden hover-lift">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={s.coverUrl || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop'}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold text-lg">{s.name}</h3>
                      <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" /><span className="text-sm">{s.rating || '5.0'}</span></div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{s.category} · {s.productsCount || 0} products</p>
                    <span className="text-primary text-sm font-medium flex items-center gap-1">Visit Store <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
