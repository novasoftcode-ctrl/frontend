import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardSettings() {
  const { toast } = useToast();
  const [storeData, setStoreData] = useState({
    name: "My Awesome Store",
    description: "Welcome to my store!",
    email: "john@example.com"
  });

  useEffect(() => {
    const savedStore = localStorage.getItem("vendor_store_data");
    const savedAccount = localStorage.getItem("user_account_data");

    let updatedData = { ...storeData };
    if (savedStore) {
      const parsedStore = JSON.parse(savedStore);
      updatedData.name = parsedStore.name || updatedData.name;
      updatedData.description = parsedStore.description || updatedData.description;
      updatedData.email = parsedStore.email || updatedData.email;
    } else if (savedAccount) {
      const parsedAccount = JSON.parse(savedAccount);
      updatedData.email = parsedAccount.email || updatedData.email;
    }
    setStoreData(updatedData);
  }, []);

  const handleSave = () => {
    // Update store data in localStorage
    const savedStore = localStorage.getItem("vendor_store_data");
    if (savedStore) {
      const parsedStore = JSON.parse(savedStore);
      parsedStore.name = storeData.name;
      parsedStore.description = storeData.description;
      localStorage.setItem("vendor_store_data", JSON.stringify(parsedStore));
      localStorage.setItem("vendor_store_name", JSON.stringify(storeData.name));
    }

    // Update account data in localStorage
    const savedAccount = localStorage.getItem("user_account_data");
    if (savedAccount) {
      const parsedAccount = JSON.parse(savedAccount);
      parsedAccount.email = storeData.email;
      localStorage.setItem("user_account_data", JSON.stringify(parsedAccount));
    }

    toast({
      title: "Settings Saved",
      description: "Your store settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your store settings.</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div>
                <Label>Store Name</Label>
                <Input
                  value={storeData.name}
                  readOnly
                  className="mt-1.5 bg-muted cursor-not-allowed font-bold"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Store name is linked to your URL and cannot be changed.</p>
              </div>
              <div>
                <Label>Store Description</Label>
                <textarea
                  className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-primary outline-none"
                  value={storeData.description}
                  onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Store URL</Label>
                <Input value={`https://prism-zone.netlify.app/store/${storeData.name.toLowerCase().replace(/\s+/g, '-')}`} readOnly className="mt-1.5 bg-muted font-mono text-xs cursor-not-allowed" />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input
                  value={storeData.email}
                  onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                  className="mt-1.5 h-11 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={handleSave} className="gradient-bg border-0 text-primary-foreground">Save Changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-heading font-semibold mb-4">Payment Methods</h3>
              <p className="text-muted-foreground text-sm">Configure payment gateways for your store.</p>
              <div className="mt-4 space-y-3">
                {["Credit/Debit Cards", "PayPal", "Bank Transfer"].map((m) => (
                  <div key={m} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <span className="font-medium text-sm">{m}</span>
                    <Button variant="outline" size="sm">Configure</Button>
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
              {["New Order", "Order Shipped", "Low Stock Alert", "New Customer"].map((n) => (
                <div key={n} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm">{n}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-card after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
