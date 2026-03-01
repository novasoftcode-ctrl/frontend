import StoreLayout from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

const initialCart = [
  { id: 1, name: "Classic Blue Dress", size: "M", color: "Blue", price: 89.99, qty: 1, img: "👗" },
  { id: 2, name: "Wireless Earbuds Pro", size: "-", color: "White", price: 49.99, qty: 2, img: "🎧" },
  { id: 3, name: "Leather Crossbody Bag", size: "-", color: "Brown", price: 129.99, qty: 1, img: "👜" },
];

export default function Cart() {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const remove = (id: number) => setCart(cart.filter((i) => i.id !== id));

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button className="gradient-bg border-0 text-primary-foreground" asChild><Link to="/store/my-store/products">Continue Shopping</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center text-4xl shrink-0">{item.img}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.size} · Color: {item.color}</p>
                      </div>
                      <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-lg">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1.5"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1.5"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <span className="font-heading font-bold">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-card rounded-xl border border-border p-6 sticky top-20">
                <h3 className="font-heading font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-success">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="border-t border-border pt-3 flex justify-between font-heading font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>

                <div className="flex gap-2 mt-5">
                  <Input placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="flex-1" />
                  <Button variant="outline" size="sm"><Tag className="w-3.5 h-3.5" /></Button>
                </div>

                <Button className="w-full mt-4 gradient-bg border-0 text-primary-foreground" size="lg" asChild>
                  <Link to="/checkout">Checkout <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">Free shipping on orders over $50</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
