import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { Store, Eye, Search, Filter, Save, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function StoreManagement() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stores`);
            if (response.ok) {
                const data = await response.json();
                setStores(data);
            }
        } catch (error) {
            console.error("Failed to fetch stores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        setStores(stores.map(store =>
            store._id === id ? { ...store, status: newStatus } : store
        ));
    };

    const updateStoreStatus = async (id: string, newStatus: string) => {
        setUpdating(id);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stores/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast.success(`Store status updated to ${newStatus}`);
            } else {
                toast.error("Failed to update store status.");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Network error while updating status.");
        } finally {
            setUpdating(null);
        }
    };

    const deleteStore = async (id: string, storeName: string) => {
        if (!window.confirm(`Are you absolutely sure you want to permanently delete the store "${storeName}"? This action cannot be undone.`)) {
            return;
        }

        setDeleting(id);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stores/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success(`Store "${storeName}" deleted successfully`);
                setStores(stores.filter(store => store._id !== id));
            } else {
                toast.error("Failed to delete store.");
            }
        } catch (error) {
            console.error("Failed to delete store:", error);
            toast.error("Network error while deleting store.");
        } finally {
            setDeleting(null);
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                            <Store className="w-6 h-6 text-primary" /> Store Management
                        </h1>
                        <p className="text-muted-foreground text-sm">View and manage all registered stores on the platform.</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Input
                                placeholder="Search by store name or owner..."
                                className="h-10 pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                                    <th className="text-left p-4 font-semibold">Store Name</th>
                                    <th className="text-left p-4 font-semibold">Owner Info</th>
                                    <th className="text-left p-4 font-semibold">Category</th>
                                    <th className="text-center p-4 font-semibold">Total Products</th>
                                    <th className="text-center p-4 font-semibold">Total Orders</th>
                                    <th className="text-left p-4 font-semibold">Joining Date</th>
                                    <th className="text-center p-4 font-semibold">URL</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-center p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">Loading store data...</td></tr>
                                ) : filteredStores.length === 0 ? (
                                    <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No stores found.</td></tr>
                                ) : (
                                    filteredStores.map((store) => (
                                        <tr key={store._id} className="hover:bg-muted/20 transition-colors">
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
                                            <td className="p-4 text-center font-semibold text-lg">{store.productsCount}</td>
                                            <td className="p-4 text-center font-semibold text-primary text-lg">{store.ordersCount}</td>
                                            <td className="p-4 text-muted-foreground font-medium text-sm whitespace-nowrap">
                                                {new Date(store.joinedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Button variant="link" size="sm" asChild className="text-primary h-auto p-0">
                                                    <Link to={`/store/${store.slug || store.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`} target="_blank">
                                                        Visit <ExternalLink className="w-3 h-3 ml-1" />
                                                    </Link>
                                                </Button>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    className="text-xs border border-border rounded-md px-2 py-1 bg-background"
                                                    value={store.status}
                                                    onChange={(e) => handleStatusChange(store._id, e.target.value)}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Disabled">Disabled</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="h-8"
                                                        disabled={updating === store._id}
                                                        onClick={() => updateStoreStatus(store._id, store.status)}
                                                    >
                                                        <Save className="w-4 h-4 mr-2" /> {updating === store._id ? "Saving..." : "Update"}
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="h-8 px-2"
                                                        disabled={deleting === store._id}
                                                        onClick={() => deleteStore(store._id, store.name)}
                                                    >
                                                        {deleting === store._id ? "..." : <Trash2 className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
