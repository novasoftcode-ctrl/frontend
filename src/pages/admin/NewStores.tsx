import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { BarChart3, ExternalLink, CalendarDays, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NewStores() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNewStores();
    }, []);

    const fetchNewStores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stores/recent`);
            if (response.ok) {
                const data = await response.json();
                setStores(data);
            }
        } catch (error) {
            console.error("Failed to fetch recent stores:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-primary" /> New Stores
                        </h1>
                        <p className="text-muted-foreground text-sm">Tracking newly registered stores from the past 3 days.</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-start gap-3">
                        <CalendarDays className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-primary">Recent Registrations</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                This list highlights stores that joined the platform within the last 72 hours.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                                    <th className="text-left p-4 font-semibold">Store Details</th>
                                    <th className="text-left p-4 font-semibold">Owner Info</th>
                                    <th className="text-left p-4 font-semibold">Category</th>
                                    <th className="text-left p-4 font-semibold">Joining Date</th>
                                    <th className="text-right p-4 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Scanning for recent registrations...</td></tr>
                                ) : stores.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <Store className="w-10 h-10 text-muted-foreground/30 mb-3" />
                                                <p className="text-base font-medium text-foreground">No New Stores</p>
                                                <p className="text-sm">No new stores have registered in the past 3 days.</p>
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
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-sm">{store.ownerName}</p>
                                                <p className="text-xs text-muted-foreground">{store.ownerEmail}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-muted/50 text-muted-foreground px-2.5 py-1 rounded-md text-xs font-medium">
                                                    {store.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted-foreground font-medium text-sm whitespace-nowrap">
                                                {new Date(store.joinedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="outline" size="sm" asChild className="h-8">
                                                    <Link to={`/store/${store.slug || store.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`} target="_blank">
                                                        Visit Store <ExternalLink className="w-3 h-3 ml-2" />
                                                    </Link>
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
