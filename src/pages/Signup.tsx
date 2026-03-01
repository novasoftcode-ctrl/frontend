import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Signup() {
  const [showPw, setShowPw] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch("https://backend-production-de8ef.up.railway.app/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("prismzone_token", data.token);
      localStorage.setItem("prismzone_user", JSON.stringify(data.user));

      toast({
        title: "Account Created",
        description: "Welcome to PrismZone! Now let's create your store.",
      });

      navigate("/create-store");
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900">
      {/* Left side - visual */}
      <div className="hidden lg:flex flex-1 gradient-hero-bg animate-gradient items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="text-center text-primary-foreground">
          <h2 className="text-4xl font-heading font-black mb-4">Start Selling Today</h2>
          <p className="text-primary-foreground/90 text-lg max-w-sm font-medium">Create your store in minutes and reach millions of customers worldwide.</p>
        </motion.div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 font-heading font-black text-2xl mb-8 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">PrismZone</span>
          </Link>
          <h1 className="text-3xl font-heading font-black mb-2">Create Your Account</h1>
          <p className="text-slate-500 mb-8 font-medium">Start your e-commerce journey today.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label className="font-bold text-slate-700">Full Name <span className="text-destructive">*</span></Label>
              <Input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="mt-1.5 h-12 rounded-xl focus-visible:ring-primary/20"
              />
            </div>
            <div>
              <Label className="font-bold text-slate-700">Email <span className="text-destructive">*</span></Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1.5 h-12 rounded-xl focus-visible:ring-primary/20"
              />
            </div>
            <div>
              <Label className="font-bold text-slate-700">Phone <span className="text-destructive">*</span></Label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="mt-1.5 h-12 rounded-xl focus-visible:ring-primary/20"
              />
            </div>
            <div>
              <Label className="font-bold text-slate-700">Password <span className="text-destructive">*</span></Label>
              <div className="relative mt-1.5">
                <Input
                  required
                  type={showPw ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder=""
                  className="h-12 rounded-xl focus-visible:ring-primary/20"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="font-bold text-slate-700">Confirm Password <span className="text-destructive">*</span></Label>
              <Input
                required
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder=""
                className="mt-1.5 h-12 rounded-xl focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex items-start gap-3 py-2">
              <Checkbox id="terms" className="mt-1 rounded-sm border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" required />
              <Label htmlFor="terms" className="text-sm font-medium text-slate-500 leading-snug">
                I agree to the <Link to="/terms" className="text-primary hover:underline font-bold">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-bold">Privacy Policy</Link>
              </Label>
            </div>
            <Button type="submit" className="w-full gradient-bg border-0 text-primary-foreground h-14 rounded-xl text-lg font-black shadow-xl shadow-primary/20 active:scale-[0.98] transition-all" size="lg">
              Create Account
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or sign up with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">Google</Button>
              <Button variant="outline" className="h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">Facebook</Button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-8 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-black hover:underline">Log in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
