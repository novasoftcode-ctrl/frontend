import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Users, Store, Package, DollarSign, TrendingUp, AlertTriangle, Flag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const stats = [
  { title: "Total Users", value: "24,580", icon: Users, change: "+15%" },
  { title: "Active Stores", value: "12,340", icon: Store, change: "+8%" },
  { title: "Total Products", value: "567K", icon: Package, change: "+22%" },
  { title: "Platform Revenue", value: "Rs. 2.4M", icon: DollarSign, change: "+18%" },
];

const registeredStores = [
  { name: "Fashion Hub", owner: "Sarah J.", email: "sarah@fashionhub.com", status: "Active", products: 120, revenue: "Rs. 45,200", joined: "Jan 12, 2026", category: "Apparel" },
  { name: "Tech Zone", owner: "Mike C.", email: "mike@techzone.io", status: "Active", products: 85, revenue: "Rs. 128,500", joined: "Dec 05, 2025", category: "Electronics" },
  { name: "Beauty Bar", owner: "Anna K.", email: "anna@beautybar.co", status: "Under Review", products: 64, revenue: "Rs. 12,300", joined: "Feb 18, 2026", category: "Cosmetics" },
  { name: "Sport Central", owner: "James L.", email: "james@sportscentral.net", status: "Active", products: 45, revenue: "Rs. 8,900", joined: "Nov 22, 2025", category: "Fitness" },
  { name: "GadgetMaster", owner: "Robert D.", email: "robert@gadget.com", status: "Active", products: 210, revenue: "Rs. 95,000", joined: "Jan 30, 2026", category: "Electronics" },
  { name: "Eco Living", owner: "Elena S.", email: "elena@ecoliving.org", status: "Suspended", products: 32, revenue: "Rs. 4,100", joined: "Feb 02, 2026", category: "Home" },
  { name: "Urban Kicks", owner: "David W.", email: "david@urbankicks.com", status: "Active", products: 76, revenue: "Rs. 22,400", joined: "Jan 15, 2026", category: "Footwear" },
];

const issues = [
  { id: 1, type: "Report", store: "Fashion Hub", issue: "Counterfeit product complaint", severity: "High", date: "2 hours ago" },
  { id: 2, type: "Support", store: "Tech Zone", issue: "Payment processing error", severity: "Medium", date: "5 hours ago" },
  { id: 3, type: "Report", store: "Beauty Bar", issue: "Misleading product description", severity: "Low", date: "1 day ago" },
];

const sc: Record<string, string> = {
  Active: "bg-success/10 text-success",
  "Under Review": "bg-accent/10 text-accent",
  Suspended: "bg-destructive/10 text-destructive",
};

const sev: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-accent/10 text-accent",
  Low: "bg-muted text-muted-foreground",
};

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Managing platform integrity and store performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Flag className="w-4 h-4 mr-2" />System Logs</Button>
            <Button size="sm" className="gradient-bg border-0 text-primary-foreground"><Settings className="w-4 h-4 mr-2" />Platform Settings</Button>
          </div>
        </div>

        {/* Stats */}
        <div id="revenue" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20"><s.icon className="w-5 h-5 text-primary" /></div>
                <span className="text-xs font-medium text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" />{s.change}</span>
              </div>
              <div className="text-2xl font-heading font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{s.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Registered Stores */}
        <div id="stores" className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-heading font-semibold text-lg">Registered Stores</h3>
            <div className="relative w-full sm:w-64">
              <Input placeholder="Search stores..." className="h-9 pr-10" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-xs">Search</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-semibold">Store Details</th>
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Products</th>
                  <th className="text-left p-4 font-semibold">Total Revenue</th>
                  <th className="text-left p-4 font-semibold">Joined Date</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registeredStores.map((s) => (
                  <tr key={s.name} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground font-bold shadow-sm">{s.name[0]}</div>
                        <div>
                          <p className="font-semibold text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.owner} · {s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{s.category}</td>
                    <td className="p-4 font-semibold">{s.products}</td>
                    <td className="p-4 text-success font-bold font-heading">{s.revenue}</td>
                    <td className="p-4 text-muted-foreground">{s.joined}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${sc[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border bg-muted/10 text-center">
            <Button variant="link" size="sm" className="text-primary font-semibold">View All Platform Stores</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Issues */}
          <div className="lg:col-span-1 bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-heading font-semibold flex items-center gap-2"><Flag className="w-4 h-4 text-primary" />Platform Reports</h3>
              <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">3 New</span>
            </div>
            <div className="p-5 space-y-4">
              {issues.map((i) => (
                <div key={i.id} className="p-3 rounded-xl border border-border/50 bg-muted/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${sev[i.severity]}`}>{i.severity}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{i.date}</span>
                  </div>
                  <p className="font-semibold text-sm mb-1">{i.issue}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Store className="w-3 h-3" />{i.store} · {i.type}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs h-9">Review All Issues</Button>
            </div>
          </div>

          {/* User Growth / Stats Summary */}
          <div id="users" className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold">Recent User Activity</h3>
              <Button variant="ghost" size="sm" className="text-primary h-8">View User CRM</Button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", email: "sarah@email.com", role: "Vendor", stores: "Fashion Hub", joined: "2 mins ago", status: "Active" },
                { name: "Mike Chen", email: "mike@email.com", role: "Vendor", stores: "Tech Zone", joined: "15 mins ago", status: "Active" },
                { name: "Anna Kim", email: "anna@email.com", role: "Customer", stores: "-", joined: "1 hour ago", status: "Active" },
              ].map((u) => (
                <div key={u.email} className="flex items-center justify-between p-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">{u.name[0]}</div>
                    <div>
                      <p className="font-semibold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.role} · {u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">{u.joined}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{u.stores !== "-" ? `Store: ${u.stores}` : "Account Verified"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
