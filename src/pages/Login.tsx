import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("prismzone_token", data.token);
      localStorage.setItem("prismzone_user", JSON.stringify(data.user));

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 font-heading font-black text-2xl mb-8 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">PrismZone</span>
          </Link>
          <h1 className="text-3xl font-heading font-black mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-8 font-medium">Log in to manage your store and orders.</p>

          <form onSubmit={handleLogin} className="space-y-4 text-slate-900">
            <div>
              <Label className="font-bold text-slate-700">Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 h-12 rounded-xl focus-visible:ring-primary/20"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label className="font-bold text-slate-700">Password <span className="text-destructive">*</span></Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl focus-visible:ring-primary/20"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="rounded-sm border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <Label htmlFor="remember" className="text-sm font-medium text-slate-500">Remember me</Label>
              </div>
              <Link to="/forgot-password" university-title="Forgot password?" className="text-sm text-primary hover:underline font-bold">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full gradient-bg border-0 text-primary-foreground h-14 rounded-xl text-lg font-black shadow-xl shadow-primary/20 active:scale-[0.98] transition-all" size="lg">
              Log In
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">Google</Button>
            <Button variant="outline" className="h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">Facebook</Button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-black hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - visual */}
      <div className="hidden lg:flex flex-1 gradient-hero-bg animate-gradient items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="text-center text-primary-foreground">
          <h2 className="text-4xl font-heading font-black mb-4">Manage Your Empire</h2>
          <p className="text-primary-foreground/90 text-lg max-w-sm font-medium">Access your dashboard, track orders, and grow your business from anywhere.</p>
        </motion.div>
      </div>
    </div>
  );
}
