import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Store, ChevronLeft, LogOut, Plus,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const adminMenuItems = [
  { title: "Platform Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Store Management", url: "/admin#stores", icon: Store },
  { title: "User Control", url: "/admin#users", icon: Users },
  { title: "Revenue", url: "/admin#revenue", icon: BarChart3 },
  { title: "Platform Settings", url: "/admin#settings", icon: Settings },
];



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [storeName, setStoreName] = useState("My Store");
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("J");
  const [storeSlug, setStoreSlug] = useState("my-store");

  useEffect(() => {
    const savedName = localStorage.getItem("vendor_store_name");
    if (savedName) setStoreName(savedName);

    // Get user/store name for formatting
    const storeDataStr = localStorage.getItem("vendor_store_data");
    const accountDataStr = localStorage.getItem("user_account_data");

    if (storeDataStr) {
      const parsed = JSON.parse(storeDataStr);
      if (parsed.name) {
        setStoreName(parsed.name);
        setUserInitial(parsed.name.charAt(0).toUpperCase());
        setStoreSlug(parsed.name.toLowerCase().replace(/\s+/g, '-'));
      }
    }

    if (accountDataStr) {
      const parsed = JSON.parse(accountDataStr);
      if (parsed.name) setUserName(parsed.name);
    }
  }, []);

  const dynamicMenuItems = menuItems.map(item => ({ ...item }));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="p-4 flex items-center gap-3 border-b border-border/50 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Store className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-heading font-black text-sm truncate uppercase tracking-tighter">{isAdmin ? "PrismZone" : storeName}</span>
                <span className="text-[10px] text-muted-foreground font-bold truncate">{isAdmin ? "Administrator" : userName}</span>
              </div>
            </div>

            {!isAdmin && (
              <div className="px-4 mb-4">
                <Button className="w-full gradient-bg border-0 text-primary-foreground shadow-md hover:shadow-primary/20 transition-all font-bold" size="sm" asChild>
                  <Link to="/dashboard/products/new"><Plus className="w-4 h-4 mr-1" />Add Product</Link>
                </Button>
              </div>
            )}

            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest px-4">{isAdmin ? "Admin Console" : "Vendor Menu"}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {(isAdmin ? adminMenuItems : menuItems).map((item) => {
                    const active = location.pathname === item.url || (item.url.includes("#") && location.hash === item.url.split("#")[1]);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${active ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 space-y-2 border-t border-border/50">
              {!isAdmin && (
                <Link to={`/store/${storeSlug}`} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group">
                  <Store className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">View Store</span>
                </Link>
              )}
              <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all group">
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-bold">Logout</span>
              </Link>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="hover:bg-muted" />
            <div className="ml-auto flex items-center gap-4">
              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-muted-foreground font-black text-[10px] tracking-tighter uppercase" asChild>
                  <Link to="/dashboard">Vendor Dashboard</Link>
                </Button>
              )}
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground text-sm font-black shadow-lg shadow-primary/20 cursor-pointer hover:rotate-3 transition-transform">
                {isAdmin ? "A" : userInitial}
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 bg-[#f8fafc] overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
