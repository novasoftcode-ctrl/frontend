import StoreLayout from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StoreContact() {
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vendor_store_data");
    if (saved) {
      setStoreData(JSON.parse(saved));
    }
  }, []);

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-8 text-center text-primary">Contact Us</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">Send a Message</h2>
              <div className="space-y-4">
                <div><Label>Name</Label><Input placeholder="Your name" className="mt-1.5" /></div>
                <div><Label>Email</Label><Input type="email" placeholder="you@example.com" className="mt-1.5" /></div>
                <div><Label>Subject</Label><Input placeholder="How can we help?" className="mt-1.5" /></div>
                <div><Label>Message</Label><textarea className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-sm min-h-[120px] focus:ring-2 focus:ring-primary outline-none" placeholder="Your message..." /></div>
                <Button className="w-full gradient-bg border-0 text-primary-foreground font-bold shadow-lg shadow-primary/20">Send Message</Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
                <h2 className="text-xl font-heading font-semibold mb-4 text-primary">Contact Info</h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Address", value: storeData?.address || "123 Main St, New York, NY 10001" },
                    { icon: Phone, label: "Phone", value: storeData?.phone || "+1 (555) 000-0000" },
                    { icon: Mail, label: "Email", value: "hello@mystore.com" },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><c.icon className="w-5 h-5" /></div>
                      <div><div className="text-sm font-bold text-foreground">{c.label}</div><div className="text-sm text-muted-foreground">{c.value}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
                <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2 text-primary"><Clock className="w-5 h-5" />Store Hours</h2>
                <div className="space-y-2 text-sm">
                  {[["Mon - Fri", "9:00 AM - 6:00 PM"], ["Saturday", "10:00 AM - 4:00 PM"], ["Sunday", "Closed"]].map(([day, hours]) => (
                    <div key={day} className="flex justify-between"><span className="text-muted-foreground font-medium">{day}</span><span className="font-bold">{hours}</span></div>
                  ))}
                </div>
              </div>

              <div className="bg-muted rounded-xl h-48 flex items-center justify-center border border-border/50">
                <MapPin className="w-8 h-8 text-muted-foreground" />
                <span className="text-muted-foreground ml-2 font-medium">Map Placeholder</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </StoreLayout>
  );
}
