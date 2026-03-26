import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";

export default function DashboardSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    email: "",
    address: "",
    phone: "",
    slug: "",
    notifications: {
      newOrder: true,
      lowStock: true,
      newCustomer: true
    }
  });
  const [paymentMethods, setPaymentMethods] = useState({
    easypaisa: { enabled: false, accountNumber: "", accountName: "" },
    jazzcash: { enabled: false, accountNumber: "", accountName: "" },
    bankTransfer: { enabled: false, accountNumber: "", accountName: "", bankName: "" }
  });
  const [showPaymentConfig, setShowPaymentConfig] = useState<string | null>(null);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`${API_BASE_URL}/api/store/view/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setStoreData({
          name: data.name || "",
          description: data.description || "",
          email: data.email || "",
          address: data.address || "",
          phone: data.phone || "",
          slug: data.slug || "",
          notifications: data.notifications || { newOrder: true, lowStock: true, newCustomer: true }
        });
        // Fetch payment methods configuration
        const paymentResponse = await fetch(`${API_BASE_URL}/api/store/payment-methods`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          setPaymentMethods(paymentData.paymentMethods || {
            easypaisa: { enabled: false, accountNumber: "", accountName: "" },
            jazzcash: { enabled: false, accountNumber: "", accountName: "" },
            bankTransfer: { enabled: false, accountNumber: "", accountName: "", bankName: "" }
          });
        }
      }
    } catch (error) {
      console.error("Error fetching store settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`${API_BASE_URL}/api/store/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          description: storeData.description,
          address: storeData.address,
          phone: storeData.phone,
          email: storeData.email,
          notifications: storeData.notifications,
          paymentMethods: paymentMethods
        })
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your store settings have been updated successfully.",
        });
        // Update local state with the returned data
        setStoreData({
          name: result.store.name || "",
          description: result.store.description || "",
          email: result.store.email || "",
          address: result.store.address || "",
          phone: result.store.phone || "",
          slug: result.store.slug || "",
          notifications: result.store.notifications || { newOrder: true, lowStock: true, newCustomer: true }
        });
      } else {
        throw new Error(result.message || "Failed to update settings");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePaymentConfigSave = async (method: string) => {
    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`${API_BASE_URL}/api/store/payment-methods`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethods: {
            ...paymentMethods,
            [method]: paymentMethods[method as keyof typeof paymentMethods]
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Payment Method Updated",
          description: `${method.charAt(0).toUpperCase() + method.slice(1)} configuration saved successfully.`,
        });
        setShowPaymentConfig(null);
      } else {
        throw new Error("Failed to update payment method");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const copyStoreUrl = () => {
    if (!storeData.slug) return;
    const url = `${window.location.origin}/store/${storeData.slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Store link copied to clipboard!",
    });
  };

  if (loading) return <DashboardLayout><div>Loading settings...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your store settings.</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="general" className="px-6">General</TabsTrigger>
            <TabsTrigger value="payments" className="px-6">Payments</TabsTrigger>
            <TabsTrigger value="shipping" className="px-6">Shipping</TabsTrigger>
            <TabsTrigger value="notifications" className="px-6">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Store Name</Label>
                    <Input
                      value={storeData.name}
                      disabled
                      className="h-12 bg-muted/30 border-dashed cursor-not-allowed font-bold text-slate-500"
                    />
                    <p className="text-[10px] text-muted-foreground font-medium">Store name is permament and cannot be changed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Store URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={`${window.location.origin}/store/${storeData.slug || ""}`}
                        disabled
                        className="h-12 bg-muted/30 border-dashed cursor-not-allowed font-mono text-xs text-slate-500 flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={copyStoreUrl} className="h-12 w-12 shrink-0">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Store Description</Label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-background p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Tell customers about your store..."
                    value={storeData.description}
                    onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Phone Number</Label>
                    <Input
                      placeholder="+92 300 1234567"
                      value={storeData.phone}
                      onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                      className="h-12 rounded-xl focus:ring-2 focus:ring-primary/20 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Contact Email</Label>
                    <Input
                      placeholder="store@example.com"
                      value={storeData.email}
                      onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                      className="h-12 rounded-xl focus:ring-2 focus:ring-primary/20 border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Store Address</Label>
                  <Input
                    placeholder="Shop #, Market, City"
                    value={storeData.address}
                    onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                    className="h-12 rounded-xl focus:ring-2 focus:ring-primary/20 border-border"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button onClick={handleSave} className="gradient-bg border-0 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95">
                  Save All Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-heading font-semibold mb-4">Payment Methods</h3>
              <p className="text-muted-foreground text-sm">Configure payment gateways for your store.</p>
              <div className="mt-4 space-y-3">
                {[
                  { key: "easypaisa", name: "EasyPaisa", icon: "📱" },
                  { key: "jazzcash", name: "JazzCash", icon: "📱" },
                  { key: "bankTransfer", name: "Bank Transfer", icon: "🏦" }
                ].map((method) => (
                  <div key={method.key} className="border border-border rounded-lg">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-medium text-sm">{method.name}</span>
                        {(paymentMethods[method.key as keyof typeof paymentMethods] as any)?.enabled && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Enabled</span>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPaymentConfig(showPaymentConfig === method.key ? null : method.key)}
                      >
                        {showPaymentConfig === method.key ? "Cancel" : "Configure"}
                      </Button>
                    </div>
                    
                    {showPaymentConfig === method.key && (
                      <div className="border-t border-border p-4 bg-muted/30">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={(paymentMethods[method.key as keyof typeof paymentMethods] as any)?.enabled || false}
                              onChange={(e) => setPaymentMethods({
                                ...paymentMethods,
                                [method.key]: {
                                  ...paymentMethods[method.key as keyof typeof paymentMethods],
                                  enabled: e.target.checked
                                }
                              })}
                              className="rounded border-border"
                            />
                            <label className="text-sm font-medium">Enable {method.name}</label>
                          </div>
                          
                          {(paymentMethods[method.key as keyof typeof paymentMethods] as any)?.enabled && (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs font-bold uppercase tracking-wider">Account Name</Label>
                                  <Input
                                    placeholder="Account holder name"
                                    value={(paymentMethods[method.key as keyof typeof paymentMethods] as any)?.accountName || ""}
                                    onChange={(e) => setPaymentMethods({
                                      ...paymentMethods,
                                      [method.key]: {
                                        ...paymentMethods[method.key as keyof typeof paymentMethods],
                                        accountName: e.target.value
                                      }
                                    })}
                                    className="mt-1.5"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs font-bold uppercase tracking-wider">Account Number</Label>
                                  <Input
                                    placeholder="Account number"
                                    value={(paymentMethods[method.key as keyof typeof paymentMethods] as any)?.accountNumber || ""}
                                    onChange={(e) => setPaymentMethods({
                                      ...paymentMethods,
                                      [method.key]: {
                                        ...paymentMethods[method.key as keyof typeof paymentMethods],
                                        accountNumber: e.target.value
                                      }
                                    })}
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                              
                              {method.key === "bankTransfer" && (
                                <div>
                                  <Label className="text-xs font-bold uppercase tracking-wider">Bank Name</Label>
                                  <Input
                                    placeholder="Bank name"
                                    value={(paymentMethods.bankTransfer as any)?.bankName || ""}
                                    onChange={(e) => setPaymentMethods({
                                      ...paymentMethods,
                                      bankTransfer: {
                                        ...paymentMethods.bankTransfer,
                                        bankName: e.target.value
                                      }
                                    })}
                                    className="mt-1.5"
                                  />
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handlePaymentConfigSave(method.key)}
                                  className="gradient-bg border-0 text-primary-foreground"
                                >
                                  Save Configuration
                                </Button>
                                <Button variant="outline" onClick={() => setShowPaymentConfig(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-heading font-semibold mb-2">Shipping Zones</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Domestic Shipping ($)</Label><Input type="number" defaultValue="5.99" className="mt-1.5" /></div>
                <div><Label>International Shipping ($)</Label><Input type="number" defaultValue="14.99" className="mt-1.5" /></div>
              </div>
              <div><Label>Free Shipping Threshold ($)</Label><Input type="number" defaultValue="50" className="mt-1.5" /></div>
              <Button className="gradient-bg border-0 text-primary-foreground">Save Changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h3 className="font-heading font-semibold mb-2">Email Notifications</h3>
              {[
                { label: "New Order", key: "newOrder" },
                { label: "Low Stock Alert", key: "lowStock" },
                { label: "New Customer", key: "newCustomer" }
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm">{n.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(storeData.notifications as any)[n.key]}
                      onChange={(e) => setStoreData({
                        ...storeData,
                        notifications: { ...storeData.notifications, [n.key]: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-card after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <Button onClick={handleSave} className="gradient-bg border-0 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95">
                  Update Preferences
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
