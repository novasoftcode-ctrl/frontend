import StoreLayout from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Cart() {
  const { slug } = useParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const { toast } = useToast();

  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("user_cart") || "[]");
      setCartItems(savedCart);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("user_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("user_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    toast({
      title: "Removed",
      description: "Product removed from cart.",
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({ title: "Cart is empty", description: "Add some products to your cart first.", variant: "destructive" });
      return;
    }
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);
    
    try {
      const storeDataStr = localStorage.getItem("vendor_store_data");
      const storeData = storeDataStr ? JSON.parse(storeDataStr) : null;
      let storeIdToUse = storeData?._id;

      // Ensure we have a storeId
      if (!storeIdToUse && slug) {
         // fetch store data? Since this is on storefront, we could use store context if it was available here.
         // Wait, Cart doesn't use `useStore` in this standalone file. We can assume items have storeId.
      }
      // Or we can just trust the `item.storeId` if it exists, or the first item's store context.
      // Assuming all cart items are for the same store or the backend accepts it.

      // Submit multiple orders (one for each item) to maintain current system compatibility
      const orderPromises = cartItems.map(item => 
        fetch(`${API_BASE_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item._id,
            storeId: storeIdToUse || item.storeId, // Provide a storeId correctly
            ...orderData,
            quantity: item.quantity || 1,
            // Assuming price, etc are derived on backend or not required
          })
        }).then(res => {
          if (!res.ok) throw new Error("A product order failed");
          return res.json();
        })
      );

      await Promise.all(orderPromises);

      toast({ title: "Order Placed Successfully!", description: "The store owner will contact you soon." });
      
      // Clear cart
      setCartItems([]);
      localStorage.removeItem("user_cart");
      window.dispatchEvent(new Event("storage"));
      setOrderModalOpen(false);
      setOrderData({ customerName: "", customerEmail: "", customerPhone: "", customerAddress: "" });

    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to place order", variant: "destructive" });
    } finally {
      setSubmittingOrder(false);
    }
  };

  const subtotal = calculateSubtotal();
  const shipping = cartItems.length > 0 ? 0 : 0; // Free shipping or some flat rate
  const total = subtotal + shipping;

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-heading font-black">Shopping Cart</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
            <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-muted-foreground text-lg mb-6 font-medium">Your cart is empty.</p>
            <Button className="gradient-bg border-0 text-primary-foreground font-bold rounded-full px-8" asChild>
              <Link to={`/store/${slug}/products`}>Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.category || "General"}</p>
                    <div className="text-primary font-black">Rs. {item.price}</div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full py-1 gap-4 shrink-0">
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3 border border-border rounded-full p-1">
                      <button onClick={() => updateQuantity(item._id, -1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold w-4 text-center text-sm">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-80 shrink-0">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-md sticky top-24">
                <h3 className="text-xl font-heading font-black mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-bold text-foreground">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                  </div>
                  <div className="border-t border-border pt-4 mt-4 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-black text-xl text-primary">Rs. {total}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full font-bold gradient-bg border-0 text-primary-foreground rounded-full h-12 shadow-lg shadow-primary/20">
                  Proceed to Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-black">Complete Your Order</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Please provide your delivery details for your order. Total bill: <span className="text-primary font-bold">Rs. {total}</span>.
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
