import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { API_BASE_URL } from "@/config/api";

interface ContactMessage {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    subject?: string;
    message?: string;
    createdAt: string;
}

export default function AdminContactUs() {
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/contacts`);
            if (res.ok) {
                const data = await res.json();
                setContacts(data);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground shadow-lg">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-black tracking-tight">Contact Us Messages</h1>
                        <p className="text-sm text-muted-foreground">All messages submitted via the Contact Us form</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-muted-foreground">Loading messages...</div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">No contact messages found.</div>
                ) : (
                    <div className="grid gap-4">
                        {contacts.map((contact, i) => (
                            <motion.div
                                key={contact._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl border border-border p-6 shadow-sm"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-black text-lg shadow-md shrink-0">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black text-base tracking-tight">{contact.fullName}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</p>
                                            {contact.subject && <p className="text-sm font-bold text-foreground mt-2">Subject: {contact.subject}</p>}
                                            {contact.message && <p className="text-sm text-muted-foreground mt-1 max-w-lg">{contact.message}</p>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground shrink-0">
                                        {new Date(contact.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
