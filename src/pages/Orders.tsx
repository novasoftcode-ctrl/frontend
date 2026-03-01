import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const orders = [
  { id: "#ORD-001", customer: "Sarah Johnson", email: "sarah@email.com", date: "Feb 25, 2026", items: 3, total: "$189.97", status: "Delivered" },
  { id: "#ORD-002", customer: "Mike Chen", email: "mike@email.com", date: "Feb 25, 2026", items: 1, total: "$49.99", status: "Shipped" },
  { id: "#ORD-003", customer: "Anna Kim", email: "anna@email.com", date: "Feb 24, 2026", items: 2, total: "$159.98", status: "Processing" },
  { id: "#ORD-004", customer: "James Lee", email: "james@email.com", date: "Feb 24, 2026", items: 1, total: "$79.99", status: "Pending" },
  { id: "#ORD-005", customer: "Lisa Martin", email: "lisa@email.com", date: "Feb 23, 2026", items: 4, total: "$299.96", status: "Delivered" },
  { id: "#ORD-006", customer: "David Park", email: "david@email.com", date: "Feb 23, 2026", items: 1, total: "$199.99", status: "Cancelled" },
];

const sc: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Shipped: "bg-primary/10 text-primary",
  Processing: "bg-accent/10 text-accent",
  Pending: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function Orders() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Orders</h1>
            <p className="text-muted-foreground text-sm">{orders.length} total orders</p>
          </div>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-4 font-medium">Order ID</th>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Items</th>
              <th className="text-left p-4 font-medium">Total</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="p-4"></th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{o.id}</td>
                  <td className="p-4">
                    <div>{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="p-4">{o.date}</td>
                  <td className="p-4">{o.items}</td>
                  <td className="p-4 font-medium">{o.total}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc[o.status]}`}>{o.status}</span></td>
                  <td className="p-4"><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
