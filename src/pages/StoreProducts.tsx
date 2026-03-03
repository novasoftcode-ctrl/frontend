import StoreLayout from "@/components/StoreLayout";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

// Removed static allProducts

const categories = ["All", "Fashion", "Electronics", "Accessories", "Footwear", "Beauty", "Sports", "Home"];

export default function StoreProducts() {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    if (slug) fetchProducts(slug);
  }, [slug]);

  const fetchProducts = async (storeSlug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/store/${storeSlug}`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => selectedCat === "All" || p.category === selectedCat);

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />Filters</h3>
              <div className="mb-5">
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button key={c} onClick={() => setSelectedCat(c)} className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCat === c ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <Input placeholder="Min" type="number" className="w-20" />
                  <Input placeholder="Max" type="number" className="w-20" />
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{filtered.length} products</p>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                  <p className="text-muted-foreground font-medium">No products found in this category.</p>
                </div>
              ) : filtered.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/store/${slug}/product/${p._id}`} className="block bg-card rounded-xl border border-border overflow-hidden hover-lift group">
                    <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <span className="text-6xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
                      <h3 className="font-medium text-sm mb-1">{p.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" /><span className="text-xs">{p.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold">${p.price.toFixed(2)}</span>
                        <Button size="sm" variant="outline" className="h-8"><ShoppingCart className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
