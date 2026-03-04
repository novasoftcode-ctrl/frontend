import StoreLayout from "@/components/StoreLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

const statusIcons: Record<string, any> = {
    Delivered: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    Pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
    Shipped: { icon: Package, color: "text-primary", bg: "bg-primary/10" },
    Processing: { icon: Clock, color: "text-accent", bg: "bg-accent/10" },
    Cancelled: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function TrackOrder() {
    const { slug } = useParams();
    const [identifier, setIdentifier] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const { toast } = useToast();

    const handleCancel = async (orderId: string) => {
        if (!window.confirm("Are you sure you want to cancel this order? It will be removed immediately.")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Order Cancelled", description: "Your order has been cancelled and removed." });
                // Re-track to refresh list
                const trackResponse = await fetch(`${API_BASE_URL}/api/orders/track/${identifier.trim()}`);
                const trackData = await trackResponse.json();
                if (trackResponse.ok) setOrders(trackData);
            } else {
                toast({ title: "Error", description: data.message || "Failed to cancel order", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        }
    };

    return (
        <StoreLayout>
            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-black mb-4">Track Your Order</h1>
                    <p className="text-muted-foreground text-lg">Enter your email address or phone number to see the status of your orders.</p>
                </div>

                <div className="bg-card rounded-3xl border border-border p-8 shadow-xl mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Email or Phone Number"
                                className="pl-12 h-14 rounded-2xl bg-slate-50 border-border text-lg font-medium focus:ring-primary/20"
                            />
                        </div>
                        <Button disabled={loading} className="h-14 px-10 rounded-2xl font-black text-lg gradient-bg border-0 text-primary-foreground shadow-lg shadow-primary/20">
                            {loading ? "Tracking..." : "Find Orders"}
                        </Button>
                    </form>
                </div>

                <AnimatePresence>
                    {searched && orders.length > 0 && (
                        <div className="space-y-6">
                            {orders.map((order, i) => {
                                const status = statusIcons[order.status] || statusIcons.Pending;
                                return (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white rounded-3xl border border-border overflow-hidden shadow-md hover:shadow-lg transition-all"
                                    >
                                        <div className="p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                                <div className="flex gap-4">
                                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-border">
                                                        {order.product?.imageUrl ? (
                                                            <img src={order.product.imageUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-8 h-8 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-primary uppercase tracking-widest mb-1">{order.orderId}</div>
                                                        <h3 className="text-xl font-heading font-bold">{order.product?.name || "Product Name"}</h3>
                                                        <p className="text-muted-foreground font-medium">Qty: {order.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm ${status.bg} ${status.color}`}>
                                                        <status.icon className="w-4 h-4" />
                                                        {order.status}
                                                    </div>
                                                    <div className="mt-2 text-2xl font-black text-foreground">Rs. {order.product?.price * order.quantity}</div>
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                                <div className="flex gap-3">
                                                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                                                    <div>
                                                        <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Shipping To:</div>
                                                        <div className="font-medium text-slate-700">{order.customerName}</div>
                                                        <div className="text-sm text-slate-500">{order.customerAddress}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                                                    <div>
                                                        <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Ordered On:</div>
                                                        <div className="font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.status !== 'Cancelled' && (
                                                <div className="mt-8 flex justify-end">
                                                    <Button
                                                        variant="destructive"
                                                        className="rounded-xl font-bold px-6 h-11"
                                                        disabled={order.status === 'Delivered'}
                                                        onClick={() => handleCancel(order._id)}
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </StoreLayout>
    );
}
