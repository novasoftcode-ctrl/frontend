import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, MapPin, Heart, Package, Settings } from "lucide-react";

const orderHistory = [
  { id: "#ORD-12346", date: "Feb 25, 2026", total: "$319.96", status: "Delivered", items: 4 },
  { id: "#ORD-12300", date: "Feb 10, 2026", total: "$89.99", status: "Delivered", items: 1 },
  { id: "#ORD-12250", date: "Jan 28, 2026", total: "$199.99", status: "Delivered", items: 1 },
];

const wishlist = [
  { id: 5, name: "Smartwatch Elite", price: "$199.99", img: "⌚" },
  { id: 8, name: "Yoga Mat Premium", price: "$44.99", img: "🧘" },
  { id: 11, name: "Backpack Pro", price: "$69.99", img: "🎒" },
];

const sc: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Processing: "bg-accent/10 text-accent",
};

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-2xl font-bold">J</div>
            <div>
              <h1 className="text-2xl font-heading font-bold">John Doe</h1>
              <p className="text-muted-foreground">john@example.com</p>
            </div>
          </div>

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile"><User className="w-4 h-4 mr-1" />Profile</TabsTrigger>
              <TabsTrigger value="orders"><Package className="w-4 h-4 mr-1" />Orders</TabsTrigger>
              <TabsTrigger value="addresses"><MapPin className="w-4 h-4 mr-1" />Addresses</TabsTrigger>
              <TabsTrigger value="wishlist"><Heart className="w-4 h-4 mr-1" />Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Full Name</Label><Input defaultValue="John Doe" className="mt-1.5" /></div>
                  <div><Label>Email</Label><Input defaultValue="john@example.com" className="mt-1.5" /></div>
                  <div><Label>Phone</Label><Input defaultValue="+1 (555) 000-0000" className="mt-1.5" /></div>
                  <div><Label>Date of Birth</Label><Input type="date" className="mt-1.5" /></div>
                </div>
                <Button className="gradient-bg border-0 text-primary-foreground">Save Changes</Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-4 font-medium">Order</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Items</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                  </tr></thead>
                  <tbody>
                    {orderHistory.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="p-4 font-medium">{o.id}</td>
                        <td className="p-4">{o.date}</td>
                        <td className="p-4">{o.items}</td>
                        <td className="p-4 font-medium">{o.total}</td>
                        <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc[o.status] || "bg-muted text-muted-foreground"}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-muted-foreground">123 Main St, Apt 4B<br />New York, NY 10001<br />United States</p>
                </div>
                <button className="bg-card rounded-xl border-2 border-dashed border-border p-5 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <span className="text-sm">+ Add New Address</span>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <div className="grid sm:grid-cols-3 gap-4">
                {wishlist.map((p) => (
                  <Link key={p.id} to={`/store/my-store/product/${p.id}`} className="bg-card rounded-xl border border-border overflow-hidden hover-lift">
                    <div className="h-32 bg-muted flex items-center justify-center text-4xl">{p.img}</div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm">{p.name}</h3>
                      <span className="font-heading font-bold">{p.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
