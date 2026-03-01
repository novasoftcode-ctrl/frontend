import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const customers = [
  { name: "Sarah Johnson", email: "sarah@email.com", orders: 12, spent: "$1,234.56", joined: "Jan 2026" },
  { name: "Mike Chen", email: "mike@email.com", orders: 8, spent: "$456.78", joined: "Dec 2025" },
  { name: "Anna Kim", email: "anna@email.com", orders: 15, spent: "$2,345.67", joined: "Nov 2025" },
  { name: "James Lee", email: "james@email.com", orders: 3, spent: "$189.99", joined: "Feb 2026" },
  { name: "Lisa Martin", email: "lisa@email.com", orders: 22, spent: "$3,456.78", joined: "Oct 2025" },
];

export default function Customers() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Customers</h1>
          <p className="text-muted-foreground text-sm">{customers.length} registered customers</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9" />
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Orders</th>
              <th className="text-left p-4 font-medium">Total Spent</th>
              <th className="text-left p-4 font-medium">Joined</th>
            </tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm">{c.name[0]}</div>
                      <div><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.email}</div></div>
                    </div>
                  </td>
                  <td className="p-4">{c.orders}</td>
                  <td className="p-4 font-medium">{c.spent}</td>
                  <td className="p-4 text-muted-foreground">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
