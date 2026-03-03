import StoreLayout from "@/components/StoreLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StoreProducts() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();

  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    quantity: 1
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    if (slug) {
      const cleanSlug = slug.trim().toLowerCase();
      fetchProducts(cleanSlug);
    }
    const savedFavs = localStorage.getItem("user_favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [slug]);

  const fetchProducts = async (storeSlug: string) => {
    setLoading(true);
    try {
      console.log(`[StoreProducts] Fetching products for: ${storeSlug}`);
      // Use lowercase slug for consistency with backend expectation
      const response = await fetch(`${API_BASE_URL}/api/products/store/${storeSlug.toLowerCase()}`);
      const data = await response.json();
      if (response.ok) {
        console.log(`[StoreProducts] Found ${data.length} products`);
        setProducts(data);
      } else {
        console.error(`[StoreProducts] Failed to fetch products:`, data.message);
      }
    } catch (error) {
      console.error("[StoreProducts] Error in fetchProducts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    let newFavs;
    if (favorites.includes(productId)) {
      newFavs = favorites.filter(id => id !== productId);
      toast({ title: "Removed", description: "Product removed from favorites." });
    } else {
      newFavs = [...favorites, productId];
      toast({ title: "Added", description: "Product added to favorites! ❤️" });
    }
    setFavorites(newFavs);
    localStorage.setItem("user_favorites", JSON.stringify(newFavs));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);
    try {
      const storeDataStr = localStorage.getItem("vendor_store_data");
      const storeData = storeDataStr ? JSON.parse(storeDataStr) : {};

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
        setOrderData({ customerName: "", customerEmail: "", customerPhone: "", customerAddress: "", quantity: 1 });
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmittingOrder(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category || "General")))];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-24 shadow-sm">
              <h3 className="font-heading font-black mb-6 flex items-center gap-2 text-lg"><SlidersHorizontal className="w-5 h-5 text-primary" />Filters</h3>

              <div className="mb-8">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Categories</h4>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCat(c)}
                      className={`block w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${selectedCat === c ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "text-slate-600 hover:bg-slate-50 hover:text-primary font-medium"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Quick Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50 border-0 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-heading font-bold">{selectedCat === "All" ? "Full" : selectedCat} Collection</h2>
              <p className="text-sm font-medium text-muted-foreground">{filtered.length} products found</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-border px-6">
                <p className="text-muted-foreground font-medium text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl border border-border overflow-hidden group hover:shadow-2xl transition-all"
                  >
                    <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
                      )}
                      <button
                        onClick={() => toggleFavorite(p._id)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:scale-110 ${favorites.includes(p._id) ? "text-destructive" : "text-slate-400"}`}
                      >
                        <Heart className={favorites.includes(p._id) ? "fill-current" : ""} />
                      </button>
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2 block">{p.category || "General"}</span>
                      <h3 className="font-heading font-bold text-lg mb-4 group-hover:text-primary transition-colors truncate">{p.name}</h3>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl font-black text-foreground">Rs. {p.price}</span>
                        <Button
                          onClick={() => { setSelectedProduct(p); setOrderModalOpen(true); }}
                          className="rounded-full px-6 font-bold gradient-bg border-0 shadow-lg shadow-primary/20"
                        >
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
                <Label htmlFor="qty">Quantity *</Label>
                <Input id="qty" type="number" min="1" value={orderData.quantity} onChange={(e) => setOrderData({ ...orderData, quantity: parseInt(e.target.value) || 1 })} required />
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
