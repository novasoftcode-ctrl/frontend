import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Mail, MessageSquare, Phone, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
    { icon: BookOpen, title: "Getting Started", desc: "Learn the basics of setting up your store." },
    { icon: MessageSquare, title: "Managing Products", desc: "How to add, edit, and organize your inventory." },
    { icon: Search, title: "Orders & Shipping", desc: "Everything about processing and delivering orders." },
    { icon: Mail, title: "Billing & Plans", desc: "Manage your subscription and payments." },
];

export default function Support() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="bg-primary/5 py-16 mb-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">How can we help?</h1>
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="Search for articles, guides, and more..."
                                className="pl-12 py-7 text-lg rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid sm:grid-cols-2 gap-6 mb-20">
                        {categories.map((cat) => (
                            <div key={cat.title} className="p-6 rounded-xl border border-border bg-card hover-lift cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <cat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                                <p className="text-muted-foreground text-sm">{cat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Our support team is available 24/7 to assist with any questions or technical issues you might have.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="gap-2">
                                <Mail className="w-5 h-5" /> Contact Support
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2">
                                <Phone className="w-5 h-5" /> Call Us
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
