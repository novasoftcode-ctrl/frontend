import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      toast({
        title: "Success",
        description: response.data.message,
      });
      
      setSubmitted(true);
      setEmail('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to send reset link',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
            <h1 className="text-2xl font-heading font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground text-sm mb-6">We've sent a password reset link to your email. Click the link to reset your password. The link will expire in 1 hour.</p>
            <div className="space-y-4">
              <Button onClick={() => setSubmitted(false)} className="w-full gradient-bg border-0 text-primary-foreground">Send Another Link</Button>
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or <Link to="/contact" className="text-primary hover:underline">contact support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-bg border-0 text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
