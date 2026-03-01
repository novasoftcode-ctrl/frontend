import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
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

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Full Name</label>
                                        <Input placeholder="John Doe" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Email Address</label>
                                        <Input placeholder="john@example.com" type="email" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Phone Number</label>
                                        <Input placeholder="+92 300 1234567" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Subject</label>
                                        <Input placeholder="Inspiration / Support" className="bg-muted/50 border-none h-14 rounded-2xl focus-visible:ring-primary/20" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Your Message</label>
                                    <Textarea placeholder="Tell us about your project..." className="bg-muted/50 border-none min-h-[160px] rounded-3xl resize-none focus-visible:ring-primary/20 p-6" />
                                </div>

                                <Button className="w-full h-14 gradient-bg border-0 text-primary-foreground font-black text-lg shadow-lg hover:shadow-primary/20 transition-all rounded-2xl">
                                    Submit Message
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
                                        content: "50 Babar Block Garden Town, Lahore",
                                        color: "gradient-bg"
                                    },
                                    {
                                        icon: Phone,
                                        title: "Phone Number",
                                        content: "(042) 99232040",
                                        color: "gradient-bg"
                                    },
                                    {
                                        icon: Mail,
                                        title: "Email Addresses",
                                        content: "info@peima.punjab.gov.pk",
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
