import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";

const COLORS = ["hsl(217, 91%, 60%)", "hsl(263, 70%, 50%)", "hsl(38, 92%, 50%)", "hsl(160, 84%, 39%)"];

const statusColors: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Shipped: "bg-primary/10 text-primary",
  Processing: "bg-accent/10 text-accent",
  Pending: "bg-muted text-muted-foreground",
};

export default function Dashboard() {
  const [storeName, setStoreName] = useState("your store");
  const [stats, setStats] = useState([
    { title: "Total Products", value: "0", change: "...", icon: Package, up: true },
    { title: "Orders", value: "0", change: "...", icon: ShoppingCart, up: true },
    { title: "Revenue", value: "$0", change: "...", icon: DollarSign, up: true },
    { title: "Visitors", value: "0", change: "...", icon: Users, up: false },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedName = localStorage.getItem("vendor_store_name");
    if (savedName) setStoreName(savedName);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("prismzone_token");
      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch Products
      const prodRes = await fetch("https://backend-production-de8ef.up.railway.app/api/products/my-products", { headers });
      const products = await prodRes.json();

      // Fetch Orders
      const orderRes = await fetch("https://backend-production-de8ef.up.railway.app/api/orders/my-orders", { headers });
      const orders = await orderRes.json();

      if (prodRes.ok && orderRes.ok) {
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.product?.price || 0), 0);

        setStats([
          { title: "Total Products", value: products.length.toString(), change: "Live", icon: Package, up: true },
          { title: "Orders", value: orders.length.toString(), change: "Live", icon: ShoppingCart, up: true },
          { title: "Revenue", value: `$${totalRevenue.toFixed(2)}`, change: "Live", icon: DollarSign, up: true },
          { title: "Visitors", value: "0", change: "N/A", icon: Users, up: false },
        ]);
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Here's your {storeName} overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${s.up ? "text-success" : "text-destructive"}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <div className="text-2xl font-heading font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts removed because of static data */}

        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">Recent Orders</h3>
            <a href="/dashboard/orders" className="text-sm text-primary hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 font-medium">Order ID</th>
                  <th className="text-left py-3 font-medium">Customer</th>
                  <th className="text-left py-3 font-medium">Product</th>
                  <th className="text-left py-3 font-medium">Amount</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground font-medium">No orders yet.</td></tr>
                ) : recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium uppercase text-[10px] tracking-widest text-primary">#{o._id.slice(-6)}</td>
                    <td className="py-3 font-bold">{o.customerName}</td>
                    <td className="py-3 text-slate-500 font-medium">{o.product?.name || "Product Deleted"}</td>
                    <td className="py-3 font-black text-primary">${o.product?.price || 0}</td>
                    <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[o.status || 'Pending']}`}>{o.status || 'Pending'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
