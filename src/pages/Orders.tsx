import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const sc: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Shipped: "bg-primary/10 text-primary",
  Processing: "bg-accent/10 text-accent",
  Pending: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  const handleStatusUpdate = async (orderId: string) => {
    const newStatus = statusMap[orderId];
    if (!newStatus) return;

    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast({ title: `Order ${newStatus}`, description: `Order status updated to ${newStatus}.` });

        // Optimistically update the UI
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        fetchOrders();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

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

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Order ID</th>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Qty</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="p-4">Action</th>
              </tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{o.orderId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {o.product?.imageUrl ? <img src={o.product.imageUrl} alt="" className="w-full h-full object-cover" /> : <span>📦</span>}
                        </div>
                        <span className="font-medium truncate max-w-[150px]">{o.product?.name || "Product Deleted"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{o.customerName}</div>
                      <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                    </td>
                    <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{o.quantity}</td>
                    <td className="p-4 font-medium italic text-primary">Rs. {o.product?.price * (o.quantity || 1)}</td>
                    <td className="p-4">
                      <select
                        className={`text-xs font-medium px-2 py-1 rounded-md border border-border focus:ring-1 focus:ring-primary outline-none ${sc[statusMap[o._id] || o.status]}`}
                        value={statusMap[o._id] || o.status}
                        onChange={(e) => setStatusMap(prev => ({ ...prev, [o._id]: e.target.value }))}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(o._id)}
                        disabled={!statusMap[o._id] || statusMap[o._id] === o.status}
                      >
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
