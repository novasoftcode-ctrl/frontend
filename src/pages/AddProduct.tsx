import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [variants, setVariants] = useState([{ size: "", color: "" }]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    sku: "",
    stock: "",
    category: "",
    image: null as string | null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!productData.name || !productData.price) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and price for the product.",
        variant: "destructive"
      });
      return;
    }

    const newProduct = {
      ...productData,
      id: Date.now(),
      variants: variants.filter(v => v.size || v.color)
    };

    const savedProducts = localStorage.getItem("vendor_products");
    const products = savedStoreProducts(savedProducts);
    products.push(newProduct);

    localStorage.setItem("vendor_products", JSON.stringify(products));

    toast({
      title: "Product Published",
      description: `${productData.name} is now live in your store!`,
    });

    navigate("/dashboard/products");
  };

  const savedStoreProducts = (saved: string | null) => {
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/dashboard/products"><ArrowLeft className="w-4 h-4" /></Link></Button>
          <div>
            <h1 className="text-2xl font-heading font-bold">Add Product</h1>
            <p className="text-muted-foreground text-sm">Fill in the details to list a new product.</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          {/* Images */}
          <div>
            <Label className="text-base font-heading font-semibold">Product Image</Label>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden relative"
              >
                {productData.image ? (
                  <img src={productData.image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </>
                )}
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-xl border border-border bg-muted flex items-center justify-center text-3xl opacity-50">
                  {["👗", "🎧", "👜"][i - 1]}
                </div>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                placeholder="e.g. Classic Blue Dress"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-sm min-h-[120px]"
                placeholder="Describe your product..."
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Price ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                className="mt-1.5"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Compare at Price ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                className="mt-1.5"
                value={productData.comparePrice}
                onChange={(e) => setProductData({ ...productData, comparePrice: e.target.value })}
              />
            </div>
            <div>
              <Label>SKU</Label>
              <Input
                placeholder="SKU-001"
                className="mt-1.5"
                value={productData.sku}
                onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                className="mt-1.5"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                placeholder="Fashion"
                className="mt-1.5"
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <Label className="text-base font-heading font-semibold">Variants</Label>
            <div className="space-y-3 mt-3">
              {variants.map((v, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Input placeholder="Size (e.g. M, L)" value={v.size} onChange={(e) => { const n = [...variants]; n[i].size = e.target.value; setVariants(n); }} />
                  <Input placeholder="Color (e.g. Blue)" value={v.color} onChange={(e) => { const n = [...variants]; n[i].color = e.target.value; setVariants(n); }} />
                  {variants.length > 1 && <button onClick={() => setVariants(variants.filter((_, j) => j !== i))}><X className="w-4 h-4 text-muted-foreground" /></button>}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setVariants([...variants, { size: "", color: "" }])}><Plus className="w-3 h-3 mr-1" />Add Variant</Button>
            </div>
          </div>

          {/* SEO */}
          <div>
            <Label className="text-base font-heading font-semibold">SEO Preview</Label>
            <div className="mt-3 bg-muted rounded-lg p-4">
              <p className="text-primary text-sm font-medium">{productData.name || "Product Name"} - My Store</p>
              <p className="text-xs text-success">prismzone.com/store/my-store/products/{productData.name.toLowerCase().replace(/\s+/g, '-')}</p>
              <p className="text-xs text-muted-foreground mt-1">{productData.description || "Beautiful product perfect for any occasion..."}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline">Save as Draft</Button>
          <Button onClick={handlePublish} className="gradient-bg border-0 text-primary-foreground">Publish Product</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
