import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const monthlyData = [
  { month: "Aug", revenue: 3200, orders: 45, visitors: 1200 },
  { month: "Sep", revenue: 4100, orders: 56, visitors: 1500 },
  { month: "Oct", revenue: 3800, orders: 48, visitors: 1350 },
  { month: "Nov", revenue: 5200, orders: 72, visitors: 2100 },
  { month: "Dec", revenue: 7500, orders: 110, visitors: 3200 },
  { month: "Jan", revenue: 6800, orders: 95, visitors: 2800 },
  { month: "Feb", revenue: 7200, orders: 102, visitors: 3000 },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">Track your store performance.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-heading font-semibold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%, 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-heading font-semibold mb-4">Orders Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(263, 70%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <h3 className="font-heading font-semibold mb-4">Visitor Traffic</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ fill: "hsl(38, 92%, 50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
