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

function DashboardSidebar({ storeName }: { storeName: string }) {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isAdmin = location.pathname.startsWith("/admin");
  const items = isAdmin ? adminMenuItems : menuItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-heading font-bold truncate max-w-[150px]">{isAdmin ? "PrismZone" : storeName}</span>}
        </div>
        {!collapsed && !isAdmin && (
          <div className="px-4 mb-2">
            <Button className="w-full gradient-bg border-0 text-primary-foreground shadow-sm" size="sm" asChild>
              <Link to="/dashboard/products/new"><Plus className="w-4 h-4 mr-1" />Add Product</Link>
            </Button>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? "Admin Console" : "Vendor Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname === item.url || (item.url.includes("#") && location.hash === item.url.split("#")[1]);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className={`flex items-center gap-2 ${active ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}>
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4 border-t border-border/50">
          <SidebarMenu>
            {!isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/store/my-store" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Store className="w-4 h-4" />
                    {!collapsed && <span>View Store</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="w-4 h-4" />
                  {!collapsed && <span>Logout</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [storeName, setStoreName] = useState("My Store");
  const [userInitial, setUserInitial] = useState("J");

  useEffect(() => {
    const savedName = localStorage.getItem("vendor_store_name");
    if (savedName) setStoreName(savedName);

    // Try to get user initial from signup or store data
    const storeData = localStorage.getItem("vendor_store_data");
    if (storeData) {
      const parsed = JSON.parse(storeData);
      if (parsed.name) setUserInitial(parsed.name.charAt(0).toUpperCase());
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar storeName={storeName} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="hover:bg-muted" />
            <div className="ml-auto flex items-center gap-4">
              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-muted-foreground font-medium" asChild>
                  <Link to="/dashboard">Vendor Dashboard</Link>
                </Button>
              )}
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-sm font-black shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform">
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
