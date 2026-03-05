import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Store, ChevronLeft, LogOut, Plus,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";

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
  { title: "Store Management", url: "/admin/store-management", icon: Store },
  { title: "User Control", url: "/admin#users", icon: Users },
  { title: "Revenue", url: "/admin#revenue", icon: BarChart3 },
  { title: "Platform Settings", url: "/admin#settings", icon: Settings },
];



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [storeName, setStoreName] = useState("My Store");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("J");
  const [storeSlug, setStoreSlug] = useState("my-store");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      const token = localStorage.getItem("prismzone_token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/store/view/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStoreName(data.name || "My Store");
        setStoreLogo(data.logoUrl || null);
        setStoreSlug(data.slug || "");

        if (data.owner && data.owner.fullName) {
          setUserName(data.owner.fullName);
          setUserInitial(data.owner.fullName.charAt(0).toUpperCase());
        }
      }
    } catch (error) {
      console.error("Error fetching vendor dashboard data:", error);
    }
  };

  const dynamicMenuItems = menuItems.map(item => ({ ...item }));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="p-4 flex items-center gap-3 border-b border-border/50 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 overflow-hidden">
                {storeLogo ? (
                  <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-primary-foreground" />
                )}
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
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="hover:bg-muted" />
            <div className="ml-auto flex items-center gap-4 relative">
              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-muted-foreground font-black text-[10px] tracking-tighter uppercase" asChild>
                  <Link to="/dashboard">Vendor Dashboard</Link>
                </Button>
              )}

              <div
                className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground text-sm font-black shadow-lg shadow-primary/20 cursor-pointer hover:rotate-3 transition-transform"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {isAdmin ? "A" : userInitial}
              </div>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-xl p-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isAdmin ? "Administrator" : "Vendor Account"}</p>
                    <p className="text-sm font-black truncate">{isAdmin ? "Admin" : userName}</p>
                  </div>

                  {!isAdmin && (
                    <Link
                      to={`/store/${storeSlug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
                      onClick={() => setShowProfileMenu(false)}
                      target="_blank"
                    >
                      <Store className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      View Store
                    </Link>
                  )}

                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all group"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Logout
                  </Link>
                </motion.div>
              )}

              {/* Overlay to close menu */}
              {showProfileMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              )}
            </div>
          </header>
          <main className="flex-1 p-8 bg-[#f8fafc] overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
