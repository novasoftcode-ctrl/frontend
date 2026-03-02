import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [variants, setVariants] = useState([{ size: "", color: "" }]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`https://backend-production-de8ef.up.railway.app/api/products/my-products`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      const product = data.find((p: any) => p._id === id);
      if (product) {
        setProductData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          comparePrice: product.comparePrice?.toString() || "",
          sku: product.sku || "",
          stock: product.stock.toString(),
          category: product.category || "",
          image: product.imageUrl
        });
        if (product.variants && product.variants.length > 0) {
          setVariants(product.variants);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!productData.name || !productData.price) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and price for the product.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile && !id) {
      toast({
        title: "Missing Image",
        description: "Please upload a product image.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("prismzone_token");
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("comparePrice", productData.comparePrice);
      formData.append("sku", productData.sku);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      formData.append("variants", JSON.stringify(variants.filter(v => v.size || v.color)));

      const url = id
        ? `https://backend-production-de8ef.up.railway.app/api/products/${id}`
        : "https://backend-production-de8ef.up.railway.app/api/products";

      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish product");
      }

      toast({
        title: id ? "Product Updated" : "Product Published",
        description: `${productData.name} has been saved!`,
      });

      navigate("/dashboard/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-5xl mx-auto space-y-8">
        {fetching ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold">{id ? "Edit Product" : "Add New Product"}</h1>
                <p className="text-muted-foreground">{id ? "Update your product details and images" : "Create a new product for your store"}</p>
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
              <Button
                onClick={handlePublish}
                disabled={loading}
                className="gradient-bg border-0 text-primary-foreground min-w-[140px]"
              >
                {loading ? (id ? "Updating..." : "Publishing...") : (id ? "Update Product" : "Publish Product")}
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
