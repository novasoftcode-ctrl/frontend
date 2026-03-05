import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { Users, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function StoreControl() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState<string | null>(null);
    const [sentEmails, setSentEmails] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchDueStores();
    }, []);

    const fetchDueStores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stores/payment-due`);
            if (response.ok) {
                const data = await response.json();
                setStores(data);
            }
        } catch (error) {
            console.error("Failed to fetch due stores:", error);
            toast.error("Failed to load stores with pending payments.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendReminder = async (id: string, storeName: string) => {
        if (sentEmails.has(id)) return;

        setSending(id);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stores/${id}/payment-reminder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                toast.success(`Payment reminder sent to owner of ${storeName}`);
                setSentEmails(prev => new Set(prev).add(id));
            } else {
                toast.error(`Failed to send reminder for ${storeName}`);
            }
        } catch (error) {
            console.error("Failed to send email:", error);
            toast.error("Network error while trying to send email.");
        } finally {
            setSending(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" /> Store Control
                        </h1>
                        <p className="text-muted-foreground text-sm">Managing payment reminders for stores reaching the end of their billing month.</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-border bg-destructive/5 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-destructive">Payment Reminders Due</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                The stores listed below are precisely 3 days away from completing their 30-day billing cycle. Send them an email reminder to collect their subscription fee.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                                    <th className="text-left p-4 font-semibold">Store Details</th>
                                    <th className="text-left p-4 font-semibold">Owner Information</th>
                                    <th className="text-left p-4 font-semibold">Days Active</th>
                                    <th className="text-right p-4 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Scanning for stores nearing billing cycle...</td></tr>
                                ) : stores.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <CheckCircle className="w-10 h-10 text-success/50 mb-3" />
                                                <p className="text-base font-medium text-foreground">All Clear</p>
                                                <p className="text-sm">No stores have a payment due in exactly 3 days right now.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    stores.map((store, index) => (
                                        <motion.tr
                                            key={store._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground font-bold shadow-sm text-lg">
                                                        {store.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground text-base">{store.name}</p>
                                                        <p className="text-xs text-muted-foreground">Since: {new Date(store.joinedDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-sm">{store.ownerName}</p>
                                                <p className="text-xs text-muted-foreground">{store.ownerEmail}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-accent/10 text-accent font-semibold px-2.5 py-1 rounded-md text-xs">
                                                    {store.daysActive} Days
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    variant={sentEmails.has(store._id) ? "outline" : "default"}
                                                    size="sm"
                                                    className={`h-9 ${sentEmails.has(store._id) ? "text-success border-success/30 bg-success/5" : ""}`}
                                                    disabled={sending === store._id || sentEmails.has(store._id)}
                                                    onClick={() => handleSendReminder(store._id, store.name)}
                                                >
                                                    {sentEmails.has(store._id) ? (
                                                        <><CheckCircle className="w-4 h-4 mr-2" /> Sent</>
                                                    ) : sending === store._id ? (
                                                        <><Mail className="w-4 h-4 mr-2 animate-pulse" /> Sending...</>
                                                    ) : (
                                                        <><Mail className="w-4 h-4 mr-2" /> Send Reminder</>
                                                    )}
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
