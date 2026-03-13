import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";

export default function AdminLogin() {
    const [showPw, setShowPw] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("admin_token", data.token);

            toast({
                title: "Login Successful",
                description: "Welcome to Admin Panel!",
            });

            navigate("/admin");
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
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

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-black">Admin Login</h1>
                            <p className="text-slate-500 text-sm font-medium">Secure access to Admin Panel</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 text-slate-900 mt-8">
                        <div>
                            <Label className="font-bold text-slate-700">Email <span className="text-destructive">*</span></Label>
                            <Input
                                type="email"
                                placeholder="admin@example.com"
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
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full gradient-bg border-0 text-primary-foreground h-14 rounded-xl text-lg font-black shadow-xl shadow-primary/20 active:scale-[0.98] transition-all mt-2"
                            size="lg"
                        >
                            {loading ? "Logging in..." : "Login to Admin Panel"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                        <Link to="/" className="text-primary font-black hover:underline">← Back to Home</Link>
                    </p>
                </motion.div>
            </div>

            {/* Right side - visual */}
            <div className="hidden lg:flex flex-1 gradient-hero-bg animate-gradient items-center justify-center p-12">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="text-center text-primary-foreground">
                    <ShieldCheck className="w-20 h-20 mx-auto mb-6 opacity-90" />
                    <h2 className="text-4xl font-heading font-black mb-4">Admin Console</h2>
                    <p className="text-primary-foreground/90 text-lg max-w-sm font-medium">Manage platform operations, users, stores and settings from one powerful dashboard.</p>
                </motion.div>
            </div>
        </div>
    );
}
