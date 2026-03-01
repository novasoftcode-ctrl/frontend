import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          PrismZone
        </Link>
        <div className="bg-card rounded-xl border border-border p-8">
          <h1 className="text-2xl font-heading font-bold mb-2">Forgot Password</h1>
          <p className="text-muted-foreground text-sm mb-6">Enter your email and we'll send you a reset link.</p>
          <div className="space-y-4">
            <div><Label>Email</Label><Input type="email" placeholder="you@example.com" className="mt-1.5" /></div>
            <Button className="w-full gradient-bg border-0 text-primary-foreground">Send Reset Link</Button>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
