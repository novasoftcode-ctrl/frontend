import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";

const stats = [
  { title: "Total Products", value: "156", change: "+12%", icon: Package, up: true },
  { title: "Orders", value: "2,345", change: "+8%", icon: ShoppingCart, up: true },
  { title: "Revenue", value: "$45,230", change: "+23%", icon: DollarSign, up: true },
  { title: "Visitors", value: "12,456", change: "-3%", icon: Users, up: false },
];

const revenueData = [
  { month: "Jan", revenue: 4000 }, { month: "Feb", revenue: 3000 }, { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 }, { month: "May", revenue: 6000 }, { month: "Jun", revenue: 5500 },
  { month: "Jul", revenue: 7000 },
];

const trafficData = [
  { name: "Direct", value: 40 }, { name: "Social", value: 25 }, { name: "Search", value: 20 }, { name: "Referral", value: 15 },
];
const COLORS = ["hsl(217, 91%, 60%)", "hsl(263, 70%, 50%)", "hsl(38, 92%, 50%)", "hsl(160, 84%, 39%)"];

const recentOrders = [
  { id: "#ORD-001", customer: "Sarah J.", product: "Blue Dress", amount: "$89.99", status: "Delivered" },
  { id: "#ORD-002", customer: "Mike C.", product: "Wireless Earbuds", amount: "$49.99", status: "Shipped" },
  { id: "#ORD-003", customer: "Anna K.", product: "Leather Bag", amount: "$129.99", status: "Processing" },
  { id: "#ORD-004", customer: "James L.", product: "Sneakers", amount: "$79.99", status: "Pending" },
  { id: "#ORD-005", customer: "Lisa M.", product: "Watch", amount: "$199.99", status: "Delivered" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Shipped: "bg-primary/10 text-primary",
  Processing: "bg-accent/10 text-accent",
  Pending: "bg-muted text-muted-foreground",
};

export default function Dashboard() {
  const [storeName, setStoreName] = useState("your store");

  useEffect(() => {
    const savedName = localStorage.getItem("vendor_store_name");
    if (savedName) setStoreName(savedName);
  }, []);

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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <h3 className="font-heading font-semibold mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-heading font-semibold mb-4">Traffic Sources</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {trafficData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {trafficData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        </div>

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
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{o.id}</td>
                    <td className="py-3">{o.customer}</td>
                    <td className="py-3">{o.product}</td>
                    <td className="py-3 font-medium">{o.amount}</td>
                    <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>{o.status}</span></td>
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
