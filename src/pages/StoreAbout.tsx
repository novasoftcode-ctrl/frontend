import StoreLayout from "@/components/StoreLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StoreAbout() {
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-6">About {storeData?.name || "Our Store"}</h1>

          <div className="bg-card rounded-xl border border-border p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-primary">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {storeData?.description ? storeData.description : "Founded in 2024, our store began with a simple mission: to bring high-quality, curated products to customers who value both style and substance."}
            </p>
            {!storeData?.description && (
              <p className="text-muted-foreground leading-relaxed">
                We believe that shopping should be an experience — not just a transaction. Every product in our store is carefully selected to meet our standards of quality, design, and value.
              </p>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-primary">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To empower customers with access to exceptional products while maintaining sustainable and ethical business practices. We're committed to transparency, quality, and customer satisfaction.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-semibold mb-6 text-primary">Our Team</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { name: "John Doe", role: "Founder & CEO", emoji: "👨‍💼" },
                { name: "Jane Smith", role: "Head of Design", emoji: "👩‍🎨" },
                { name: "Alex Park", role: "Operations Lead", emoji: "👨‍💻" },
              ].map((m) => (
                <div key={m.name} className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform">{m.emoji}</div>
                  <h3 className="font-heading font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </StoreLayout>
  );
}
