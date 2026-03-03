import StoreLayout from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Star, Minus, Plus, Heart, Share2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function ProductDetail() {
  const { slug, id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { toast } = useToast();

  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: ""
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
    const savedFavs = localStorage.getItem("user_favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
      const data = await response.json();
      if (response.ok) {
        setProduct(data);
        fetchRelatedProducts(data.store._id, productId);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (storeId: string, currentProductId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/store/${slug}`);
      const data = await response.json();
      if (response.ok) {
        setRelated(data.filter((p: any) => p._id !== currentProductId).slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
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
      const storeData = product.store;
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          storeId: storeData._id,
          ...orderData,
          quantity: qty
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

  if (loading) return (
    <StoreLayout>
      <div className="flex items-center justify-center p-40">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </StoreLayout>
  );

  if (!product) return (
    <StoreLayout>
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button asChild><Link to={`/store/${slug}`}>Back to Store</Link></Button>
      </div>
    </StoreLayout>
  );

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to={`/store/${slug}/products`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-50 rounded-[2rem] h-[500px] flex items-center justify-center overflow-hidden border border-border group">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="text-9xl">📦</div>
              )}
            </motion.div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-primary/60 mb-3 block">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-tight leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-accent text-accent" : "text-slate-200"}`} />)}</div>
                <span className="text-sm font-bold text-slate-500">4.5 (12 reviews)</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black text-foreground">Rs. {product.price}</span>
                {product.comparePrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-muted-foreground line-through">Rs. {product.comparePrice}</span>
                    <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-black uppercase tracking-widest">Sale</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-success mb-8">✓ In Stock ({product.stock} units)</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-border mb-8">
              <p className="text-slate-600 leading-relaxed font-medium">{product.description}</p>
            </div>

            <div className="mt-auto space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 flex items-center bg-slate-100 rounded-full px-2 border border-border">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all"><Minus className="w-4 h-4" /></button>
                  <span className="w-12 text-center font-black text-lg">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all"><Plus className="w-4 h-4" /></button>
                </div>
                <Button
                  onClick={() => setOrderModalOpen(true)}
                  className="flex-1 h-14 rounded-full font-black text-lg gradient-bg border-0 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Order Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavorite(product._id)}
                  className={`w-14 h-14 rounded-full border-2 transition-all ${favorites.includes(product._id) ? "border-destructive/20 bg-destructive/5 text-destructive" : "hover:border-primary hover:text-primary"}`}
                >
                  <Heart className={favorites.includes(product._id) ? "fill-current" : ""} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-heading font-black">You May Also Like</h2>
              <div className="h-1 w-20 bg-primary/20 rounded-full" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p._id} to={`/store/${slug}/product/${p._id}`} className="bg-white rounded-3xl border border-border overflow-hidden hover-lift group shadow-sm hover:shadow-xl transition-all">
                  <div className="h-56 bg-muted relative overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-primary transition-colors truncate">{p.name}</h3>
                    <span className="font-black text-xl text-foreground">Rs. {p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Order Modal */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-black">Complete Your Order</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Deliver to: Your preferred address.
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
              <div className="bg-primary/5 p-4 rounded-2xl flex justify-between items-center">
                <span className="font-bold">Total (x{qty})</span>
                <span className="text-xl font-black text-primary">Rs. {product?.price * qty}</span>
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
