import StoreLayout from "@/components/StoreLayout";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const categories = [
  { name: "Fashion", emoji: "👗", count: 42 },
  { name: "Electronics", emoji: "🎧", count: 28 },
  { name: "Accessories", emoji: "👜", count: 35 },
  { name: "Footwear", emoji: "👟", count: 19 },
];

// The original 'featured' array is removed as per the instruction's intent to replace it with dynamic loading.

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

export default function StoreFront() {
  const { slug } = useParams();
  const [storeName, setStoreName] = useState("My Store");
  const [products, setProducts] = useState<any[]>([]); // State for products

  useEffect(() => {
    const saved = localStorage.getItem("vendor_store_name");
    if (saved) setStoreName(saved);

    // Load products from localStorage
    const savedProducts = localStorage.getItem("vendor_products");
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch (e) {
        console.error("Error parsing products from localStorage", e);
      }
    }
  }, []);

  // Fallback products if none are found in localStorage
  const displayProducts = products.length > 0 ? products : [
    { id: 1, name: "Premium Leather Jacket", price: "199.99", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format" },
    { id: 2, name: "Minimalist Watch", price: "149.50", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format" },
    { id: 3, name: "Wireless Headphones", price: "89.00", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format" },
    { id: 4, name: "Silk Summer Dress", price: "125.00", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format" },
  ];

  return (
    <StoreLayout>
      {/* Hero Banner */}
      <section className="gradient-bg py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-black text-primary-foreground mb-6 tracking-tight"
          >
            Welcome to {storeName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/90 text-xl mb-10 max-w-2xl mx-auto font-medium"
          >
            Discover unique products curated just for you with premium quality and exceptional style.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 h-14 rounded-full text-lg shadow-xl shadow-black/10" asChild>
              <Link to={`/store/${slug}/products`}>Shop Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-heading font-bold">Shop by Category</h2>
            <div className="h-1 w-20 bg-primary/20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c, i) => (
              <motion.div key={c.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={`/store/${slug}/products`} className="block bg-white rounded-2xl border border-border p-8 text-center hover-lift shadow-sm hover:shadow-md transition-all">
                  <span className="text-5xl block mb-4">{c.emoji}</span>
                  <h3 className="font-heading font-bold text-lg mb-1">{c.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{c.count} products</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-heading font-black tracking-tight italic mb-4">Featured Products</h2>
            <p className="text-slate-500 font-medium text-lg">Handpicked excellence just for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((p, i) => ( // Added 'i' for custom delay
              <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="group">
                <Link to={`/store/${slug}/product/${p.id}`} className="block"> {/* Wrapped product card in Link */}
                  <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 bg-white shadow-sm border border-slate-100">
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={p.name}
                    />
                    <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <Button size="icon" className="w-12 h-12 rounded-full shadow-xl bg-white text-slate-900 hover:bg-primary hover:text-white border-0">
                        <ShoppingBag className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-slate-900 group-hover:text-primary transition-colors">{p.name}</h3>
                    {/* Assuming price is a string or number, format it with $ */}
                    <p className="text-2xl font-black text-primary italic font-heading">${parseFloat(p.price).toFixed(2)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl" />

            <h2 className="text-3xl md:text-4xl font-heading font-black mb-4 relative z-10">Stay Updated with {storeName}</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto font-medium relative z-10">Subscribe for new arrivals, exclusive deals, and more.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
              <Input placeholder="Enter your email" className="h-14 rounded-full border-0 bg-white/10 text-white placeholder:text-white/50 px-8 focus-visible:ring-white/30 text-lg" />
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-black h-14 rounded-full px-8 shadow-xl">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
