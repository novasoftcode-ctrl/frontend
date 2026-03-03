import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Plus, Grid3X3, List, MoreVertical, Edit, Trash2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";

const stockStatus: Record<string, string> = {
  Active: "bg-success/10 text-success",
  "Low Stock": "bg-accent/10 text-accent",
  "Out of Stock": "bg-destructive/10 text-destructive",
};

export default function Products() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`${API_BASE_URL}/api/products/my-products`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("prismzone_token");
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== id));
        toast({
          title: "Product Deleted",
          description: "Product has been successfully removed.",
        });
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "Active";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Products</h1>
            <p className="text-muted-foreground text-sm">{products.length} products in your store</p>
          </div>
          <Button className="gradient-bg border-0 text-primary-foreground" asChild>
            <Link to="/dashboard/products/new"><Plus className="w-4 h-4 mr-1" />Add Product</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" />
          </div>
          <div className="flex border border-border rounded-lg">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No products found. Add your first product!</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => {
              const status = getStatus(p.stock);
              return (
                <div key={p._id} className="bg-card rounded-xl border border-border overflow-hidden hover-lift">
                  <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl">📦</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{p.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><button><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/products/edit/${p._id}`} className="flex items-center w-full">
                              <Edit className="w-3.5 h-3.5 mr-2" />Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem><Copy className="w-3.5 h-3.5 mr-2" />Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p._id)}><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-lg font-heading font-bold">${p.price}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus[status]}`}>{status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="p-4"></th>
              </tr></thead>
              <tbody>
                {products.map((p) => {
                  const status = getStatus(p.stock);
                  return (
                    <tr key={p._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </td>
                      <td className="p-4 font-medium">${p.price}</td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus[status]}`}>{status}</span></td>
                      <td className="p-4"><DropdownMenu>
                        <DropdownMenuTrigger asChild><button><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/products/edit/${p._id}`} className="flex items-center w-full">
                              <Edit className="w-3.5 h-3.5 mr-2" />Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p._id)}><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
