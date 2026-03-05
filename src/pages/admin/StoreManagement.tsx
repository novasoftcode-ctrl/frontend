import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { Store, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StoreManagement() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
                                    <th className="text-left p-4 font-semibold">Store & Owner</th>
                                    <th className="text-left p-4 font-semibold">Category</th>
                                    <th className="text-center p-4 font-semibold">Total Products</th>
                                    <th className="text-center p-4 font-semibold">Total Orders</th>
                                    <th className="text-left p-4 font-semibold">Joined Date</th>
                                    <th className="text-right p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading store data...</td></tr>
                                ) : filteredStores.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No stores found.</td></tr>
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
                                                        <p className="text-xs text-muted-foreground">{store.ownerName} · {store.ownerEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-muted/50 text-muted-foreground px-2.5 py-1 rounded-md text-xs font-medium">
                                                    {store.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center font-semibold text-lg">{store.productsCount}</td>
                                            <td className="p-4 text-center font-semibold text-primary text-lg">{store.ordersCount}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(store.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td className="p-4 text-right">
                                                <Button variant="outline" size="sm" className="h-8">
                                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                                </Button>
                                            </td>
                                        </tr>
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
