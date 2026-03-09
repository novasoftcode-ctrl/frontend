import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface UserData {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
}

export default function AdminUsers() {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                toast({ title: 'Deleted', description: data.message });
                setUsers(prev => prev.filter(u => u._id !== id));
            } else {
                toast({ title: 'Error', description: data.message, variant: 'destructive' });
            }
        } catch {
            toast({ title: 'Error', description: 'Failed to delete user.', variant: 'destructive' });
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground shadow-lg">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-black tracking-tight">Registered Users</h1>
                        <p className="text-sm text-muted-foreground">All users who have registered on PrismZone</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-muted-foreground">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">No registered users found.</div>
                ) : (
                    <div className="grid gap-4">
                        {users.map((user, i) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl border border-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-black text-lg shadow-md shrink-0">
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-base tracking-tight">{user.fullName}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-xs text-muted-foreground">
                                        Joined: {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                    </p>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(user._id)}
                                        className="rounded-xl font-bold"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
