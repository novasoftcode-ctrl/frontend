import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Plus, Grid3X3, List, MoreVertical, Edit, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const products = [
  { id: 1, name: "Classic Blue Dress", price: "$89.99", stock: 45, status: "Active", img: "👗" },
  { id: 2, name: "Wireless Earbuds Pro", price: "$49.99", stock: 120, status: "Active", img: "🎧" },
  { id: 3, name: "Leather Crossbody Bag", price: "$129.99", stock: 8, status: "Low Stock", img: "👜" },
  { id: 4, name: "Running Sneakers", price: "$79.99", stock: 0, status: "Out of Stock", img: "👟" },
  { id: 5, name: "Smartwatch Elite", price: "$199.99", stock: 33, status: "Active", img: "⌚" },
  { id: 6, name: "Organic Face Cream", price: "$34.99", stock: 67, status: "Active", img: "🧴" },
  { id: 7, name: "Cotton T-Shirt Pack", price: "$24.99", stock: 200, status: "Active", img: "👕" },
  { id: 8, name: "Yoga Mat Premium", price: "$44.99", stock: 15, status: "Active", img: "🧘" },
];

const stockStatus: Record<string, string> = {
  Active: "bg-success/10 text-success",
  "Low Stock": "bg-accent/10 text-accent",
  "Out of Stock": "bg-destructive/10 text-destructive",
};

export default function Products() {
  const [view, setView] = useState<"grid" | "list">("grid");

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

        {view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden hover-lift">
                <div className="h-40 bg-muted flex items-center justify-center text-5xl">{p.img}</div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{p.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="w-3.5 h-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="w-3.5 h-3.5 mr-2" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-lg font-heading font-bold">{p.price}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus[p.status]}`}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
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
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 flex items-center gap-3">
                      <span className="text-2xl">{p.img}</span>
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="p-4 font-medium">{p.price}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus[p.status]}`}>{p.status}</span></td>
                    <td className="p-4"><DropdownMenu>
                      <DropdownMenuTrigger asChild><button><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="w-3.5 h-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="w-3.5 h-3.5 mr-2" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
