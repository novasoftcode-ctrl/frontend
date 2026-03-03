import StoreLayout from "@/components/StoreLayout";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, ShoppingBag, Heart, Search, ArrowRight, Instagram, Facebook, Mail, Phone, MapPin, ExternalLink, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/config/api";

// Categories will be derived dynamically from products

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

export default function StoreFront() {
  const { slug } = useParams();
  const [storeName, setStoreName] = useState("My Store");
  const [storeCover, setStoreCover] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Derive dynamic categories
  const categories = products.reduce((acc: any[], p: any) => {
    const catName = p.category || "General";
    const existing = acc.find(c => c.name === catName);
    if (existing) {
      existing.count++;
    } else {
      const emojiMap: Record<string, string> = { "Fashion": "👗", "Electronics": "🎧", "Accessories": "👜", "Footwear": "👟" };
      acc.push({ name: catName, emoji: emojiMap[catName] || "📦", count: 1 });
    }
    return acc;
  }, []);
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: ""
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const { toast } = useToast();

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
      toast({ title: "Required Fields", description: "Please fill in all details.", variant: "destructive" });
      return;
    }

    setSubmittingOrder(true);
    try {
      const storeData = JSON.parse(localStorage.getItem("vendor_store_data") || "{}");
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          storeId: storeData._id,
          ...orderData
        })
      });

      if (response.ok) {
        toast({ title: "Order Placed!", description: "The store owner will contact you soon." });
        setOrderModalOpen(false);
        setOrderData({ customerName: "", customerEmail: "", customerPhone: "", customerAddress: "" });
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmittingOrder(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchStoreDetails(slug);
      fetchProducts(slug);
    }

    const savedFavs = localStorage.getItem("user_favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [slug]);

  const fetchStoreDetails = async (storeSlug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/store/${storeSlug}`);
      const data = await response.json();
      if (response.ok) {
        setStoreName(data.name);
        setStoreCover(data.coverUrl);
        // Save to local storage for other pages to use if needed, but don't rely on it for this page
        localStorage.setItem("vendor_store_data", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching store details:", error);
    }
  };

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

  const toggleFavorite = (productId: string) => {
    let newFavs;
    if (favorites.includes(productId)) {
      newFavs = favorites.filter(id => id !== productId);
      toast({ title: "Removed from Favorites", description: "Product removed from your list." });
    } else {
      newFavs = [...favorites, productId];
      toast({ title: "Added to Favorites", description: "Product added to your wishlist! ❤️" });
    }
    setFavorites(newFavs);
    localStorage.setItem("user_favorites", JSON.stringify(newFavs));
  };

  return (
    <StoreLayout>
      {/* Hero Banner */}
      <section
        className={`py-20 text-center relative overflow-hidden ${!storeCover ? 'gradient-bg' : ''}`}
        style={storeCover ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${storeCover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {!storeCover && <div className="absolute inset-0 bg-black/5 pointer-events-none" />}
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold">Featured Products</h2>
            <Button variant="outline" className="rounded-full font-bold" asChild>
              <Link to={`/store/${slug}/products`}>View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
              <p className="text-muted-foreground font-medium">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ y: -10 }}
                  className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl transition-all group"
                >
                  <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
                    )}
                    {p.stock === 0 && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{p.category || "General"}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />)}
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-1 group-hover:text-primary transition-colors truncate">{p.name}</h3>
                    <div className="flex items-center justify-between mt-4 gap-3">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-foreground">${p.price}</span>
                        {p.comparePrice && <span className="text-xs text-muted-foreground line-through">${p.comparePrice}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(p._id)}
                          className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all hover:scale-110 ${favorites.includes(p._id) ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(p._id) ? "fill-current" : ""}`} />
                        </button>
                        <Button
                          size="sm"
                          onClick={() => { setSelectedProduct(p); setOrderModalOpen(true); }}
                          className="rounded-full px-5 gradient-bg border-0 text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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

      {/* Order Modal */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-black">Complete Your Order</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Please provide your delivery details for <span className="text-primary font-bold">{selectedProduct?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOrderSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="John Doe" value={orderData.customerName} onChange={(e) => setOrderData({ ...orderData, customerName: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" value={orderData.customerEmail} onChange={(e) => setOrderData({ ...orderData, customerEmail: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+92 300 1234567" value={orderData.customerPhone} onChange={(e) => setOrderData({ ...orderData, customerPhone: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea id="address" placeholder="House #, Street, City, ZIP" value={orderData.customerAddress} onChange={(e) => setOrderData({ ...orderData, customerAddress: e.target.value })} className="min-h-[100px]" required />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOrderModalOpen(false)} className="rounded-full">Cancel</Button>
              <Button type="submit" disabled={submittingOrder} className="gradient-bg border-0 text-primary-foreground font-bold rounded-full px-8 shadow-lg shadow-primary/20">
                {submittingOrder ? "Placing Order..." : "Confirm Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </StoreLayout>
  );
}
