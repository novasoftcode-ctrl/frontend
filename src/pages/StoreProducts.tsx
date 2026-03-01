import StoreLayout from "@/components/StoreLayout";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const allProducts = [
  { id: 1, name: "Classic Blue Dress", price: 89.99, category: "Fashion", rating: 4.8, img: "👗" },
  { id: 2, name: "Wireless Earbuds Pro", price: 49.99, category: "Electronics", rating: 4.9, img: "🎧" },
  { id: 3, name: "Leather Crossbody Bag", price: 129.99, category: "Accessories", rating: 4.7, img: "👜" },
  { id: 4, name: "Running Sneakers", price: 79.99, category: "Footwear", rating: 4.5, img: "👟" },
  { id: 5, name: "Smartwatch Elite", price: 199.99, category: "Electronics", rating: 4.6, img: "⌚" },
  { id: 6, name: "Organic Face Cream", price: 34.99, category: "Beauty", rating: 4.4, img: "🧴" },
  { id: 7, name: "Cotton T-Shirt Pack", price: 24.99, category: "Fashion", rating: 4.3, img: "👕" },
  { id: 8, name: "Yoga Mat Premium", price: 44.99, category: "Sports", rating: 4.8, img: "🧘" },
  { id: 9, name: "Sunglasses Classic", price: 59.99, category: "Accessories", rating: 4.2, img: "🕶️" },
  { id: 10, name: "Ceramic Mug Set", price: 19.99, category: "Home", rating: 4.6, img: "☕" },
  { id: 11, name: "Backpack Pro", price: 69.99, category: "Accessories", rating: 4.7, img: "🎒" },
  { id: 12, name: "Candle Collection", price: 29.99, category: "Home", rating: 4.5, img: "🕯️" },
];

const categories = ["All", "Fashion", "Electronics", "Accessories", "Footwear", "Beauty", "Sports", "Home"];

export default function StoreProducts() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = allProducts.filter((p) => selectedCat === "All" || p.category === selectedCat);

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
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/store/my-store/product/${p.id}`} className="block bg-card rounded-xl border border-border overflow-hidden hover-lift group">
                    <div className="h-48 bg-muted flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">{p.img}</div>
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
