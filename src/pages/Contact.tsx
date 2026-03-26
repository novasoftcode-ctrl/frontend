import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const { toast } = useToast();
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        address: "50 Babar Block Garden Town, Lahore",
        phone: "(042) 99232040",
        contactEmail: "info@peima.punjab.gov.pk"
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/admin/settings`)
            .then((res) => res.json())
            .then((data) => {
                if (data.address) setContactInfo(prev => ({ ...prev, address: data.address }));
                if (data.phone) setContactInfo(prev => ({ ...prev, phone: data.phone }));
                if (data.contactEmail) setContactInfo(prev => ({ ...prev, contactEmail: data.contactEmail }));
            })
            .catch(() => {
                // silently use defaults on failure
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.phone) {
            toast({ title: 'Required Fields', description: 'Full Name, Email and Phone are required.', variant: 'destructive' });
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                toast({ title: 'Message Sent!', description: data.message });
                setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
            } else {
                toast({ title: 'Error', description: data.message, variant: 'destructive' });
            }
        } catch {
            toast({ title: 'Error', description: 'Failed to send message. Try again.', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Left: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-border"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-primary-foreground shadow-lg">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-heading font-black tracking-tighter">Send Us a Message</h2>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">We'll respond within 24 hours</p>
                                </div>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Full Name</label>
                                        <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Email Address</label>
                                        <Input name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" type="email" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Phone Number</label>
                                        <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Subject</label>
                                        <Input name="subject" value={form.subject} onChange={handleChange} placeholder="Inspiration / Support" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Your Message</label>
                                    <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project..." className="bg-muted/50 border-none min-h-[160px] rounded-3xl resize-none focus-visible:ring-primary/20 p-6" />
                                </div>

                                <Button type="submit" disabled={submitting} className="w-full h-14 gradient-bg border-0 text-primary-foreground font-black text-lg shadow-lg hover:shadow-primary/20 transition-all rounded-2xl">
                                    {submitting ? 'Sending...' : 'Submit Message'}
                                    <Send className="w-5 h-5 ml-2" />
                                </Button>
                            </form>
                        </motion.div>

                        {/* Right: Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:pt-8"
                        >
                            <h1 className="text-5xl font-heading font-black tracking-tighter mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Get In Touch</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-12 font-medium">
                                Whether you have questions about our stores, want to collaborate, or
                                need assistance with PrismZone, our team is ready to support you.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: MapPin,
                                        title: "Office Address",
                                        content: contactInfo.address,
                                        color: "gradient-bg"
                                    },
                                    {
                                        icon: Phone,
                                        title: "Phone Number",
                                        content: contactInfo.phone,
                                        color: "gradient-bg"
                                    },
                                    {
                                        icon: Mail,
                                        title: "Email Addresses",
                                        content: contactInfo.contactEmail,
                                        color: "gradient-bg"
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-primary-foreground shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                                            <p className="text-muted-foreground font-bold">{item.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
