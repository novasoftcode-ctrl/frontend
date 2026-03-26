import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CreditCard, Truck, Store, Smartphone, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

const cartItems = [
  { name: "Classic Blue Dress", price: 89.99, qty: 1, img: "👗" },
  { name: "Wireless Earbuds Pro", price: 49.99, qty: 2, img: "🎧" },
  { name: "Leather Crossbody Bag", price: 129.99, qty: 1, img: "👜" },
];

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState("online"); // "online" or "cash"
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [storePaymentMethods, setStorePaymentMethods] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  // Get store slug from URL or use a default
  const getStoreSlug = () => {
    const pathParts = window.location.pathname.split('/');
    const storeIndex = pathParts.indexOf('store');
    return storeIndex !== -1 && pathParts[storeIndex + 1] ? pathParts[storeIndex + 1] : 'default-store';
  };

  useEffect(() => {
    const fetchStorePaymentMethods = async () => {
      try {
        const storeSlug = getStoreSlug();
        const response = await fetch(`${API_BASE_URL}/api/store/${storeSlug}`);
        if (response.ok) {
          const data = await response.json();
          setStorePaymentMethods(data.paymentMethods || {});
        }
      } catch (error) {
        console.error("Error fetching store payment methods:", error);
      }
    };

    if (step === 2) {
      fetchStorePaymentMethods();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 flex items-center h-14">
          <Link to="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />Back to Cart
          </Link>
          <Link to="/" className="mx-auto flex items-center gap-2 font-heading font-bold">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center"><Store className="w-4 h-4 text-primary-foreground" /></div>
            PrismZone
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[{ n: 1, label: "Shipping", icon: Truck }, { n: 2, label: "Payment", icon: CreditCard }, { n: 3, label: "Confirm", icon: Check }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s.n <= step ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {s.n < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              </div>
              <span className={`text-sm hidden sm:block ${s.n <= step ? "font-medium" : "text-muted-foreground"}`}>{s.label}</span>
              {i < 2 && <div className={`w-12 h-0.5 ${s.n < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="lg:col-span-2">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border p-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-heading font-bold mb-6">Shipping Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input className="mt-1.5" /></div>
                    <div><Label>Last Name</Label><Input className="mt-1.5" /></div>
                    <div className="sm:col-span-2"><Label>Address</Label><Input className="mt-1.5" /></div>
                    <div><Label>City</Label><Input className="mt-1.5" /></div>
                    <div><Label>State/Province</Label><Input className="mt-1.5" /></div>
                    <div><Label>ZIP Code</Label><Input className="mt-1.5" /></div>
                    <div><Label>Country</Label><Input className="mt-1.5" /></div>
                    <div className="sm:col-span-2"><Label>Phone</Label><Input className="mt-1.5" /></div>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-heading font-bold mb-6">Payment Method</h2>
                  
                  {/* Payment Type Selection */}
                  <div className="space-y-3 mb-6">
                    <Label className="text-sm font-medium">Choose Payment Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentType === "online" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                        <input type="radio" name="paymentType" value="online" checked={paymentType === "online"} onChange={(e) => setPaymentType(e.target.value)} className="accent-primary" />
                        <div className="flex-1">
                          <span className="text-sm font-medium block">Online Payment</span>
                          <span className="text-xs text-muted-foreground">Pay via EasyPaisa, JazzCash</span>
                        </div>
                        <CreditCard className="w-5 h-5 text-primary" />
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentType === "cash" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                        <input type="radio" name="paymentType" value="cash" checked={paymentType === "cash"} onChange={(e) => setPaymentType(e.target.value)} className="accent-primary" />
                        <div className="flex-1">
                          <span className="text-sm font-medium block">Cash on Delivery</span>
                          <span className="text-xs text-muted-foreground">Pay when you receive</span>
                        </div>
                        <Truck className="w-5 h-5 text-primary" />
                      </label>
                    </div>
                  </div>

                  {/* Online Payment Methods */}
                  {paymentType === "online" && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Select Online Payment Method</Label>
                      {storePaymentMethods ? (
                        <div className="space-y-3">
                          {storePaymentMethods.easypaisa?.enabled && (
                            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedPaymentMethod === "easypaisa" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                              <input type="radio" name="paymentMethod" value="easypaisa" checked={selectedPaymentMethod === "easypaisa"} onChange={(e) => setSelectedPaymentMethod(e.target.value)} className="accent-primary" />
                              <div className="flex items-center gap-3 flex-1">
                                <Smartphone className="w-5 h-5 text-green-600" />
                                <div>
                                  <span className="text-sm font-medium">EasyPaisa</span>
                                  <p className="text-xs text-muted-foreground">Pay with EasyPaisa account</p>
                                </div>
                              </div>
                            </label>
                          )}
                          {storePaymentMethods.jazzcash?.enabled && (
                            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedPaymentMethod === "jazzcash" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                              <input type="radio" name="paymentMethod" value="jazzcash" checked={selectedPaymentMethod === "jazzcash"} onChange={(e) => setSelectedPaymentMethod(e.target.value)} className="accent-primary" />
                              <div className="flex items-center gap-3 flex-1">
                                <Smartphone className="w-5 h-5 text-blue-600" />
                                <div>
                                  <span className="text-sm font-medium">JazzCash</span>
                                  <p className="text-xs text-muted-foreground">Pay with JazzCash account</p>
                                </div>
                              </div>
                            </label>
                          )}
                          {storePaymentMethods.bankTransfer?.enabled && (
                            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedPaymentMethod === "bankTransfer" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                              <input type="radio" name="paymentMethod" value="bankTransfer" checked={selectedPaymentMethod === "bankTransfer"} onChange={(e) => setSelectedPaymentMethod(e.target.value)} className="accent-primary" />
                              <div className="flex items-center gap-3 flex-1">
                                <Building className="w-5 h-5 text-purple-600" />
                                <div>
                                  <span className="text-sm font-medium">Bank Transfer</span>
                                  <p className="text-xs text-muted-foreground">Direct bank transfer</p>
                                </div>
                              </div>
                            </label>
                          )}
                          {!storePaymentMethods.easypaisa?.enabled && !storePaymentMethods.jazzcash?.enabled && !storePaymentMethods.bankTransfer?.enabled && (
                            <div className="text-center py-8 bg-muted/30 rounded-lg">
                              <p className="text-muted-foreground">No online payment methods available</p>
                              <p className="text-sm text-muted-foreground">Please contact the store owner</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <p className="text-muted-foreground">Loading payment methods...</p>
                        </div>
                      )}

                      {/* Payment Details Form */}
                      {selectedPaymentMethod && (
                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                          <Label className="text-sm font-medium">Payment Details</Label>
                          <div>
                            <Label className="text-xs">Account Number</Label>
                            <Input 
                              placeholder="Enter your account number" 
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Account Holder Name</Label>
                            <Input 
                              placeholder="Enter account holder name" 
                              className="mt-1.5"
                            />
                          </div>
                          {selectedPaymentMethod === "bankTransfer" && (
                            <div>
                              <Label className="text-xs">Transaction ID</Label>
                              <Input 
                                placeholder="Enter transaction ID" 
                                className="mt-1.5"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cash on Delivery Message */}
                  {paymentType === "cash" && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">You will pay when you receive your order</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {step === 3 && (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-success" />
                  </motion.div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Order Confirmed! 🎉</h2>
                  <p className="text-muted-foreground mb-1">Thank you for your purchase.</p>
                  <p className="text-sm text-muted-foreground mb-6">Order #ORD-12346 · Confirmation email sent</p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" asChild><Link to="/store/my-store/products">Continue Shopping</Link></Button>
                    <Button className="gradient-bg border-0 text-primary-foreground" asChild><Link to="/profile">View Order</Link></Button>
                  </div>
                </div>
              )}

              {step < 3 && (
                <div className="flex gap-3 mt-8">
                  {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>}
                  <Button className="flex-1 gradient-bg border-0 text-primary-foreground" onClick={() => setStep(step + 1)}>
                    {step === 2 ? "Place Order" : "Continue to Payment"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Summary */}
          <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-20">
            <h3 className="font-heading font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">{item.img}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-medium">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
              <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-border"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
