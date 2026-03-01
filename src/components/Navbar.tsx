import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ShoppingBag, Menu, X, Zap, Cpu, MessageSquare, ShieldCheck, Search, Home, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Features", href: "/#features", icon: Zap },
  { label: "How It Works", href: "/#how-it-works", icon: Cpu },
  { label: "Testimonials", href: "/#testimonials", icon: MessageSquare },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact Us", href: "/contact", icon: Phone },
  { label: "Explore Stores", href: "/stores", icon: ShoppingBag },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm"
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-4 gap-4">
        <Link to="/" className="flex items-center gap-2 font-heading font-black text-2xl tracking-tighter group">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent drop-shadow-sm">
            PrismZone
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="group flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-primary transition-all duration-300"
            >
              <div className="p-2 rounded-xl bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                <l.icon className="w-5 h-5 transition-colors" />
              </div>
              <span>{l.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full transition-all ${searchOpen ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="font-bold" asChild><Link to="/login">Log In</Link></Button>
          <Button className="gradient-bg border-0 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all font-black px-6" asChild>
            <Link to="/admin">
              <ShieldCheck className="w-5 h-5 mr-2" />
              Admin
            </Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5" />
          </Button>
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search for projects, news, downloads..."
                  className="pl-12 h-14 bg-muted/30 border-2 border-primary/10 rounded-full text-lg focus-visible:ring-primary/20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border bg-white px-4 pb-4"
        >
          <div className="py-4">
            <div className="grid grid-cols-3 gap-3">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 text-[10px] font-black text-muted-foreground uppercase text-center"
                  onClick={() => setOpen(false)}
                >
                  <l.icon className="w-6 h-6 text-primary" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Button className="w-full h-12 gradient-bg border-0 text-primary-foreground font-black text-lg" asChild onClick={() => setOpen(false)}>
              <Link to="/admin">Admin Access</Link>
            </Button>
            <Button variant="outline" className="w-full h-12 font-bold" asChild onClick={() => setOpen(false)}>
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
