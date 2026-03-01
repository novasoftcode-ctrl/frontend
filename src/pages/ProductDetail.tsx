import StoreLayout from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const product = {
  name: "Classic Blue Dress",
  price: 89.99,
  oldPrice: 119.99,
  rating: 4.8,
  reviews: 124,
  description: "A timeless classic blue dress made from premium cotton blend. Perfect for casual outings, dinner dates, or office wear. Features a flattering silhouette and comfortable fit.",
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["Blue", "Black", "Red"],
  images: ["👗", "👗", "👗", "👗"],
};

const related = [
  { id: 7, name: "Cotton T-Shirt Pack", price: "$24.99", img: "👕" },
  { id: 3, name: "Leather Crossbody Bag", price: "$129.99", img: "👜" },
  { id: 9, name: "Sunglasses Classic", price: "$59.99", img: "🕶️" },
  { id: 4, name: "Running Sneakers", price: "$79.99", img: "👟" },
];

const reviews = [
  { name: "Emily R.", rating: 5, text: "Absolutely love this dress! The fabric is amazing and it fits perfectly.", date: "Feb 20, 2026" },
  { name: "Jessica M.", rating: 4, text: "Great quality, slightly smaller than expected. Order one size up.", date: "Feb 18, 2026" },
  { name: "Rachel K.", rating: 5, text: "My go-to dress for everything! Already ordered it in black too.", date: "Feb 15, 2026" },
];

export default function ProductDetail() {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Blue");
  const [selectedImg, setSelectedImg] = useState(0);

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted rounded-2xl h-96 flex items-center justify-center text-8xl mb-4">
              {product.images[selectedImg]}
            </motion.div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)} className={`w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-3xl border-2 transition-colors ${i === selectedImg ? "border-primary" : "border-border"}`}>{img}</button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />)}</div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-heading font-bold">${product.price}</span>
              <span className="text-xl text-muted-foreground line-through">${product.oldPrice}</span>
              <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
            </div>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="mb-5">
              <h4 className="text-sm font-medium mb-2">Size</h4>
              <div className="flex gap-2">{product.sizes.map((s) => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${selectedSize === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground"}`}>{s}</button>
              ))}</div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Color</h4>
              <div className="flex gap-2">{product.colors.map((c) => (
                <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-lg border text-sm transition-colors ${selectedColor === c ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground"}`}>{c}</button>
              ))}</div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2"><Plus className="w-4 h-4" /></button>
              </div>
              <Button className="flex-1 gradient-bg border-0 text-primary-foreground" size="lg">
                <ShoppingCart className="w-4 h-4 mr-2" />Add to Cart
              </Button>
              <Button variant="outline" size="icon"><Heart className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="text-2xl font-heading font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.name} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm">{r.name[0]}</div>
                  <div><div className="font-medium text-sm">{r.name}</div><div className="text-xs text-muted-foreground">{r.date}</div></div>
                  <div className="ml-auto flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mt-16">
          <h2 className="text-2xl font-heading font-bold mb-6">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <Link key={p.id} to={`/store/my-store/product/${p.id}`} className="bg-card rounded-xl border border-border overflow-hidden hover-lift">
                <div className="h-40 bg-muted flex items-center justify-center text-5xl">{p.img}</div>
                <div className="p-4"><h3 className="font-medium text-sm">{p.name}</h3><span className="font-heading font-bold">{p.price}</span></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </StoreLayout>
  );
}
